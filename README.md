# telegram-mt-node
[![npm version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]
[![Sauce Test Status][sauce-image]][sauce-url]


**Telegram Mobile Protocol** [(MTProto)](https://core.telegram.org/mtproto) unofficial library in pure **javascript** on the Node.js platform

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



## telegram-mt-node in short..

The **telegram-mt-node** library implements the **Mobile Protocol** and provides the following features:

 - Both **TCP** and **HTTP connections** implemented in the transport layer
 
 - A cipher implementation for **AES and RSA encryption** in the security layer
 
 - Both **plain-text and encrypted message** (this will be available soon) to communicate data with the server 
 
 - **Diffie-Hellman key exchange** supported by the **prime factorization** function implemented in the security layer
 
 - **MTProto TL-Schema** compilation as **javascript classes and functions** via [**telegram-tl-node**](https://github.com/enricostara/telegram-tl-node) dependency

The [**telegram.link**](http://telegram.link) <img src="https://raw.githubusercontent.com/enricostara/telegram.link/master/telegram.link.png" 
width="25" /> main project has a dependency on this library.

## Installation

```bash
$ git clone --branch=master git://github.com/enricostara/telegram-mt-node.git
$ cd telegram-mt-node
$ npm install
```

## Unit Testing 

```bash
$ npm test
```

## License

The project is released under the [Mit License](./LICENSE) 

[npm-url]: https://www.npmjs.org/package/telegram.link
[npm-image]: https://badge.fury.io/js/telegram-mt-node.svg

[travis-url]: https://travis-ci.org/enricostara/telegram-mt-node
[travis-image]: https://travis-ci.org/enricostara/telegram-mt-node.svg?branch=master

[coverage-url]: https://coveralls.io/r/enricostara/telegram-mt-node?branch=master
[coverage-image]: https://img.shields.io/coveralls/enricostara/telegram-mt-node.svg

[sauce-url]: https://saucelabs.com/u/enricostara
[sauce-image]: https://saucelabs.com/browser-matrix/enricostara.svg
