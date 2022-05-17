const { strictEqual } = require('assert');
suite(
  'add',
  makeTest('should add two numbers', () => {
    strictEqual(3 + 2, 5);
  })
);
