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

module.exports = (filename, getTests) => linter(filename.slice(-7)).then(ex => {
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

  describe(filename.slice(-7, -3), getTests(ex).concat([

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
    const stack = err.stack.split('\n').filter(r => /exercise\/ex/.test(r))
    if (!stack.length) return console.error(err)
    try {
      const [ , c, l ] = stack[stack.length - 1].split('.js')[1].split(':')
      err.column = c
      err.line = l.slice(0, -1)
    } catch (skipError) {}
  }
  showTap([ err ])
  process.on('exit', () => process.exit(1))
})
