const fs = require('fs')
const linter = require('../lib/lint')
const { describe, test } = require('../lib/mixtape')
const stringify = require('../lib/log-value')

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

const getName = str => str.replace('.bonus.js', '.js').slice(-7)
module.exports = (filename, getTests) => linter(getName(filename)).then(ex => {
  ex.describe = describe
  ex.test = test

  test.fn = (name, tests) => describe(name, [
    test('function should be exported')
      .value(ex.exports[name])
      .isA(Function, `module.exports.${name} must be a function`),
    ].concat(tests))

  test.against = (name, fn, values) => test.fn(name, values.map(args =>
    test(`${fn.name || ''}(${args.join(', ')})`)
      .call(() => ex.exports[name](...args)) 
      .equal(fn(...args))))


  test.defined = key => test('is defined')
    .value(ex.exports[key])
    .notEqual(undefined, `module.exports.${key} should not be undefined`)

  test.type = (key, type) => test(`is a ${type.name}`)
    .value(ex.exports[key])
    .isA(type, `module.exports.${key} should be a ${type.name}`)

  test.value = (key, value) => test(`of value ${stringify(value)}`)
    .value(ex.exports[key])
    .deepEqual(value, `module.exports.${key} should be ${stringify(value)}`)

  test.prop = (key, type, value) => [
    test.defined(key),
    test.type(key, type),
    test.value(key, value),
  ]

  describe(getName(filename).slice(-7, -3), getTests(ex).concat([

  ]))()

  //describe('linter', ex.errors.map())
}).catch(err => {
  err.ruleId = 'loading-error'
  if (err.code === 'ENOENT') {
    err.column = err.line = 0
    err.message = 'You must create the file '+ err.path.split('../')[1]
  } else if (err.column !== undefined) {
    err.line = err.lineNumber
  } else {
    const stack = err.stack.split('\n').filter(r => /<anonymous>/.test(r))
    if (!stack.length) return console.error(err)
    try {
      const [ , l, c ] = stack[stack.length - 2]
        .split('<anonymous>')[1]
        .split(':')

      const column = Number(c.slice(0, -1))
      const lineText = err.lines[l - 1]

      console.log({ lineText })

      err.line = l
      err.column = lineText.length < column
        ? (lineText.length - lineText.trim().length)
        : column

    } catch (skipError) {}
  }
  showTap([ err ])
  process.on('exit', () => process.exit(1))
})
