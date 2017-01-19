const tester = require('../lib/tester')
const stringify = require('../lib/log-value')
const wesh = _ => (console.error(_), _)

tester(__filename, ex => {
  const { describe, test, code, exports } = ex

  const testDefined = key => test('is defined')
    .value(exports[key])
    .notEqual(undefined, `module.exports.${key} should not be undefined`)

  const testType = (key, type) => test(`is a ${type.name}`)
    .value(exports[key])
    .isA(type, `module.exports.${key} should be a ${type.name}`)

  const testValue = (key, value) => test(`of value ${stringify(value)}`)
    .value(exports[key])
    .deepEqual(value, `module.exports.${key} should be ${stringify(value)}`)

  const testProp = (key, type, value) => [
    testDefined(key),
    testType(key, type),
    testValue(key, value),
  ]

  return [
    describe('str', testProp('str', String, '42')),
    describe('num', testProp('num', Number, 42)),
    describe('bool', testProp('bool', Boolean, false)),
    describe('escapeStr', [
      testDefined('escapeStr'),
      testType('escapeStr', String),
    ].concat('\\\'"`'.split('').map(c => 
      test(`should contain the character ${c}`)
        .value(exports.escapeStr)
        .include(c)))),
    describe('arr', [
      testDefined('arr'),
      testType('arr', Array),
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
      testDefined('fn'),
      testType('fn', Function),
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
      testDefined('obj'),
      testType('obj', Object),
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
    ].concat([ 'str', 'num', 'arr' ].map(key =>
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
    ])
  ]
})