
const logger = {
  log(message) {
    if (global.CONSOLE_LOG) {
      console.log(message);
    }
  },

  error(message) {
    if (global.CONSOLE_LOG) {
      console.error(message);
    }
  },

  warn(message) {
    if (global.CONSOLE_LOG) {
      console.warn(message);
    }
  },

  success(message) {
    if (global.CONSOLE_LOG) {
      console.log(`\x1b[32m${message}\x1b[0m`);
    }
  }
};

module.exports = logger;
