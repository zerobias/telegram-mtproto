'use strict'

exports['messageExample'] = {
  '_'         : 'rpc_result',
  'req_msg_id': '6469337826915064756',
  'result'    : {
    '_'         : 'nearestDc',
    'country'   : 'RU',
    'this_dc'   : 2,
    'nearest_dc': 2
  }
}

exports['detailedInfoAndUpdShort'] = {
  '_'       : 'msg_container',
  'messages': [
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6475416378305629316',
        'result'    : {
          '_'         : 'nearestDc',
          'country'   : 'RU',
          'this_dc'   : 2,
          'nearest_dc': 2
        }
      },
      'seqno' : 3,
      'bytes' : 28,
      'msg_id': '6475416381804694529'
    },
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6475416379125142140',
        'result'    : {
          '_'               : 'auth.sentCode',
          'flags'           : 3,
          'phone_registered': true,
          'type'            : {
            '_'     : 'auth.sentCodeTypeApp',
            'length': 5
          },
          'phone_code_hash': '785aca4eafa44096bb',
          'next_type'      : {
            '_': 'auth.codeTypeSms'
          }
        }
      },
      'seqno' : 5,
      'bytes' : 52,
      'msg_id': '6475416383493737473'
    },
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6475416381752923364',
        'result'    : {
          '_'    : 'auth.authorization',
          'flags': 0,
          'user' : {
            '_'          : 'user',
            'flags'      : 3195,
            'self'       : true,
            'contact'    : true,
            'id'         : 297169,
            'access_hash': '6362957075171533052',
            'first_name' : 'lambda257',
            'username'   : 'lambda',
            'phone'      : '9996620000',
            'photo'      : {
              '_'          : 'userProfilePhoto',
              'photo_id'   : '1276331592624111',
              'photo_small': {
                '_'        : 'fileLocation',
                'dc_id'    : 2,
                'volume_id': '604116248',
                'local_id' : 204,
                'secret'   : '15001237309940136639'
              },
              'photo_big': {
                '_'        : 'fileLocation',
                'dc_id'    : 2,
                'volume_id': '604116248',
                'local_id' : 206,
                'secret'   : '5708407752355442935'
              }
            },
            'status': {
              '_'      : 'userStatusOnline',
              'expires': 1507675632
            }
          }
        }
      },
      'seqno' : 7,
      'bytes' : 148,
      'msg_id': '6475416384416892929'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416382250187468',
        'answer_msg_id': '6475416385491397633',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338641921'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416383313199836',
        'answer_msg_id': '6475416387655886849',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338649089'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416386016730916',
        'answer_msg_id': '6475416388684033025',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338652161'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416382799717076',
        'answer_msg_id': '6475416386584066049',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338654209'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416386515667812',
        'answer_msg_id': '6475416389711134721',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338656257'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416390282302004',
        'answer_msg_id': '6475416392896020481',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338661377'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416387574568820',
        'answer_msg_id': '6475416391895000065',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338663425'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416391297242852',
        'answer_msg_id': '6475416395002836993',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338665473'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416390785802068',
        'answer_msg_id': '6475416393929719809',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338667521'
    },
    {
      '_'   : 'message',
      'body': {
        '_'            : 'msg_detailed_info',
        'msg_id'       : '6475416387033512092',
        'answer_msg_id': '6475416390823334913',
        'bytes'        : 2092,
        'status'       : 0
      },
      'seqno' : 28,
      'bytes' : 28,
      'msg_id': '6475416418338668545'
    },
    {
      '_'   : 'message',
      'body': {
        '_'        : 'updateShortMessage',
        'flags'    : 0,
        'id'       : 6101,
        'user_id'  : 777000,
        'message'  : "Your login code: 22222\n\nThis code can be used to log in to your Telegram account. We never ask it for anything else. Do not give it to anyone, even if they say they're from Telegram!!\n\nIf you didn't request this code by trying to log in on another device, simply ignore this message.",
        'pts'      : 8222,
        'pts_count': 1,
        'date'     : 1507675372
      },
      'seqno' : 29,
      'bytes' : 256,
      'msg_id': '6475416418338671617'
    }
  ]
}

