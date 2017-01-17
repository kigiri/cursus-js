const tape = require('blue-tape')
const testProto = tape.Test.prototype
const noOp = () => {}
const pass = _ => _
const disabledKeys = {
  plan: 'Plan is filled automaticaly in chain mode',
  end: 'end is not needed in chain mode',
  test: 'use describe to describe tests in chain mode',
  throws: 'throws is not implemented in chain mode yet',
  doesNotThrow: 'doesNotThrow is not implemented in chain mode yet',
}

// novalue
const noValue = new Set([
  'isNaN',
  'fail',
  'pass',
  'timeoutAfter',
  'skip',
  'comment',
])

const arg = type => args => {
  let i = -1
  while (++i < args.length) {
    if (args[i] && args[i].constructor === type) {
      let arg = args[i]
      args.splice(i, 1)
      return arg
    }
  }
}

arg.string = arg(String)
arg.object = arg(Object)
arg.function = arg(Function)

const composePath = (f, key) => value => f(value && value[key])
const getPath = p => typeof p === 'string'
  ? p.split('.').filter(Boolean).reverse().reduce(composePath, pass)
  : p

const include = part => actual => actual &&
  (actual.indexOf && actual || String(actual)).indexOf(part) !== -1

const exclude = part => actual => actual &&
  (actual.indexOf && actual || String(actual)).indexOf(part) === -1

exports.test = (...testArgs) => {
  let _fn = arg.function(testArgs) || noOp
  let _only = false
  const name = arg.string(testArgs)
  const opts = arg.object(testArgs) || {}
  const stack = []
  const push = test => (stack.push(test), getter)
  const cache = {
    call: fn => (_fn = fn, getter),
    value: value => (_fn = () => value, getter),
    timeout: delay => (opts.timeout = delay, getter),
    objectPrintDepth: depth => (opts.objectPrintDepth = depth, getter),
    only: () => (_only = true, getter),
    map: map => push({ key: 'map', map: getPath(map) }),
    from: map => (stack[stack.length -1].map = getPath(map), getter),
    isA: (...args) => push({ args, key: 'equal', map: t => t&&t.constructor }),
    include: (part, ...args) => push({ args, key: 'true', map: include(part) }),
    exclude: (part, ...args) => push({ args, key: 'true', map: exclude(part) }),
    start: (tester = tape) => {
      if (!_fn) return

      const fn = _fn.constructor === Function ? _fn : (f => () => f)(_fn)
      const tapeArgs = []
      const msg = [tester.msg, name].filter(Boolean).join(' - ')
      const test = (_only ? tester.only : tester)

      msg && tapeArgs.push(msg)
      tapeArgs.push(opts, t => {
        if (!stack.length) return fn(t)

        Promise.resolve(fn()).catch(pass).then(actualValue => {
          stack.forEach(({ key, args, map = pass }) => {
            if (key === 'map') {
              actualValue = map(actualValue)
            } else if (noValue.has(key)) {
              t[key](...args)
            } else if ((key === 'equal' || key === 'notEqual')
                && Number.isNaN(map(actualValue))) {
              t[key]('NaN', Number.isNaN(args[0]) ? 'NaN' : args[0], args[1])
            } else {
              t[key](map(actualValue), ...args)
            }
          })
          t.end()
        })
      })

      test(...tapeArgs)
      _fn = undefined
    },
  }

  const getter = new Proxy(Object.create(null), {
    get: (src, key) => {
      if (cache[key]) return cache[key]

      if (disabledKeys[key]) throw Error(disabledKeys[key])

      if (!testProto[key]) throw Error(`Unknown key ${key}`)

      return (cache[key] = (...args) => push({key, args}))
    }
  })

  Object.defineProperty(cache, 'ignore', {
    get: () => (opts.skip = true, getter),
  })

  setTimeout(cache.start, 500)

  return getter
}

exports.describe = (msgPart, tests) => {
  const describer = (tester = tape) => {
    const msg = [tester.msg, msgPart].filter(Boolean).join(' - ')

    tape(msg, t => {
      const tt = t.test.bind(t)

      tt.msg = msg
      tests.forEach(test => (test.start || test)(tt))
      t.end()
    })
  }

  return describer
}

exports.onFinish = fn => tape.onFinish(fn)

// variables and function


/*
En reprenant ce principe on pourrait structurer une piscine de javascript ainsi :
j00 et j01 shell comme 42 car il est important de connaitre sont environement
j02 variables -> fonctions -> boucles
j03 comprendre le scope en JavaScript copie / references manipuler les fonctions
j04 recursion
// 1er rush (faire un petit programme en js basique)
j05 Lambda, introduction a l'asynchrone dans node (on reecrit des fonctions qui utilise des lambda comme forEach, map, reduce et filter et manipule des fonctions asynchrone de node)
j06 gestion de parametres + FileSystem (car c'est quand meme vachement plus simple en JS)
j07 Html + css
j08 le DOM en JS (refaire ce qu'on a fait faire a la main en html + css en js)
j09 24h comme a 42 ?
Exam final
*/