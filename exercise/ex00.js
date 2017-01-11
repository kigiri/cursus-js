const abs = n => n < 0 ? -n : n
const getSign = (a, b) => a < 0 ? b < 0 : b > 0
const mult = (a, b, r=0) => a > 0 ? mult(a - 1, b, r + b) : r
const multiply = (a, b) => getSign(a, b)
  ? mult(abs(a), abs(b))
  : -mult(abs(a), abs(b))

module.exports = {
  multiply,
}