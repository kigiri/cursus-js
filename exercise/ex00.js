const abs = n => n < 0 ? -n : n
const positive = (a, b) => a < 0 ? b < 0 : b > 0

const mult = (a, b, r=0) => a > 0 ? mult(a - 1, b, r + b) : r
const div = (a, b, r=0) => a >= b ? div(a - b, b, r + 1) : r
const mod = (a, b) => a >= b ? mod(a - b, b) : a

const genericOp = op => (a, b) => positive(a, b)
  ? op(abs(a), abs(b))
  : -op(abs(a), abs(b))

module.exports = {
  abs,
  positive,
  add: (a,b) => a + b,
  sub: (a,b) => a - b,
  multiply: genericOp(mult),
  divide: genericOp(div),
  modulo: genericOp(mod),
  call: (f, a, b) => f(a, b),
  curry: (f, a) => b => f(a, b),
}
