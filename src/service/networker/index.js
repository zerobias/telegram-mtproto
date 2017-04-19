//@flow

import Promise from 'bluebird'

import is from 'ramda/src/is'
import contains from 'ramda/src/contains'
import mapObjIndexed from 'ramda/src/mapObjIndexed'

import CryptoWorker from '../../crypto'
import { dTime, tsNow, generateID, applyServerTime } from '../time-manager'
import random from '../secure-random'
import { NetMessage, NetContainer } from './net-message'
import State from './state'
import smartTimeout, { immediate } from '../../util/smart-timeout'
import { httpClient } from '../../http'

import { ErrorBadRequest, ErrorBadResponse } from '../../error'

import Logger from '../../util/log'

const log = Logger`networker`

import {
  convertToUint8Array,
  convertToArrayBuffer,
  sha1BytesSync,
  bytesCmp,
  bytesToHex,
  bytesFromArrayBuffer,
  bytesToArrayBuffer,
  longToBytes,
  uintToInt,
  rshift32
} from '../../bin'

import type { AsyncStorage } from '../../plugins/index.h'
import type { TLFabric, SerializationFabric, DeserializationFabric } from '../../tl'
import { TypeWriter } from '../../tl'
import { readLong, readInt } from '../../tl/reader'
import { writeInt, writeIntBytes, writeBytes, writeLong } from '../../tl/writer'
import type { Emit } from '../main/index.h'

import LongPoll from '../../plugins/long-poll'
import { getRandomId } from '../../plugins/math-help'

let updatesProcessor
let iii = 0
let akStopped = false

//eslint-disable-next-line
// const xhrSendBuffer = !isNode && !('ArrayBufferView' in window)

type NetOptions = {
  fileUpload?: boolean,
  fileDownload?: boolean,
  notContentRelated?: boolean,
  afterMessageID?: string,
  resultType?: any
}
type Bytes = number[]

type ContextConfig = {
  Serialization: SerializationFabric,
  Deserialization: DeserializationFabric,
  emit: Emit,
  storage: AsyncStorage
}

const storeIntString = (writer: TypeWriter) => (value: number | string, field: string) => {
  switch (typeof value) {
    case 'string': return writeBytes(writer, value, `${field}:string`)
    case 'number': return writeInt(writer, value, field)
    default: throw new Error(`tl storeIntString field ${field} value type ${typeof value}`)
  }
}

export class NetworkerThread {
  dcID: number
  authKey: string
  authKeyUint8: Uint8Array
  authKeyBuffer: ArrayBuffer
  serverSalt: string
  iii: number
  authKeyID: Bytes
  upload: boolean
  pendingAcks: number[] = []
  seqNo: number
  sessionID: Bytes
  prevSessionID: Bytes
  state = new State
  connectionInited = false
  checkConnectionPeriod = 0
  checkConnectionPromise: Promise<*>
  Serialization: SerializationFabric
  Deserialization: DeserializationFabric
  emit: Emit
  lastServerMessages: string[] = []
  offline: boolean
  storage: AsyncStorage
  longPoll: LongPoll
  onOnlineCb: *
  constructor({
      appConfig,
      chooseServer,
      Serialization,
      Deserialization,
      storage,
      emit
    }: ContextConfig,
              dc: number,
              authKey: string,
              serverSalt: string,
              options: NetOptions) {
    this.appConfig = appConfig
    this.chooseServer = chooseServer
    this.Serialization = Serialization
    this.Deserialization = Deserialization
    this.storage = storage
    this.emit = emit
    this.dcID = dc
    this.iii = iii++

    this.longPoll = new LongPoll(this)

    this.authKey = authKey
    this.authKeyUint8 = convertToUint8Array(authKey)
    this.authKeyBuffer = convertToArrayBuffer(authKey)
    this.authKeyID = sha1BytesSync(authKey).slice(-8)

    //$FlowIssue
    this.wrapApiCall = this.wrapApiCall.bind(this)

    // this.checkLongPollCond = this.checkLongPollCond.bind(this)
    this.serverSalt = serverSalt

    this.upload = options.fileUpload || options.fileDownload || false

    this.updateSession()

    setInterval(this.checkLongPoll, 10000) //NOTE make configurable interval
    this.checkLongPoll()
  }
  updateSession() {
    this.seqNo = 0
    this.prevSessionID = this.sessionID
    this.sessionID = new Array(8)
    random(this.sessionID)
  }

