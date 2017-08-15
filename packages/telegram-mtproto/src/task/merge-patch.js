//@flow


import { mergeWith, concat, append, groupBy, pipe, map, last, filter, fromPairs, contains } from 'ramda'

import {
  type MessageUnit,

  type ᐸPatchᐳSummary,
  type ᐸPatchᐳMessage,
  type ᐸPatchᐳAuthKey,
  type ᐸPatchᐳSalt,
  type ᐸPatchᐳSession,
  type ᐸPatchᐳSummaryReduced,

  type DcAuth
} from './index.h'
import { queryNetworker } from '../state/query'

import singleHandler from './single-handler'

import Logger from 'mtproto-logger'
import Status, { netStatuses } from '../net-status'
const log = Logger`merge-patch`


export default function mergePatch(ctx: *, processed: MessageUnit[]) {
  const { message, summary } = processed
    .reduce((acc, msg) => {
      const { message, summary } = singleHandler(ctx, msg)
      return {
        message: append(message, acc.message),
        summary: append(summary, acc.summary),
      }
    }, { message: [], summary: [] })
  const mergedSummary = summary.reduce(mergeSummary, emptySummary())
  const regrouped = regroupSummary(mergedSummary)
  const noAuth = dcWithoutAuth(regrouped.auth)
  const { salt, session, ...omitSalt } = regrouped
  const updatedSalt: { [dc: number]: number[] | false } = { ...salt, ...noAuth }
  const updatedSession: { [dc: number]: ᐸPatchᐳSession | false } = { ...session, ...noAuth }
  const withNewSalt: ᐸPatchᐳSummaryReduced = {
    ...omitSalt,
    salt   : updatedSalt,
    session: updatedSession,
  }
  const joinedAuth = joinDcAuth(withNewSalt)
  // log`mergedSummary`(mergedSummary)
  log`regrouped`(withNewSalt)
  log`joinedAuth`(joinedAuth)
  log`detectStatus`(map(detectStatus, joinedAuth))
  return {
    normalized: message,
    summary   : withNewSalt,
  }
}


const emptySummary = (): ᐸPatchᐳSummary => ({
  processAck  : [],
  ack         : [],
  home        : [],
  auth        : [],
  reqResend   : [],
  resend      : [],
  lastMessages: [],
  salt        : [],
  session     : [],
})

type MergeSummary = (acc: ᐸPatchᐳSummary, val: ᐸPatchᐳSummary) => ᐸPatchᐳSummary
//$off
const mergeSummary: MergeSummary = mergeWith(concat)

//$off
type GroupAndExtract/*:: <-T, S>*/ = (list: $ReadOnlyArray<T>) => { [dc: number]: S[] }
const groupAndExtract = /*:: <T, S>*/(fn: (x: T) => S): GroupAndExtract<T, S> => pipe(
  groupBy(({ dc }: { dc: number }) => /*::(*/dc/*:: : $FlowIssue)*/),
  map(map(fn))
)

const groupDcIds: GroupAndExtract<ᐸPatchᐳMessage, string> = groupAndExtract(e => e.id)
const groupAuthKey: GroupAndExtract<ᐸPatchᐳAuthKey, number[] | false> = groupAndExtract(e => e.authKey)
const groupSalt: GroupAndExtract<ᐸPatchᐳSalt, number[]> = groupAndExtract(e => e.salt)
const groupSession: GroupAndExtract<ᐸPatchᐳSession, ᐸPatchᐳSession> = groupAndExtract(e => e)

function regroupSummary(summary: ᐸPatchᐳSummary) {
  const {
    processAck,
    ack,
    home,
    auth,
    reqResend,
    resend,
    lastMessages,
    salt,
    session,
  } = summary

  const regrouped = {
    processAck  : groupDcIds(processAck),
    ack         : groupDcIds(ack),
    home,
    auth        : reduceToLast(groupAuthKey(auth)),
    reqResend   : groupDcIds(reqResend),
    resend      : groupDcIds(resend),
    lastMessages: groupDcIds(lastMessages),
    salt        : reduceToLast(groupSalt(salt)),
    session     : reduceToLast(groupSession(session)),
  }

  return regrouped
}


type ReduceToLast = <T>(dcMap: { [dc: number]: T[] }) => { [dc: number]: T }
//$off
const reduceToLast: ReduceToLast = map(last)

//$off
type DcWithoutAuth = (auth: { [dc: number]: number[] | false }) =>
  { [dc: number]: false }
const dcWithoutAuth: DcWithoutAuth = filter(e => e === false)


const empty: any = {}
const toDcs = obj => Object
  .keys(obj)
  .filter(isFinite)
  .map(e => parseInt(e, 10))

function joinDcAuth(summary) {
  /*::
  type AuthMap = typeof summary.auth
  type SaltMap = typeof summary.salt
  type SessionMap = typeof summary.session
  */
  const emptyAuth: AuthMap = empty
  const emptySalt: SaltMap = empty
  const emptySession: SessionMap = empty
  const {
    auth = emptyAuth,
    salt = emptySalt,
    session = emptySession,
  } = summary
  const authKeys = toDcs(auth)
  const saltKeys = toDcs(salt)
  const sessionKeys = toDcs(session)
  const usedDcs = [...new Set([...authKeys, ...saltKeys, ...sessionKeys])]
  const emptyDcAuth: DcAuth = /*::(*/{}/*:: : any)*/
  let result: {
    [dc: number]: DcAuth
  } = fromPairs(usedDcs.map(e => [e, emptyDcAuth]))
  for (const dc of usedDcs) {
    let dcAuth = result[dc]
    const hasDc = contains(dc)
    if (hasDc(authKeys))
      dcAuth = { ...dcAuth, auth: auth[dc] }
    if (hasDc(saltKeys))
      dcAuth = { ...dcAuth, salt: salt[dc] }
    if (hasDc(sessionKeys))
      dcAuth = { ...dcAuth, session: session[dc] }
    result = { ...result, [dc]: dcAuth }
  }
  return result
}

const emptyDcAuth: DcAuth = {
  auth   : false,
  salt   : false,
  session: false,
}

function detectStatus(dc: number, dcAuth: DcAuth) {
  const net = queryNetworker(dc).fold(() => false, x => x)
  let initialData = dcAuth
  if (net) {
    const auth: number[] | false = net.authKey && net.authKey.length > 0
      ? net.authKey
      : false
    const salt: number[] | false = net.salt && net.salt.length > 0
      ? net.salt
      : false
    initialData = { auth, salt, ...initialData }
  }
  initialData = { ...emptyDcAuth, ...initialData }
  if (!initialData.auth || !initialData.salt)
    return netStatuses.load
  return netStatuses.active
}
