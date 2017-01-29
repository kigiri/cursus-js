const tester = require('../lib/tester')

tester(__filename, ({ describe, test, $ }) => [
  describe('BONUS', [
    test('while is not used')
      .value($('WhileStatement').length)
      .equal(0, 'Use recursion instead of while loops'),
  ].concat($('arrow').map(def =>
    test(`function line ${def.loc.start.line} column ${
      def.loc.start.column} is a single expression`)
      .value(def.body.type)
      .notEqual('BlockStatement')))),
])
