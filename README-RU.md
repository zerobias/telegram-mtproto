# telegram-mtproto

[![npm version][npm-image]][npm-url]

**Mobile Telegram Protocol** [(MTProto)](https://core.telegram.org/mtproto) пакет написан на **ES6**

## Про MTProto...

**MTProto** - это протокол сервиса [Telegram](http://www.telegram.org) _"придуман для работы с серверами API из мобильных приложений"_.

Mobile Protocol подразделятся на 3 части ([с официального сайта](https://core.telegram.org/mtproto#general-description)):

 - **Компонент высшего уровня (API query language):** определяет методы через которые запросы и ответы преобразуются в двоичные сообщения.
 - **Криптографический слой (для авторизаций):** определяет методы через которые сообщения шифруются перед передачей.
 - **Транспортный компонент:** определяет протоколы по которым будут общаться клиент и сервер (такие как, `http`, `https`, `tcp`, `udp`).


## Про telegram-mtproto в двух словах...

Никакие другие пакеты не нужны.
Пакет **telegram-mtproto** позволяет реализовать все возможности работы с **Mobile Protocol**:

 - Выший уровень API для подключения к серверу

 - API которая работает через промисы

 - **HTTP подключения** которые выполняют перенос данных

 - **Web worker** - сверх быстрые криптографическеские работы в фоновом режиме

 - Реализация **AES и RSA-шифрования** шифрования, для безопасности

 - Оба метода **plain-text** и **encrypted message** для передачи данных на сервер

 - Обмен **ключами Диффи-Хеллмана**, поддерживающими функцию **prime factorization**, для безопасности

 - **MTProto TL-Schema** сборник **JavaScript классов и функций**

 - **async storage** для сохранения данных между сессиями


## Установка

```bash
$ npm install --save telegram-mtproto@beta
```

## Использование

```javascript
import MTProto from 'telegram-mtproto'

const phone = {
  num : '+79123456789',
  code: '22222'
}

const api = {
  layer          : 57,
  initConnection : 0x69796de9,
  api_id         : 49631
}

const server = {
  dev: true // Подключаемся к тестовому серверу.
}           // Пустые поля конфигураций можно не указывать

const client = MTProto({ server, api })

async function connect(){
  const { phone_code_hash } = await client('auth.sendCode', {
    phone_number  : phone.num,
    current_number: false,
    api_id        : 49631,
    api_hash      : 'fb050b8f6771e15bfda5df2409931569'
  })
  const { user } = await client('auth.signIn', {
    phone_number   : phone.num,
    phone_code_hash: phone_code_hash,
    phone_code     : phone.code
  })

  console.log('Вы вошли как ', user)
}

connect()
```

Выше мы использовали две функции из API.

```typescript
type auth.sendCode = (
  phone_number: string,
  sms_type: int,
  api_id: int,
  api_hash: string,
  lang_code: string
) => {
  phone_registered: boolean,
  phone_code_hash: string,
  send_call_timeout: int,
  is_password: boolean
}

type auth.signIn = (
  phone_number: string,
  phone_code_hash: string,
  phone_code: string
) => {
  expires: int,
  user: User
}
```
[Больше][send-code] про [авторизацию][sign-in], а также о многих других методах, вы можете прочитать в [документации][docs].

Дополнительные примеры можно посмотреть в [папке с примерами][examples].

## Хранение

Вы можете использовать наши основные хранилища [localForage][localForage] для хранения данных.
Модуль имеет следующие интерфейсы:

```typescript
interface AsyncStorage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(...keys: string[]): Promise<void>;
  clear(): Promise<void>;
}
```

```javascript
import { MTProto } from 'telegram-mtproto'
import { api } from './config'
import CustomStorage from './storage'

const client = MTProto({
  api,
  app: {
    storage: CustomStorage
  }
})

```

## Лицензия

Проект запущен под лицензией [MIT](./LICENSE)

[examples]: https://github.com/zerobias/telegram-mtproto/tree/develop/examples
[localForage]: https://github.com/localForage/localForage
[docs]: https://core.telegram.org/
[send-code]: https://core.telegram.org/method/auth.sendCode
[sign-in]: https://core.telegram.org/method/auth.signIn
[npm-url]: https://www.npmjs.org/package/telegram-mtproto
[npm-image]: https://badge.fury.io/js/telegram-mtproto.svg
