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

module.exports = (filename, fn) => linter(filename.slice(-7)).then(ex => {
  ex.describe = describe
  ex.test = test

  ex.test.fn = (name, tests) => describe(name, [
    test('function should be exported')
      .value(ex.exports[name])
      .isA(Function, `module.exports.${name} must be a function`),
    ].concat(tests))

  ex.test.against = (name, fn, values) => ex.test.fn(name, values
    .map(args => test(`${fn.name || ''}(${args.join(', ')})`)
      .call(() => ex.exports[name](...args)) 
      .equal(fn(...args))))

  if (ex.errors && ex.errors.length) {
    showTap(ex.errors)
  } else {
    describe(filename.slice(-7, -3), fn(ex))()
  }
}).catch(err => {
  err.ruleId = 'syntax-error'
  if (err.column !== undefined) {
    err.line = err.lineNumber
  } else {
    const stack = err.stack.split('\n').filter(r => /exercise\/ex/.test(r))
    if (!stack.length) return console.error(err)
    try {
      const [ , c, l ] = stack[stack.length - 1].split('.js')[1].split(':')
      err.column = c
      err.line = l.slice(0, -1)
    } catch (skipError) {
      throw err
    }
  }
  showTap([ err ])
}).catch(console.error)
