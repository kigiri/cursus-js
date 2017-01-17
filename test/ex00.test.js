const fs = require('fs')
const linter = require('../lib/lint')
const { describe, test } = require('../lib/mixtape')

const showError = (err, idx) => `
not ok ${idx} - ${err.ruleId}
  ---
  message: ${err.message}
  line: ${err.line}
  column: ${err.column}
  ...`

const showTap = errors => console.log(`
TAP version 13
1..${errors.length}
${errors.map(showError).join('\n')}`)

linter('ex00.js').then(ex00 => {
  const testFn = (name, tests) => 
    describe(name, [
      test('function is exported')
        .value(ex00.exports[name])
        .isA(Function)
      ].concat(tests))

  const fun = n => ex00
    .$(`(arrow.parent.id[name="${n}"], arrow.parent.key[name="${n}"])`)[0]

  const pass = _ => _

  const generateOpTests = (name, op, values, map=pass) => values.map(([ a, b ]) =>
    test(`(${a} ${op} ${b})`)
      .call(() => ex00.exports[name](a, b))
      .equal(map(eval(`(${a} ${op} ${b})`))))

  const testOp = (name, op, values, map) =>
    testFn(name, generateOpTests(name, op, values, map))

  const testAgainst = (name, fn, values) => testFn(name, values
    .map(args => test(`${fn.name || ''}(${args.join(', ')})`)
      .call(() => ex00.exports[name](...args)) 
      .equal(fn(...args))))

  const testMath = (name, values) => testAgainst(name, Math[name], values)

  if (ex00.errors && ex00.errors.length) {
    showTap(ex00.errors)
    process.exit(0)
  }

  const genNum = n => n && ((Math.random() * n * 89.9) + (10 * n))
  const single = [ 1, 1, -1, -1, 0 ].map(n => [ genNum(n) ])
  const pairs = [
    [  1,  1 ],
    [  1, -1 ],
    [ -1,  1 ],
    [ -1, -1 ],
    [  0,  0 ],
    [  0,  1 ],
    [  1,  0 ],
    [ -1,  0 ],
    [  0, -1 ],
  ].map(n => n.map(genNum))

  const flooredPairs = pairs.map(n => n.map(Math.floor))

  describe('ex00', [
    describe('cheating', [
      test('original Math should not be used')
        .value(ex00.$('#Math')).map('0').equal(),

      test('toString should not be used')
        .value(ex00.$('#toString').length).equal(0),

      test('String should not be used')
        .value(ex00.$('#String').length).equal(0),

      test('Strings should not be used')
        .value(ex00.$('String').length < 2).equal(true),
    ].concat('~*%/'.split('').map(op => test(`${op} operator`)
      .value(ex00.code.ast.tokens.filter(t => t.value === op).length)
      .equal(0, `You can't use the operator ${op}, try harder`)))),

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

    testAgainst('positive', (a, b) => a < 0 ? b < 0 : b > 0, pairs),

    testOp('multiply', '*', flooredPairs),
    testOp('modulo', '%', flooredPairs, Math.trunc),
    testOp('divide', '/', flooredPairs, Math.trunc),

    testFn('call', [
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

    testFn('curry', [
      test('function should return a function')
        .call(ex00.exports.curry)
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
      test('while is not used')
        .value(ex00.$('WhileStatement').length)
        .equal(0),
    ].concat(ex00.$('arrow').map(def =>
      test(`function line ${def.loc.start.line} column ${
        def.loc.start.column} is a single expression`)
        .value(def.body.type)
        .notEqual('BlockStatement')))),
  ])()
}).catch(err => {
  err.ruleId = 'syntax-error'
  if (err.column !== undefined) {
    err.line = err.lineNumber
  } else {
    const stack = err.stack.split('\n').filter(r => /exercise\/ex/.test(r))
    if (!stack.length) return console.error(err)
    const [ , c, l ] = stack[stack.length - 1].split('.js')[1].split(':')
    err.column = c
    err.line = l.slice(0, -1)
  }
  showTap([ err ])
})