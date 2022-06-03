const createArgsIterator = (args) => {
  let index = 0;
  const nextArg = function () {
    index++;
    return args[index];
  };
  const currentArg = function () {
    return args[index];
  };
  const hasMoreArgs = function () {
    return args.length > index;
  };
  const restArgs = function () {
    return args.slice(index);
  };
  return {
    nextArg,
    currentArg,
    hasMoreArgs,
    restArgs
  };
};

const parseOption = (argsIterator, config) => {
  const { optionParsers } = config;
  const text = argsIterator.currentArg();
  for (const optionParser of optionParsers) {
    if (optionParser.predicate(text)) {
      return optionParser.parser(argsIterator);
    }
  }
};

const parseOptions = (argsIterator, config) => {
  const { validator, notOption } = config;
  let options = {};
  while (argsIterator.hasMoreArgs()) {
    const text = argsIterator.currentArg();
    if (notOption.predicate(text)) {
      return options;
    }
    options = {
      ...options,
      ...validator(parseOption(argsIterator, config), options)
    };
  }
  return options;
};

const parseArgs = function (args) {
  const argsIterator = createArgsIterator(args);
  const options = parseOptions(argsIterator, this.config);
  return {
    filenames: argsIterator.restArgs(),
    options: options
  };
};

const createParser = (config) => {
  return parseArgs.bind({ config });
};

exports.createArgsIterator = createArgsIterator;
exports.parseOption = parseOption;
exports.parseOptions = parseOptions;
exports.parseArgs = parseArgs;
exports.createParser = createParser;
