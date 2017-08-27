//@flow

/* eslint-disable max-len */

import { ProtocolError } from '../error'

export default function describeProtocolError(code: number) {
  return new ProtocolError(
    code,
    getShortDescription(code),
    getFullDescription(code),
  )
}

function getShortDescription(code: number) {
  switch (code) {
    case 16: return `msg_id too low`
    case 17: return `msg_id too high`
    case 18: return `incorrect two lower order msg_id bits`
    case 19: return `same container id`
    case 20: return `message too old`
    case 32: return `msg_seqno too low`
    case 33: return `msg_seqno too high`
    case 34: return `odd seq`
    case 35: return `even seq`
    case 48: return `incorrect server salt`
    case 64: return `invalid container`
    default: return `unknown`
  }
}

function getFullDescription(code: number) {
  switch (code) {
    case 16: return `Most likely, client time is wrong; it would be worthwhile to synchronize it using msg_id notifications and re-send the original message with the “correct” msg_id or wrap it in a container with a new msg_id if the original message had waited too long on the client to be transmitted`
    case 17: return `The client time has to be synchronized, and the message re-sent with the correct msg_id`
    case 18: return `the server expects client message msg_id to be divisible by 4`
    case 19: return `container msg_id is the same as msg_id of a previously received message (this must never happen)`
    case 20: return `message too old, and it cannot be verified whether the server has received a message with this msg_id or not`
    case 32: return `the server has already received a message with a lower msg_id but with either a higher or an equal and odd seqno`
    case 33: return `similarly, there is a message with a higher msg_id but with either a lower or an equal and odd seqno`
    case 34: return `an even msg_seqno expected (irrelevant message), but odd received`
    case 35: return `odd msg_seqno expected (relevant message), but even received`
    case 48: return `In this case, the bad_server_salt response is received with the correct salt, and the message is to be re-sent with it`
    case 64: return `invalid container`
    default: return `unknown error`
  }
}
