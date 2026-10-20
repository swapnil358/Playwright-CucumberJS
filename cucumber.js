
module.exports = {
  default: {
    paths: ['features.js/**/*.feature'],

    require: [
      'hooks/**/*.js',
      'stepDef/**/*.js'
    ],

    format: [
      'progress',
      'html:reports/cucumber-report.html'
    ],

    publishQuiet: true
  }
};