  updateSentMessage(sentMessageID: string) {
    if (!this.state.hasSent(sentMessageID)) return false
    const sentMessage = this.state.getSent(sentMessageID)

    if (sentMessage instanceof NetContainer) {
      const newInner = []
      for (const innerID of sentMessage.inner) {
        const innerSentMessage = this.updateSentMessage(innerID)
        if (innerSentMessage)
          newInner.push(innerSentMessage.msg_id)
      }
      sentMessage.inner = newInner
    }
    this.state.deleteSent(sentMessage)
    const newId = generateID()
    sentMessage.msg_id = newId
    sentMessage.seq_no = this.generateSeqNo(
      sentMessage.notContentRelated ||
      sentMessage.container
    )
    this.state.addSent(sentMessage)

    return sentMessage
  }

  generateSeqNo(notContentRelated?: boolean) {
    let seqNo = this.seqNo * 2

    if (!notContentRelated) {
      seqNo++
      this.seqNo++
    }

    return seqNo
  }

  wrapMtpCall(method: string, params: Object, options: NetOptions) {
    const serializer = this.Serialization({ mtproto: true })

    serializer.storeMethod(method, params)

    const seqNo = this.generateSeqNo()
    const message = new NetMessage(
      seqNo,
      serializer.getBytes(true)
    )
    log(`MT call`)(method, params, message.msg_id, seqNo)

    this.pushMessage(message, options)
    return message.deferred.promise
  }

  wrapMtpMessage(object: Object, options: NetOptions = {}) {

    const serializer = this.Serialization({ mtproto: true })
    serializer.storeObject(object, 'Object')

    const seqNo = this.generateSeqNo(options.notContentRelated)
    const message = new NetMessage(
      seqNo,
      serializer.getBytes(true)
    )
    log(`MT message`)(message.msg_id, object, seqNo)
    verifyInnerMessages(object.msg_ids)
    this.pushMessage(message, options)
    return message
  }

  wrapApiCall(method: string, params: Object, options: NetOptions) {
    const serializer = this.Serialization(options)
    const serialBox = serializer.writer
    if (!this.connectionInited) {
      // serializer.storeInt(0xda9b0d0d, 'invokeWithLayer')
      // serializer.storeInt(Config.Schema.API.layer, 'layer')
      // serializer.storeInt(0x69796de9, 'initConnection')
      // serializer.storeInt(Config.App.id, 'api_id')
      // serializer.storeString(navigator.userAgent || 'Unknown UserAgent', 'device_model')
      // serializer.storeString(navigator.platform || 'Unknown Platform', 'system_version')
      // serializer.storeString(Config.App.version, 'app_version')
      // serializer.storeString(navigator.language || 'en', 'lang_code')
      const mapper = storeIntString(serialBox)
      mapObjIndexed(mapper, this.appConfig)
    }

    if (options.afterMessageID) {
      writeInt(serialBox, 0xcb9f372d, 'invokeAfterMsg')
      writeLong(serialBox, options.afterMessageID, 'msg_id')
    }

    options.resultType = serializer.storeMethod(method, params)

    const seqNo = this.generateSeqNo()
    const message = new NetMessage(
      seqNo,
      serializer.getBytes(true)
    )
    message.isAPI = true

    log(`Api call`)(method, params, message.msg_id, seqNo, options)

    this.pushMessage(message, options)
    return message.deferred.promise
  }

  checkLongPollCond = () =>
    this.longPoll.pendingTime > tsNow() ||
    !!this.offline ||
    akStopped

  checkLongPollAfterDcCond = (isClean: boolean, baseDc: number) => isClean && (
    this.dcID !== baseDc ||
    this.upload ||
    this.sleepAfter &&
    this.sleepAfter < tsNow()
  )

  checkLongPoll = async () => {
    const isClean = this.cleanupSent()
    if (this.checkLongPollCond())
      return false

    const baseDc: number = await this.storage.get('dc')
    if (this.checkLongPollAfterDcCond(isClean, baseDc))
    // console.warn(dTime(), 'Send long-poll for DC is delayed', this.dcID, this.sleepAfter)
      return
    return this.longPoll.sendLongPool()
  }

