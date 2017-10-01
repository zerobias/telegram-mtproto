'use strict'

exports.migrate = /^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/
exports.fileMigrate = /^(FILE_MIGRATE_)(\d+)/
exports.floodWait = /^(FLOOD_WAIT_)(\d+)/