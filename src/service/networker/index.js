//@flow

import Promise from 'bluebird'

import is from 'ramda/src/is'
import contains from 'ramda/src/contains'
import mapObjIndexed from 'ramda/src/mapObjIndexed'

import { dTime, tsNow, generateID, applyServerTime } from '../time-manager'
import random from '../secure-random'
import { NetMessage, NetContainer } from './net-message'
import State from './state'
import smartTimeout, { immediate } from '../../util/smart-timeout'
import { httpClient } from '../../http'

import { Serialization, Deserialization } from '../../tl'
import { readResponse, getDataWithPad, readHash, parsedResponse } from '../chain/parse-response'
import { writeInnerMessage } from '../chain/perform-request'
import { ErrorBadRequest, ErrorBadResponse } from '../../error'

import Logger from '../../util/log'

const log = Logger`networker`

import {
  convertToUint8Array,
  convertToArrayBuffer,
  sha1BytesSync,
  bytesToHex,
  longToBytes,
  uintToInt,
  rshift32
} from '../../bin'

import type { AsyncStorage } from '../../plugins/index.h'
import { TypeWriter } from '../../tl'
import { readLong, readInt } from '../../tl/reader'
import { writeInt, writeBytes, writeLong } from '../../tl/writer'
import { apiMessage, encryptApiBytes, mtMessage } from '../chain/encrypted-message'
import type { Emit } from '../main/index.h'

import LongPoll from '../../plugins/long-poll'
import { getRandomId } from '../../plugins/math-help'

let updatesProcessor: *
let iii = 0
let akStopped = false

//eslint-disable-next-line
// const xhrSendBuffer = !isNode && !('ArrayBufferView' in window)

type NetOptions = {
  fileUpload?: boolean,
  fileDownload?: boolean,
  notContentRelated?: boolean,
  afterMessageID?: string,
  resultType?: string,
  messageID?: string
}
type Bytes = number[]

type ContextConfig = {|
  emit: Emit,
  storage: AsyncStorage,
  appConfig: { [key: string]: * },
  chooseServer: *
|}

const storeIntString = (writer: TypeWriter) => (value: number | string, field: string) => {
  switch (typeof value) {
    case 'string': return writeBytes(writer, value, `${field}:string`)
    case 'number': return writeInt(writer, value, field)
    default: throw new Error(`tl storeIntString field ${field} value type ${typeof value}`)
  }
}

export class NetworkerThread {
  uid: string
  dcID: number
  authKey: Bytes
  authKeyUint8: Uint8Array
  authKeyBuffer: ArrayBuffer
  serverSalt: string
  iii: number
  authKeyID: Bytes
  upload: boolean
  pendingAcks: string[] = []
  seqNo: number
  sessionID: Bytes
  prevSessionID: Bytes
  state = new State
  connectionInited = false
  checkConnectionPeriod = 0
  checkConnectionPromise: Promise<*>
  emit: Emit
  lastServerMessages: string[] = []
  offline: boolean
  storage: AsyncStorage
  longPoll: LongPoll
  onOnlineCb: *
  nextReq: *
  appConfig: { [key: string]: * }
  chooseServer: (dc: number) => string
  nextReqPromise: *
  lastResendReq: *
  constructor({
      appConfig,
      chooseServer,
      storage,
      emit
    }: ContextConfig,
              dc: number,
              authKey: Bytes,
              serverSalt: string,
              options: NetOptions,
              uid: string) {
    this.uid = uid
    this.appConfig = appConfig
    this.chooseServer = chooseServer
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
    const serializer = new Serialization({ mtproto: true }, this.uid)

    serializer.storeMethod(method, params)

    const seqNo = this.generateSeqNo()
    const message = new NetMessage(
      seqNo,
      serializer.getBytes(true)
    )
    log(`Call method`, `msg_id`, `seqNo`)(method, message.msg_id, seqNo)
    log(`Call method`, `params`)(params)

    this.pushMessage(message, options)
    return message.deferred.promise
  }

  wrapMtpMessage(object: Object, options: NetOptions = {}) {

    const serializer = new Serialization({ mtproto: true }, this.uid)
    serializer.storeObject(object, 'Object')

    const seqNo = this.generateSeqNo(options.notContentRelated)
    const message = new NetMessage(
      seqNo,
      serializer.getBytes(true)
    )
    log(`MT message`, `msg_id`, `seqNo`)(message.msg_id, seqNo)
    log(`MT message`, `result`)(object)
    verifyInnerMessages(object.msg_ids)
    this.pushMessage(message, options)
    return message
  }

