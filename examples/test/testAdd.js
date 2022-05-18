const { strictEqual } = require('assert');
const { add } = require('../src/add.js');

suite(
  'add',
  makeTest('should add two numbers', () => {
    strictEqual(add(2, 3), 5);
  }),
  makeTest('should add a positve and negative numbers', () => {
    strictEqual(add(2, -3), -1);
  })
);
