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

const promisify = fn => (...args) => new Promise((s,f) =>
  fn(...args, (e, r) => e ? f(e) : s(r)))

const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const pass = _ => _

const loadExercise = exercise => () =>
  spawn('node', abs('/eslint/bin/eslint.js'), abs(`/exercise/${exercise}`))
    .catch(pass)
    .then(code => {
      const dot = spawn('node', abs(`/bin/dot.js`))
      const ex = child_process.spawn('node', [ abs(`/test/${exercise}`) ])

      ex.stdout.pipe(dot.stdin)
      ex.stderr.pipe(dot.stdin)
      return new Promise((s, f) => ex.on('exit', err =>
        dot.stdin.end((err || code) ? f(err) : s())))
    })

Promise.series = w => w.reduce((q, f) => q.then(f), Promise.resolve())
Promise.resolve()
  .then(() => Promise.all([
    stat(abs('node_modules'))
      .catch(() => spawn('yarn', 'install')
        .catch(() => spawn('npm', 'install'))),
    stat(abs('eslint/bin')).catch(() =>
      spawn('git', 'submodule', 'update', '--init', '--recursive')),
  ]))
  .then(() => readdir(abs(`/test`)))
  .then(exercises => Promise.series(exercises.map(loadExercise)))
  .catch(err => (err instanceof Error) && console.error(err))