  wrapApiCall(method: string, params: { [key: string]: * } = {}, options: *) {
    const serializer = new Serialization(options, this.uid)
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

    log(`Api call`)(method)
    log(`|      |`, `msg_id`, `seqNo`)(message.msg_id, seqNo)
    log(`|      |`, `params`)(params)
    log(`|      |`, `options`)(options)
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

  pushResend(messageID: string, delay: number = 0) {
    const value = tsNow() + delay
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

    const serializer = new Serialization({ mtproto: true }, this.uid)
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
      }) //TODO WTF Why we make wrapped message and doesnt use it?
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
    const logGroup = log.group('perform sheduled request')
    for (const [messageID, value] of this.state.pendingIterator()) {
      if (value && value < tsNow()) continue
      this.state.deletePending(messageID)
      if (!this.state.hasSent(messageID)) continue
      message = this.state.getSent(messageID)
      logGroup('message')(message)
      logGroup('messageID, value' )(messageID, value)
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
    logGroup('message, final')(message)
    logGroup('messages')(messages)
    if (!message) return Promise.resolve(false)

    if (message.isAPI && !message.longPoll) {
      const serializer = new Serialization({ mtproto: true }, this.uid)
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

    let noResponseMsgs = []

    if (messages.length > 1) {
      const container = new Serialization({ mtproto: true, startMaxLength: messagesByteLen + 64 }, this.uid)
      const contBox = container.writer
      writeInt(contBox, 0x73f1f8dc, 'CONTAINER[id]')
      writeInt(contBox, messages.length, 'CONTAINER[count]')

      const {
        innerMessages,
        noResponseMessages
      } = writeInnerMessage({
        writer: contBox,
        messages
      })
      noResponseMsgs = noResponseMessages

      message = new NetContainer(
        this.generateSeqNo(true),
        container.getBytes(true),
        innerMessages)

      logGroup(`Container`)(innerMessages,
                            noResponseMessages,
                            message.msg_id,
                            message.seq_no)

    } else {
      if (message.noResponse)
        noResponseMsgs.push(message.msg_id)
    }
    logGroup.groupEnd()
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
      log(`Server response`, `dc${this.dcID}`)(response)
      log(`message`)(message)

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

  sendEncryptedRequest = async (message: NetMessage, options: NetOptions = {}) => {
    const apiBytes = apiMessage({
      ctx       : new Serialization({ startMaxLength: message.body.length + 64 }, this.uid).writer,
      serverSalt: this.serverSalt,
      sessionID : this.sessionID,
      message
    })

    const { encryptedBytes, msgKey } = await encryptApiBytes({
      bytes  : apiBytes,
      authKey: this.authKeyUint8
    })

    const request = new Serialization({ startMaxLength: encryptedBytes.byteLength + 256 }, this.uid).writer

    const mtBytes = mtMessage({
      ctx      : request,
      authKeyID: this.authKeyID,
      msgKey,
      encryptedBytes
    })


    const url = this.chooseServer(this.dcID, this.upload)
    const requestOpts = { responseType: 'arraybuffer', ...options }

    try {
      const result = await httpClient.post(url, mtBytes, requestOpts)
      return !result.data.byteLength
        ? Promise.reject(new ErrorBadResponse(url, result))
        : result
    } catch (error) {
      return Promise.reject(new ErrorBadRequest(url, error))
    }
  }

  getMsgById = ({ req_msg_id }: { req_msg_id: string }) => this.state.getSent(req_msg_id)

  async parseResponse(responseBuffer: Uint8Array) {

    const { msgKey, encryptedData } = readResponse({
      reader       : new Deserialization(responseBuffer, {}, this.uid),
      response     : responseBuffer,
      authKeyStored: this.authKeyID
    })

    const dataWithPadding = await getDataWithPad({
      authKey: this.authKeyUint8,
      msgKey,
      encryptedData
    })

    const {
      hashData,
      seqNo,
      messageID,
      buffer,
      sessionID
    } = readHash({
      reader        : new Deserialization(dataWithPadding, { mtproto: true }, this.uid),
      currentSession: this.sessionID,
      prevSession   : this.prevSessionID,
      dataWithPadding
    })

    const deserializerOptions = getDeserializeOpts(this.getMsgById)

    const response = await parsedResponse({
      hashData,
      msgKey,
      reader: new Deserialization(buffer, deserializerOptions, this.uid)
    })

    return {
      response,
      messageID,
      sessionID,
      seqNo
    }
  }

  async applyServerSalt(newServerSalt: string) {
    const serverSalt = longToBytes(newServerSalt)
    await this.storage.set(`dc${ this.dcID }_server_salt`, bytesToHex(serverSalt))

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

  processError(rawError: { [key: string]: * }) {
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

  async processMessage(message: *, messageID: string, sessionID: string) {
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

        await this.applyServerSalt(message.new_server_salt)
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
          if (badMessage instanceof NetMessage)
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
        await this.applyServerSalt(message.server_salt)


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
            this.emit('error.303', this.dcID)
          } else
            log('non phone error')(error.code, error.description)
          if (deferred) {
            deferred.reject(error)
          }
        } else {
          if (deferred) {
            // log(`Rpc response`)(message.result)
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
  code: number | string
  type: string
  originalError: { [key: string]: * }
  constructor(obj: *) {
    super(`${obj.code} ${obj.type} ${obj.description}`)
    this.code = obj.code
    this.type = obj.type
    this.description = obj.description
    this.originalError = obj.originalError
  }
}


type MsgGetter = ({ req_msg_id: string }) => NetMessage

export const getDeserializeOpts = (msgGetter: MsgGetter) => ({
  mtproto : true,
  override: {
    mt_message(result: { [key: string]: * }, field: string) {
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
    mt_rpc_result(result: { [key: string]: * }, field: string) {
      result.req_msg_id = readLong(this.typeBuffer, `${ field }[req_msg_id]`)

      const sentMessage: NetMessage = msgGetter(result)
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

export const setUpdatesProcessor = (callback: *) =>
  updatesProcessor = callback


const verifyInnerMessages = (messages) => {
  if (messages.length !== new Set(messages).size) {
    console.log(`!!!!!!WARN!!!!!!`, 'container check failed', messages)
      // throw new Error('Container bug')
  }
}
