const tester = require('../lib/tester')

tester(__filename, ({ describe, test, $, code }) => [
  describe('BONUS', $('arrow').map(def =>
    test(`function line ${def.loc.start.line} column ${
      def.loc.start.column} is a single expression`)
      .value(def.body.type)
      .notEqual('BlockStatement'))
  .concat([
    test('module.exports should be used only 4')
      .value(code.text.split('module.exports').length)
      .equal(5),
    test('no variable declaration')
      .value($('VariableDeclarator').length)
      .equal(0, 'Variables declaration count should be 0'),
  ])),
])
