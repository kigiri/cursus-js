'use strict'

// first line of the file must be 'use strict' to ensure we use javascript
// in strict mode

// the previous line start with two slashes so it's a comment.
// Comments allow you to annotate your code with text that will be ignored
// by javascript, it's for keep notes and help too clarify code

/* To avoid adding // before each lines
  Multiline comments start with slash-star,
  and end with star-slash
*/

// Statements can be terminated by ;
doStuff();

// ... but they don't have to be, as semicolons are automatically inserted
// wherever there's a newline, except in certain cases.
doStuff()


///////////////////////////////////
// 1. Numbers, Strings and Operators

// JavaScript has one number type (which is a 64-bit IEEE 754 double).
// Doubles have a 52-bit mantissa, which is enough to store integers
// up to about 9✕10¹⁵ precisely.
3 // = 3
1.5 // = 1.5

// Some basic arithmetic works as you'd expect.
1 + 1 // = 2
0.1 + 0.2 // = 0.30000000000000004
8 - 1 // = 7
10 * 2 // = 20
35 / 5 // = 7

// Including uneven division.
5 / 2 // = 2.5

// And modulo division.
10 % 2 // = 0
30 % 4 // = 2
18.5 % 7 // = 4.5

// Bitwise operations also work, when you perform a bitwise operation your float
// is converted to a signed int *up to* 32 bits.
1 << 2 // = 4

// Precedence is enforced with parentheses.
(1 + 3) * 2 // = 8

// There are three special not-a-real-number values:
Infinity // result of e.g. 1/0
-Infinity // result of e.g. -1/0
NaN // result of e.g. 0/0, stands for 'Not a Number'

// There's also a boolean type.
true
false

// Strings are created with ' or ".
'abc' // The norm ask for single quotes '
"I'm such a nice boy" // but you may use " if your string contains '

// Negation uses the ! symbol
!true // = false
!false // = true

// Equality is ===
1 === 1 // = true
2 === 1 // = false

// Inequality is !==
1 !== 1 // = false
2 !== 1 // = true

// More comparisons
1 < 10 // = true
1 > 10 // = false
2 <= 2 // = true
2 >= 2 // = true

// Strings are concatenated with +
'Hello ' + 'world!' // = 'Hello world!'

// ... which works with more than just strings
'1, 2, ' + 3 // = '1, 2, 3'
'Hello ' + ['world', '!'] // = 'Hello world,!' So be carefull with + operator

// and are compared with < and >
'a' < 'b' // = true

// Type coercion is performed for comparisons with double equals...
'5' == 5 // = true
null == undefined // = true

// ...avoid loosing your hairs and you use the strict === instead... please...
'5' === 5 // = false
null === undefined // = false

// You can access characters in a string with [index]
'This is a string'[0]  // = 'T'

// ...or use `slice` to get larger pieces.
'Hello world'.slice(0, 5) // = 'Hello'

// `length` is a property that return the lenght of a string or array
'Hello'.length // = 5

// There's also `null` and `undefined`.
null      // used to indicate a deliberate non-value
undefined // used to indicate a value is not currently present (although
          // `undefined` is actually a value itself)

// We recommand to avoid using null as it can always be substitute by undefined

// false, null, undefined, NaN, 0 and '' are falsy everything else is truthy.
// Note that 0 is falsy and "0" is truthy.
// empty string are falsy but empty array [] and empty object {} are truthy


///////////////////////////////////
// 2. Variables, Arrays and Objects

// Variables are declared with the `let` keyword. JavaScript is dynamically
// typed, so you don't need to specify type. Assignment uses a single `=`
// character.
let someVar = 5

// Variables declared without being assigned to are set to undefined.
let someThirdVar // = undefined

// There's shorthand for performing math operations on variables:
someVar += 5 // equivalent to someVar = someVar + 5 someVar is 10 now
someVar *= 10 // now someVar is 100

// and an even-shorter-hand for adding or subtracting 1
const prevValue = someVar++ // prevValue is 100
// and now someVar is 101