exports['newSessionAndAck'] = {
  '_'       : 'msg_container',
  'messages': [
    {
      '_'   : 'message',
      'body': {
        '_'           : 'new_session_created',
        'first_msg_id': '6475416149516675284',
        'unique_id'   : '1149214835638777811',
        'server_salt' : '8646898345719505880'
      },
      'seqno' : 1,
      'bytes' : 28,
      'msg_id': '6475416284902969345'
    },
    {
      '_'   : 'message',
      'body': {
        '_'      : 'msgs_ack',
        'msg_ids': [
          '6475416149516675284'
        ]
      },
      'seqno' : 2,
      'bytes' : 20,
      'msg_id': '6475416284903060481'
    }
  ]
}

exports['rawExample'] = {
  '_'       : 'msg_container',
  'messages': [
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6469337870743595052',
        'result'    : {
          '_'         : 'nearestDc',
          'country'   : 'RU',
          'this_dc'   : 2,
          'nearest_dc': 2
        }
      },
      'seqno' : 3,
      'bytes' : 28,
      'msg_id': '6469337874156814337'
    },
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6469337873782192212',
        'result'    : {
          '_'               : 'auth.sentCode',
          'flags'           : 3,
          'phone_registered': true,
          'type'            : {
            '_'     : 'auth.sentCodeTypeApp',
            'length': 5
          },
          'phone_code_hash': '7deac9022b73a3a888',
          'next_type'      : {
            '_': 'auth.codeTypeSms'
          }
        }
      },
      'seqno' : 5,
      'bytes' : 52,
      'msg_id': '6469337875833342977'
    },
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6469337874337673772',
        'result'    : {
          '_'    : 'auth.authorization',
          'flags': 0,
          'user' : {
            '_'          : 'user',
            'flags'      : 3195,
            'self'       : true,
            'contact'    : true,
            'id'         : 297169,
            'access_hash': '6362957075171533052',
            'first_name' : 'lambda257',
            'username'   : 'lambda',
            'phone'      : '9996620000',
            'photo'      : {
              '_'          : 'userProfilePhoto',
              'photo_id'   : '1276331592624111',
              'photo_small': {
                '_'        : 'fileLocation',
                'dc_id'    : 2,
                'volume_id': '604116248',
                'local_id' : 204,
                'secret'   : '15001237309940136639'
              },
              'photo_big': {
                '_'        : 'fileLocation',
                'dc_id'    : 2,
                'volume_id': '604116248',
                'local_id' : 206,
                'secret'   : '5708407752355442935'
              }
            },
            'status': {
              '_'      : 'userStatusOnline',
              'expires': 1506260250
            }
          }
        }
      },
      'seqno' : 7,
      'bytes' : 148,
      'msg_id': '6469337877070913537'
    },
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6469337874967091388',
        'result'    : {
          '_'      : 'messages.dialogs',
          'dialogs': [
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 777000
              },
              'top_message'       : 6037,
              'read_inbox_max_id' : 3779,
              'read_outbox_max_id': 2392,
              'unread_count'      : 2242,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 2147483647,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 152058
              },
              'top_message'       : 5504,
              'read_inbox_max_id' : 5474,
              'read_outbox_max_id': 5471,
              'unread_count'      : 1,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 372278
              },
              'top_message'       : 5492,
              'read_inbox_max_id' : 5492,
              'read_outbox_max_id': 0,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 303253
              },
              'top_message'       : 5491,
              'read_inbox_max_id' : 4422,
              'read_outbox_max_id': 1571,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 297169
              },
              'top_message'       : 4225,
              'read_inbox_max_id' : 4225,
              'read_outbox_max_id': 0,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 903185
              },
              'top_message'       : 2487,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 2487,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 266297
              },
              'top_message'       : 2291,
              'read_inbox_max_id' : 2071,
              'read_outbox_max_id': 2291,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 1,
              'peer' : {
                '_'         : 'peerChannel',
                'channel_id': 10268765
              },
              'top_message'       : 7,
              'read_inbox_max_id' : 7,
              'read_outbox_max_id': 6,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'default'
              },
              'pts': 8
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerChat',
                'chat_id': 96733
              },
              'top_message'       : 2029,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 2029,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerChat',
                'chat_id': 245975
              },
              'top_message'       : 1262,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 1262,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerChat',
                'chat_id': 902655
              },
              'top_message'       : 1231,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 1231,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 1,
              'peer' : {
                '_'         : 'peerChannel',
                'channel_id': 10279405
              },
              'top_message'       : 3,
              'read_inbox_max_id' : 3,
              'read_outbox_max_id': 2,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'default'
              },
              'pts': 4
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerChat',
                'chat_id': 235870
              },
              'top_message'       : 1097,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 1096,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerChat',
                'chat_id': 680564
              },
              'top_message'       : 1095,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 1094,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerChat',
                'chat_id': 681708
              },
              'top_message'       : 250,
              'read_inbox_max_id' : 109,
              'read_outbox_max_id': 250,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 627821
              },
              'top_message'       : 172,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 0,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 207386
              },
              'top_message'       : 164,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 0,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 771698
              },
              'top_message'       : 156,
              'read_inbox_max_id' : 156,
              'read_outbox_max_id': 155,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            },
            {
              '_'    : 'dialog',
              'flags': 0,
              'peer' : {
                '_'      : 'peerUser',
                'user_id': 659076
              },
              'top_message'       : 149,
              'read_inbox_max_id' : 0,
              'read_outbox_max_id': 0,
              'unread_count'      : 0,
              'notify_settings'   : {
                '_'            : 'peerNotifySettings',
                'flags'        : 1,
                'show_previews': true,
                'mute_until'   : 0,
                'sound'        : 'Default'
              }
            }
          ],
          'messages': [
            {
              '_'      : 'message',
              'flags'  : 256,
              'id'     : 6037,
              'from_id': 777000,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 297169
              },
              'date'   : 1506260101,
              'message': "Your login code: 22222\n\nThis code can be used to log in to your Telegram account. We never ask it for anything else. Do not give it to anyone, even if they say they're from Telegram!!\n\nIf you didn't request this code by trying to log in on another device, simply ignore this message."
            },
            {
              '_'      : 'message',
              'flags'  : 256,
              'id'     : 5504,
              'from_id': 152058,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 297169
              },
              'date'   : 1505762351,
              'message': 'Пидор'
            },
            {
              '_'      : 'message',
              'flags'  : 256,
              'id'     : 5492,
              'from_id': 372278,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 297169
              },
              'date'   : 1505736000,
              'message': 'hallo memers'
            },
            {
              '_'      : 'message',
              'flags'  : 258,
              'out'    : true,
              'id'     : 5491,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 303253
              },
              'date'   : 1505734426,
              'message': 'hi'
            },
            {
              '_'      : 'message',
              'flags'  : 256,
              'id'     : 4225,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 297169
              },
              'date'   : 1502366284,
              'message': 'sd'
            },
            {
              '_'      : 'message',
              'flags'  : 770,
              'out'    : true,
              'id'     : 2487,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 903185
              },
              'date'   : 1492946736,
              'message': '',
              'media'  : {
                '_'           : 'messageMediaContact',
                'phone_number': '9996620000',
                'first_name'  : 'Test Account',
                'last_name'   : 'https://blog.sean.taipei/',
                'user_id'     : 297169
              }
            },
            {
              '_'      : 'message',
              'flags'  : 386,
              'out'    : true,
              'id'     : 2291,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 266297
              },
              'date'    : 1491183631,
              'message' : 'phone call',
              'entities': []
            },
            {
              '_'      : 'messageService',
              'flags'  : 258,
              'out'    : true,
              'id'     : 2029,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerChat',
                'chat_id': 96733
              },
              'date'  : 1490506384,
              'action': {
                '_'         : 'messageActionChatMigrateTo',
                'channel_id': 10268765
              }
            },
            {
              '_'      : 'messageService',
              'flags'  : 258,
              'out'    : true,
              'id'     : 1262,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerChat',
                'chat_id': 245975
              },
              'date'  : 1489328965,
              'action': {
                '_'         : 'messageActionChatMigrateTo',
                'channel_id': 10414459
              }
            },
            {
              '_'      : 'messageService',
              'flags'  : 258,
              'out'    : true,
              'id'     : 1231,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerChat',
                'chat_id': 902655
              },
              'date'  : 1489328699,
              'action': {
                '_'         : 'messageActionChatMigrateTo',
                'channel_id': 10273020
              }
            },
            {
              '_'      : 'messageService',
              'flags'  : 258,
              'out'    : true,
              'id'     : 1097,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerChat',
                'chat_id': 235870
              },
              'date'  : 1489326120,
              'action': {
                '_'         : 'messageActionChatMigrateTo',
                'channel_id': 10741368
              }
            },
            {
              '_'      : 'messageService',
              'flags'  : 258,
              'out'    : true,
              'id'     : 1095,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerChat',
                'chat_id': 680564
              },
              'date'  : 1489326025,
              'action': {
                '_'         : 'messageActionChatMigrateTo',
                'channel_id': 10279405
              }
            },
            {
              '_'      : 'message',
              'flags'  : 2498,
              'out'    : true,
              'id'     : 250,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerChat',
                'chat_id': 681708
              },
              'via_bot_id'  : 771698,
              'date'        : 1474298271,
              'message'     : 'Try to beat me at Game title. I scored 1473864445.',
              'reply_markup': {
                '_'   : 'replyInlineMarkup',
                'rows': [
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'   : 'keyboardButtonGame',
                        'text': 'Play Game title!'
                      }
                    ]
                  }
                ]
              },
              'entities': [
                {
                  '_'     : 'messageEntityBold',
                  'offset': 18,
                  'length': 10
                },
                {
                  '_'     : 'messageEntityBold',
                  'offset': 39,
                  'length': 10
                }
              ]
            },
            {
              '_'      : 'message',
              'flags'  : 35266,
              'out'    : true,
              'id'     : 172,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 627821
              },
              'via_bot_id'  : 771698,
              'date'        : 1474042430,
              'message'     : 'Try to beat me at Game title. I scored 1474038177.',
              'reply_markup': {
                '_'   : 'replyInlineMarkup',
                'rows': [
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'   : 'keyboardButtonGame',
                        'text': 'Play Game title!'
                      }
                    ]
                  }
                ]
              },
              'entities': [
                {
                  '_'     : 'messageEntityBold',
                  'offset': 18,
                  'length': 10
                },
                {
                  '_'     : 'messageEntityBold',
                  'offset': 39,
                  'length': 10
                }
              ],
              'edit_date': 1474038177
            },
            {
              '_'      : 'messageService',
              'flags'  : 266,
              'out'    : true,
              'id'     : 164,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 207386
              },
              'reply_to_msg_id': 163,
              'date'           : 1474038177,
              'action'         : {
                '_'      : 'messageActionGameScore',
                'game_id': '0',
                'score'  : 1474038177
              }
            },
            {
              '_'      : 'message',
              'flags'  : 328,
              'id'     : 156,
              'from_id': 771698,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 297169
              },
              'reply_to_msg_id': 155,
              'date'           : 1473948772,
              'message'        : 'Tell me more about yourself',
              'reply_markup'   : {
                '_'   : 'replyInlineMarkup',
                'rows': [
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'   : 'keyboardButtonGame',
                        'text': 'game'
                      }
                    ]
                  },
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'   : 'keyboardButtonCallback',
                        'text': 'Update score',
                        'data': {
                          '0': 115,
                          '1': 101,
                          '2': 116,
                          '3': 95,
                          '4': 115,
                          '5': 99,
                          '6': 111,
                          '7': 114,
                          '8': 101
                        }
                      }
                    ]
                  },
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'   : 'keyboardButtonUrl',
                        'text': 'url',
                        'url' : 'https://google.com/'
                      }
                    ]
                  },
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'   : 'keyboardButtonCallback',
                        'text': 'callback',
                        'data': {
                          '0': 99,
                          '1': 97,
                          '2': 108,
                          '3': 108,
                          '4': 98,
                          '5': 97,
                          '6': 99,
                          '7': 107
                        }
                      }
                    ]
                  },
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'    : 'keyboardButtonSwitchInline',
                        'flags': 0,
                        'text' : 'switch inline',
                        'query': 'query'
                      }
                    ]
                  },
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'        : 'keyboardButtonSwitchInline',
                        'flags'    : 1,
                        'same_peer': true,
                        'text'     : 'switch inline current',
                        'query'    : 'query in current chat'
                      }
                    ]
                  },
                  {
                    '_'      : 'keyboardButtonRow',
                    'buttons': [
                      {
                        '_'   : 'keyboardButtonCallback',
                        'text': 'edit',
                        'data': {
                          '0': 101,
                          '1': 100,
                          '2': 105,
                          '3': 116
                        }
                      }
                    ]
                  }
                ]
              }
            },
            {
              '_'      : 'messageService',
              'flags'  : 266,
              'out'    : true,
              'id'     : 149,
              'from_id': 297169,
              'to_id'  : {
                '_'      : 'peerUser',
                'user_id': 659076
              },
              'reply_to_msg_id': 148,
              'date'           : 1473873250,
              'action'         : {
                '_'      : 'messageActionGameScore',
                'game_id': '0',
                'score'  : 1473873250
              }
            },
            {
              '_'      : 'messageService',
              'flags'  : 258,
              'out'    : true,
              'id'     : 7,
              'from_id': 297169,
              'to_id'  : {
                '_'         : 'peerChannel',
                'channel_id': 10268765
              },
              'date'  : 1490506528,
              'action': {
                '_'      : 'messageActionChatDeleteUser',
                'user_id': 207386
              }
            },
            {
              '_'      : 'messageService',
              'flags'  : 258,
              'out'    : true,
              'id'     : 3,
              'from_id': 297169,
              'to_id'  : {
                '_'         : 'peerChannel',
                'channel_id': 10279405
              },
              'date'  : 1489326136,
              'action': {
                '_'      : 'messageActionChatDeleteUser',
                'user_id': 207386
              }
            }
          ],
          'chats': [
            {
              '_'          : 'channel',
              'flags'      : 9537,
              'creator'    : true,
              'megagroup'  : true,
              'democracy'  : true,
              'id'         : 10268765,
              'access_hash': '5245050742222239464',
              'title'      : '[Kotobank.ch]uu*~',
              'username'   : 'kotobank',
              'photo'      : {
                '_'          : 'chatPhoto',
                'photo_small': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116720',
                  'local_id' : 295,
                  'secret'   : '633745032212408880'
                },
                'photo_big': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116720',
                  'local_id' : 297,
                  'secret'   : '13267189720182814748'
                }
              },
              'date'   : 1490506384,
              'version': 0
            },
            {
              '_'          : 'chat',
              'flags'      : 97,
              'creator'    : true,
              'deactivated': true,
              'id'         : 96733,
              'title'      : 'Kotobank',
              'photo'      : {
                '_': 'chatPhotoEmpty'
              },
              'participants_count': 3,
              'date'              : 1490506378,
              'version'           : 1,
              'migrated_to'       : {
                '_'          : 'inputChannel',
                'channel_id' : 10268765,
                'access_hash': '5245050742222239464'
              }
            },
            {
              '_'          : 'chat',
              'flags'      : 97,
              'creator'    : true,
              'deactivated': true,
              'id'         : 245975,
              'title'      : 'Lineage OS',
              'photo'      : {
                '_': 'chatPhotoEmpty'
              },
              'participants_count': 4,
              'date'              : 1489328959,
              'version'           : 1,
              'migrated_to'       : {
                '_'          : 'inputChannel',
                'channel_id' : 10414459,
                'access_hash': '12155428250007441817'
              }
            },
            {
              '_'          : 'chat',
              'flags'      : 97,
              'creator'    : true,
              'deactivated': true,
              'id'         : 902655,
              'title'      : 'tunnel',
              'photo'      : {
                '_': 'chatPhotoEmpty'
              },
              'participants_count': 4,
              'date'              : 1489328693,
              'version'           : 1,
              'migrated_to'       : {
                '_'          : 'inputChannel',
                'channel_id' : 10273020,
                'access_hash': '489938970448962410'
              }
            },
            {
              '_'          : 'channel',
              'flags'      : 9537,
              'creator'    : true,
              'megagroup'  : true,
              'democracy'  : true,
              'id'         : 10279405,
              'access_hash': '5318219935666667186',
              'title'      : 'React.js — на тестовом сервере',
              'username'   : 'react_js',
              'photo'      : {
                '_'          : 'chatPhoto',
                'photo_small': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116084',
                  'local_id' : 189,
                  'secret'   : '10077796920746514350'
                },
                'photo_big': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116084',
                  'local_id' : 191,
                  'secret'   : '5588625439638961968'
                }
              },
              'date'   : 1489326025,
              'version': 0
            },
            {
              '_'          : 'chat',
              'flags'      : 97,
              'creator'    : true,
              'deactivated': true,
              'id'         : 680564,
              'title'      : 'React.js — на тестовом сервере',
              'photo'      : {
                '_': 'chatPhotoEmpty'
              },
              'participants_count': 2,
              'date'              : 1489326018,
              'version'           : 1,
              'migrated_to'       : {
                '_'          : 'inputChannel',
                'channel_id' : 10279405,
                'access_hash': '5318219935666667186'
              }
            },
            {
              '_'          : 'chat',
              'flags'      : 97,
              'creator'    : true,
              'deactivated': true,
              'id'         : 235870,
              'title'      : 'Переехали @react_js',
              'photo'      : {
                '_': 'chatPhotoEmpty'
              },
              'participants_count': 2,
              'date'              : 1489326113,
              'version'           : 1,
              'migrated_to'       : {
                '_'          : 'inputChannel',
                'channel_id' : 10741368,
                'access_hash': '3552563832049415765'
              }
            },
            {
              '_'      : 'chat',
              'flags'  : 1,
              'creator': true,
              'id'     : 681708,
              'title'  : 'Chat',
              'photo'  : {
                '_': 'chatPhotoEmpty'
              },
              'participants_count': 5,
              'date'              : 1472226002,
              'version'           : 2
            },
            {
              '_'          : 'channelForbidden',
              'flags'      : 256,
              'megagroup'  : true,
              'id'         : 10414459,
              'access_hash': '12155428250007441817',
              'title'      : 'Lineage OS'
            },
            {
              '_'          : 'channelForbidden',
              'flags'      : 256,
              'megagroup'  : true,
              'id'         : 10273020,
              'access_hash': '489938970448962410',
              'title'      : 'tunnel'
            },
            {
              '_'          : 'channelForbidden',
              'flags'      : 256,
              'megagroup'  : true,
              'id'         : 10741368,
              'access_hash': '3552563832049415765',
              'title'      : 'Переехали @react_js'
            }
          ],
          'users': [
            {
              '_'          : 'user',
              'flags'      : 133139,
              'contact'    : true,
              'verified'   : true,
              'id'         : 777000,
              'access_hash': '7144639649641349022',
              'first_name' : 'Telegram',
              'phone'      : '42777'
            },
            {
              '_'          : 'user',
              'flags'      : 2171,
              'contact'    : true,
              'id'         : 152058,
              'access_hash': '10193022074052882036',
              'first_name' : 'Амир',
              'username'   : 'loskiq',
              'phone'      : '79094822074',
              'photo'      : {
                '_'          : 'userProfilePhoto',
                'photo_id'   : '653084593334187',
                'photo_small': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116539',
                  'local_id' : 16943,
                  'secret'   : '3011755622844907656'
                },
                'photo_big': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116539',
                  'local_id' : 16945,
                  'secret'   : '15487266476231144716'
                }
              },
              'status': {
                '_'         : 'userStatusOffline',
                'was_online': 1506195292
              }
            },
            {
              '_'          : 'user',
              'flags'      : 103,
              'id'         : 372278,
              'access_hash': '9410081209965202501',
              'first_name' : 'boom',
              'last_name'  : 'poow',
              'photo'      : {
                '_'          : 'userProfilePhoto',
                'photo_id'   : '1598922291259305',
                'photo_small': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 1,
                  'volume_id': '702109604',
                  'local_id' : 1321,
                  'secret'   : '7272927231373671580'
                },
                'photo_big': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 1,
                  'volume_id': '702109604',
                  'local_id' : 1323,
                  'secret'   : '8737357417587093780'
                }
              },
              'status': {
                '_'      : 'userStatusOnline',
                'expires': 1506260275
              }
            },
            {
              '_'             : 'user',
              'flags'         : 6239,
              'contact'       : true,
              'mutual_contact': true,
              'id'            : 303253,
              'access_hash'   : '16892969001010794951',
              'first_name'    : 'see this',
              'last_name'     : 'https://blog.sean.taipei/',
              'username'      : 'HelloWorld',
              'phone'         : '9996620001',
              'status'        : {
                '_'         : 'userStatusOffline',
                'was_online': 1506221077
              }
            },
            {
              '_'          : 'user',
              'flags'      : 3195,
              'self'       : true,
              'contact'    : true,
              'id'         : 297169,
              'access_hash': '6362957075171533052',
              'first_name' : 'lambda257',
              'username'   : 'lambda',
              'phone'      : '9996620000',
              'photo'      : {
                '_'          : 'userProfilePhoto',
                'photo_id'   : '1276331592624111',
                'photo_small': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116248',
                  'local_id' : 204,
                  'secret'   : '15001237309940136639'
                },
                'photo_big': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116248',
                  'local_id' : 206,
                  'secret'   : '5708407752355442935'
                }
              },
              'status': {
                '_'      : 'userStatusOnline',
                'expires': 1506260250
              }
            },
            {
              '_'          : 'user',
              'flags'      : 107,
              'id'         : 903185,
              'access_hash': '5014380836310350709',
              'first_name' : 'Sean',
              'username'   : 'S_ean',
              'photo'      : {
                '_'          : 'userProfilePhoto',
                'photo_id'   : '3879150493476777',
                'photo_small': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116759',
                  'local_id' : 46,
                  'secret'   : '16250793314822469553'
                },
                'photo_big': {
                  '_'        : 'fileLocation',
                  'dc_id'    : 2,
                  'volume_id': '604116759',
                  'local_id' : 48,
                  'secret'   : '5091504426992334747'
                }
              },
              'status': {
                '_'         : 'userStatusOffline',
                'was_online': 1505655860
              }
            },
            {
              '_'          : 'user',
              'flags'      : 79,
              'id'         : 266297,
              'access_hash': '12724163088027607302',
              'first_name' : 'Pavel',
              'last_name'  : 'Durov',
              'username'   : 'wekiro',
              'status'     : {
                '_'         : 'userStatusOffline',
                'was_online': 1494963942
              }
            },
            {
              '_'          : 'user',
              'flags'      : 8193,
              'deleted'    : true,
              'id'         : 627821,
              'access_hash': '8733752096899168768'
            },
            {
              '_'          : 'user',
              'flags'      : 2139,
              'contact'    : true,
              'id'         : 207386,
              'access_hash': '11096851018323080944',
              'first_name' : '100',
              'username'   : 'Qwerty',
              'phone'      : '9997777100',
              'status'     : {
                '_'         : 'userStatusOffline',
                'was_online': 1489367332
              }
            },
            {
              '_'                     : 'user',
              'flags'                 : 540683,
              'bot'                   : true,
              'id'                    : 771698,
              'access_hash'           : '2290364735052642689',
              'first_name'            : 'levlam_bot',
              'username'              : 'levlam_bot',
              'bot_info_version'      : 1,
              'bot_inline_placeholder': 'Search...'
            },
            {
              '_'          : 'user',
              'flags'      : 8193,
              'deleted'    : true,
              'id'         : 659076,
              'access_hash': '11301501176615365980'
            }
          ]
        }
      },
      'seqno' : 9,
      'bytes' : 2128,
      'msg_id': '6469337878303598593'
    },
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6469337968829274940',
        'result'    : {
          '_'            : 'rpc_error',
          'error_code'   : 400,
          'error_message': 'PHONE_CODE_INVALID'
        }
      },
      'seqno' : 11,
      'bytes' : 40,
      'msg_id': '6469337971327860737'
    },
    {
      '_'   : 'message',
      'body': {
        '_'         : 'rpc_result',
        'req_msg_id': '6469337968829274940',
        'result'    : {
          '_'            : 'rpc_error',
          'error_code'   : 420,
          'error_message': 'FLOOD_WAIT_3478'
        }
      },
      'seqno' : 13,
      'bytes' : 40,
      'msg_id': '6469337971327860738'
    }
  ]
}
