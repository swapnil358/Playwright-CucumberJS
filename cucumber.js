
module.exports = {
  default: {
    format: [
      'summary',
      'html:reports/cucumber-report.html'
    ],
    require: [
      'hooks/**/*.js',
      'stepDef/**/*.js'
    ],
    // tags: process.env.TAG || '@smoke',
    retry: process.env.RETRY
      ? Number(process.env.RETRY)
      : 0,
    parallel: 1,
    paths: ['features.js/support/**/*.feature'],
  }
};
