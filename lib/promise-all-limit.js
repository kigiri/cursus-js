module.exports = (fns, parallel = 1) => Promise.all(fns.reduce((acc, fn, i) => {
  acc[i % parallel] = acc[i % parallel].then(fn)
  return acc
}, Array(parallel).fill(Promise.resolve())))
