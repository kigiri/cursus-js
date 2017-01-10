// Restrictions: `require` is prohibed and only the mathematical operators
// `-` and `+` are allowed.



// export the function `add`:
// it must take 2 numbers and add them together
// const add = 


// export the function `sub`:
// it must take 2 numbers and substract them from left to right

// const sub =


// export the function `multiply`:
// it must take 2 numbers and multiply them
// only using your function `add`, `sub` and the `while` loop
// const multiply = 

const multiply = (a, b) => {
  if (!a || !b) return 0
  let sign = true
  if (a < 0) {
    sign = !sign
    a = -a
  }
  if (b < 0) {
    sign = !sign
    b = -b
  }
  let result = b
  while (--a) {
    result += b
  }
  return sign ? result : -result
}

module.exports.multiply = multiply

// export the function `divide`:
// it must take 2 numbers and divide them from left to right
// only using your function `add`, `sub` and the `while` loop
// const divide = 

