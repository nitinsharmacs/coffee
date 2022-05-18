#! /usr/bin/env node

const { PWD, COFFEE_REPORTERS } = process.env;

const { readdirSync } = require('fs');
const {
  displayReport,
  testReport
} = require(COFFEE_REPORTERS + '/reporter.js');


const tests = [];

makeTest = function (description, testFunction) {
  return this.testCases.push({ description, testFunction });
};

suite = function (suiteName, itRunner) {
  return function () {
    it = makeTest.bind(this);
    itRunner();
    tests.push(this);
  }.call({ suite: suiteName, testCases: [] });
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

const isTestFile = (fileName) => {
  return fileName.startsWith('test') && fileName.endsWith('.js');
};

const getTestFiles = (path) => {
  return readdirSync(path).filter(isTestFile);
};

const requireTestFiles = (testDir, fileNames) => {
  fileNames.forEach(fileName => {
    require(PWD + '/' + testDir + '/' + fileName);
  });
};

const filterFiles = (testFiles, suites) => {
  if (suites.length === 0) {
    return testFiles;
  }
  return testFiles.filter(fileName => suites.includes(fileName));
};

const main = (testDir) => {
  const [, , ...suites] = process.argv;
  const testFiles = getTestFiles(testDir);
  const filteredFiles = filterFiles(testFiles, suites);
  requireTestFiles(testDir, filteredFiles);
  const testResults = runTests();
  displayReport(testReport(testResults));
};

main('test');
