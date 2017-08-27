//@flow

import { toPairs } from 'ramda'

import { type State, type ApiNewRequest } from '../index.h'
import { type MessageUnit } from '../../task/index.h'
import { makeError, type MakeError, of } from 'apropos'



type Args = {
  dc: number,
  outID: string
}


const id = x => x
const supressErrors = () => void 0

const noNetworker: MakeError<'No networker'> = makeError('No networker')
const noOutID: MakeError<'outID not found'> = makeError('outID not found')
const unexpected: MakeError<'Unexpected failure'> = makeError('Unexpected failure')

const getNetworker = ({ networker }) => networker
const getReqMap = ({ requestMap }) => requestMap
const getReqID = ([reqID]) => reqID

const pairMapper = ([reqID, { msg_id }]) => [reqID, msg_id]
const remapPairs = pairs => pairs.map(pairMapper)

const getFromDcCond = dc => ({
  cond: list => list.has(dc),
  pass: list => list.get(dc),
  fail: noNetworker
})

const findOutID =
  (outID, pairs) => pairs.findIndex(
    ([reqID, msgID]) => msgID === outID)

const mapFind = outID => pairs => ({
  pairs,
  finded: findOutID(outID, pairs)
})

const context = ({ dc, outID }) => ({
  getWorker: getFromDcCond(dc),
  find     : mapFind(outID)
})

const reqPairs = networker =>
  of(networker)
    .map(getReqMap)
    .map(toPairs)
    .map(remapPairs)
    .mapL(unexpected)

const checkIndex = {
  cond: ({ finded }) => finded > -1,
  pass: ({ pairs, finded }) => pairs[finded],
  fail: noOutID
}

const chain = (state, { getWorker, find }) =>
  of(state)
    .map(getNetworker)
    .mapL(unexpected)
    .logic(getWorker)
    .chain(reqPairs)
    .map(find)
    .logic(checkIndex)
    .map(getReqID)
    .fold(supressErrors, id)

const query = (state: State) => (args: Args) => chain(state, context(args))

export default query