  pushMessage(message: NetMessage, options: NetOptions = {}) {
    message.copyOptions(options)
    this.state.addSent(message)
    this.state.setPending(message.msg_id)

    if (!options.noShedule)
      this.sheduleRequest()
    if (is(Object, options))
      options.messageID = message.msg_id
  }

  pushResend(messageID: string, delay?: number) {
    const value = delay
      ? tsNow() + delay
      : 0
    const sentMessage = this.state.getSent(messageID)
    if (sentMessage instanceof NetContainer)
      for (const msg of sentMessage.inner)
        this.state.setPending(msg, value)
    else
      this.state.setPending(messageID, value)

    this.sheduleRequest(delay)
  }



  checkConnection = async (event: * ) => {
    log(`Check connection`)(event)
    smartTimeout.cancel(this.checkConnectionPromise)

    const serializer = this.Serialization({ mtproto: true })
    const pingID = getRandomId()

    serializer.storeMethod('ping', { ping_id: pingID })

    const pingMessage = new NetMessage(
      this.generateSeqNo(true),
      serializer.getBytes()
    )

    let succ = false

    try {
      const result = await this.sendEncryptedRequest(pingMessage, { timeout: 15000 })
      succ = true
      this.toggleOffline(false)
      log(`checkConnection, result`)(result)
    } catch (err) {
      log(`encrypted request fail`)(err)
    }
    if (succ) return
    const delay = this.checkConnectionPeriod * 1e3
    log(`checkConnection, Delay`)(delay)
    this.checkConnectionPromise = smartTimeout(
      this.checkConnection, delay)
    this.checkConnectionPeriod = Math.min(60, this.checkConnectionPeriod * 1.5)
  }

