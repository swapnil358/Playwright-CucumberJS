
const { AllureRuntime } = require('allure-js-commons');
const { CucumberJSAllureFormatter } = require('allure-cucumberjs');

module.exports = class extends CucumberJSAllureFormatter {
  constructor(options) {
    const runtime = new AllureRuntime({
      resultsDir: './allure-results'
    });

    super(options, runtime, options.parsedArgvOptions);
  }
};
