const fs = require('fs')
const { describe, test } = require('../lib/mixtape')
const ex00 = require('../exercise/ex00')
const ex00Text = fs.readFileSync('./exercise/ex00.js')

describe('ex00', [
  describe('add', [
    test('function add is exported')
      .value(ex00.add)
      .isA(Function)
    ,
    test('adding 2 numbers (5 + 5)')
      .call(() => ex00.add(5, 5))
      .equal(5 + 5)
    ,
    test('adding negative numbers (5 + -5)')
      .call(() => ex00.add(5, -5))
      .equal(5 + -5)
    ,
  ]),

  describe('sub', [
    test('function sub is exported')
      .value(ex00.sub)
      .isA(Function)
    ,
    test('substracting 2 numbers (5 + 5)')
      .call(() => ex00.sub(5, 5))
      .equal(5 - 5)
    ,
    test('substracting negative numbers (5 + -5)')
      .call(() => ex00.sub(5, -5))
      .equal(5 - -5)
    ,
  ]),

  describe('multiply', [
    test('function multiply is exported')
      .value(ex00Text)
      .exclude('*', 'he opperator `*` should not be used')
    ,
    test('multiply 2 numbers (5 * 5)')
      .call(() => ex00.multiply(5, 5))
      .equal(5 * 5)
    ,
    test('multiply negative numbers (5 * -5)')
      .call(() => ex00.multiply(5, -5))
      .equal(5 * -5)
    ,
    test('multiply negative numbers (-5 * -5)')
      .call(() => ex00.multiply(-5, -5))
      .equal(-5 * -5)
    ,
    test('multiply negative numbers (-5 * 5)')
      .call(() => ex00.multiply(-5, 5))
      .equal(-5 * 5)
    ,
  ]),

  describe('divide', [
    test('function divide is exported')
      .value(ex00.divide)
      .isA(Function)
      .exclude('/', 'the opperator `/` should not be used')
    ,
    test('divide 2 numbers (5 / 2)')
      .call(() => ex00.divide(5, 2))
      .equal(Math.floor(5 / 2))
    ,
    test('divide 2 numbers (100 / 22)')
      .call(() => ex00.divide(100, 22))
      .equal(Math.floor(100 / 22))
    ,
  ]),

  describe('modulo', [
    test('function modulo is exported')
      .value(ex00.modulo)
      .isA(Function)
      .exclude('%', 'the opperator `%` should not be used')
    ,
    test('modulo 2 numbers (5 % 2)')
      .call(() => ex00.modulo(5, 2))
      .equal(Math.floor(5 % 2))
    ,
    test('modulo 2 numbers (100 % 22)')
      .call(() => ex00.modulo(100, 22))
      .equal(Math.floor(100 % 22))
    ,
  ]),

  describe('call', [
      test('function call is exported')
        .value(ex00.call)
        .isA(Function)
      ,
      test('function call should return a function')
        .value(ex00.call())
        .isA(Function)
      ,
      test('call(add, 5) -> then with 2')
        .call(() => ex00.call(ex00.add, 5)(2))
        .equal(ex00.add(5, 2))
      ,
      test('call(sub, 5) -> then with 2')
        .call(() => ex00.call(ex00.sub, 5)(2))
        .equal(ex00.sub(5, 2))
      ,
      test('call((a, b) => (a++) * 2 + b, 5) -> then with 2')
        .call(() => ex00.call((a, b) => (a++) * 2 + b, 5)(2))
        .equal((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),
])()
