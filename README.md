# Coffee

It is a javascript testing framework.

## Installation

Run the following command in your shell.

``` sh
/bin/bash -c "$( curl -s https://raw.githubusercontent.com/nitinsharmacs/coffee/main/install.sh )"
```

> **After installation, restart your shell.**

## Command

``` sh
coffee [file/s]
```
If no file provided, `coffee` would run all the files falling under convention in `test` directory.
If any file is provided, `coffee` runs only that file.

For instance,

```
test
  - testAdd.js
  - testLengthOf.js
```

``` sh
coffee # it would run all the files
coffee testAdd.js # only runs testAdd.js
coffee testAdd.js testLengthOf.js # runs both files
```

## Conventions

To use Coffee, the following conventions should be followed :

  1. There should be `test` directory where the coffee has to run.
  2. Files to be tested should start with test. Eg, `testAdd.js` etc.


## Test file

``` js
const { strictEqual } = require('assert');

suite(
  'add',
  makeTest('should add two numbers', () => {
    strictEqual(3 + 2, 3);
  }),
  makeTest('should add positve and negative numbers', () => {
    strictEqual(-3 + 2, -1);
  })
);
```
`makeTest` is creates a test case for the suite `add`.

> Please look `examples` given in the repository.

