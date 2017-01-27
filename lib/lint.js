'use strict'

const each = require('lodash/each')
const { linter, SourceCode } = require('eslint')
const squery = require('grasp-squery').query
const espree = require('espree')
const fs = require('mz/fs')
const rules = require('../.eslintrc')

const parseAST = code => new SourceCode(code, espree.parse(code, {
  ecmaVersion: 7,
  tokens: true,
  loc: true,
  comment: true,
  attachComment: true,
  range: true,
}))

const extend = extraRules => {
  if (!extraRules) {
    return rules
  }
  const newRules = Object.assign({}, rules)

  each(extraRules, (rule, key) => {
    if (!rules[key]) {
      newRules[key] = rule
    } else if (Array.isArray(rules[key])) {
      if (Array.isArray(rule)) {
        newRules[key] = rules[key].concat(rule)
      } else {
        newRules[key] = rules[key].push(rule)
      }
    } else {
      newRules[key] = [ rules[key], rule ]
    }
  })

  return newRules
}

const exPath = `${__dirname}/../exercise`

module.exports = (filename, extraRules) => fs.readFile(`${exPath}/${filename}`)
  .then(c => c.toString('utf-8'))
  .then(parseAST)
  .then(code => {
    const errors = linter.verify(code, extend(extraRules), { filename })
    const exports = require(`${exPath}/${filename}`)

    return {
      $: q => squery(q, code.ast),
      filename,
      code,
      errors,
      exports,
    }
  })

