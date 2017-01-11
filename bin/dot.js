#!/usr/bin/env node

var through = require('through2');
var parser = require('tap-out');
var chalk = require('chalk');
var out = through();
var tap = parser();
var currentTestName = '';
var errors = [];
var extra = [];
var assertCount = 0;
var lastComment;

process.stdin.pipe(tap);

out.push('\n');

function outPush (str) {

  out.push('  ' + str);
};

tap.on('comment', function (comment) {

  lastComment = comment;
});

var firstTestDone = false;

function pushTest(color) {
  if (!firstTestDone) {
    firstTestDone = true;
    out.push('  ');
  }
  out.push(chalk[color](color === 'red' ? 'x' : '.'));
}

function endLine() {
  out.push('\n')
}

tap.on('assert', function (res) {

  pushTest(res.ok ? 'green' : 'red')

  assertCount +=1;
});

tap.on('extra', function (str) {

  if (str !== '') extra.push(str);
});

tap.on('output', function (res) {

  if (res.fail && res.fail.length || assertCount === 0) {
    endLine();
    endLine();

    var failure = res.fail[0];

    if (failure) {
      outPush(chalk.white(`test #${failure.number}: `));
      out.push(chalk.cyan(failure.name));
      endLine();
      outPush(chalk.white('expected: '));
      out.push(chalk.green(failure.error.expected));
      endLine();
      outPush(chalk.white('actual: '));
      out.push(chalk.red(failure.error.actual));
      endLine();
    }

    errors = res.fail;
    outputExtra();

    statsOutput();

    outPush(chalk.red(res.fail.length + ' failed'));

    var past = (res.fail.length == 1) ? 'was' : 'were';
    var plural = (res.fail.length == 1) ? 'failure' : 'failures';

    endLine();

    outPush(chalk.red('Failed Tests: '));
    outPush('There ' + past + ' ' + chalk.red(res.fail.length) + ' ' + plural + '\n\n');

    res.fail.forEach(function (error) {
      outPush('  ' + chalk.red('x') + ' ' + error.name + '\n');
    });
    endLine();
  }
  else{
    statsOutput();

    endLine();
    outPush(chalk.green('Pass!'));
    endLine();
  }

  function statsOutput () {
    endLine();
    endLine();

    outPush(res.tests.length + ' tests\n');
    outPush(chalk.green(res.pass.length + ' passed\n'));
  }
});

function outputExtra () {

  console.log(extra.join('\n'));
}

out.pipe(process.stdout);
