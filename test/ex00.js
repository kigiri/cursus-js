const tester = require('../lib/tester')
const stringify = require('../lib/log-value')

tester(__filename, ({ describe, test, code, exports }) => [
  describe('str', test.prop('str', String, '42')),
  describe('num', test.prop('num', Number, 42)),
  describe('bool', test.prop('bool', Boolean, false)),
  describe('escapeStr', [
    test.defined('escapeStr'),
    test.type('escapeStr', String),
  ].concat('\\\'"`'.split('').map(c => 
    test(`should contain the character ${c}`)
      .value(exports.escapeStr)
      .include(c)))),
  describe('arr', [
    test.defined('arr'),
    test.type('arr', Array),
    test('should have 2 elements')
      .value(exports.arr)
      .map('length')
      .equal(2)
    ,
    test('first element should be 4')
      .value(exports.arr)
      .map('0')
      .equal(4)
    ,
    test('second element should be \'2\'')
      .value(exports.arr)
      .map('1')
      .equal('2')
    ,
  ]),
  describe('fn', [
    test.defined('fn'),
    test.type('fn', Function),
    test('should take 1 argument')
      .value(exports.fn)
      .map('length')
      .equal(1)
    ,
  ].concat([ 'str', 'bool', 'num', 'arr', 'fn', 'undefined' ].map(key =>
    test(`calling function fn with argument '${key
      }' should return ${stringify(exports[key])}`)
      .value(exports.fn)
      .map(fn => fn(key))
      .deepEqual(exports[key])))),
  describe('obj', [
    test.defined('obj'),
    test.type('obj', Object),
    test('should have 6 elements')
      .value(exports.obj)
      .map(Object.keys)
      .map('length')
      .equal(7)
    ,
    test(`obj['spaced key'] should equal true`)
      .value(exports.obj)
      .map('spaced key')
      .equal(true)
    ,
  ].concat([ 'str', 'num', 'arr', 'bool' ].map(key =>
    test(`obj.${key} should equal module.exports.${key}`)
      .value(exports.obj)
      .map(key)
      .deepEqual(exports[key])))
  .concat([
    test('obj.obj should be a circular reference and equal itself')
      .value(exports.obj)
      .map('obj')
      .equal(exports.obj)
    ,
  ])),

  describe('BONUS', [

  ]),
])
