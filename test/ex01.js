const tester = require('../lib/tester')

tester(__filename, ({ test, describe, exports, code, $ }) => {
  const pass = _ => _

  const generateOpTests = (name, op, values, map=pass) =>
    values.map(([ a, b ]) => test(`(${a} ${op} ${b})`)
      .call(() => exports[name](a, b))
      .equal(map(eval(`(${a} ${op} ${b})`))))

  const testOp = (name, op, values, map) =>
    test.fn(name, generateOpTests(name, op, values, map))

  const testMath = (name, values) => test.against(name, Math[name], values)
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
    describe('cheating', [
        'require',
        'Math',
        'toString',
        'String',
        'Number',
        'parseInt',
        'toFixed',
      ].map(key => test(`${key} should not be used`)
        .value($(`#${key}`).length).equal(0))
      .concat([
        test('Strings should not be used')
          .value($('String').length < 2).equal(true),
      ])
      .concat('~ >> ^ << * % / & |'.split(' ')
        .map(op => test(`${op} operator`)
          .value(code.ast.tokens.filter(t => t.value === op).length)
          .equal(0, `You can't use the operator ${op}, try something else`)))),

    testOp('add', '+', pairs),
    testOp('sub', '-', pairs),

    testMath('sign', single),
    testMath('abs', single),

    testMath('max', pairs),
    testMath('min', pairs),

    test.against('positive', (a, b) => a < 0 ? b < 0 : b > 0, pairs
      .filter(([a, b]) => a !== 0 && b !== 0)),

    testOp('multiply', '*', flooredPairs),
    testOp('modulo', '%', flooredPairs, Math.trunc),
    testOp('divide', '/', flooredPairs, Math.trunc),

    testMath('ceil', single),
    testMath('floor', single),
    testMath('round', single),
    testMath('trunc', single),

    test.against('odd', isOdd, flooredSingle),
    test.against('even', n => !isOdd(n), flooredSingle),

    test.against('clamp', (n, max) => n < max ? n : max, pairs),
    test.against('rotate', (n, max) => n % max, flooredPairs
      .filter(([ a, b ]) => a > 0 && b > 0)),
  ]
})
