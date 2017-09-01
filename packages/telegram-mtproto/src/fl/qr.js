//@flow

type Fields = 'dc' | 'ack' | 'msg'


const dcs = [2, 3, 5]
const homeDc = 2
const dcHome = [true, false, false]

const msgs = ['aa', 'bb', 'dd', 'zz']
const msgAcks = [true, false, false, true]
const msgDc = [2, 2, 3, 5]

const ackMsgs = [0, 3]
const ackApi = [1]
const ackResp = ['ee', 'ff']

const flags = {
  dc  : true,
  msg : true,
  ack : {
    api: [1]
  },
  salt: false,
}

const msgList = [{
  dc : 2,
  id : 'aa',
  ack: true,
}, {
  dc : 2,
  id : 'bb',
  ack: false,
}, {
  dc : 3,
  id : 'dd',
  ack: false,
}, {
  dc : 5,
  id : 'zz',
  ack: true,
}]

const dcList = [{
  id  : 2,
  msgs: [0, 1],
  ack : [0],
}, {
  id  : 3,
  msgs: [2],
  ack : [0],
}, {
  id  : 5,
  msgs: [3],
  ack : [1],
}]

const ackList = [{
  dc : 2,
  id : 'aa',
  ack: true,
  resp: 'ee',
}, {
  dc : 5,
  id : 'zz',
  ack: true,
  resp: 'ff',
  api: 'sign.In'
}]
