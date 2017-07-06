//@flow

import { combineEpics, select } from 'redux-most'
import { Stream } from 'most'

import { MAIN, NET } from '../action'
import { type Action } from '../action'
import { NetMessage } from '../../service/networker/net-message'
import { apiMessage, encryptApiBytes, mtMessage } from '../../service/chain/encrypted-message'
import Config from '../../config-provider'
import NetworkerThread from '../../service/networker/index'
import { Serialization } from '../../tl/index'
import { ErrorBadResponse, ErrorBadRequest } from '../../error'
import { httpClient } from '../../http'
import signal from '../signal'
import { faucet } from '../../pull-stream'

const initialize = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.SWITCH_ON.stream)
    .delay(15)
    .map(() => MAIN.ACTIVATED.action())



const faucetC =
  (source: Stream<*>) =>
    faucet(source, signal.active).stream

const netRequest = (action: Stream<*>) =>
  action
    .thru(e => NET.SEND_REQUEST.stream(e))
    .thru(faucetC)
    .map((val: { payload: { message: NetMessage, options: Object, threadID: string, thread: NetworkerThread } }) => {
      const { payload } = val
      const { message, options, threadID, thread } = payload
      console.log(payload)
      const apiBytes = apiMessage({
        ctx       : new Serialization({ startMaxLength: message.body.length + 64 }, thread.uid).writer,
        serverSalt: thread.serverSalt,
        sessionID : thread.sessionID,
        message
      })
      return { ...payload, apiBytes }
      // return MAIN.TEST.action('  ')
    })
    // .tap(e => console.log(e))
    .map(async(val) => {
      const { apiBytes, thread, options, message, noResponseMsgs } = val
      const { encryptedBytes, msgKey } = await encryptApiBytes({
        bytes  : apiBytes,
        authKey: thread.authKeyUint8
      })
      const request = new Serialization({ startMaxLength: encryptedBytes.byteLength + 256 }, thread.uid).writer

      const mtBytes = mtMessage({
        ctx      : request,
        authKeyID: thread.authKeyID,
        msgKey,
        encryptedBytes
      })
      const url = Config.dcMap(thread.uid, thread.dcID)
      const requestOpts = { responseType: 'arraybuffer', ...options }
      try {
        const result = await httpClient.post(url, mtBytes, requestOpts)
        console.log(result.data)
        if (!result.data.byteLength) {
          const err = new ErrorBadResponse(url, result)
          thread.emit('response-raw', err)
          return Promise.reject(err)
        }
        const response = await thread.parseResponse(result.data)
        await thread.requestPerformer(message, noResponseMsgs, response)
        thread.emit('response-raw', {
          data      : result.data,
          status    : result.status,
          statusText: result.statusText,
          message,
          options
        })
        return {
          data      : response,
          status    : result.status,
          statusText: result.statusText,
          message,
          options
        }
      } catch (error) {
        const err = new ErrorBadRequest(url, error)
        thread.emit('response-raw', err)
        return Promise.reject(err)
      }
    })
    .awaitPromises()
    .tap(e => console.log(e))
    .map(NET.RECIEVE_RESPONSE.action)
    // .recoverWith(err => NET.NETWORK_ERROR.action(err))


const rootEpic = combineEpics([
  initialize,
  netRequest,
])

export default rootEpic