  toggleOffline(enabled: boolean) {
    // console.log('toggle ', enabled, this.dcID, this.iii)
    if (!this.offline !== undefined && this.offline == enabled)
      return false

    this.offline = enabled

    if (this.offline) {
      smartTimeout.cancel(this.nextReqPromise)
      delete this.nextReq

      if (this.checkConnectionPeriod < 1.5)
        this.checkConnectionPeriod = 0


      this.checkConnectionPromise = smartTimeout(
        this.checkConnection, parseInt(this.checkConnectionPeriod * 1000))
      this.checkConnectionPeriod = Math.min(30, (1 + this.checkConnectionPeriod) * 1.5)

      this.onOnlineCb = this.checkConnection
      this.emit('net.offline', this.onOnlineCb)
    } else {
      this.longPoll.pendingTime = -Infinity
        //NOTE check long state was here
      this.checkLongPoll().then(() => {})
      this.sheduleRequest()

      if (this.onOnlineCb)
        this.emit('net.online', this.onOnlineCb)

      smartTimeout.cancel(this.checkConnectionPromise)

    }
  }
  performResend() {
    if (this.state.hasResends()) {
      const resendMsgIDs = [...this.state.getResends()]
      const resendOpts = { noShedule: true, notContentRelated: true }
        // console.log('resendReq messages', resendMsgIDs)
      const msg = this.wrapMtpMessage({
        _      : 'msg_resend_req',
        msg_ids: resendMsgIDs
      }, resendOpts)
      this.lastResendReq = { req_msg_id: msg.msg_id, resend_msg_ids: resendMsgIDs }
    }
  }
  performSheduledRequest = () => { //TODO extract huge method
    // console.log(dTime(), 'sheduled', this.dcID, this.iii)
    if (this.offline || akStopped) {
      log(`Cancel sheduled`)(``)
      return Promise.resolve(false)
    }
    delete this.nextReq
    if (this.pendingAcks.length) {
      const ackMsgIDs = []
      for (const ack of this.pendingAcks)
        ackMsgIDs.push(ack)
      log('acking messages')(ackMsgIDs)
      this.wrapMtpMessage({
          _      : 'msgs_ack',
          msg_ids: ackMsgIDs
      }, {
          notContentRelated: true,
          noShedule        : true
      })
        // const res = await msg.deferred.promise
        // log(`AWAITED`, `ack`)(res)
    }

    this.performResend()

    const messages = []
    let message: NetMessage
    let messagesByteLen = 0
      // const currentTime = tsNow()
    let lengthOverflow = false
    let singlesCount = 0

    for (const [messageID, value] of this.state.pendingIterator()) {
      if (value && value < tsNow()) continue
      this.state.deletePending(messageID)
      if (!this.state.hasSent(messageID)) continue
      message = this.state.getSent(messageID)
      const messageByteLength = message.size() + 32
      const cond1 = !message.notContentRelated && lengthOverflow
      const cond2 = !message.notContentRelated &&
        messagesByteLen + messageByteLength > 655360 // 640 Kb
      if (cond1) continue
      if (cond2) {
        lengthOverflow = true
        continue
      }
      if (message.singleInRequest) {
        singlesCount++
        if (singlesCount > 1) continue
      }
      messages.push(message)
      messagesByteLen += messageByteLength
    }

    if (!message) return Promise.resolve(false)

    if (message.isAPI && !message.longPoll) {
      const serializer = this.Serialization({ mtproto: true })
      serializer.storeMethod('http_wait', {
        max_delay : 500,
        wait_after: 150,
        max_wait  : 3000
      })
      messages.push(new NetMessage(
        this.generateSeqNo(),
        serializer.getBytes()
      ))
      this.longPoll.writePollTime()
    }

    if (!messages.length) {
      // console.log('no sheduled messages')
      return Promise.resolve()
    }

    const noResponseMsgs = []

    if (messages.length > 1) {
      const container = this.Serialization({ mtproto: true, startMaxLength: messagesByteLen + 64 })
      const contBox = container.writer
      writeInt(contBox, 0x73f1f8dc, 'CONTAINER[id]')
      writeInt(contBox, messages.length, 'CONTAINER[count]')
      const innerMessages = []
      let i = 0
      for (const msg of messages) {
        writeLong(contBox, msg.msg_id, `CONTAINER[${i}][msg_id]`)
        innerMessages.push(msg.msg_id)
        writeInt(contBox, msg.seq_no, `CONTAINER[${i}][seq_no]`)
        writeInt(contBox, msg.body.length, `CONTAINER[${i}][bytes]`)
        writeIntBytes(contBox, msg.body, false, `CONTAINER[${i}][body]`)
        if (msg.noResponse)
          noResponseMsgs.push(msg.msg_id)
        i++
      }

      message = new NetContainer(
        this.generateSeqNo(true),
        container.getBytes(true),
        innerMessages)

      log(`Container`)(innerMessages,
                       noResponseMsgs,
                       message.msg_id,
                       message.seq_no)
    } else {
      if (message.noResponse)
        noResponseMsgs.push(message.msg_id)
    }

    this.state.addSent(message)

    this.pendingAcks = [] //TODO WTF,he just clear and forget them at all?!?
    if (lengthOverflow || singlesCount > 1) this.sheduleRequest()

    return this.requestPerformer(message, noResponseMsgs)
  }
  async requestPerformer(message: NetMessage, noResponseMsgs: string[]) {
    try {
      const result = await this.sendEncryptedRequest(message)
      this.toggleOffline(false)
      const response = await this.parseResponse(result.data)
      log(`Server response`)(this.dcID, response)

      await this.processMessage(
        response.response,
        response.messageID,
        response.sessionID)

      for (const msgID of noResponseMsgs)
        if (this.state.hasSent(msgID)) {
          const msg = this.state.getSent(msgID)
          this.state.deleteSent(msg)
          msg.deferred.resolve()
        }

      this.checkConnectionPeriod = Math.max(1.1, Math.sqrt(this.checkConnectionPeriod))

      //return
      this.checkLongPoll() //TODO Bluebird warning here
    } catch (error) {
      console.log('Encrypted request failed', error)

      if (message instanceof NetContainer) {
        for (const msgID of message.inner)
          this.state.setPending(msgID)
        this.state.deleteSent(message)
      } else
        this.state.setPending(message.msg_id)


      for (const msgID of noResponseMsgs)
        if (this.state.hasSent(msgID)) {
          const msg = this.state.getSent(msgID)
          this.state.deleteSent(msg)
          this.state.deletePending(msgID)
          msg.deferred.reject()
        }

      this.toggleOffline(true)
      return Promise.reject(error)
    }
  }

