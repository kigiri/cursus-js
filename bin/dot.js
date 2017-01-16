#!/usr/bin/env node

const through = require('through2')
const parser = require('tap-out')
const chalk = require('chalk')
const out = through()
const tap = parser()
const extra = []
const asserts = []

const pusher = str => (n=1) => {
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
  pushr(res.tests.length +' tests')
  pushr(chalk.green(res.pass.length +' passed'))
}

let currentTest = ''
let firstFailingTest = ''
tap.on('test', ({name}) => currentTest = name)

tap.on('assert', ({ok}) => {
  if (!ok && !firstFailingTest) {
    firstFailingTest = currentTest
  }
  pushTest(ok ? 'green' : 'red')
  asserts.push(ok)
})

tap.on('extra', str => str && extra.push(str))
tap.on('output', res => {
  if (res.fail && res.fail.length || asserts.length === 0) {
    endLine(2)

    const failure = res.fail[0]

    if (failure) {
      pushr(chalk.yellow(firstFailingTest))
      pushr(chalk.white(`  test #${failure.number}: `)
        + chalk.yellow(failure.name))
      pushr(chalk.white('  expected: ') + chalk.green(failure.error.expected))
      pushr(chalk.white('    actual: ') + chalk.red(failure.error.actual))
    }

    statsOutput(res)

    if (extra.length) {
      console.log(extra.join('\n'))
    }

    push(chalk.red(res.fail.length +' failed'))

    const past = (res.fail.length === 1) ? 'was' : 'were'
    const plural = (res.fail.length === 1) ? 'failure' : 'failures'

    pushr(chalk.red('Failed Tests: ')
      + 'There '+ past +' '+ chalk.red(res.fail.length) +' '+ plural)
    endLine()

    res.fail.forEach(error => pushr(chalk.red('x') +' '+ error.name))
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
