import Promise from 'bluebird'

import { pipeP, is, values, mapObjIndexed } from 'ramda'

import CryptoWorker from '../crypto'
import { dTime, tsNow, generateID, applyServerTime } from './time-manager'
import MtpSecureRandom from './secure-random'
import forEach from '../for-each'
import smartTimeout from '../smart-timeout'
import blueDefer from '../defer'
import { httpClient } from '../http'

import { convertToUint8Array, convertToArrayBuffer, sha1BytesSync,
  nextRandomInt, bytesCmp, bytesToHex, bytesFromArrayBuffer,
  bytesToArrayBuffer, longToBytes, uintToInt, bigStringInt } from '../bin'

let updatesProcessor
let iii = 0
let offlineInited = false
let akStopped = false
// const chromeMatches = navigator.userAgent.match(/Chrome\/(\d+(\.\d+)?)/)
// const chromeVersion = chromeMatches && parseFloat(chromeMatches[1]) || false
// const xhrSendBuffer = !('ArrayBufferView' in window) && (!chromeVersion || chromeVersion < 30)


export const NetworkerFabric = (appConfig, chooseServer, { Serialization, Deserialization }, storage, emit, debug) =>
  class NetworkerThread {
    constructor(dc, authKey, serverSalt, options = {}) {
      this.dcID = dc
      this.iii = iii++

      this.authKey = authKey
      this.authKeyUint8 = convertToUint8Array(authKey)
      this.authKeyBuffer = convertToArrayBuffer(authKey)
      this.authKeyID = sha1BytesSync(authKey).slice(-8)

      this.serverSalt = serverSalt

      this.upload = options.fileUpload || options.fileDownload || false

      this.updateSession()

      this.lastServerMessages = []

      this.currentRequests = 0
      this.checkConnectionPeriod = 0

      this.sentMessages = {}
      this.clientMessages = []

      this.pendingMessages = {}
      this.pendingAcks = []
      this.pendingResends = []
      this.connectionInited = false

      this.pendingTimeouts = []

      setInterval(this.checkLongPoll, 10000)
      this.checkLongPoll()

      if (!offlineInited)
        offlineInited = true
    }
    updateSession() {
      this.seqNo = 0
      this.prevSessionID = this.sessionID
      this.sessionID = new Array(8)
      MtpSecureRandom.nextBytes(this.sessionID)
    }

    updateSentMessage(sentMessageID) {
      const sentMessage = this.sentMessages[sentMessageID]
      if (!sentMessage) return false

      if (sentMessage.container) {
        const newInner = []
        const updateInner = innerSentMessageID => {
          const innerSentMessage = this.updateSentMessage(innerSentMessageID)
          if (innerSentMessage)
            newInner.push(innerSentMessage.msg_id)
        }
        forEach(sentMessage.inner, updateInner)
        sentMessage.inner = newInner
      }

      sentMessage.msg_id = generateID()
      sentMessage.seq_no = this.generateSeqNo(
        sentMessage.notContentRelated ||
        sentMessage.container
      )
      this.sentMessages[sentMessage.msg_id] = sentMessage
      delete this.sentMessages[sentMessageID]

      return sentMessage
    }

    generateSeqNo(notContentRelated) {
      let seqNo = this.seqNo * 2

      if (!notContentRelated) {
        seqNo++
        this.seqNo++
      }

      return seqNo
    }

    wrapMtpCall(method, params, options) {
      const serializer = new Serialization({ mtproto: true })

      serializer.storeMethod(method, params)

      const messageID = generateID()
      const seqNo = this.generateSeqNo()
      const message = {
        msg_id: messageID,
        seq_no: seqNo,
        body  : serializer.getBytes()
      }

      if (debug)
        console.log(dTime(), 'MT call', method, params, messageID, seqNo)

      return this.pushMessage(message, options)
    }

    wrapMtpMessage(object, options = {}) {

      const serializer = new Serialization({ mtproto: true })
      serializer.storeObject(object, 'Object')

      const messageID = generateID()
      const seqNo = this.generateSeqNo(options.notContentRelated)
      const message = {
        msg_id: messageID,
        seq_no: seqNo,
        body  : serializer.getBytes()
      }

      if (debug)
        console.log(dTime(), 'MT message', object, messageID, seqNo)

      return this.pushMessage(message, options)
    }

    wrapApiCall(method, params, options) {
      const serializer = new Serialization(options)

      if (!this.connectionInited) {
        // serializer.storeInt(0xda9b0d0d, 'invokeWithLayer')
        // serializer.storeInt(Config.Schema.API.layer, 'layer')
        // serializer.storeInt(0x69796de9, 'initConnection')
        // serializer.storeInt(Config.App.id, 'api_id')
        // serializer.storeString(navigator.userAgent || 'Unknown UserAgent', 'device_model')
        // serializer.storeString(navigator.platform || 'Unknown Platform', 'system_version')
        // serializer.storeString(Config.App.version, 'app_version')
        // serializer.storeString(navigator.language || 'en', 'lang_code')
        mapObjIndexed(serializer.storeIntString, appConfig)
      }

      if (options.afterMessageID) {
        serializer.storeInt(0xcb9f372d, 'invokeAfterMsg')
        serializer.storeLong(options.afterMessageID, 'msg_id')
      }

      options.resultType = serializer.storeMethod(method, params)

      const messageID = generateID()
      const seqNo = this.generateSeqNo()
      const message = {
        msg_id: messageID,
        seq_no: seqNo,
        body  : serializer.getBytes(true),
        isAPI : true
      }

      if (debug)
        console.log(dTime(), 'Api call', method, params, messageID, seqNo, options)
      else
        console.log(dTime(), 'Api call', method)

      return this.pushMessage(message, options)
    }

    checkLongPollCond = () =>
      this.longPollPending &&
        this.longPollPending > tsNow() ||
      !!this.offline ||
      akStopped

    checkLongPollAfterDcCond = (isClean, baseDc) => isClean && (
      this.dcID !== baseDc ||
      this.upload ||
      this.sleepAfter &&
        this.sleepAfter < tsNow()
    )

    checkLongPoll = force => {
      const isClean = this.cleanupSent()
      // console.log('Check lp', this.longPollPending, tsNow(), this.dcID, isClean)
      if (this.checkLongPollCond())
        return false

      const afterGetDc = baseDc => {
        if (this.checkLongPollAfterDcCond(isClean, baseDc))
          // console.warn(dTime(), 'Send long-poll for DC is delayed', this.dcID, this.sleepAfter)
          return

        return this.sendLongPoll()
      }

      storage.get('dc')
        .then(afterGetDc)
    }

    onHttpWait = () => {
      delete this.longPollPending
      return smartTimeout.immediate(this.checkLongPoll)
    }

    sendLongPoll = () => {
      const maxWait = 25000
      this.longPollPending = tsNow() + maxWait
      // console.log('Set lp', this.longPollPending, tsNow())

      return this.wrapMtpCall('http_wait', {
        max_delay : 500,
        wait_after: 150,
        max_wait  : maxWait
      }, {
        noResponse: true,
        longPoll  : true
      }).then(this.onHttpWait, () => {
        console.log('Long-poll failed')
      })
    }

    pushMessage(message, options = {}) {
      const deferred = blueDefer()

      this.sentMessages[message.msg_id] = { ...message, ...options, deferred }
      this.pendingMessages[message.msg_id] = 0

      if (!options || !options.noShedule)
        this.sheduleRequest()
      if (is(Object, options))
        options.messageID = message.msg_id

      return deferred.promise
    }

    pushResend(messageID, delay) {
      const value = delay
        ? tsNow() + delay
        : 0
      const innerMap = innerMsg => this.pendingMessages[innerMsg] = value
      const sentMessage = this.sentMessages[messageID]
      if (sentMessage.container)
        sentMessage.inner.forEach(innerMap)
      else
        this.pendingMessages[messageID] = value

      // console.log('Resend due', messageID, this.pendingMessages)

      this.sheduleRequest(delay)
    }

    getMsgKeyIv(msgKey, isOut) {
      const authKey = this.authKeyUint8
      const x = isOut
        ? 0
        : 8
      const sha1aText = new Uint8Array(48)
      const sha1bText = new Uint8Array(48)
      const sha1cText = new Uint8Array(48)
      const sha1dText = new Uint8Array(48)
      const promises = {}

      sha1aText.set(msgKey, 0)
      sha1aText.set(authKey.subarray(x, x + 32), 16)
      promises.sha1a = CryptoWorker.sha1Hash(sha1aText)

      sha1bText.set(authKey.subarray(x + 32, x + 48), 0)
      sha1bText.set(msgKey, 16)
      sha1bText.set(authKey.subarray(x + 48, x + 64), 32)
      promises.sha1b = CryptoWorker.sha1Hash(sha1bText)

      sha1cText.set(authKey.subarray(x + 64, x + 96), 0)
      sha1cText.set(msgKey, 32)
      promises.sha1c = CryptoWorker.sha1Hash(sha1cText)

      sha1dText.set(msgKey, 0)
      sha1dText.set(authKey.subarray(x + 96, x + 128), 16)
      promises.sha1d = CryptoWorker.sha1Hash(sha1dText)

      const onAll = result => {
        const aesKey = new Uint8Array(32),
              aesIv = new Uint8Array(32),
              sha1a = new Uint8Array(result[0]),
              sha1b = new Uint8Array(result[1]),
              sha1c = new Uint8Array(result[2]),
              sha1d = new Uint8Array(result[3])

        aesKey.set(sha1a.subarray(0, 8))
        aesKey.set(sha1b.subarray(8, 20), 8)
        aesKey.set(sha1c.subarray(4, 16), 20)

        aesIv.set(sha1a.subarray(8, 20))
        aesIv.set(sha1b.subarray(0, 8), 12)
        aesIv.set(sha1c.subarray(16, 20), 20)
        aesIv.set(sha1d.subarray(0, 8), 24)

        return [aesKey, aesIv]
      }

      return Promise.all(values(promises)).then(onAll)
    }

    checkConnection = event => {
      console.log(dTime(), 'Check connection', event)
      smartTimeout.cancel(this.checkConnectionPromise)

      const serializer = new Serialization({ mtproto: true })
      const pingID = [nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF)]

      serializer.storeMethod('ping', { ping_id: pingID })

      const pingMessage = {
        msg_id: generateID(),
        seq_no: this.generateSeqNo(true),
        body  : serializer.getBytes()
      }

      this.sendEncryptedRequest(pingMessage, { timeout: 15000 }).then(result =>
        this.toggleOffline(false)
      , () => {
        console.log(dTime(), 'Delay ', this.checkConnectionPeriod * 1000)
        this.checkConnectionPromise = smartTimeout(
          this.checkConnection, parseInt(this.checkConnectionPeriod * 1000))
        this.checkConnectionPeriod = Math.min(60, this.checkConnectionPeriod * 1.5)
      })
    }

    toggleOffline(enabled) {
      // console.log('toggle ', enabled, this.dcID, this.iii)
      if (this.offline !== undefined && this.offline == enabled)
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
        emit('net.offline', this.onOnlineCb)
      } else {
        delete this.longPollPending
        this.checkLongPoll()
        this.sheduleRequest()

        if (this.onOnlineCb)
          emit('net.online', this.onOnlineCb)

        smartTimeout.cancel(this.checkConnectionPromise)
      }
    }
    onNoResponseMsg = msgID => {
      if (this.sentMessages[msgID]) {
        const deferred = this.sentMessages[msgID].deferred
        delete this.sentMessages[msgID]
        return deferred.resolve()
      }
    }
    onNoResponseMsgReject = msgID => {
      if (this.sentMessages[msgID]) {
        const deferred = this.sentMessages[msgID].deferred
        delete this.sentMessages[msgID]
        delete this.pendingMessages[msgID]
        return deferred.reject()
      }
    }
    resetPendingMessage = msgID => this.pendingMessages[msgID] = 0
    performSheduledRequest = () => { //TODO extract huge method
      // console.log(dTime(), 'sheduled', this.dcID, this.iii)
      if (this.offline || akStopped) {
        console.log(dTime(), 'Cancel sheduled')
        return false
      }
      delete this.nextReq
      if (this.pendingAcks.length) {
        const ackMsgIDs = []
        for (let i = 0; i < this.pendingAcks.length; i++) {
          ackMsgIDs.push(this.pendingAcks[i])
        }
        // console.log('acking messages', ackMsgIDs)
        this.wrapMtpMessage({ _: 'msgs_ack', msg_ids: ackMsgIDs }, { notContentRelated: true, noShedule: true })
      }

      if (this.pendingResends.length) {
        const resendMsgIDs = []
        const resendOpts = { noShedule: true, notContentRelated: true }
        for (let i = 0; i < this.pendingResends.length; i++) {
          resendMsgIDs.push(this.pendingResends[i])
        }
        // console.log('resendReq messages', resendMsgIDs)
        this.wrapMtpMessage({ _: 'msg_resend_req', msg_ids: resendMsgIDs }, resendOpts)
        this.lastResendReq = { req_msg_id: resendOpts.messageID, resend_msg_ids: resendMsgIDs }
      }

      const messages = []
      let message,
          messagesByteLen = 0
      const currentTime = tsNow()
      let hasApiCall = false
      let hasHttpWait = false
      let lengthOverflow = false
      let singlesCount = 0

      const onPendingMessage = (value, messageID) => {
        if (!(!value || value >= currentTime)) return
        message = this.sentMessages[messageID]
        if (message) {
          const messageByteLength = (message.body.byteLength || message.body.length) + 32
          const cond1 = !message.notContentRelated && lengthOverflow
          const cond2 =
            !message.notContentRelated &&
            messagesByteLen &&
            messagesByteLen + messageByteLength > 655360 // 640 Kb
          if (cond1) return
          if (cond2) {
            lengthOverflow = true
            return
          }
          if (message.singleInRequest) {
            singlesCount++
            if (singlesCount > 1) return
          }
          messages.push(message)
          messagesByteLen += messageByteLength
          if (message.isAPI)
            hasApiCall = true
          else if (message.longPoll)
            hasHttpWait = true
        } else {
          // console.log(message, messageID)
        }
        delete this.pendingMessages[messageID]
      }

      forEach(this.pendingMessages, onPendingMessage)

      if (hasApiCall && !hasHttpWait) {
        const serializer = new Serialization({ mtproto: true })
        serializer.storeMethod('http_wait', {
          max_delay : 500,
          wait_after: 150,
          max_wait  : 3000
        })
        messages.push({
          msg_id: generateID(),
          seq_no: this.generateSeqNo(),
          body  : serializer.getBytes()
        })
      }

      if (!messages.length) {
        // console.log('no sheduled messages')
        return
      }

      const noResponseMsgs = []

      if (messages.length > 1) {
        const container = new Serialization({ mtproto: true, startMaxLength: messagesByteLen + 64 })
        container.storeInt(0x73f1f8dc, 'CONTAINER[id]')
        container.storeInt(messages.length, 'CONTAINER[count]')
        const onloads = []
        const innerMessages = []
        for (let i = 0; i < messages.length; i++) {
          container.storeLong(messages[i].msg_id, `CONTAINER[${  i  }][msg_id]`)
          innerMessages.push(messages[i].msg_id)
          container.storeInt(messages[i].seq_no, `CONTAINER[${  i  }][seq_no]`)
          container.storeInt(messages[i].body.length, `CONTAINER[${  i  }][bytes]`)
          container.storeRawBytes(messages[i].body, `CONTAINER[${  i  }][body]`)
          if (messages[i].noResponse) {
            noResponseMsgs.push(messages[i].msg_id)
          }
        }

        const containerSentMessage = {
          msg_id   : generateID(),
          seq_no   : this.generateSeqNo(true),
          container: true,
          inner    : innerMessages
        }

        message = { body: container.getBytes(true), ...containerSentMessage }

        this.sentMessages[message.msg_id] = containerSentMessage

        if (debug)
          console.log(dTime(), 'Container', innerMessages, message.msg_id, message.seq_no)
      } else {
        if (message.noResponse)
          noResponseMsgs.push(message.msg_id)
        this.sentMessages[message.msg_id] = message
      }

      this.pendingAcks = []
      const afterSendRequest = result => {
        this.toggleOffline(false)
        // console.log('parse for', message)
        this
          .parseResponse(result.data)
          .then(afterResponseParse)
      }
      const afterResponseParse = response => {
        if (debug)
          console.log(dTime(), 'Server response', this.dcID, response)

        this.processMessage(
          response.response,
          response.messageID,
          response.sessionID)

        forEach(noResponseMsgs, this.onNoResponseMsg)

        this.checkLongPoll()

        this.checkConnectionPeriod = Math.max(1.1, Math.sqrt(this.checkConnectionPeriod))
      }
      const onRequestFail = error => {
        console.log('Encrypted request failed', error)

        if (message.container) {
          forEach(message.inner, this.resetPendingMessage)
          delete this.sentMessages[message.msg_id]
        } else
          this.pendingMessages[message.msg_id] = 0

        forEach(noResponseMsgs, this.onNoResponseMsgReject)

        this.toggleOffline(true)
      }
      this.sendEncryptedRequest(message)
        .then(afterSendRequest)
        .catch(onRequestFail)

      if (lengthOverflow || singlesCount > 1) this.sheduleRequest()
    }

    getEncryptedMessage(bytes) {
      let msgKey
      const f1 = CryptoWorker.sha1Hash
      const f2 = bytesHash => {
        msgKey = new Uint8Array(bytesHash).subarray(4, 20)
        return this.getMsgKeyIv(msgKey, true)
      }
      const f3 = keyIv => CryptoWorker.aesEncrypt(bytes, keyIv[0], keyIv[1])
      const f4 = encryptedBytes => ({
        bytes: encryptedBytes,
        msgKey
      })
      const encryptFlow = pipeP(f1, f2, f3, f4)
      return encryptFlow(bytes)
    }

    getDecryptedMessage(msgKey, encryptedData) {
      const getKeyCurry = key => this.getMsgKeyIv(key, false)
      const cryptoAesCurry = keyIv => CryptoWorker.aesDecrypt(encryptedData, keyIv[0], keyIv[1])
      const decryptFlow = pipeP(getKeyCurry, cryptoAesCurry)
      return decryptFlow(msgKey)
    }

    getRequestUrl = () => chooseServer(this.dcID, this.upload)

    sendEncryptedRequest = (message, options = {}) => {
      // console.log(dTime(), 'Send encrypted'/*, message*/)
      // console.trace()
      const data = new Serialization({ startMaxLength: message.body.length + 64 })

      data.storeIntBytes(this.serverSalt, 64, 'salt')
      data.storeIntBytes(this.sessionID, 64, 'session_id')

      data.storeLong(message.msg_id, 'message_id')
      data.storeInt(message.seq_no, 'seq_no')

      data.storeInt(message.body.length, 'message_data_length')
      data.storeRawBytes(message.body, 'message_data')

      const url = this.getRequestUrl()
      const baseError = { code: 406, type: 'NETWORK_BAD_RESPONSE', url }

      const afterRequestData = result => {
        if (!result.data || !result.data.byteLength)
          return Promise.reject(baseError)
        return result
      }

      const afterRequestReject = error => {
        if (!error.message && !error.type)
          error = { type: 'NETWORK_BAD_REQUEST', originalError: error, ...baseError }
        return Promise.reject(error)
      }

      const onEncryptedResult = encryptedResult => {
        // console.log(dTime(), 'Got encrypted out message'/*, encryptedResult*/)
        const request = new Serialization({ startMaxLength: encryptedResult.bytes.byteLength + 256 })
        request.storeIntBytes(this.authKeyID, 64, 'auth_key_id')
        request.storeIntBytes(encryptedResult.msgKey, 128, 'msg_key')
        request.storeRawBytes(encryptedResult.bytes, 'encrypted_data')

        const requestData = /*xhrSendBuffer
          ? request.getBuffer()
          : */request.getArray()

        try {
          options = { responseType: 'arraybuffer', ...options }
          return httpClient.post(url, requestData, options)
        } catch (e) {
          return Promise.reject(e)
        }
      }

      return this
        .getEncryptedMessage(data.getBuffer())
        .then(onEncryptedResult)
        .then(
          afterRequestData,
          afterRequestReject)
    }

    getMsgById = ({ req_msg_id }) => this.sentMessages[req_msg_id]

    parseResponse(responseBuffer) {
      // console.log(dTime(), 'Start parsing response')
      // const self = this

      const deserializer = new Deserialization(responseBuffer)

      const authKeyID = deserializer.fetchIntBytes(64, false, 'auth_key_id')
      if (!bytesCmp(authKeyID, this.authKeyID)) {
        throw new Error(`[MT] Invalid server auth_key_id: ${  bytesToHex(authKeyID)}`)
      }
      const msgKey = deserializer.fetchIntBytes(128, true, 'msg_key')
      const encryptedData = deserializer.fetchRawBytes(
        responseBuffer.byteLength - deserializer.getOffset(),
        true,
        'encrypted_data')

      const afterDecrypt = dataWithPadding => {
        // console.log(dTime(), 'after decrypt')
        const deserializer = new Deserialization(dataWithPadding, { mtproto: true })

        const salt = deserializer.fetchIntBytes(64, false, 'salt')
        const sessionID = deserializer.fetchIntBytes(64, false, 'session_id')
        const messageID = deserializer.fetchLong('message_id')

        const isInvalidSession =
          !bytesCmp(sessionID, this.sessionID) && (
            !this.prevSessionID ||
            !bytesCmp(sessionID, this.prevSessionID))
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
        const messageBody = deserializer.fetchRawBytes(messageBodyLength, true, 'message_data')

        offset = deserializer.getOffset()
        const paddingLength = totalLength - offset
        if (paddingLength < 0 || paddingLength > 15)
          throw new Error(`[MT] Invalid padding length: ${  paddingLength}`)
        const hashData = convertToUint8Array(dataWithPadding).subarray(0, offset)

        const afterShaHash = dataHash => {
          if (!bytesCmp(msgKey, bytesFromArrayBuffer(dataHash).slice(-16))) {
            console.warn(msgKey, bytesFromArrayBuffer(dataHash))
            throw new Error('[MT] server msgKey mismatch')
          }

          const buffer = bytesToArrayBuffer(messageBody)
          const deserializerOptions = getDeserializeOpts(this.getMsgById)
          const deserializer = new Deserialization(buffer, deserializerOptions)
          const response = deserializer.fetchObject('', 'INPUT')

          return {
            response,
            messageID,
            sessionID,
            seqNo
          }
        }
        return CryptoWorker
          .sha1Hash(hashData)
          .then(afterShaHash)
      }


      return this
        .getDecryptedMessage(msgKey, encryptedData)
        .then(afterDecrypt)
    }

    applyServerSalt(newServerSalt) {
      const serverSalt = longToBytes(newServerSalt)

      const storeObj = {
        [`dc${ this.dcID }_server_salt`]: bytesToHex(serverSalt)
      }
      storage.set(storeObj)

      this.serverSalt = serverSalt
      return true
    }

    sheduleRequest(delay = 0) {
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
        smartTimeout.immediate(this.performSheduledRequest)

      this.nextReq = nextReq
    }

    ackMessage(msgID) {
      // console.log('ack message', msgID)
      this.pendingAcks.push(msgID)
      this.sheduleRequest(30000)
    }

    reqResendMessage(msgID) {
      console.log(dTime(), 'Req resend', msgID)
      this.pendingResends.push(msgID)
      this.sheduleRequest(100)
    }

    cleanupSent() {
      let notEmpty = false
      // console.log('clean start', this.dcID/*, this.sentMessages*/)
      const cleanMessages = (message, msgID) => {
        // console.log('clean iter', msgID, message)
        if (message.notContentRelated && this.pendingMessages[msgID] === undefined) {
          // console.log('clean notContentRelated', msgID)
          delete this.sentMessages[msgID]
        }
        else if (message.container) {
          for (let i = 0; i < message.inner.length; i++) {
            if (this.sentMessages[message.inner[i]] !== undefined) {
              // console.log('clean failed, found', msgID, message.inner[i], this.sentMessages[message.inner[i]].seq_no)
              notEmpty = true
              return
            }
          }
          // console.log('clean container', msgID)
          delete this.sentMessages[msgID]
        } else {
          notEmpty = true
        }
      }
      forEach(this.sentMessages, cleanMessages)

      return !notEmpty
    }

    processMessageAck = messageID => {
      const sentMessage = this.sentMessages[messageID]
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

      return {
        code: !rawError.error_code || rawError.error_code <= 0
          ? 500
          : rawError.error_code,
        type         : matches[1] || 'UNKNOWN',
        description  : matches[3] || `CODE#${  rawError.error_code  } ${  rawError.error_message}`,
        originalError: rawError
      }
    }
    spliceMessage = badMsgID => {
      const pos = this.pendingResends.indexOf(badMsgID)
      if (pos !== -1)
        this.pendingResends.splice(pos, 1)
    }
    processMessage(message, messageID, sessionID) {
      const msgidInt = parseInt(messageID.toString(10).substr(0, -10), 10)
      if (msgidInt % 2) {
        console.warn('[MT] Server even message id: ', messageID, message)
        return
      }
      // console.log('process message', message, messageID, sessionID)
      switch (message._) {
        case 'msg_container': {
          const len = message.messages.length
          for (let i = 0; i < len; i++) {
            this.processMessage(message.messages[i], message.messages[i].msg_id, sessionID)
          }
          break
        }
        case 'bad_server_salt': {
          console.log(dTime(), 'Bad server salt', message)
          const sentMessage = this.sentMessages[message.bad_msg_id]
          if (!sentMessage || sentMessage.seq_no != message.bad_msg_seqno) {
            console.log(message.bad_msg_id, message.bad_msg_seqno)
            throw new Error('[MT] Bad server salt for invalid message')
          }

          this.applyServerSalt(message.new_server_salt)
          this.pushResend(message.bad_msg_id)
          this.ackMessage(messageID)
          break
        }
        case 'bad_msg_notification': {
          console.log(dTime(), 'Bad msg notification', message)
          const sentMessage = this.sentMessages[message.bad_msg_id]
          if (!sentMessage || sentMessage.seq_no != message.bad_msg_seqno) {
            console.log(message.bad_msg_id, message.bad_msg_seqno)
            throw new Error('[MT] Bad msg notification for invalid message')
          }

          if (message.error_code == 16 || message.error_code == 17) {
            if (applyServerTime(
                bigStringInt(messageID)
                  .shiftRight(32)
                  .toString(10)
              )) {
              console.log(dTime(), 'Update session')
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
          this.processMessage(message.body, message.msg_id, sessionID)
          break
        }
        case 'new_session_created': {
          this.ackMessage(messageID)

          this.processMessageAck(message.first_msg_id)
          this.applyServerSalt(message.server_salt)

          const onBaseDc = baseDcID => {
            const updateCond =
              baseDcID === this.dcID &&
              !this.upload &&
              updatesProcessor
            if (updateCond)
              updatesProcessor(message, true)
          }
          storage.get('dc').then(onBaseDc)
          break
        }
        case 'msgs_ack': {
          message.msg_ids.forEach(this.processMessageAck)
          break
        }
        case 'msg_detailed_info': {
          if (!this.sentMessages[message.msg_id]) {
            this.ackMessage(message.answer_msg_id)
            break
          }
          break
        }
        case 'msg_new_detailed_info': {
          // this.ackMessage(message.answer_msg_id)
          this.reqResendMessage(message.answer_msg_id)
          break
        }
        case 'msgs_state_info': {
          this.ackMessage(message.answer_msg_id)
          const spliceCond =
            this.lastResendReq &&
            this.lastResendReq.req_msg_id == message.req_msg_id &&
            this.pendingResends.length
          if (spliceCond)
            this.lastResendReq.resend_msg_ids.forEach(this.spliceMessage)
          break
        }
        case 'rpc_result': {
          this.ackMessage(messageID)

          const sentMessageID = message.req_msg_id
          const sentMessage = this.sentMessages[sentMessageID]

          this.processMessageAck(sentMessageID)
          if (!sentMessage) break

          const deferred = sentMessage.deferred
          if (message.result._ == 'rpc_error') {
            const error = this.processError(message.result)
            console.log(dTime(), 'Rpc error', error)
            if (deferred) {
              deferred.reject(error)
            }
          } else {
            if (deferred) {
              if (debug) {
                console.log(dTime(), 'Rpc response', message.result)
              } else {
                let dRes = message.result._
                if (!dRes)
                  dRes = message.result.length > 5
                    ? `[..${  message.result.length  }..]`
                    : message.result
                console.log(dTime(), 'Rpc response', dRes)
              }
              sentMessage.deferred.resolve(message.result)
            }
            if (sentMessage.isAPI)
              this.connectionInited = true
          }

          delete this.sentMessages[sentMessageID]
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

const getDeserializeOpts = msgGetter => ({
  mtproto : true,
  override: {
    mt_message(result, field) {
      result.msg_id = this.fetchLong(`${field  }[msg_id]`)
      result.seqno = this.fetchInt(`${field  }[seqno]`)
      result.bytes = this.fetchInt(`${field  }[bytes]`)

      const offset = this.getOffset()

      try {
        result.body = this.fetchObject('Object', `${field  }[body]`)
      } catch (e) {
        console.error(dTime(), 'parse error', e.message, e.stack)
        result.body = { _: 'parse_error', error: e }
      }
      if (this.offset != offset + result.bytes) {
        // console.warn(dTime(), 'set offset', this.offset, offset, result.bytes)
        // console.log(dTime(), result)
        this.offset = offset + result.bytes
      }
      // console.log(dTime(), 'override message', result)
    },
    mt_rpc_result(result, field) {
      result.req_msg_id = this.fetchLong(`${ field }[req_msg_id]`)

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