  sendEncryptedRequest = async (message: NetMessage, options = {}) => {
    // console.log(dTime(), 'Send encrypted'/*, message*/)
    // console.trace()
    const data = this.Serialization({ startMaxLength: message.body.length + 64 })
    const dataBox = data.writer
    writeIntBytes(dataBox, this.serverSalt, 64, 'salt')
    writeIntBytes(dataBox, this.sessionID, 64, 'session_id')
    writeLong(dataBox, message.msg_id, 'message_id')
    writeInt(dataBox, message.seq_no, 'seq_no')

    writeInt(dataBox, message.body.length, 'message_data_length')
    writeIntBytes(dataBox, message.body, false, 'message_data')

    const url = this.chooseServer(this.dcID, this.upload)

    const bytes = dataBox.getBuffer()

    const bytesHash = await CryptoWorker.sha1Hash(bytes)
    const msgKey = new Uint8Array(bytesHash).subarray(4, 20)
    const [aesKey, aesIv] = await getMsgKeyIv(this.authKeyUint8, msgKey, true)
    const encryptedBytes = await CryptoWorker.aesEncrypt(bytes, aesKey, aesIv)

    const request = this.Serialization({ startMaxLength: encryptedBytes.byteLength + 256 })
    const requestBox = request.writer
    writeIntBytes(requestBox, this.authKeyID, 64, 'auth_key_id')
    writeIntBytes(requestBox, msgKey, 128, 'msg_key')
    writeIntBytes(requestBox, encryptedBytes, false, 'encrypted_data')

    const requestData = requestBox.getArray()

    options = { responseType: 'arraybuffer', ...options }

    try {
      const result = await httpClient.post(url, requestData, options)
      return !result.data || !result.data.byteLength
        ? Promise.reject(new ErrorBadResponse(url, result))
        : result
    } catch (error) {
      return Promise.reject(new ErrorBadRequest(url, error))
    }
  }

  getMsgById = ({ req_msg_id }) => this.state.getSent(req_msg_id)

  async parseResponse(responseBuffer: Uint8Array) {
    // console.log(dTime(), 'Start parsing response')
    // const self = this

    const deserializerRaw = this.Deserialization(responseBuffer)

    const authKeyID = deserializerRaw.fetchIntBytes(64, 'auth_key_id')
    if (!bytesCmp(authKeyID, this.authKeyID)) {
      throw new Error(`[MT] Invalid server auth_key_id: ${  bytesToHex(authKeyID)}`)
    }
    const msgKey = deserializerRaw.fetchIntBytes(128, 'msg_key')
    const encryptedData = deserializerRaw.fetchRawBytes(
      responseBuffer.byteLength - deserializerRaw.getOffset(),
      'encrypted_data')


    const [aesKey, aesIv] = await getMsgKeyIv(this.authKeyUint8, msgKey, false)
    const dataWithPadding = await CryptoWorker.aesDecrypt(encryptedData, aesKey, aesIv)
      // console.log(dTime(), 'after decrypt')
    const deserializer = this.Deserialization(dataWithPadding, { mtproto: true })

    deserializer.fetchIntBytes(64, 'salt')
    const sessionID = deserializer.fetchIntBytes(64, 'session_id')
    const messageID = readLong(deserializer.typeBuffer, 'message_id')

    const isInvalidSession = !bytesCmp(sessionID, this.sessionID) && (!this.prevSessionID ||
      //eslint-disable-next-line
      !bytesCmp(sessionID, this.prevSessionID));
    if (isInvalidSession) {
      console.warn('Sessions', sessionID, this.sessionID, this.prevSessionID)
      throw new Error(`[MT] Invalid server session_id: ${ bytesToHex(sessionID) }`)
    }

    const seqNo = deserializer.fetchInt('seq_no')

    let offset = deserializer.getOffset()
    const totalLength = dataWithPadding.byteLength

    const messageBodyLength = deserializer.fetchInt('message_data[length]')
    if (messageBodyLength % 4 ||
      messageBodyLength > totalLength - offset) {
      throw new Error(`[MT] Invalid body length: ${  messageBodyLength}`)
    }
    const messageBody = deserializer.fetchRawBytes(messageBodyLength, 'message_data')

    offset = deserializer.getOffset()
    const paddingLength = totalLength - offset
    if (paddingLength < 0 || paddingLength > 15)
      throw new Error(`[MT] Invalid padding length: ${  paddingLength}`)
    const hashData = convertToUint8Array(dataWithPadding).subarray(0, offset)

    const dataHash = await CryptoWorker.sha1Hash(hashData)

    if (!bytesCmp(msgKey, bytesFromArrayBuffer(dataHash).slice(-16))) {
      console.warn(msgKey, bytesFromArrayBuffer(dataHash))
      throw new Error('[MT] server msgKey mismatch')
    }

    const buffer = bytesToArrayBuffer(messageBody)
    const deserializerOptions = getDeserializeOpts(this.getMsgById)
    const deserializerData = this.Deserialization(buffer, deserializerOptions)
    const response = deserializerData.fetchObject('', 'INPUT')

    return {
      response,
      messageID,
      sessionID,
      seqNo
    }
  }