someVar-- // back to 100

// or you can use pre-incrementation
const nowValue = ++someVar // in this case someVar and nowValue are 101

// Arrays are ordered lists of values, of any type.
// `const` is used for a constant variable, you can however change the content
// of an array but not reassign the reference to a new array.
// prefer to use `const` when ever possible, use let only when necessary.
const myArray = ['Hello', 45, true]

// Their members can be accessed using the square-brackets subscript syntax.
// Array indices start at zero.
myArray[1] // = 45

// Arrays are mutable and of variable length.
myArray.push('World')
myArray.length // = 4

// Add/Modify at specific index
myArray[3] = 'Hello'

// JavaScript's objects are equivalent to 'dictionaries' or 'maps' in other
// languages: an unordered collection of key-value pairs.
const myObjA = { key1: 'Hello', key2: 'World' }

// Keys are strings, but quotes aren't required if they're a valid
// JavaScript identifier. Values can be any type.
const myObjB = { myKey: 'myValue', 'my other key': 'my other value' }

// Object attributes can also be accessed using the subscript syntax
myObjB['my other key'] // = 'my other value'

// ... or using the dot syntax, provided the key is a valid identifier.
myObjB.myKey // = 'myValue'

// You can use variables to access an object
const myKey = 'my other key'
myObjB[myKey] // = 'my other value'

// Objects are mutable values can be changed and new keys added.
myObjB.myThirdKey = true

// If you try to access a value that's not yet set, you'll get undefined.
myObjB.myFourthKey // = undefined


///////////////////////////////////
// 3. Functions, Scope and Closures

// JavaScript functions are declared with the `=>` keyword.
// if the function is only one expression, it will return automaticaly the
// result of this expression
const myFunctionA = (thing) => thing.toUpperCase()

myFunctionA('foo') // = 'FOO'

// if a function is multiline you need to wrap it's content between `{}`
const myFunctionB = () => {
  return {
    thisIsAn: 'object literal',
  }
}

myFunctionB().thisIsAn // = 'object literal'

// to return object literal directly you must wrap them in `()` so it's not
// parsed as the function `{}` body
const myFunctionC = () => ({
  thisIsStillAn: 'object literal',
})

myFunctionB().thisIsStillAn // = 'object literal'


// Note that the value to be returned must start on the same line as the
// `return` keyword, otherwise you'll always return `undefined` due to
// automatic semicolon insertion. Watch out for this when using Allman style.
const myFunctionC = () => {
  return // <- semicolon automatically inserted here
    { thisIsAn: 'object literal' }
}

myFunctionC() // = undefined

// if your function takes more than one they are separated by a comma `, `
const fromTo = (f, t) => `from ${f} to ${t} with love`

// if you only have one argument, `()` parens are optionnal
const add10 = x => x + 10

// you can specify default parameters like so
const myFunctionD = (x = 100) => 15 + x

myFunctionD(10) // = 30
myFunctionD() // = 115

// JavaScript functions are first class objects, so they can be reassigned to
// different variable names and passed to other functions as arguments - for
// example, when supplying an event handler:
const in5sec = () => {
  constole.log('this code will be called in 5 seconds')
}

setTimeout(in5sec, 5000)
// Note: setTimeout isn't part of the JS language, but is provided by browsers
// and Node.js.

// Another function provided by browsers is setInterval
const every5sec = () => {
  console.log('this code will be called every 5 seconds')
}

setInterval(every5sec, 5000)

// Function objects don't even have to be declared with a name - you can write
// an anonymous function definition directly into the arguments of another.
setTimeout(() =>
  console.log('this code will be called in 5 seconds')
}, 5000)

