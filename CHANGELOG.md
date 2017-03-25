# 2.2.1
* Flag (optional type) fields now acts like common fields.
* Zeroes, empty strings and empty types now can be omited. write only useful fields.
* *invokeWithLayer* api field now may detects internally and don't required (but still valid).
* Type check argument fields
* Fix auth race condition
* Add batch async logger

# 2.2.0

* **breaking** Instance now creates without `new`
* **breaking** Rename module exports from `ApiManager` to `MTProto`

# =<2.1.0

Several early alpha versions based on new architechture

---

# 1.1.0 *(beta)*

* **breaking** Remove all functions from response. Just use the field values.
* Remove logger from response
* Add changelog.md

# 1.0.6 *(beta)*

* Https connection. Usage:
```javascript
const { network } = require('telegram-mtproto')
const connection = network.http({ host: 'ip', port: '80', protocol: 'https' })
```
* Websockets connection. Usage:
```javascript
const connection = network.wc({ host: 'ip', port: '80' })
```
* Precision timing
* Major performance boost