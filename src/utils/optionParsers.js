const createOption = (name, value) => {
  const option = {};
  option[name] = value;
  return option;
};

const parseNumericOption = function (argsIterator) {
  const { optionName, separator } = this;
  const text = argsIterator.currentArg();
  argsIterator.nextArg();
  return createOption(optionName, separator(text));
};

const parseCombinedOption = function (argsIterator) {
  const { separator } = this;
  const text = argsIterator.currentArg();
  argsIterator.nextArg();
  return separator(text);
};

const parseStandAloneOption = function (argsIterator) {
  const text = argsIterator.currentArg();
  argsIterator.nextArg();
  return createOption(text, 'true');
};

const parseNonCombinedOption = function (argsIterator) {
  const text = argsIterator.currentArg();
  const option = createOption(text, argsIterator.nextArg());
  argsIterator.nextArg();
  return option;
};

exports.parseCombinedOption = parseCombinedOption;
exports.parseNonCombinedOption = parseNonCombinedOption;
exports.parseNumericOption = parseNumericOption;
exports.parseStandAloneOption = parseStandAloneOption;
