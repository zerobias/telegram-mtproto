# telegram-mtproto

[![npm version][npm-image]][npm-url]

**Telegram Mobile Protocol** [(MTProto)](https://core.telegram.org/mtproto) library in **es6**

## About MTProto..

**MTProto** is the [Telegram Messenger](http://www.telegram.org ) protocol
_"designed for access to a server API from applications running on mobile devices"_.

The Mobile Protocol is subdivided into three components ([from the official site](https://core.telegram.org/mtproto#general-description)):

 - High-level component (API query language): defines the method whereby API
 queries and responses are converted to binary messages.

 - Cryptographic (authorization) layer: defines the method by which messages
 are encrypted prior to being transmitted through the transport protocol.

 - Transport component: defines the method for the client and the server to transmit
 messages over some other existing network protocol (such as, http, https, tcp, udp).



## telegram-mtproto in short..

No more additional libs.
The **telegram-mtproto** library implements the **Mobile Protocol** and provides all features for work with telegram protocol:

 - A high level api for server connection

 - Promise-based API

 - Both **TCP** and **HTTP connections** implemented in the transport layer

 - A cipher implementation for **AES and RSA encryption** in the security layer

 - Both **plain-text and encrypted message** to communicate data with the server

 - **Diffie-Hellman key exchange** supported by the **prime factorization** function implemented in the security layer

 - **MTProto TL-Schema** compilation as **javascript classes and functions**

## Usage

```javascript
const { Telegram, network } = require('telegram-mtproto')

const fileSchema = require('./api-schema-57.json')

const telegram = new Telegram(fileSchema)
const addKey = key => telegram.addPublicKey(key)
publicKeys.forEach(addKey)

const connection = new network.http(server)
const client = telegram.createClient()

client.setConnection(connection)
connection.connect()
  .then(() => console.log(`api ready for requests`))
  .then(() => client.callApi('auth.sendCode', {
    phone_number  : phone.num,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  }).then(
  ({ phone_code_hash }) =>
    client.callApi('auth.signIn', {
      phone_number   : phone.num,
      phone_code_hash: phone_code_hash,
      phone_code     : phone.code
    }))
```

## Installation

```bash
$ npm install --save telegram-mtproto
```

## API

- **network**. Classes for network connection

  - **http**

  - **tcp**

- **tl**. Telegram schema api

- **Telegram**. High level api.

  - **createClient** *() => TelegramClient*

## License

The project is released under the [Mit License](./LICENSE)

[npm-url]: https://www.npmjs.org/package/telegram-mtproto
[npm-image]: https://badge.fury.io/js/telegram-mtproto.svg