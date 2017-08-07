//@flow
/*::
import {
  type MessageMain,
  type Conformᐸbodyᐳ,
  type Conformᐸapiᐳ,
  type Conformᐸcontainerᐳ,
  type Conformᐸincomingᐳ,
  type ConformᐸmethodResultᐳ,
} from '../../src/task/index.h'
*/
const session = new Uint8Array([104, 253, 6, 5, 166, 213, 190, 141])

export const raw = {
  _       : 'msg_container',
  messages: [{
    _   : 'message',
    body: {
      _           : 'new_session_created',
      first_msg_id: '6451324639565242596',
      server_salt : '10054112889999250563',
      unique_id   : '12719723951254540931',
    },
    bytes : 28,
    msg_id: '6451324664439027713',
    seqno : 1
  }, {
    _   : 'message',
    body: {
      _         : 'rpc_result',
      req_msg_id: '6451324639565242596',
      result    : {
        _        : 'auth.sentCode',
        flags    : 3,
        next_type: {
          _: 'auth.codeTypeSms',
        },
        phone_code_hash : 'e49a9dab2598a3db61',
        phone_registered: true,
        type            : {
          _     : 'auth.sentCodeTypeApp',
          length: 5,
        },
      }
    },
    bytes : 52,
    msg_id: '6451324664531753985',
    seqno : 3
  }]
}

/* const errorMessage: Conformᐸincomingᐳ & Conformᐸapiᐳ & Conformᐸbodyᐳ = {
  id   : '6450496917016671233',
  seq  : 3,
  session,
  dc   : 1,
  flags: {
    api      : true,
    inner    : true,
    container: false,
    incoming : true,
    methodResult  : true,
    body     : true,
  },
  incoming: {
    outAs: '6450496914088833140',
  },
  api: {
    reqMsg : '6450496914088833140',
    request: '025b856a-df78-4a6f-b98f-5914170b4d07',
  },
  inner: {
    container: '6450496919383260161',
  },
  body: {
    _            : 'rpc_error',
    error_code   : 303,
    error_message: 'PHONE_MIGRATE_2'
  }
} */

export const TIMESTAMP = 1502083278012

const newSession: Conformᐸincomingᐳ & Conformᐸbodyᐳ = {
  id   : '6451324664439027713',
  seq  : 1,
  session,
  dc   : 2,
  flags: {
    api         : false,
    inner       : true,
    container   : false,
    incoming    : true,
    methodResult: false,
    body        : true,
    error       : false,
  },
  inner: {
    container: '6451324666894843905',
  },
  incoming: {
    timestamp: TIMESTAMP,
  },
  body: {
    _           : 'new_session_created',
    first_msg_id: '6451324639565242596',
    unique_id   : '12719723951254540931',
    server_salt : '10054112889999250563'
  },
}

const sentCode: Conformᐸapiᐳ & Conformᐸbodyᐳ = {
  id   : '6451324664531753985',
  seq  : 3,
  session,
  dc   : 2,
  flags: {
    api         : true,
    inner       : true,
    container   : false,
    incoming    : true,
    methodResult: true,
    body        : true,
    error       : false,
  },
  inner: {
    container: '6451324666894843905',
  },
  incoming: {
    timestamp: TIMESTAMP,
  },
  methodResult: {
    outID: '6451324639565242596',
  },
  body: {
    _        : 'auth.sentCode',
    flags    : 3,
    next_type: {
      _: 'auth.codeTypeSms',
    },
    phone_code_hash : 'e49a9dab2598a3db61',
    phone_registered: true,
    type            : {
      _     : 'auth.sentCodeTypeApp',
      length: 5,
    },
  },
  // api: {
  //   resultType: 'auth.SentCode',
  // }
}

const container: Conformᐸincomingᐳ & Conformᐸcontainerᐳ = {
  id   : '6451324666894843905',
  seq  : 4,
  session,
  dc   : 2,
  flags: {
    api         : false,
    inner       : false,
    container   : true,
    incoming    : true,
    methodResult: false,
    body        : false,
    error       : false,
  },
  container: {
    contains: ['6451324664439027713', '6451324664531753985'],
    // apiMap  : new Map([
    //   ['6451324664439027713', false],
    //   ['6451324664531753985', '76dea7e3-92f9-4932-9beb-8c1b9c9586f5']
    // ]),
  },
  incoming: {
    timestamp: TIMESTAMP,
  },
}


// This should be outcoming container
/* const container: Conformᐸincomingᐳ & Conformᐸcontainerᐳ = {
  id   : '6451324666894843905',
  seq  : 4,
  session,
  dc   : 2,
  flags: {
    api         : false,
    inner       : false,
    container   : true,
    incoming    : true,
    methodResult: false,
    body        : false,
  },
  container: {
    contains: ['6451324639565242596', '6451324639575664692'],
    apiMap  : new Map([
      ['6451324639565242596', '76dea7e3-92f9-4932-9beb-8c1b9c9586f5'],
      ['6451324639575664692', false]
    ]),
  },
  incoming: {
    timestamp: TIMESTAMP,
  },
} */

export default [
  newSession,
  sentCode,
  container,
]

