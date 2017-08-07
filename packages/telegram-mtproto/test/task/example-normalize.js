//@flow

/* eslint-disable max-len */

/* import { type RawInput } from '../../src/task/index.h' */
import { toBuffer8 } from './fixtures'

const { NetMessage, NetContainer } = require('../../lib/service/networker/net-message')

const mockNetMessage = (data, Construct = NetMessage) => {
  let msg
  if (Construct === NetMessage)
    msg = new Construct(data.uid, data.seq_no, data.body, data.type)
  else
    //$FlowIssue
    msg = new Construct(data.uid, data.seq_no, data.body, data.type, data.inner, data.innerAPI)
  Object.assign(msg, data)
  return msg
}

const noResponseMsgs = ['6450657550051501188']

const responseBuffer = toBuffer8([72, 154, 7, 174, 115, 239, 125, 150, 208, 238, 179, 127, 137, 119, 120, 2, 62, 211, 155, 232, 34, 190, 112, 190, 145, 227, 18, 207, 94, 39, 193, 80, 240, 175, 171, 161, 171, 28, 254, 29, 102, 189, 181, 4, 81, 232, 255, 46, 66, 117, 73, 173, 138, 252, 144, 245, 127, 164, 206, 157, 66, 251, 94, 242, 90, 32, 181, 25, 236, 181, 132, 81, 71, 185, 152, 248, 132, 206, 181, 0, 252, 246, 83, 1, 73, 87, 115, 238])

const uid = '45803d12-e871-4315-9620-b5af69656271'

const authKeyID = [72, 154, 7, 174, 115, 239, 125, 150]

const authKeyUint8 = new Uint8Array([57, 5, 27, 106, 126, 248, 172, 240, 84, 152, 131, 113, 242, 219, 183, 123, 153, 219, 132, 193, 159, 207, 232, 90, 222, 107, 24, 254, 190, 162, 119, 74, 172, 56, 156, 245, 50, 163, 1, 62, 192, 209, 111, 255, 123, 25, 249, 59, 181, 131, 82, 33, 251, 55, 250, 71, 108, 5, 31, 155, 197, 98, 234, 136, 4, 60, 178, 1, 174, 123, 200, 10, 227, 46, 252, 97, 97, 56, 187, 34, 119, 234, 160, 151, 75, 155, 126, 26, 117, 172, 144, 206, 18, 241, 127, 47, 12, 230, 225, 141, 59, 134, 92, 115, 126, 56, 51, 97, 65, 162, 193, 56, 66, 137, 4, 56, 28, 47, 109, 178, 138, 213, 104, 250, 198, 191, 43, 198, 114, 34, 247, 241, 125, 152, 21, 252, 203, 124, 18, 23, 48, 103, 166, 47, 243, 90, 64, 232, 185, 24, 86, 250, 95, 53, 222, 115, 12, 155, 185, 29, 107, 246, 10, 242, 134, 176, 20, 150, 100, 90, 122, 232, 194, 89, 63, 214, 54, 92, 96, 94, 251, 50, 225, 248, 144, 66, 233, 222, 103, 160, 248, 237, 7, 98, 70, 28, 240, 244, 175, 89, 165, 108, 223, 181, 164, 206, 121, 249, 172, 255, 228, 75, 124, 138, 44, 14, 54, 99, 195, 38, 139, 2, 237, 52, 33, 98, 7, 50, 185, 142, 44, 115, 134, 97, 211, 141, 65, 116, 141, 250, 63, 0, 72, 76, 102, 19, 124, 20, 119, 101, 108, 244, 121, 19, 207, 113])

const thisSessionID = [89, 35, 220, 168, 231, 136, 44, 110]

const prevSessionID = void 0

