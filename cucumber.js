
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
    tags: process.env.TAG || '@e2e',

    retry: process.env.RETRY
      ? Number(process.env.RETRY)
      : 0,

    // Keep sequential execution while troubleshooting Allure
    parallel: process.env.PARALLEL
    ? Number(process.env.PARALLEL)
    : 1,

    paths: [
      'features.js/support/**/*.feature'
    ]
  }
};
