# Coffee

It is a javascript testing framework.

## Installation

Run the following command in your shell.

``` sh
/bin/bash -c "$( curl -s https://raw.githubusercontent.com/nitinsharmacs/coffee/main/install.sh)"
```

> **After installation, restart your shell.**

## Command

``` sh
coffee [file filter]
```

`file filter` is the name of the file under test. Any number of file can be provided.

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

To use Coffee, the following convenstions should be followed :

  1. There is should be `test` directory where the coffee is being run.
  2. Files to be tested should start with test. Eg, `testAdd.js` etc.





