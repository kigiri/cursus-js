const tester = require('../lib/tester')

tester(__filename, ({ describe, test, $ }) => [
  describe('BONUS', $('arrow').map(def =>
    test(`function line ${def.loc.start.line} column ${
      def.loc.start.column} is a single expression`)
      .value(def.body.type)
      .notEqual('BlockStatement')))
  .concat([
    test('no variable declaration')
      .value($('VariableDeclarator').length)
      .equal(0, 'Variables declaration count should be 0'),
  ]),
])
