const { describe, test } = require('./mixtape')
const ex00 = require('./ex00')
const ex00Text = fs.readFileSync('./ex00')

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
  ])
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
  ])

  describe('multiply', [
    test('function multiply is exported')
      .value(ex00Text)
      .exclude('*', 'You can not use the opperator `*`, try harder !')
    ,
    test('substracting 2 numbers (5 + 5)')
      .call(() => ex00.multiply(5, 5))
      .equal(5 * 5)
    ,
    test('substracting negative numbers (5 + -5)')
      .call(() => ex00.multiply(5, -5))
      .equal(5 * -5)
    ,
  ])
])()