#! /usr/bin/env node

const fs = require('fs');
const { EventEmitter } = require('events');

const { PWD, COFFEE } = process.env;
const {
  displayReport,
  testReport
} = require(`${COFFEE}/reporters/reporter.js`);
const { coffeeArgsParser } = require(`${COFFEE}/utils/argsParser.js`);


let TESTS = [];

makeTest = function (description, testFunction) {
  return this.testCases.push({ description, testFunction });
};

suite = function (suiteName, itRunner) {
  return function () {
    it = makeTest.bind(this);
    itRunner();
    TESTS.push(this);
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
  return TESTS.map(test => {
    return runTest(test);
  });
};

const isTestFile = (fileName) => {
  return fileName.startsWith('test') && fileName.endsWith('.js');
};

const getTestFiles = (path) => {
  return fs.readdirSync(path).filter(isTestFile);
};

const clearRequireCache = (path) => {
  delete require.cache[path];
};

const isTestFilePath = (path) => {
  const testFileRule = /.*\/test.*\.js$/;
  return testFileRule.test(path);
};

const testFilePaths = () => {
  const cachesPaths = Object.keys(require.cache);
  return cachesPaths.filter(path => isTestFilePath(path));
};

const clearTestFileCaches = () => {
  const paths = testFilePaths();
  paths.forEach(path => clearRequireCache(path));
};

const clearTestsEnv = () => {
  TESTS = [];
  clearTestFileCaches();
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

const coffee = (testDir, suites) => {
  const testFiles = getTestFiles(testDir);
  const filteredFiles = filterFiles(testFiles, suites);

  requireTestFiles(testDir, filteredFiles);

  const testResults = runTests();
  displayReport(testReport(testResults));
}

const printWaitingMessage = () => {
  console.log('\nCoffee waiting for changes ...\n');
};

const startWatcher = (target, eventEmitter) => {
  let fileStat = { mtimeMs: 0 };

  fs.watch(target, 'utf8', (eventType, filename) => {
    const stat = fs.statSync(`${target}/${filename}`);

    if (fileStat.mtimeMs < stat.mtimeMs) {
      clearTestsEnv();
      eventEmitter.emit(eventType);
      fileStat = stat;
      printWaitingMessage();
    }
  });
};

const main = (args) => {
  const { suites, options } = coffeeArgsParser(args.slice(2));

  const eventEmitter = new EventEmitter();
  eventEmitter.on('change', () => coffee('test', suites));

  if (!options.watch) {
    eventEmitter.emit('change');
    return;
  }

  eventEmitter.emit('change');
  printWaitingMessage();

  startWatcher('./test', eventEmitter);
};

main(process.argv);
