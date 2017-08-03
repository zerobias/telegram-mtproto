//@flow

import Bluebird from 'bluebird'
import uuid from 'uuid/v4'

import { is, contains } from 'ramda'

import { tsNow, applyServerTime } from '../time-manager'
import random from '../secure-random'
import { NetMessage, NetContainer } from './net-message'
import State from './state'
import { smartTimeout, immediate } from 'mtproto-shared'

import { Serialization, Deserialization } from '../../tl'
import { readResponse, getDataWithPad, readHash, parsedResponse } from '../chain/parse-response'
import { writeInnerMessage } from '../chain/perform-request'
import Config from '../../config-provider'

import Logger from 'mtproto-logger'

const log = Logger`networker`

import {
  convertToUint8Array,
  convertToArrayBuffer,
  sha1BytesSync,
  bytesToHex,
  longToBytes,
  rshift32
} from '../../bin'

import type { AsyncStorage } from '../../plugins/index.h'
import { TypeWriter } from '../../tl'
import { writeInt, writeBytes, writeLong } from '../../tl/writer'
import type { Emit } from 'eventemitter2'

import LongPoll from '../../plugins/long-poll'
import { NET, NETWORKER_STATE, AUTH } from '../../state/action'
import { type ApiConfig } from '../main/index.h'

import { dispatch } from '../../state/core'

let updatesProcessor: *
let iii = 0
let akStopped = false

type NetOptions = {
  fileUpload?: boolean,
  fileDownload?: boolean,
  notContentRelated?: boolean,
  afterMessageID?: string,
  resultType?: string,
  messageID?: string
}
type Bytes = number[]

type ContextConfig = {
  storage: AsyncStorage,
  appConfig: ApiConfig,
}

const storeIntString = (writer: TypeWriter) => (value: number | string, field: string) => {
  switch (typeof value) {
    case 'string': return writeBytes(writer, value)
    case 'number': return writeInt(writer, value, field)
    default: throw new Error(`tl storeIntString field ${field} value type ${typeof value}`)
  }
}

export class NetworkerThread {
  threadID: string = uuid()
  uid: string
  dcID: number
  authKey: Bytes
  authKeyUint8: Uint8Array
  authKeyBuffer: ArrayBuffer
  serverSalt: number[]
  iii: number
  authKeyID: Bytes
  upload: boolean = false
  pendingAcks: string[] = []
  seqNo: number
  sessionID: Bytes
  prevSessionID: Bytes
  state: State = new State
  connectionInited = false
  checkConnectionPeriod = 0
  checkConnectionPromise: Promise<mixed>
  emit: Emit
  lastServerMessages: string[] = []
  offline: boolean
  storage: AsyncStorage
  longPoll: LongPoll
  onOnlineCb: Function
  nextReq: number
  appConfig: ApiConfig
  nextReqPromise: Promise<mixed>
  lastResendReq: {
    req_msg_id: string,
    resend_msg_ids: string[],
  } | void
  constructor({
    appConfig,
    storage
    }: ContextConfig,
              dc: number,
              authKey: Bytes,
              serverSalt: number[],
              uid: string) {
    this.uid = uid
    const emitter = Config.rootEmitter(this.uid)
    this.emit = emitter.emit
    this.dcID = dc
    this.iii = iii++

    this.longPoll = new LongPoll(this)
    //$FlowIssue
    Object.defineProperties(this, {
      authKey: {
        value     : authKey,
        enumerable: false,
        writable  : true,
      },
      authKeyUint8: {
        value     : convertToUint8Array(authKey),
        enumerable: false,
        writable  : true,
      },
      authKeyBuffer: {
        value     : convertToArrayBuffer(authKey),
        enumerable: false,
        writable  : true,
      },
      authKeyID: {
        value     : sha1BytesSync(authKey).slice(-8),
        enumerable: false,
        writable  : true,
      },
      wrapApiCall: {
        value     : this.wrapApiCall.bind(this),
        enumerable: false,
        writable  : false,
      },
      performSheduledRequest: {
        value     : this.performSheduledRequest.bind(this),
        enumerable: false,
        writable  : false,
      },
      appConfig: {
        value     : appConfig,
        enumerable: false,
      },
      storage: {
        value     : storage,
        enumerable: false,
        writable  : true,
      },
    })

    // this.checkLongPollCond = this.checkLongPollCond.bind(this)
    this.serverSalt = serverSalt
    dispatch(AUTH.SET_AUTH_KEY(authKey, this.dcID))
    console.log('serverSalt', serverSalt)
    dispatch(AUTH.SET_SERVER_SALT(serverSalt, this.dcID))

    emitter.emit('new-networker', this)

    this.updateSession()

    setInterval(() => this.checkLongPoll(), 10000) //NOTE make configurable interval
    this.checkLongPoll()
  }
  updateSession() {
    this.seqNo = 0
    this.prevSessionID = this.sessionID
    this.sessionID = new Array(8)
    random(this.sessionID)
    dispatch(AUTH.SET_SESSION_ID(this.sessionID, this.dcID))
  }

