
module.exports = {
  default: {
    format: [
      'summary',
      'html:reports/cucumber-report.html',
      'allure-cucumberjs/reporter'
    ],

    formatOptions: {
      resultsDir: 'allure-results'
    },

    require: [
      'hooks/**/*.js',
      'stepDef/**/*.js'
    ],

    // Run with: cross-env TAG="@smoke" cucumber-js
    // tags: process.env.TAG || '@smoke',

    retry: process.env.RETRY
      ? Number(process.env.RETRY)
      : 0,

    // Keep sequential execution while troubleshooting Allure
    parallel: 10,

    paths: [
      'features.js/support/**/*.feature'
    ]
  }
};
