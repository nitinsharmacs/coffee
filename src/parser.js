const { createParser } = require('./utils/createParser.js');
const { parserConfig } = require('./parserConfig.js');

const compileWOption = (compiledOptions) => {
  return {
    ...compiledOptions,
    watch: true
  };
};

const hasKey = (obj, key) => {
  const keys = Object.keys(obj);
  return keys.includes(key);
};

const compileOptions = (options) => {
  let compiledOptions = {
    watch: false
  };
  const availableOptions = [
    {
      name: '-w',
      compiler: compileWOption
    }
  ];

  for (const option of availableOptions) {
    if (hasKey(options, option.name)) {
      compiledOptions = option.compiler(compiledOptions, options);
    }
  }
  return compiledOptions;
};

const coffeeArgsParser = (args) => {
  const parser = createParser(parserConfig);
  const { filenames: suites, options } = parser(args);
  return {
    suites,
    options: compileOptions(options)
  };
};

exports.coffeeArgsParser = coffeeArgsParser;
