#!/usr/bin/env node
'use strict'

const rules = require('../lib/rules')

rules(process.argv[2])
  .then(console.log)
  .catch(err => {
    if (err.code === 'ENOENT') {
      console.log('rule not found')
    } else {
      console.log(err.message)
    }
    process.exit(err.errno || 1)
  })
