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

const readFile = path => fs.readFile(path, 'utf-8')
const exPath = `${__dirname}/../exercise`
const injectWhile = ` _$_count_$_();`
const injectGlobal = `; let _$_i_$_ = 0`
  + `; let exports = {}`
  + `; const module = { exports }`
  + `; const _$_count_$_ = () => { if (_$_i_$_++ > 10000) { throw Error(`
  + `'Too many instructions, probably an infinite loop'`
  + `) } }`

module.exports = (filename, extraRules) => readFile(`${exPath}/${filename}`)
  .then(parseAST)
  .then(code => {
    const errors = linter.verify(code, extend(extraRules), { filename })
    const rawLines = code.text.split('\n')
    const lines = rawLines
      .map(l => /\bwhile\b/.test(l) ? (l + injectWhile) : l)

    lines[0] = '(() => { ' + lines[0]
    lines[1] = (lines[1] || '') + injectGlobal
    lines.push('return module })()')

    try {
      return {
        $: q => squery(q, code.ast),
        filename,
        code,
        errors,
        // eslint-disable-next-line no-eval
        exports: eval(lines.join('\n')).exports
      }
    } catch (err) {
      err.lines = rawLines
      throw err
    }
  })

