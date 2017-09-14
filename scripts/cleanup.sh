rimraf ./package-lock.json
rimraf ./packages/mtproto-beam/package-lock.json
rimraf ./packages/mtproto-logger/package-lock.json
rimraf ./packages/mtproto-shared/package-lock.json
rimraf ./packages/mtproto-storage-fs/package-lock.json
rimraf ./packages/mtproto-storage-browser/package-lock.json
rimraf ./packages/telegram-mtproto/package-lock.json

rimraf ./packages/mtproto-beam/node_modules
rimraf ./packages/mtproto-logger/node_modules
rimraf ./packages/mtproto-shared/node_modules
rimraf ./packages/mtproto-storage-fs/node_modules
rimraf ./packages/mtproto-storage-browser/node_modules
rimraf ./packages/telegram-mtproto/node_modules
rimraf ./node_modules

rimraf ./packages/mtproto-beam/lib
rimraf ./packages/mtproto-logger/lib
rimraf ./packages/mtproto-shared/lib
rimraf ./packages/mtproto-storage-fs/lib
rimraf ./packages/mtproto-storage-browser/lib
rimraf ./packages/telegram-mtproto/lib

rimraf ./packages/mtproto-beam/es
rimraf ./packages/mtproto-logger/es
rimraf ./packages/mtproto-shared/es
rimraf ./packages/mtproto-storage-fs/es
rimraf ./packages/mtproto-storage-browser/es
rimraf ./packages/telegram-mtproto/es

npm i