  updateSentMessage(sentMessageID: string) {
    if (!this.state.hasSent(sentMessageID)) {
      console.log(`no id`, sentMessageID)
      return false
    }
    const sentMessage = this.state.getSent(sentMessageID)
    const newInner: string[] = []
    if (sentMessage instanceof NetContainer) {
      for (const innerID of sentMessage.inner) {
        const innerSentMessage = this.updateSentMessage(innerID)
        if (innerSentMessage)
          newInner.push(innerSentMessage.msg_id)
      }
    }

    dispatch(NETWORKER_STATE.SENT.DEL([sentMessage], this.dcID))
    this.state.deleteSent(sentMessage)
    const seq_no = this.generateSeqNo(
      sentMessage.notContentRelated
      || sentMessage.container
    )
    const newMessage = sentMessage.clone(seq_no, this.dcID)
    if (newMessage instanceof NetContainer) {
      newMessage.inner = newInner
    }
    this.state.addSent(newMessage)
    dispatch(NETWORKER_STATE.SENT.ADD([newMessage], this.dcID))
    return newMessage
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
      this.uid,
      seqNo,
      serializer.getBytes(true)
    )
    message.dc = this.dcID
    const logGroup = log.group('Wrap mtp call')
    logGroup`Call method, msg_id, seqNo`(method, message.msg_id, seqNo)
    logGroup`Call method, params`(params)
    logGroup.groupEnd()
    this.pushMessage(message, options)
    // this.emit('net-message', {
    //   type  : 'mtp-call',
    //   msg_id: message.msg_id,
    //   message,
    //   method,
    //   params,
    //   options
    // })
    return message.deferred.promise
  }

  wrapMtpMessage(object: Object, options: NetOptions = {}) {

    const serializer = new Serialization({ mtproto: true }, this.uid)
    serializer.storeObject(object, 'Object', 'wrap_message')

    const seqNo = this.generateSeqNo(options.notContentRelated)
    const message = new NetMessage(
      this.uid,
      seqNo,
      serializer.getBytes(true),
      'ack/resend'
    )
    message.dc = this.dcID
    const logGroup = log.group('Wrap mtp message')
    const isAcks = object._ === 'msgs_ack'
    logGroup`MT message, msg_id, seqNo`(message.msg_id, seqNo)
    logGroup`MT message, result`(object)
    logGroup`is acks`(isAcks)
    logGroup.groupEnd()
    verifyInnerMessages(object.msg_ids)
    this.pushMessage(message, options)
    // this.emit('net-message', {
    //   type  : 'mtp-message',
    //   msg_id: message.msg_id,
    //   message,
    //   object,
    //   options
    // })
    return message
  }

  wrapApiCall(
    method: string,
    params: { [key: string]: mixed } = {},
    options: Object,
    requestID: ?string = null
  ): Promise<any> {
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
      for (const [field, value] of Object.entries(this.appConfig)) {
        //$FlowIssue
        const val: number | string = value /*:: || '' */
        mapper(val, field)
      }
    }

    if (options.afterMessageID) {
      writeInt(serialBox, 0xcb9f372d, 'invokeAfterMsg')
      writeLong(serialBox, options.afterMessageID, 'msg_id')
    }

    options.resultType = serializer.storeMethod(method, params)

    const seqNo = this.generateSeqNo()
    const message = new NetMessage(
      this.uid,
      seqNo,
      serializer.getBytes(true),
      'api'
    )
    message.isAPI = true
    message.requestID = requestID
    message.dc = this.dcID
    log(`Api call`)(method)
    log(`|      |`, `msg_id`, `seqNo`)(message.msg_id, seqNo)
    log(`|      |`, `params`)(params)
    log(`|      |`, `options`)(options)
    this.pushMessage(message, options)
    // this.emit('net-message', {
    //   type  : 'api-call',
    //   msg_id: message.msg_id,
    //   message,
    //   method,
    //   params,
    //   options
    // })
    return message.deferred.promise
  }

  checkLongPollCond() {
    return this.longPoll.pendingTime > tsNow()
    || !!this.offline
    || akStopped
  }
  checkLongPollAfterDcCond(isClean: boolean, baseDc: number) {
    return isClean && this.dcID !== baseDc
  }
  async checkLongPoll() {
    const isClean = this.cleanupSent()
    if (this.checkLongPollCond())
      return false

    const baseDc: number = await this.storage.get('dc')
    if (this.checkLongPollAfterDcCond(isClean, baseDc))
    // console.warn(dTime(), 'Send long-poll for DC is delayed', this.dcID, this.sleepAfter)
      return
    const start = Date.now()
    await this.longPoll.sendLongPool()
    if (Date.now() - start < 50) return
    return this.checkLongPoll()
  }

  pushMessage(message: NetMessage, options: NetOptions = {}) {
    message.copyOptions(options)
    dispatch(NETWORKER_STATE.SENT.ADD([message], this.dcID))
    // dispatch(NETWORKER_STATE.PENDING.ADD([message.msg_id], this.dcID))
    this.emit('push-message', {
      threadID: this.threadID,
      message,
      options
    })
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
    if (sentMessage instanceof NetContainer) {
      for (const msg of sentMessage.inner) {
        this.state.setPending(msg, value)
      }
      // dispatch(NETWORKER_STATE.PENDING.ADD(sentMessage.inner, this.dcID))
    } else {
      // dispatch(NETWORKER_STATE.PENDING.ADD([messageID], this.dcID))
      this.state.setPending(messageID, value)
    }
    this.sheduleRequest(delay)
  }



  async checkConnection() { }

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
      this.longPoll.pendingTime = Date.now()
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
      this.lastResendReq = {
        req_msg_id    : msg.msg_id,
        resend_msg_ids: resendMsgIDs,
      }
    }
  }
  performSheduledRequest() { //TODO extract huge method
    // console.log(dTime(), 'sheduled', this.dcID, this.iii)
    if (this.offline || akStopped) {
      log(`Cancel sheduled`)(``)
      return Bluebird.resolve(false)
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
    const pendingIds = []
    for (const [messageID, value] of this.state.pendingIterator()) {
      if (value && value < tsNow()) continue
      this.state.deletePending(messageID)
      pendingIds.push(messageID)
      if (!this.state.hasSent(messageID)) continue
      message = this.state.getSent(messageID)
      logGroup('message')(message)
      logGroup('messageID, value' )(messageID, value)
      const messageByteLength = message.size() + 32
      const cond1 = !message.notContentRelated && lengthOverflow
      const cond2 = !message.notContentRelated
        && messagesByteLen + messageByteLength > 655360 // 640 Kb
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
    // dispatch(NETWORKER_STATE.PENDING.DEL(pendingIds, this.dcID))
    logGroup('message, final')(message)
    logGroup('messages')(messages)
    messages.map(msg => this.emit('message-in', msg))

    if (!message) return Bluebird.resolve(false)

    if (message.isAPI && !message.longPoll) {
      const serializer = new Serialization({ mtproto: true }, this.uid)
      const params = {
        max_delay : 1000,
        wait_after: 550,
        max_wait  : 3000
      }
      serializer.storeMethod('http_wait', params)
      const netMessage = new NetMessage(
        this.uid,
        this.generateSeqNo(),
        serializer.getBytesPlain(),
        'polling'
      )
      netMessage.dc = this.dcID
      this.longPoll.writePollTime()
      // this.emit('net-message', {
      //   type   : 'mtp-call',
      //   msg_id : netMessage.msg_id,
      //   message: netMessage,
      //   method : 'http_wait',
      //   params,
      //   options: {}
      // })
      messages.push(netMessage)
    }

    if (!messages.length) {
      // console.log('no sheduled messages')
      return Bluebird.resolve(false)
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
      const innerApi = messages.reduce(
        (acc: (string | boolean)[], val) => {
          if (!val.isAPI)
            return [...acc, false]
          return [...acc, val.requestID /*::|| '' */]
        }, [])
      message = new NetContainer(
        this.uid,
        this.generateSeqNo(true),
        container.getBytes(true),
        innerMessages,
        innerApi)
      message.dc = this.dcID
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
    dispatch(NET.SEND({
      message,
      options : {},
      threadID: this.threadID,
      thread  : this,
      noResponseMsgs,
    }, this.dcID))
    return Bluebird.resolve(true)
  }


  async requestPerformer(message: NetMessage, noResponseMsgs: string[], response: *) {
    try {
      this.toggleOffline(false)
      // const response = await this.parseResponse(result.data)
      log(`Server response`, `dc${this.dcID}`)(response)
      log(`message`)(message)

      await this.processMessage(
        response.response,
        response.messageID,
        response.sessionID)
      const sentDel = []
      for (const msgID of noResponseMsgs)
        if (this.state.hasSent(msgID)) {
          const msg = this.state.getSent(msgID)
          sentDel.push(msg)
          this.state.deleteSent(msg)
          msg.deferred.resolve()
        }
      dispatch(NETWORKER_STATE.SENT.DEL(sentDel, this.dcID))
      this.checkConnectionPeriod = Math.max(1.1, Math.sqrt(this.checkConnectionPeriod))

      //return
      this.checkLongPoll() //TODO Bluebird warning here
    } catch (error) {
      console.log('Encrypted request failed', error)
      const noRespPending: string[] = []
      const noRespSent: NetMessage[] = []
      if (message instanceof NetContainer) {
        for (const msgID of message.inner) {
          this.state.setPending(msgID)
        }
        noRespSent.push(message)
        // dispatch(NETWORKER_STATE.PENDING.ADD(message.inner, this.dcID))
        this.state.deleteSent(message)
      } else {
        // dispatch(NETWORKER_STATE.PENDING.ADD([message.msg_id], this.dcID))
        this.state.setPending(message.msg_id)
      }

      for (const msgID of noResponseMsgs)
        if (this.state.hasSent(msgID)) {
          const msg = this.state.getSent(msgID)
          noRespPending.push(msgID)
          noRespSent.push(msg)
          this.state.deleteSent(msg)
          this.state.deletePending(msgID)
          msg.deferred.reject()
        }
      dispatch(NETWORKER_STATE.SENT.DEL(noRespSent, this.dcID))
      // dispatch(NETWORKER_STATE.PENDING.DEL(noRespPending, this.dcID))
      this.toggleOffline(true)
      return Bluebird.reject(error)
    }
  }

  async parseResponse(responseBuffer: ArrayBuffer): Promise<{
    response: Object,
    messageID: string,
    sessionID: Uint8Array,
    seqNo: number
  }> {

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

    const deserializerOptions = {
      mtproto: true,
      getter : this.getMsgById
    }
    //$FlowIssue
    const response: Object = await parsedResponse({
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

  getMsgById = ({ req_msg_id }: { req_msg_id: string }) => this.state.getSent(req_msg_id)

  async applyServerSalt(newServerSalt: string) {
    const serverSalt = longToBytes(newServerSalt)
    await this.storage.set(`dc${ this.dcID }_server_salt`, bytesToHex(serverSalt))

    dispatch(AUTH.SET_SERVER_SALT(serverSalt, this.dcID))
    this.serverSalt = serverSalt
    return true
  }

  sheduleRequest(delay: number = 0) {
    if (this.offline) this.checkConnection()
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
    const sentDel = []
    for (const [msgID, message] of this.state.sentIterator()) {
      let complete = true
      if (message.notContentRelated && !this.state.hasPending(msgID)) {
        sentDel.push(message)
        // console.log('clean notContentRelated', msgID)
        this.state.deleteSent(message)
      }
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
        if (complete) {
          sentDel.push(message)
          this.state.deleteSent(message)
        }
      } else
        notEmpty = true
    }
    dispatch(NETWORKER_STATE.SENT.DEL(sentDel, this.dcID))
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

  async processMessage(message: *, messageID: string, sessionID: Uint8Array) {
    if (!isFinite(messageID)) {
      throw new TypeError(`Message ID should be finite ${messageID} ${typeof messageID}`)
    }
    const msgidInt = parseInt(messageID, 10)
    if (msgidInt % 2) {
      console.warn('[MT] Server even message id: ', messageID, message)
      return
    }
    this.emit('incoming-message', {
      threadID: this.threadID,
      message,
      messageID,
      sessionID
    })
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
            this.uid,
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
        // this.ackMessage(messageID)

        // this.processMessageAck(message.first_msg_id)
        // await this.applyServerSalt(message.server_salt)

        this.emit('new-session', {
          threadID   : this.threadID,
          networkerDC: this.dcID,
          messageID,
          message
        })

        // const baseDcID = await this.storage.get('dc')
        // const updateCond =
        //   baseDcID === this.dcID &&
        //   !this.upload &&
        //   updatesProcessor
        // if (updateCond)
        //   updatesProcessor(message, true)

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
        const lastResendReq = this.lastResendReq
        if (!lastResendReq) break
        if (lastResendReq.req_msg_id != message.req_msg_id) break
        // const resendDel = []
        for (const badMsgID of lastResendReq.resend_msg_ids) {
          // resendDel.push(badMsgID)
          this.state.deleteResent(badMsgID)
        }
        // dispatch(NETWORKER_STATE.RESEND.DEL(resendDel, this.dcID))
        break
      }
      case 'rpc_result': {
        this.ackMessage(messageID)

        const sentMessageID = message.req_msg_id
        const sentMessage = this.state.getSent(sentMessageID)

        this.processMessageAck(sentMessageID)
        if (!sentMessage) break
        dispatch(NETWORKER_STATE.SENT.DEL([sentMessage], this.dcID))
        this.state.deleteSent(sentMessage)
        if (message.result._ == 'rpc_error') {
          this.emit('rpc-error', {
            threadID   : this.threadID,
            networkerDC: this.dcID,
            error      : message.result,
            sentMessage,
            message
          })

        } else {
          this.emit('rpc-result', {
            threadID   : this.threadID,
            networkerDC: this.dcID,
            message,
            sentMessage,
            result     : message.result
          })
          if (sentMessage.isAPI)
            this.connectionInited = true
        }

        break
      }
      default: {
        this.ackMessage(messageID)
        this.emit('untyped-message', {
          threadID   : this.threadID,
          networkerDC: this.dcID,
          message,
          messageID,
          sessionID,
          result     : message.result
        })
        if (updatesProcessor) updatesProcessor(message, true)
        break
      }
    }
  }
}

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

export default NetworkerThread

export type { NetworkerThread as NetworkerType }
