const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const cwd = path.resolve(__dirname, '../')
const abs = p => path.join(cwd, p)
const spawn = (cmd, ...args) => {
  const p = child_process.spawn(cmd, args, {
    cwd,
    stdio: [ 'pipe', process.stdout, process.stderr ],
  })

  const q = new Promise((s, f) => p.on('exit', e => e ? f(e) : s()))

  p.then = (s,f) => q.then(s,f)
  p.catch = f => q.catch(f)

  return p
}

Promise.resolve()
  .then(() => fs.statSync(abs('node_modules')))
  .catch(err => spawn('yarn', 'install')
    .catch(() => spawn('npm', 'install')))
  .then(() => {
    const exercies = fs.readdirSync(abs(`/test`))
    const dot = spawn('node', abs(`/bin/dot.js`))
    const ex = child_process.spawn('node', [ abs(`/test/${exercies[0]}`) ])

    ex.stdout.pipe(dot.stdin)
    ex.stderr.pipe(dot.stdin)
    ex.on('close', (code) => dot.stdin.end())

    return dot
  })
  .catch(console.error)