// One of JavaScript's most powerful features is closures. If a function is
// defined inside another function, the inner function has access to all the
// outer function's variables, even after the outer function exits.
const sayHelloInFiveSeconds = name => {
  const prompt = 'Hello, ' + name + '!'
  // Inner functions are put in the local scope by default, as if they were
  // declared with `var`.
  const inner = () => alert(prompt)

  setTimeout(inner, 5000)
  // setTimeout is asynchronous, so the sayHelloInFiveSeconds function will
  // exit immediately, and setTimeout will call inner afterwards. However,
  // because inner is 'closed over' sayHelloInFiveSeconds, inner still has
  // access to the `prompt` variable when it is finally called.
}
sayHelloInFiveSeconds('Adam') // will open a popup with 'Hello, Adam!' in 5s

///////////////////////////////////
// 4. Logic and Control Structures

// The `if` structure works as you'd expect.
const count = 1

if (count === 3) {
  // evaluated if count is 3
} else if (count === 4) {
  // evaluated if count is 4
} else {
  // evaluated if it's not either 3 or 4
}

// && is logical and, || is logical or
if (house.size === 'big' && house.colour === 'blue') {
  house.contains = 'bear'
}
if (colour === 'red' || colour === 'blue') {
  // colour is either red or blue
}

// && and || 'short circuit', which is useful for setting default values.
const name = otherName || 'default'

// The ternary operator allow for more compact and single expression if / else
const result =  true ? 'yes' : 'no' // = 'yes'

// For readabilty you can split long expression like so :
const longResult =  count < 3
  ? 'lower than 3'
  : 'greater or equal to 3'

// The `switch` statement checks for equality with `===`.
// Use 'break' after each case
// or the cases after the correct one will be executed too.
const grade = 'B'

switch (grade) {
  case 'A':
    console.log('Great job')
    break
  case 'B':
    console.log('OK job')
    break
  case 'C':
    console.log('You can do better')
    break
  default:
    console.log('Oy vey')
    break
}

// loops

// iterate over an array
let index = -1
const myArray = ['abcdefg', 'hijkl', 'mnop', 'qrst', 'uvw', 'xyz']

while (++index < myArray.length) {
  const letters = myArray[index]
  // use index / letters here
}

// you can also iterate over strings in the same way :
let index = -1
const myString = 'abcdefg'

while (++index < myString.length) {
  const character = myString[index]
  // use index / character here
}

// recursion is possible too
// list can be any numerical index based list like arrays and strings
const recursiveLoop = (list, index=0) => {
  // if the index is out of bounds the rest of the code is never called
  // because return always end the function
  if (index > list.length) return

  const elem = list[index]
  // use element here

  return recursiveLoop(list, index + 1)
}

recursiveLoop('exemple') // will start the loop


///////////////////////////////////
// 5. More about Objects

// Built-in types like strings and numbers have constructors that create
// equivalent wrapper objects.
const myNumber = 12
const myNumberObj = Number('12')

myNumber === myNumberObj // = true

// You can access a variable constructor like so :
myNumber.constructor === Number

// Since constructor are functions and functions are data you can use them
// in switch statements :
const getType = value => {
  switch (myNumber.constructor) {
    case Function: return 'function'
    case Number: return 'number'
    case String: return 'string'
    case Array: return 'array'
    case Object: // empty case will continue to the next
    case null: return 'object' // object can have no constructors
  }
}

getType(myNumber) === 'number'
getType('number') === 'string'

// declare functions
const isTrue = bool => {
  if (bool !== true) {
    throw Error("it's not true !!!")
  }
}
const sayHello = name => `Hello, my name is ${name}`

// declare an object with a method
const exempleHuman = {
  name: 'Stephano',
  greet: () => sayHello(exempleHuman.name),
}

// test some string equality
isTrue(sayHello('Jordy') === 'Hello, my name is Jordy')
isTrue(exempleHuman.greet() === 'Hello, my name is Stehpano')
// change the name !
exempleHuman.name = 'Bertrand'
isTrue(exempleHuman.greet() === 'Hello, my name is Bertrand')

// exports
module.exports.exempleHuman = exempleHuman
module.exports.sayHello = sayHello
// exports is an object that allow you to expose some value to the outside
// of a module in node.
// This allow you to split your code in multiple files.
// We do that to avoid getting lost in huge files and easly
// reuse the same code in multiple place


// a good practice is to always exports at the end
