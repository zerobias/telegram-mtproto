//@flow

import { doubleCreator, type ActionPair } from '../helpers'
import { type MessageUnit } from '../../task/index.h'
import {
  type OnRequestDone,
  type ApiNewRequest
} from '../index.h'

type ApiMeta = string

type Api = {
  REQUEST: {
    NEW: ActionPair<'api/request new', ApiNewRequest, ApiMeta>,
    DONE: ActionPair<'api/request done', OnRequestDone>,
  },
  TASK: {
    NEW: ActionPair<'api/task new', any>,
    DONE: ActionPair<'api/task done', MessageUnit[]>,
  },
}

export type ApiMetaPL = {
  _: 'api',
  id: string,
}

const apiMeta = (_: any, id: string) => ({ _: 'api', id })


export const API: Api = {
  REQUEST: {
    NEW : doubleCreator('api/request new', apiMeta),
    DONE: doubleCreator('api/request done'),
  },
  TASK: {
    NEW : doubleCreator('api/task new'),
    DONE: doubleCreator('api/task done'),
  }
}
