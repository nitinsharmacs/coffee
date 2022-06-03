const { createParser } = require('./createParser.js');

const { parseCombinedOption,
  parseNonCombinedOption,
  parseStandAloneOption } = require('./optionParsers.js');


const isCombinedOption = (text) => /^-[a-z][-+]?[a-z0-9]+$/.test(text);

const isNonCombinedOption = (text) => /^-[a-z]+$/.test(text);

const createOption = (name, value) => {
  const option = {};
  option[name] = value;
  return option;
};

const separateCombinedOption = (option) => {
  const optionName = option.substring(0, 2);
  const optionValue = option.substring(2);
  return createOption(optionName, optionValue);
};

const isNotOption = (text) => {
  return !(isCombinedOption(text) ||
    isNonCombinedOption(text));
};

const isStandAloneOption = (text) => {
  return ['-w'].includes(text);
};

const optionName = (option) => {
  const [name] = option.split('-').reverse();
  return name;
};

const optionKey = (option) => {
  const [key] = Object.keys(option);
  return key;
};

const isValidOption = (option) => {
  const validOptions = ['-w'];
  return validOptions.includes(optionKey(option));
};

const validateOption = (option) => {
  if (isValidOption(option)) {
    return option;
  }

  const name = optionName(optionKey(option));
  throw {
    code: 'INVALID_OPTION',
    message: `illegal option -- ${name}`
  }
};

const parserConfig = {
  optionParsers: [
    {
      parser: parseStandAloneOption,
      predicate: isStandAloneOption
    },
    {
      parser: parseCombinedOption,
      predicate: isCombinedOption,
      separator: separateCombinedOption
    },
    {
      parser: parseNonCombinedOption,
      predicate: isNonCombinedOption
    },
  ],
  notOption: {
    predicate: isNotOption
  },
  validator: validateOption
};

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
