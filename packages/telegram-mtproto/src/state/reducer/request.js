//@flow

/* eslint-disable object-shorthand */

// import { Pure, liftF } from '@safareli/free'
// import { of, Left, Right } from 'apropos'
// import { Maybe } from 'folktale/maybe'
import { Maybe } from 'apropos'

import type {
  Client,
} from '../index.h'
import {
  trimType,
} from '../helpers'
import {
  type UID,
  toUID,
} from 'Newtype'
import { KeyValue, TupleT } from 'Monad'
import { RpcApiError } from '../../error'
import ApiRequest from '../../service/main/request'
// import Config from 'ConfigProvider'

import {
  type MessageUnit,
} from '../../task/index.h'

function handleApiResp(
  state: Client,
  task: MessageUnit,
  msgID: UID,
  outID: UID
): Client {
  const { body } = task
  if (__DEV__)
    console.log(`\n--- request done ---\n`, task.body)
  const { command, request } = state
  return command
    .maybeGetK(outID)
    /*:: .map(tuple => tuple.bimap(toUID, toUID)) */
    .chain(getRequestTuple(request))
    .map(x => x.bimap(
      removeMsgID(command, outID),
      req => {
        req.deferFinal.resolve(body)
        return request
          .removeK(req.requestID)
      }
    ))
    .fold(
      stateK(state),
      tupleToState(state))
}

function handleError(
  state: Client,
  task: MessageUnit,
  msgID: UID,
  outID: UID
): Client {
  if (__DEV__)
    console.log(`\n--- request error ---\n`, task.body)
  if (task.error.handled) return state
  const errorObj = new RpcApiError(task.error.code, task.error.message)
  const { command, request } = state
  return command
    .maybeGetK(outID)
    /*:: .map(tuple => tuple.bimap(toUID, toUID)) */
    .chain(getRequestTuple(request))
    .map(x => x.bimap(
      removeMsgID(command, outID),
      req => {
        req.deferFinal.reject(errorObj)
        return request
          .removeK(req.requestID)
      }
    ))
    .fold(
      stateK(state),
      tupleToState(state))
}

const getRequestByID =
  (request: KeyValue<UID, ApiRequest>) =>
    (reqID: UID): Maybe<ApiRequest> =>
      request
        .maybeGetK(reqID)
        .map(TupleT.snd)

const removeMsgID = (command, outID) => msgID =>
  command
    .removeK(msgID)
    .removeK(outID)

const getRequestTuple =
  request =>
    tuple =>
      TupleT.traverseMaybe(
        tuple.map(getRequestByID(request))
      )

const stateK = (state: Client) => () => state

const tupleToState = (state: Client) => tuple => ({
  ...state,
  command: tuple.fst(),
  request: tuple.snd(),
})

function resolveTask(state: Client, task: MessageUnit): Client {
  const { flags } = task
  const msgID = /*:: toUID( */ task.id /*:: ) */
  if (flags.api) {
    if (!task.api || !task.api.resolved) {
      if (__DEV__)
        console.error(`Task not found!`, task)
    }
    if (flags.methodResult) {
      const outID = /*:: toUID( */ task.methodResult.outID /*:: ) */
      if (flags.error) {
        return handleError(state, task, msgID, outID)
      } else if (flags.body) {
        return handleApiResp(state, task, msgID, outID)
      }
    }
  }
  return state
}

export default function requestWatch(state: Client, action: any): Client {
  switch (trimType(action.type)) {
    case ('api/task done'): {
      const tasks: MessageUnit[] = action.payload
      let newState = state
      for (const task of tasks) {
        newState = resolveTask(newState, task)
      }
      return newState
    }
    default: return state
  }
}
