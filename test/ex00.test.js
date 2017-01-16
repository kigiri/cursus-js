const fs = require('fs')
const { describe, test } = require('../lib/mixtape')
const ex00 = require('../exercise/ex00')
const ex00Code = fs.readFileSync('./exercise/ex00.js')
  .toString('utf-8')

describe('ex00', [
  test('is well linted')
    .value(ex00Code)
    .equal('lol')
    .ignore
  ,

  describe('add', [
    test('function is exported')
      .value(ex00.add)
      .isA(Function)
    ,
    test('(5, 5)')
      .call(() => ex00.add(5, 5))
      .equal(5 + 5)
    ,
    test('(5, -5)')
      .call(() => ex00.add(5, -5))
      .equal(5 + -5)
    ,
  ]),

  describe('sub', [
    test('function is exported')
      .value(ex00.sub)
      .isA(Function)
    ,
    test('(5, 5)')
      .call(() => ex00.sub(5, 5))
      .equal(5 - 5)
    ,
    test('(5, -5)')
      .call(() => ex00.sub(5, -5))
      .equal(5 - -5)
    ,
  ]),

  describe('floor', []),

  describe('round', []),

  describe('abs', []),

  describe('positive', [
    test('function is exported')
      .value(ex00.positive)
      .isA(Function)
    ,
    test('(5, -5)')
      .call(() => ex00.positive(5, -5))
      .equal(false)
    ,
    test('(5, 5)')
      .call(() => ex00.positive(5, 5))
      .equal(true)
    ,
    test('(-5, -5)')
      .call(() => ex00.positive(-5, -5))
      .equal(true)
    ,
    test('(-5, 5)')
      .call(() => ex00.positive(-5, 5))
      .equal(false)
    ,
  ]),

  describe('multiply', [
    test('function is exported')
      .value(ex00Code)
      .exclude('*', 'he opperator `*` should not be used')
    ,
    test('2 numbers (5 * 5)')
      .call(() => ex00.multiply(5, 5))
      .equal(5 * 5)
    ,
    test('negative numbers (5 * -5)')
      .call(() => ex00.multiply(5, -5))
      .equal(5 * -5)
    ,
    test('negative numbers (-5 * -5)')
      .call(() => ex00.multiply(-5, -5))
      .equal(-5 * -5)
    ,
    test('negative numbers (-5 * 5)')
      .call(() => ex00.multiply(-5, 5))
      .equal(-5 * 5)
    ,
  ]),

  describe('divide', [
    test('function is exported')
      .value(ex00.divide)
      .isA(Function)
      .exclude('/', 'the opperator `/` should not be used')
    ,
    test('2 numbers (5 / 2)')
      .call(() => ex00.divide(5, 2))
      .equal(Math.floor(5 / 2))
    ,
    test('2 numbers (100 / 22)')
      .call(() => ex00.divide(100, 22))
      .equal(Math.floor(100 / 22))
    ,
  ]),

  describe('modulo', [
    test('function is exported')
      .value(ex00.modulo)
      .isA(Function)
      .exclude('%', 'the opperator `%` should not be used')
    ,
    test('2 numbers (5 % 2)')
      .call(() => ex00.modulo(5, 2))
      .equal(Math.floor(5 % 2))
    ,
    test('2 numbers (100 % 22)')
      .call(() => ex00.modulo(100, 22))
      .equal(Math.floor(100 % 22))
    ,
  ]),

  describe('call', [
    test('function is exported')
      .value(ex00.call)
      .isA(Function)
    ,
    test('call(add, 5, 2)')
      .call(() => ex00.call(ex00.add, 5, 2))
      .equal(5 + 2)
    ,
    test('call(sub, 5) -> then with 2')
      .call(() => ex00.call(ex00.sub, 5, 2))
      .equal(5 - 2)
    ,
    test('call((a, b) => (a++) * 2 + b, 5, 2)')
      .call(() => ex00.call((a, b) => (a++) * 2 + b, 5, 2))
      .equal(((a, b) => (a++) * 2 + b)(5, 2))
    ,
  ]),

  describe('curry', [
    test('function is exported')
      .value(ex00.curry)
      .isA(Function)
    ,
    test('function should return a function')
      .value(ex00.curry && ex00.curry())
      .isA(Function)
    ,
    test('curry(add, 5) -> then with 2')
      .call(() => ex00.curry(ex00.add, 5)(2))
      .equal(5 + 2)
    ,
    test('curry(sub, 5) -> then with 2')
      .call(() => ex00.curry(ex00.sub, 5)(2))
      .equal(5 - 2)
    ,
    test('curry((a, b) => (a++) * 2 + b, 5) -> then with 2')
      .call(() => ex00.curry((a, b) => (a++) * 2 + b, 5)(2))
      .equal(((a, b) => (a++) * 2 + b)(5, 2))
    ,
  ]),

  describe('BONUS', [
    test('add is a single expression')
      .value(ex00.add)
      .exclude('{')
    ,
    test('sub is a single expression')
      .value(ex00.sub)
      .exclude('{')
    ,
    test('call is a single expression')
      .value(ex00.call)
      .exclude('{')
    ,
    test('apply is a single expression')
      .value(ex00.apply)
      .exclude('{')
    ,
  ]),

  describe('PENALTY', [
    test('console left')
  ]),
])()
