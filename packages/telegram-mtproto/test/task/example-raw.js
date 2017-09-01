//@flow

export const binary: ArrayBuffer = new Int32Array([
  -395484551, -2117291008, -1746366153, -1532165303, -208150345, -617954986, -1929555773, 1807790409, 1660078198,
  608484458, -1502202275, 772479440, 1484945697, -155630404, -1411836251, -1654989022, -2028749017, 1702029726,
  -241911952, 1785508817, 690090220, -1795417273, -219831549, -1724936998, -374907850, -1907089505, -1091291027,
  1097680463, 212414193, 635872514, 29683548, -1905846953, -1329427645, -766185550, 1013798727, -2022144515,
  1559731880, 352227177, 296334258, -1087960443, 430174400, -1153055336
]).buffer

const exampleStart = {
  message: {
    acked            : false,
    container        : true,
    notContentRelated: false,
    createNetworker  : false,
    longPoll         : false,
    type             : 'container',
    msg_id           : '6450496914109960508',
    seq_no           : 4,
    inner            : [
      '6450496914088833140',
      '6450496914097330900'
    ],
    innerAPI: [
      '025b856a-df78-4a6f-b98f-5914170b4d07',
      false
    ],
    dc: 1
  },
  thread: {
    threadID   : 'ed77e421-1bed-45f9-82d4-29a132416f15',
    upload     : false,
    pendingAcks: [
      '6450496916758786049',
      '6450496917016671233'
    ],
    state: {
      sent   : {},
      pending: {},
      resend : {}
    },
    connectionInited     : false,
    checkConnectionPeriod: 1.1,
    lastServerMessages   : [
      '6450496916758786049',
      '6450496917016671233'
    ],
    uid       : '297582e3-0cb5-4b0c-a394-e5311fd05102',
    dcID      : 1,
    serverSalt: [ 36, 43, 212, 2, 216, 69, 29, 173 ],
    seqNo     : 3,
    sessionID : [ 48, 116, 20, 220, 200, 121, 178, 166 ],
    offline   : false,
    nextReq   : 1501873169192
  },
  noResponseMsgs: [],
  result        : { data: binary }
}

const exampleEnd =  {
  result: {
    response: {
      _       : 'msg_container',
      messages: [
        {
          _     : 'message',
          msg_id: '6450496916758786049',
          seqno : 1,
          bytes : 28,
          body  : {
            _           : 'new_session_created',
            first_msg_id: '6450496914088833140',
            unique_id   : '6819072553920564273',
            server_salt : '12474203336948853540'
          }
        },
        {
          _     : 'message',
          msg_id: '6450496917016671233',
          seqno : 3,
          bytes : 36,
          body  : {
            _         : 'rpc_result',
            req_msg_id: '6450496914088833140',
            result    : {
              _            : 'rpc_error',
              error_code   : 303,
              error_message: 'PHONE_MIGRATE_2'
            }
          }
        }
      ]
    },
    messageID: '6450496919383260161',
    sessionID: new Uint8Array([ 48, 116, 20, 220, 200, 121, 178, 166 ]),
    seqNo    : 4
  },
  thread : exampleStart.thread,
  message: exampleStart.message
}

export default exampleStart
