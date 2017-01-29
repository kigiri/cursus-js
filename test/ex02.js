const tester = require('../lib/tester')
const stringify = require('../lib/log-value')

tester(__filename, ({ test, describe, exports }) => {
/*
    test.against('base2', n => Number(n.toString(2)), flooredSingle),
    test.against('base8', n => Number(n.toString(8)), flooredSingle),
*/

  const { call, curry, clamp, inRange } = exports
  const add = (a, b) => a + b
  const sub = (a, b) => a - b
  return [
    test.fn('call', [
      test('call(add, 5, 2)')
        .call(() => call(add, 5, 2))
        .equal(5 + 2)
      ,
      test('call(sub, 5) -> then with 2')
        .call(() => call(sub, 5, 2))
        .equal(5 - 2)
      ,
      test('call((a, b) => (a++) * 2 + b, 5, 2)')
        .call(() => call((a, b) => (a++) * 2 + b, 5, 2))
        .equal(((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),

    test.fn('curry', [
      test('function should return a function')
        .call(curry)
        .isA(Function)
      ,
      test('curry(add, 5) -> then with 2')
        .call(() => curry(add, 5)(2))
        .equal(5 + 2)
      ,
      test('curry(sub, 5) -> then with 2')
        .call(() => curry(sub, 5)(2))
        .equal(5 - 2)
      ,
      test('curry((a, b) => (a++) * 2 + b, 5) -> then with 2')
        .call(() => curry((a, b) => (a++) * 2 + b, 5)(2))
        .equal(((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),

    test.fn('clamp', [
      test('function should return a function')
        .call(() => clamp(5, 5))
        .isA(Function)
      ,
      test('clamp(-5, 5)(2)')
        .call(() => clamp(-5, 5)(2))
        .equal(2)
      ,
      test('clamp(-5, 5)(-10)')
        .call(() => clamp(-5, 5)(-10))
        .equal(-5)
      ,
      test('clamp(-5, 5)(2)')
        .call(() => clamp(-5, 5)(10))
        .equal(5)
      ,
      test('clamp(50, 500)(2)')
        .call(() => clamp(50, 500)(2))
        .equal(50)
      ,
      test('clamp(50, 500)(150)')
        .call(() => clamp(50, 500)(150))
        .equal(150)
      ,
      test('clamp(50, 500)(800)')
        .call(() => clamp(50, 500)(800))
        .equal(500)
      ,
    ]),

    test.fn('inRange', [
      test('function should return a function')
        .call(() => inRange(5, 5))
        .isA(Function)
      ,
      test('inRange(-5, 5)(2)')
        .call(() => inRange(-5, 5)(2))
        .equal(true)
      ,
      test('inRange(-5, 5)(-10)')
        .call(() => inRange(-5, 5)(-10))
        .equal(false)
      ,
      test('inRange(-5, 5)(2)')
        .call(() => inRange(-5, 5)(10))
        .equal(false)
      ,
      test('inRange(50, 500)(2)')
        .call(() => inRange(50, 500)(2))
        .equal(false)
      ,
      test('inRange(50, 500)(150)')
        .call(() => inRange(50, 500)(150))
        .equal(true)
      ,
      test('inRange(50, 500)(800)')
        .call(() => inRange(50, 500)(800))
        .equal(false)
      ,
    ]),

    describe('`inRange` and `clamp` should handle single arguments', [
      test('clamp(500) should work like clamp(0, 500)')
        .call(() => clamp(500))
        .equal(399).from(fn => fn(399))
        .equal(500).from(fn => fn(999))
        .equal(0).from(fn => fn(-399))
      ,
      test('inRange(500) should work like inRange(0, 500)')
        .call(() => inRange(500))
        .equal(true).from(fn => fn(399))
        .equal(false).from(fn => fn(999))
        .equal(false).from(fn => fn(-399))
      ,
    ]),
  ]
})
