#!/usr/bin/env node
'use strict'

const through = require('through2')
const parser = require('tap-out')
const chalk = require('chalk')
const out = through()
const tap = parser()
const extra = []
const asserts = []

const pusher = str => (n = 1) => {
  while (n-- > 0) {
    out.push(str)
  }
}

const endLine = pusher('\n')
const indent = pusher('  ')
const push = (str, n) => {
  indent(n)
  out.push(str)
}
const pushr = (str, n) => {
  push(str, n)
  endLine()
}

let firstTestDone = false
const pushTest = color => {
  if (!firstTestDone) {
    firstTestDone = true
    indent()
  }
  out.push(chalk[color](color === 'red' ? 'x' : '.'))
}

const statsOutput = res => {
  endLine(2)
  pushr(res.tests.length + ' tests')
  pushr(chalk.green(res.pass.length + ' passed'))
}

let currentTest = ''
let firstFailingTest = ''

tap.on('test', ({ name }) => currentTest = name)

tap.on('assert', ({ ok }) => {
  if (!ok && !firstFailingTest) {
    firstFailingTest = currentTest
  }
  pushTest(ok ? 'green' : 'red')
  asserts.push(ok)
})

const operators = { deepEqual: 'equal' }
const replaceOp = op => operators[op] || op

const handleFailure = failure => {
  if (!failure) {
    return
  }

  pushr(chalk.yellow(firstFailingTest))
  pushr(`  test #${failure.number}: ` + chalk.yellow(failure.name))
  if (failure.error.expected) {
    pushr('  failed where value:')
    pushr('    ' + chalk.red(failure.error.actual))
    pushr('  should ' + chalk.cyan(replaceOp(failure.error.operator)) + ':')
    pushr('    ' + chalk.green(failure.error.expected))

    return
  }
  pushr('   message: ' + chalk.green(failure.error.message))
  pushr('      line: ' + chalk.cyan(failure.error.line))
  pushr('    column: ' + chalk.cyan(failure.error.column))
  if (failure.name !== 'loading-error') {
    pushr('            -> run : `'
      + chalk.yellow('npm run rule ' + failure.name)
      + ('` to see more details'))
    pushr('            -> or see : '
      + chalk.yellow('http://eslint.org/docs/rules/' + failure.name))
  }
}

tap.on('extra', str => str && extra.push(str))
tap.on('output', res => {
  if ((res.fail && res.fail.length) || asserts.length === 0) {
    endLine(2)

    handleFailure(res.fail[0])
    statsOutput(res)

    if (extra.length) {
      console.log(extra.join('\n'))
    }

    push(chalk.red(res.fail.length + ' failed'))

    const past = (res.fail.length === 1) ? 'was' : 'were'
    const plural = (res.fail.length === 1) ? 'failure' : 'failures'

    pushr(chalk.red('Failed Tests: ')
      + 'There ' + past + ' ' + chalk.red(res.fail.length) + ' ' + plural)
    endLine()

    const errors = {}

    res.fail.forEach(fail => {
      const type = res.fail[0].error.expected ? fail.type : fail.name

      errors[type] = (errors[type] || 0) + 1
    })

    Object.keys(errors).forEach(e => pushr(chalk.red(errors[e]) + ' ' + e))
    endLine()
  } else {
    statsOutput(res)
    endLine()
    pushr(chalk.green('Pass!'))
  }
})

process.stdin.pipe(tap)

endLine()

out.pipe(process.stdout)