const threadState = new Map([
  [
    '6450657550051501188',
    mockNetMessage({
      acked            : false,
      container        : false,
      notContentRelated: false,
      createNetworker  : false,
      longPoll         : true,
      type             : 'other',
      uid              : uid,
      msg_id           : '6450657550051501188',
      seq_no           : 5,
      dc               : 2,
      noResponse       : true,
      body             : new Uint8Array([159, 53, 153, 146, 232, 3, 0, 0, 244, 1, 0, 0, 168, 97, 0, 0]),
    })
  ],
  [
    '6450657575076875828',
    mockNetMessage({
      acked            : false,
      container        : false,
      notContentRelated: false,
      createNetworker  : false,
      longPoll         : true,
      type             : 'other',
      uid              : uid,
      msg_id           : '6450657575076875828',
      seq_no           : 7,
      dc               : 2,
      noResponse       : true,
      body             : new Uint8Array([159, 53, 153, 146, 232, 3, 0, 0, 244, 1, 0, 0, 168, 97, 0, 0]),
    })
  ],
  [
    '6450657575206813772',
    mockNetMessage({
      acked            : false,
      container        : false,
      notContentRelated: true,
      createNetworker  : false,
      longPoll         : false,
      type             : 'ack/resend',
      uid              : uid,
      msg_id           : '6450657575206813772',
      seq_no           : 8,
      dc               : 2,
      noShedule        : true,
      body             : new Uint8Array([89, 180, 214, 98, 21, 196, 181, 28, 1, 0, 0, 0, 1, 176, 201, 218, 155, 43, 133, 89]),
    })
  ],
  [
    '6450657575242554964',
    mockNetMessage({
      acked            : false,
      container        : true,
      notContentRelated: false,
      createNetworker  : false,
      longPoll         : false,
      type             : 'container',
      uid              : uid,
      msg_id           : '6450657575242554964',
      seq_no           : 8,
      inner            : [
        '6450657575076875828',
        '6450657575206813772'
      ],
      innerAPI: [
        false,
        false
      ],
      dc  : 2,
      body: new Uint8Array([220, 248, 241, 115, 2, 0, 0, 0, 52, 206, 35, 50, 227, 86, 133, 89, 7, 0, 0, 0, 16, 0, 0, 0, 159, 53, 153, 146, 232, 3, 0, 0, 244, 1, 0, 0, 168, 97, 0, 0, 76, 128, 226, 57, 227, 86, 133, 89, 8, 0, 0, 0, 20, 0, 0, 0, 89, 180, 214, 98, 21, 196, 181, 28, 1, 0, 0, 0, 1, 176, 201, 218, 155, 43, 133, 89]),
    }, NetContainer)
  ]
])

const getMsgById = ({ req_msg_id }: { req_msg_id: string }) => threadState.get(req_msg_id)

const fullConfig = {
  responseBuffer,
  uid,
  authKeyID,
  authKeyUint8,
  thisSessionID,
  prevSessionID,
  getMsgById,
}

export const rawData = {
  noResponseMsgs,
  message: mockNetMessage({
    body             : new Uint8Array([159, 53, 153, 146, 232, 3, 0, 0, 244, 1, 0, 0, 168, 97, 0, 0]),
    acked            : false,
    container        : false,
    notContentRelated: false,
    createNetworker  : false,
    longPoll         : true,
    type             : 'other',
    uid              : uid,
    msg_id           : '6450657550051501188',
    seq_no           : 5,
    dc               : 2,
    noResponse       : true
  }),
  result: {
    status    : 200,
    statusText: 'OK',
    data      : toBuffer8([72, 154, 7, 174, 115, 239, 125, 150, 208, 238, 179, 127, 137, 119, 120, 2, 62, 211, 155, 232, 34, 190, 112, 190, 145, 227, 18, 207, 94, 39, 193, 80, 240, 175, 171, 161, 171, 28, 254, 29, 102, 189, 181, 4, 81, 232, 255, 46, 66, 117, 73, 173, 138, 252, 144, 245, 127, 164, 206, 157, 66, 251, 94, 242, 90, 32, 181, 25, 236, 181, 132, 81, 71, 185, 152, 248, 132, 206, 181, 0, 252, 246, 83, 1, 73, 87, 115, 238])
  }
}

export default fullConfig
