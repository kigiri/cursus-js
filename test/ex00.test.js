const fs = require('fs')
const { find } = require('lodash')
const linter = require('../lib/lint')
const { describe, test } = require('../lib/mixtape')

linter('ex00.js').then(ex00 => {

  ex00.var = name => find(ex00.code.ast.body, n => n.type === 'VariableDeclaration'
    && n.declarations[0].id.name === name).declarations[0]

  if (ex00.errors) {
    //console.log(ex00.errors[0])
    const error = ex00.errors[0]
    console.log(`
TAP version 13
1..1
not ok 1 - Moulinette ex00.js
  ---
  message: ${error.message}
  line: ${error.line}
  column: ${error.column}
  ruleId: ${error.ruleId}
  ...`)
    process.exit(0)
  }

  describe('ex00', [
    describe('add', [
      test('function is exported')
        .value(ex00.exports.add)
        .isA(Function)
      ,
      test('(5, 5)')
        .call(() => ex00.exports.add(5, 5))
        .equal(5 + 5)
      ,
      test('(5, -5)')
        .call(() => ex00.exports.add(5, -5))
        .equal(5 + -5)
      ,
    ]),

    describe('sub', [
      test('function is exported')
        .value(ex00.exports.sub)
        .isA(Function)
      ,
      test('(5, 5)')
        .call(() => ex00.exports.sub(5, 5))
        .equal(5 - 5)
      ,
      test('(5, -5)')
        .call(() => ex00.exports.sub(5, -5))
        .equal(5 - -5)
      ,
    ]),

    describe('floor', []),

    describe('round', []),

    describe('abs', []),

    describe('positive', [
      test('function is exported')
        .value(ex00.exports.positive)
        .isA(Function)
      ,
      test('(5, -5)')
        .call(() => ex00.exports.positive(5, -5))
        .equal(false)
      ,
      test('(5, 5)')
        .call(() => ex00.exports.positive(5, 5))
        .equal(true)
      ,
      test('(-5, -5)')
        .call(() => ex00.exports.positive(-5, -5))
        .equal(true)
      ,
      test('(-5, 5)')
        .call(() => ex00.exports.positive(-5, 5))
        .equal(false)
      ,
    ]),

    describe('multiply', [
      test('function is exported')
        .value(ex00.exports.multiply)
        .isA(Function)
      ,
      test('* operator')
        .value(ex00.code.ast.tokens.filter(t => t.value === '*')[0])
        .equal(undefined, 'You can\'t use the operator *, try harder')
      ,
      test('2 numbers (5 * 5)')
        .call(() => ex00.exports.multiply(5, 5))
        .equal(5 * 5)
      ,
      test('negative numbers (5 * -5)')
        .call(() => ex00.exports.multiply(5, -5))
        .equal(5 * -5)
      ,
      test('negative numbers (-5 * -5)')
        .call(() => ex00.exports.multiply(-5, -5))
        .equal(-5 * -5)
      ,
      test('negative numbers (-5 * 5)')
        .call(() => ex00.exports.multiply(-5, 5))
        .equal(-5 * 5)
      ,
    ]),

    describe('divide', [
      test('function is exported')
        .value(ex00.exports.divide)
        .isA(Function)
      ,
      test('/ operator')
        .value(ex00.code.ast.tokens.filter(t => t.value === '/')[0])
        .equal(undefined, 'You can\'t use the operator /, try harder')
      ,
      test('2 numbers (5 / 2)')
        .call(() => ex00.exports.divide(5, 2))
        .equal(Math.floor(5 / 2))
      ,
      test('2 numbers (100 / 22)')
        .call(() => ex00.exports.divide(100, 22))
        .equal(Math.floor(100 / 22))
      ,
    ]),

    describe('modulo', [
      test('function is exported')
        .value(ex00.exports.modulo)
        .isA(Function)
      ,
      test('% operator')
        .value(ex00.code.ast.tokens.filter(t => t.value === '%')[0])
        .equal(undefined, 'You can\'t use the operator %, try harder')
      ,
      test('2 numbers (5 % 2)')
        .call(() => ex00.exports.modulo(5, 2))
        .equal(Math.floor(5 % 2))
      ,
      test('2 numbers (100 % 22)')
        .call(() => ex00.exports.modulo(100, 22))
        .equal(Math.floor(100 % 22))
      ,
    ]),

    describe('call', [
      test('function is exported')
        .value(ex00.exports.call)
        .isA(Function)
      ,
      test('call(add, 5, 2)')
        .call(() => ex00.exports.call(ex00.exports.add, 5, 2))
        .equal(5 + 2)
      ,
      test('call(sub, 5) -> then with 2')
        .call(() => ex00.exports.call(ex00.exports.sub, 5, 2))
        .equal(5 - 2)
      ,
      test('call((a, b) => (a++) * 2 + b, 5, 2)')
        .call(() => ex00.exports.call((a, b) => (a++) * 2 + b, 5, 2))
        .equal(((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),

    describe('curry', [
      test('function is exported')
        .value(ex00.exports.curry)
        .isA(Function)
      ,
      test('function should return a function')
        .value(ex00.exports.curry && ex00.exports.curry())
        .isA(Function)
      ,
      test('curry(add, 5) -> then with 2')
        .call(() => ex00.exports.curry(ex00.exports.add, 5)(2))
        .equal(5 + 2)
      ,
      test('curry(sub, 5) -> then with 2')
        .call(() => ex00.exports.curry(ex00.exports.sub, 5)(2))
        .equal(5 - 2)
      ,
      test('curry((a, b) => (a++) * 2 + b, 5) -> then with 2')
        .call(() => ex00.exports.curry((a, b) => (a++) * 2 + b, 5)(2))
        .equal(((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),

    describe('BONUS', [
      test('add is a single expression')
        .value(ex00.var('add'))
        .notEqual('BlockStatement').map('type')
      ,
      test('sub is a single expression')
        .value(ex00.exports.sub)
        .exclude('{')
      ,
      test('call is a single expression')
        .value(ex00.exports.call)
        .exclude('{')
      ,
      test('apply is a single expression')
        .value(ex00.exports.apply)
        .exclude('{')
      ,
    ]),

  ])()
})