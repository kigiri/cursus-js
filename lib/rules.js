const join = require('path').join
const md = require('./md')

const base = join(__dirname, '../eslint/docs/rules/')

module.exports = rule => md(join(base, rule))
