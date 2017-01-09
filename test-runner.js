const { describe, test } = require('./mixtape')

describe('lol', [
  describe('mdr', [
    test('synchronous 5')
      .call(() => 5)
      .equal(5)
      .notEqual(10)
      .equal(undefined)
    ,
    test('Asynchronous 5')
      .call(() => new Promise(s => setTimeout(() => s(5), 2)))
      .equal(5)
      .notEqual(undefined)
    ,
  ])
])()