const fs = require('fs')
const child_process = require('child_process')

const spawn = (cmd, ...args) => {
  const p = child_process.spawn(cmd, args, { stdio: ['pipe', process.stdout, process.stderr]  })
  const q = new Promise((s, f) => p.on('exit', e => e ? f(e) : s()))

  p.then = (s,f) => q.then(s,f)
  p.catch = f => q.catch(f)
  return p
}

Promise.resolve()
  .then(() => fs.statSync('node_modules'))
  .catch(err => spawn('yarn', 'install')
    .catch(() => spawn('npm', 'install')))
  .then(() => {
    const exercies = fs.readdirSync('test')
    const dot = spawn('node',[ './bin/dot.js' ])
    const ex = child_process.spawn('node', [ `./test/${exercies[0]}` ])

    ex.stdout.pipe(dot.stdin)
    ex.stderr.pipe(dot.stdin)
    ex.on('close', (code) => dot.stdin.end())

    return dot
  })
  .catch(err => console.error(err))

