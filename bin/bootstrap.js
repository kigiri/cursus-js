#!/usr/bin/env node

var version = process.version.slice(1).split('.').map(Number)
var major = version[0]
var minor = version[1]

if (major < 6 || (major === 6 && minor < 9)) {
  console.error('You need to update node')
  process.exit(0)
}

require('../lib/test-runner')
