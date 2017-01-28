'use strict'

/* eslint no-use-before-define: 0 */
const map = require('lodash/map')
let refs = new WeakSet()

const needEscape = /[a-zA-Z0-9$_]/
const keyValue = (value, key) => `${needEscape.test(key)
  ? stringify(key)
  : key}: ${stringify(value)}`

const stringifyObject = obj => {
  if (refs.has(obj)) {
    return '{ Circular }'
  }

  refs.add(obj)

  return `{ ${map(obj, keyValue).join(', ')} }`
}

const stringifyArray = arr => {
  if (refs.has(arr)) {
    return '[ Circular ]'
  }

  refs.add(arr)

  return `[ ${arr.map(stringify).join(', ')} ]`
}

const stringify = value => {
  if (value === undefined || value === null) {
    return String(value)
  }

  switch (value.constructor) {
  case String: return "'" + value.replace(/[\\']/, '\\$0') + "'"
  case Number: return String(value)
  case Array: return stringifyArray(value)
  case null:
  case undefined:
  case Object: return stringifyObject(value)
  default: return String(value)
  }
}

module.exports = value => {
  refs = new WeakSet()

  return stringify(value)
}
