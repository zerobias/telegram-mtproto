'use strict'

/* eslint-disable no-var */

exports['detectIdent'] = function detectIdent(str) {
  var ln = str.length
  if (ln === 0) return 0
  var ident = 0
  do {
    if (!str.startsWith(' ', ident)) return ident
    ident += 1
  } while (ident < ln)
  return ident
}

exports['ensureNewLine'] = function ensureNewLine(str) {
  if (str.length === 0) return '\n'
  if (str.endsWith('\n')) return str
  return str + '\n'
}
