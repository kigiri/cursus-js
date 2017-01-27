const tester = require('../lib/tester')
const stringify = require('../lib/log-value')

tester(__filename, ({ test, describe, exports }) => {
/*
    test.against('base2', n => Number(n.toString(2)), flooredSingle),
    test.against('base8', n => Number(n.toString(8)), flooredSingle),
*/
  const add = (a, b) => a + b
  const sub = (a, b) => a - b
  return [
    test.fn('call', [
      test('call(add, 5, 2)')
        .call(() => exports.call(add, 5, 2))
        .equal(5 + 2)
      ,
      test('call(sub, 5) -> then with 2')
        .call(() => exports.call(sub, 5, 2))
        .equal(5 - 2)
      ,
      test('call((a, b) => (a++) * 2 + b, 5, 2)')
        .call(() => exports.call((a, b) => (a++) * 2 + b, 5, 2))
        .equal(((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),

    test.fn('curry', [
      test('function should return a function')
        .call(exports.curry)
        .isA(Function)
      ,
      test('curry(add, 5) -> then with 2')
        .call(() => exports.curry(add, 5)(2))
        .equal(5 + 2)
      ,
      test('curry(sub, 5) -> then with 2')
        .call(() => exports.curry(sub, 5)(2))
        .equal(5 - 2)
      ,
      test('curry((a, b) => (a++) * 2 + b, 5) -> then with 2')
        .call(() => exports.curry((a, b) => (a++) * 2 + b, 5)(2))
        .equal(((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),
  ]
})
