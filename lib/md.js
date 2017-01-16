const fs = require('mz/fs')
const marked = require('marked')
const Render = require('marked-terminal')

marked.setOptions({ renderer: new Render() })

const parseBuffer = b => marked(b.toString('utf-8'))

module.exports = filepath => fs.readFile(filepath)
  .catch(err => {
    if (err.code === 'ENOENT' && !/\.md$/.test(filepath)) {
      return fs.readFile(`${filepath}.md`)
    }
    throw err
  })
  .then(parseBuffer)

