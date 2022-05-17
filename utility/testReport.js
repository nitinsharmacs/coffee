const formateReportRow = function ({ description, passed }) {
  const status = passed ? '\x1b[32m✔\x1b[0m' : '\x1b[31m✗\x1b[0m';
  return indent(status + ' - ' + description, 2);
};

const failingTestCases = ({ testResult }) => {
  return testResult.filter(testCase => !testCase.passed);
};

const failingTests = (tests) => {
  return tests.reduce((failing, test) => {
    const failingCases = failingTestCases(test);
    if (failingCases.length === 0) {
      return failing;
    }
    failing.push({ suite: test.suite, testResult: failingCases });
    return failing;
  }, []);
};

const indent = (text, indentBy) => {
  return ' '.repeat(indentBy).concat(text);
};

const formateExpected = ({ expected }) => {
  return indent('Expected : ' + expected, 2);
};

const formateActual = ({ actual }) => {
  return indent('Actual : ' + actual, 2);
};

const formateMessage = ({ message }) => {
  return indent(message, 2);
};

const failedSuiteReport = (suite) => {
  const { suite: suiteName, testResult } = suite;
  const report = [suiteName];
  testResult.forEach(result => {
    report.push(formateReportRow(result));
    report.push(formateExpected(result));
    report.push(formateActual(result));
    report.push(formateMessage(result));
  });
  return report;
};

const failedSuitesReport = (tests) => {
  if (tests.length === 0) {
    return [];
  }
  const report = ['\nFAILED TESTS\n'];
  tests.forEach(test => {
    report.push(...failedSuiteReport(test));
  });
  return report;
};

const suiteReport = (suite) => {
  const { suite: suiteName, testResult } = suite;
  const report = [suiteName];
  testResult.forEach(result => {
    report.push(formateReportRow(result));
  });
  return report;
};

const testReport = (tests) => {
  const report = [];
  tests.forEach(test => {
    report.push(...suiteReport(test));
  });
  report.push(...failedSuitesReport(failingTests(tests)));
  return report;
};

const displayReport = function (report) {
  console.log(report.join('\n'));
};

exports.testReport = testReport;
exports.displayReport = displayReport;
