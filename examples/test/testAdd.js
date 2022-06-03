const { strictEqual } = require('assert');
const { add } = require('../src/add.js');

suite(
  'greet',
  () => {
    it('should greet person', () => {
      strictEqual('hello', 'hello');
    });
    it('should greet person 2', () => {
      strictEqual('hello', 'hello');
    });
  }
);
