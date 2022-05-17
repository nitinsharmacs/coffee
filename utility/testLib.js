const tests = [];

const suite = function (suiteName, ...testCases) {
  this.push({ suite: suiteName, testCases });
};

const makeTest = (description, testFunction) => {
  return { description, testFunction };
};

const runTestCase = function ({ testFunction, description }) {
  const testResult = { description, passed: true };
  try {
    testFunction();
  } catch (error) {
    return {
      ...testResult,
      expected: error.expected,
      actual: error.actual,
      passed: false,
      message: error.message
    };
  }
  return testResult;
};

const runTest = ({ suite, testCases }) => {
  const testResult = testCases.map(runTestCase);
  return { suite, testResult };
};

const runTests = () => {
  return tests.map(test => {
    return runTest(test);
  });
};

exports.makeTest = makeTest;
exports.suite = suite.bind(tests);
exports.runTests = runTests;
