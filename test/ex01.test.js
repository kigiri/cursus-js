const tester = require('../lib/tester')

tester(1, ex => {
  const pass = _ => _

  const generateOpTests = (name, op, values, map=pass) => values.map(([ a, b ]) =>
    ex.test(`(${a} ${op} ${b})`)
      .call(() => ex.exports[name](a, b))
      .equal(map(eval(`(${a} ${op} ${b})`))))

  const testOp = (name, op, values, map) =>
    ex.test.fn(name, generateOpTests(name, op, values, map))

  const testMath = (name, values) => ex.test.against(name, Math[name], values)
  const genNum = (min, max) => n => n && ((Math.random() * n * max) + (min * n))

  const basePairs = [
    [  1,  1 ],
    [  1, -1 ],
    [ -1,  1 ],
    [ -1, -1 ],
    [  0,  0 ],
    [  0,  1 ],
    [  1,  0 ],
    [ -1,  0 ],
    [  0, -1 ],
  ]

  const bigPairs = basePairs.map(n => n.map(genNum(10, 99)))
  const smallPairs = basePairs.map(n => n.map(genNum(0, 1)))

  const pairs = bigPairs.concat(smallPairs)
  const single = pairs.map(([n]) => [n])

  const flooredSingle = bigPairs.map(([n]) => [Math.floor(n)])
  const flooredPairs = bigPairs.map(n => n.map(Math.floor))

  const odds = '13579'
  const isOdd = n => odds.indexOf(n.toString()[n.toString().length - 1]) !== -1

  return [
    ex.describe('cheating', [
        'require',
        'Math',
        'toString',
        'String',
        'Number',
        'parseInt',
        'toFixed',
      ].map(key => ex.test(`${key} should not be used`)
        .value(ex.$(`#${key}`).length).equal(0))
      .concat([
        ex.test('Strings should not be used')
          .value(ex.$('String').length < 2).equal(true),
      ])
      .concat('~ >> ^ << * % / & |'.split(' ')
        .map(op => ex.test(`${op} operator`)
          .value(ex.code.ast.tokens.filter(t => t.value === op).length)
          .equal(0, `You can't use the operator ${op}, try something else`)))),

    testOp('add', '+', pairs),
    testOp('sub', '-', pairs),

    testMath('sign', single),
    testMath('abs', single),
    testMath('ceil', single),
    testMath('floor', single),
    testMath('max', pairs),
    testMath('min', pairs),
    testMath('round', single),
    testMath('trunc', single),

    ex.test.against('positive', (a, b) => a < 0 ? b < 0 : b > 0, pairs),

    testOp('multiply', '*', flooredPairs),
    testOp('modulo', '%', flooredPairs, Math.trunc),
    testOp('divide', '/', flooredPairs, Math.trunc),

    ex.test.against('odd', isOdd, flooredSingle),
    ex.test.against('even', n => !isOdd(n), flooredSingle),

    ex.test.against('clamp', (n, max) => n < max ? n : max, pairs),
    ex.test.against('rotate', (n, max) => n % max, flooredPairs
      .filter(([ a, b ]) => a > 0 && b > 0)),
/*
    ex.test.against('base2', n => Number(n.toString(2)), flooredSingle),
    ex.test.against('base8', n => Number(n.toString(8)), flooredSingle),
*/
    ex.test.fn('call', [
      ex.test('call(add, 5, 2)')
        .call(() => ex.exports.call(ex.exports.add, 5, 2))
        .equal(5 + 2)
      ,
      ex.test('call(sub, 5) -> then with 2')
        .call(() => ex.exports.call(ex.exports.sub, 5, 2))
        .equal(5 - 2)
      ,
      ex.test('call((a, b) => (a++) * 2 + b, 5, 2)')
        .call(() => ex.exports.call((a, b) => (a++) * 2 + b, 5, 2))
        .equal(((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),

    ex.test.fn('curry', [
      ex.test('function should return a function')
        .call(ex.exports.curry)
        .isA(Function)
      ,
      ex.test('curry(add, 5) -> then with 2')
        .call(() => ex.exports.curry(ex.exports.add, 5)(2))
        .equal(5 + 2)
      ,
      ex.test('curry(sub, 5) -> then with 2')
        .call(() => ex.exports.curry(ex.exports.sub, 5)(2))
        .equal(5 - 2)
      ,
      ex.test('curry((a, b) => (a++) * 2 + b, 5) -> then with 2')
        .call(() => ex.exports.curry((a, b) => (a++) * 2 + b, 5)(2))
        .equal(((a, b) => (a++) * 2 + b)(5, 2))
      ,
    ]),

    ex.describe('BONUS', [
      ex.test('while is not used')
        .value(ex.$('WhileStatement').length)
        .equal(0, 'Use recursion instead of while loops'),
    ].concat(ex.$('arrow').map(def =>
      ex.test(`function line ${def.loc.start.line} column ${
        def.loc.start.column} is a single expression`)
        .value(def.body.type)
        .notEqual('BlockStatement')))),
  ]
})