  applyServerSalt(newServerSalt: string) {
    const serverSalt = longToBytes(newServerSalt)
    this.storage.set(`dc${ this.dcID }_server_salt`, bytesToHex(serverSalt))

    this.serverSalt = serverSalt
    return true
  }

  sheduleRequest(delay: number = 0) {
    if (this.offline) this.checkConnection('forced shedule')
    const nextReq = tsNow() + delay

    if (delay && this.nextReq && this.nextReq <= nextReq)
      return false

    // console.log(dTime(), 'shedule req', delay)
    // console.trace()
    smartTimeout.cancel(this.nextReqPromise)
    if (delay > 0)
      this.nextReqPromise = smartTimeout(
        this.performSheduledRequest, delay)
    else
      immediate(this.performSheduledRequest)

    this.nextReq = nextReq
  }

  ackMessage(msgID: string) {
    /*console.trace(msgID)
    if (this.pendingAcks.includes(msgID)) {
      debugger
    }*/
    // console.log('ack message', msgID)
    if (contains(msgID, this.pendingAcks)) return
    this.pendingAcks.push(msgID)
    this.sheduleRequest(30000)
  }

  reqResendMessage(msgID: string) {
    log(`Req resend`)(msgID)
    this.state.addResend(msgID)
    this.sheduleRequest(100)
  }

  cleanupSent() {
    let notEmpty = false
      // console.log('clean start', this.dcID/*, this.state.sent*/)

    for (const [msgID, message] of this.state.sentIterator()) {
      let complete = true
      if (message.notContentRelated && !this.state.hasPending(msgID))
      // console.log('clean notContentRelated', msgID)
        this.state.deleteSent(message)
      else if (message instanceof NetContainer) {
        for (const inner of message.inner) {
          if (this.state.hasSent(inner)) {
            // console.log('clean failed, found', msgID, message.inner[i],
            // this.state.getSent(message.inner[i]).seq_no)
            notEmpty = true
            complete = false
            break
          }
        }
        // console.log('clean container', msgID)
        if (complete)
          this.state.deleteSent(message)
      } else
        notEmpty = true
    }
    return !notEmpty
  }

  processMessageAck = (messageID: string) => {
    const sentMessage = this.state.getSent(messageID)
    if (sentMessage && !sentMessage.acked) {
      delete sentMessage.body
      sentMessage.acked = true
      return true
    }
    return false
  }

  processError(rawError) {
    const matches = (rawError.error_message || '').match(/^([A-Z_0-9]+\b)(: (.+))?/) || []
    rawError.error_code = uintToInt(rawError.error_code)

    return new RawError({
      code: !rawError.error_code || rawError.error_code <= 0
        ? 500
        : rawError.error_code,
      type         : matches[1] || 'UNKNOWN',
      description  : matches[3] || `CODE#${  rawError.error_code  } ${  rawError.error_message}`,
      originalError: rawError
    })
  }

