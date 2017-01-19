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

const ignore = _ => _
Promise.series = w => w.reduce((q, f) => q.then(f), Promise.resolve())
Promise.resolve()
  .then(() => fs.statSync(abs('node_modules')))
  .catch(err => spawn('yarn', 'install')
    .catch(() => spawn('npm', 'install')))
  .then(() => fs.readdirSync(abs(`/test`))
    .map(exercise => () => 
      spawn(abs('/eslint/bin/eslint.js'), abs(`/exercise/${exercise}`))
        .catch(ignore)
        .then((code) => {
          const dot = spawn('node', abs(`/bin/dot.js`))
          const ex = child_process.spawn('node', [ abs(`/test/${exercise}`) ])

          ex.stdout.pipe(dot.stdin)
          ex.stderr.pipe(dot.stdin)
          return new Promise((s, f) => ex.on('exit', err => dot.stdin.end((err||code) ? f(err) : s())))
        })))
  .then(Promise.series)
  .catch(ignore)

