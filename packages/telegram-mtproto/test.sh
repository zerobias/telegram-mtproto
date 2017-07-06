export DEBUG=telegram-mtproto:*,-telegram-mtproto:tl:*
export NODE_ENV=development

jest test/node.test.js --runInBand