  async processMessage(message, messageID, sessionID) {
    const msgidInt = parseInt(messageID.toString(10).substr(0, -10), 10)
    if (msgidInt % 2) {
      console.warn('[MT] Server even message id: ', messageID, message)
      return
    }
    // console.log('process message', message, messageID, sessionID)
    switch (message._) {
      case 'msg_container': {
        for (const inner of message.messages)
          await this.processMessage(inner, inner.msg_id, sessionID)
        break
      }
      case 'bad_server_salt': {
        log(`Bad server salt`)(message)
        const sentMessage = this.state.getSent(message.bad_msg_id)
        if (!sentMessage || sentMessage.seq_no != message.bad_msg_seqno) {
          log(`invalid message`)(message.bad_msg_id, message.bad_msg_seqno)
          throw new Error('[MT] Bad server salt for invalid message')
        }

        this.applyServerSalt(message.new_server_salt)
        this.pushResend(message.bad_msg_id)
        this.ackMessage(messageID)
        break
      }
      case 'bad_msg_notification': {
        log(`Bad msg notification`)(message)
        const sentMessage = this.state.getSent(message.bad_msg_id)
        if (!sentMessage || sentMessage.seq_no != message.bad_msg_seqno) {
          log(`invalid message`)(message.bad_msg_id, message.bad_msg_seqno)
          throw new Error('[MT] Bad msg notification for invalid message')
        }

        if (message.error_code == 16 || message.error_code == 17) {
          if (applyServerTime(
              rshift32(messageID)
            )) {
            log(`Update session`)()
            this.updateSession()
          }
          const badMessage = this.updateSentMessage(message.bad_msg_id)
          this.pushResend(badMessage.msg_id)
          this.ackMessage(messageID)
        }
        break
      }
      case 'message': {
        if (this.lastServerMessages.indexOf(messageID) != -1) {
          // console.warn('[MT] Server same messageID: ', messageID)
          this.ackMessage(messageID)
          return
        }
        this.lastServerMessages.push(messageID)
        if (this.lastServerMessages.length > 100) {
          this.lastServerMessages.shift()
        }
        await this.processMessage(message.body, message.msg_id, sessionID)
        break
      }
      case 'new_session_created': {
        this.ackMessage(messageID)

        this.processMessageAck(message.first_msg_id)
        this.applyServerSalt(message.server_salt)


        const baseDcID = await this.storage.get('dc')
        const updateCond =
          baseDcID === this.dcID &&
          !this.upload &&
          updatesProcessor
        if (updateCond)
          updatesProcessor(message, true)

        break
      }
      case 'msgs_ack': {
        message.msg_ids.forEach(this.processMessageAck)
        break
      }
      case 'msg_detailed_info': {
        if (!this.state.hasSent(message.msg_id)) {
          this.ackMessage(message.answer_msg_id)
          break
        }
        break
      }
      case 'msg_new_detailed_info': {
        this.ackMessage(message.answer_msg_id)
        this.reqResendMessage(message.answer_msg_id)
        break
      }
      case 'msgs_state_info': {
        this.ackMessage(message.answer_msg_id)
        const spliceCond =
          this.lastResendReq &&
          //eslint-disable-next-line
          this.lastResendReq.req_msg_id == message.req_msg_id;
        if (spliceCond)
          for (const badMsgID of this.lastResendReq.resend_msg_ids)
            this.state.deleteResent(badMsgID)
        break
      }
      case 'rpc_result': {
        this.ackMessage(messageID)

        const sentMessageID = message.req_msg_id
        const sentMessage = this.state.getSent(sentMessageID)

        this.processMessageAck(sentMessageID)
        if (!sentMessage) break

        const deferred = sentMessage.deferred
        if (message.result._ == 'rpc_error') {
          const error = this.processError(message.result)
          log(`ERROR, Rpc error`)(error)
          const matched = error.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)
          if (matched && matched.length >= 2) {
            const [ , , newDcID] = matched
            if (+newDcID !== this.dcID) {
              this.dcID = +newDcID
              await this.storage.set('dc', +newDcID)

            }

          } else
            log('non phone error')(error.code, error.description)
          if (deferred) {
            deferred.reject(error)
          }
        } else {
          if (deferred) {
            log(`Rpc response`)(message.result)
              /*if (debug) {
                console.log(dTime(), 'Rpc response', message.result)
              } else {
                let dRes = message.result._
                if (!dRes)
                  dRes = message.result.length > 5
                    ? `[..${  message.result.length  }..]`
                    : message.result
                console.log(dTime(), 'Rpc response', dRes)
              }*/
            sentMessage.deferred.resolve(message.result)
          }
          if (sentMessage.isAPI)
            this.connectionInited = true
        }
        this.state.deleteSent(sentMessage)
        break
      }
      default: {
        this.ackMessage(messageID)

        // console.log('Update', message)
        if (updatesProcessor) updatesProcessor(message, true)
        break
      }
    }
  }
}

class RawError extends Error {
  constructor(obj: Object) {
    super(`${obj.code} ${obj.type} ${obj.description}`)
    this.code = obj.code
    this.type = obj.type
    this.description = obj.description
    this.originalError = obj.originalError
  }
}

export type Networker = NetworkerThread

export const NetworkerFabric = (
    appConfig,
    { Serialization, Deserialization }: TLFabric,
    storage: AsyncStorage,
    emit: Emit) => chooseServer =>
  (dc: number,
    authKey: string,
    serverSalt: string,
    options: NetOptions = {}) =>
  new NetworkerThread({
    appConfig,
    chooseServer,
    Serialization,
    Deserialization,
    storage,
    emit
  }, dc, authKey, serverSalt, options)


export const getDeserializeOpts = msgGetter => ({
  mtproto : true,
  override: {
    mt_message(result, field) {
      result.msg_id = readLong(this.typeBuffer, `${ field }[msg_id]`)
      result.seqno = readInt(this.typeBuffer, `${ field }[seqno]`)
      result.bytes = readInt(this.typeBuffer, `${ field }[bytes]`)

      const offset = this.getOffset()

      try {
        result.body = this.fetchObject('Object', `${ field }[body]`)
      } catch (e) {
        console.error(dTime(), 'parse error', e.message, e.stack)
        result.body = { _: 'parse_error', error: e }
      }
      if (this.typeBuffer.offset != offset + result.bytes) {
        // console.warn(dTime(), 'set offset', this.offset, offset, result.bytes)
        // console.log(dTime(), result)
        this.typeBuffer.offset = offset + result.bytes
      }
      // console.log(dTime(), 'override message', result)
    },
    mt_rpc_result(result, field: string) {
      result.req_msg_id = readLong(this.typeBuffer, `${ field }[req_msg_id]`)

      const sentMessage = msgGetter(result)
      const type = sentMessage && sentMessage.resultType || 'Object'

      if (result.req_msg_id && !sentMessage) {
        // console.warn(dTime(), 'Result for unknown message', result)
        return
      }
      result.result = this.fetchObject(type, `${ field }[result]`)
        // console.log(dTime(), 'override rpc_result', sentMessage, type, result)
    }
  }
})

export const startAll = () => {
  if (akStopped) {
    akStopped = false
    updatesProcessor({ _: 'new_session_created' }, true)
  }
}

export const stopAll = () => akStopped = true

export const setUpdatesProcessor = callback =>
  updatesProcessor = callback

export default NetworkerFabric


const verifyInnerMessages = (messages) => {
  if (messages.length !== new Set(messages).size) {
    console.log(`!!!!!!WARN!!!!!!`, 'container check failed', messages)
      // throw new Error('Container bug')
  }
}


async function getMsgKeyIv(authKey: Uint8Array, msgKey: Uint8Array, isOut: boolean): * {
  const x = isOut
    ? 0
    : 8
  const sha1aText = new Uint8Array(48)
  const sha1bText = new Uint8Array(48)
  const sha1cText = new Uint8Array(48)
  const sha1dText = new Uint8Array(48)
  const promises = []

  sha1aText.set(msgKey, 0)
  sha1aText.set(authKey.subarray(x, x + 32), 16)
  promises.push(CryptoWorker.sha1Hash(sha1aText))

  sha1bText.set(authKey.subarray(x + 32, x + 48), 0)
  sha1bText.set(msgKey, 16)
  sha1bText.set(authKey.subarray(x + 48, x + 64), 32)
  promises.push(CryptoWorker.sha1Hash(sha1bText))

  sha1cText.set(authKey.subarray(x + 64, x + 96), 0)
  sha1cText.set(msgKey, 32)
  promises.push(CryptoWorker.sha1Hash(sha1cText))

  sha1dText.set(msgKey, 0)
  sha1dText.set(authKey.subarray(x + 96, x + 128), 16)
  promises.push(CryptoWorker.sha1Hash(sha1dText))

  const results = await Promise.all(promises)
  const aesKey = new Uint8Array(32),
        aesIv = new Uint8Array(32),
        sha1a = new Uint8Array(results[0]),
        sha1b = new Uint8Array(results[1]),
        sha1c = new Uint8Array(results[2]),
        sha1d = new Uint8Array(results[3])

  aesKey.set(sha1a.subarray(0, 8))
  aesKey.set(sha1b.subarray(8, 20), 8)
  aesKey.set(sha1c.subarray(4, 16), 20)

  aesIv.set(sha1a.subarray(8, 20))
  aesIv.set(sha1b.subarray(0, 8), 12)
  aesIv.set(sha1c.subarray(16, 20), 20)
  aesIv.set(sha1d.subarray(0, 8), 24)

  const result: [Uint8Array, Uint8Array] = [aesKey, aesIv]
  return result
}