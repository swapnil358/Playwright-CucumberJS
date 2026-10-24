
const logs = [];

const logger = {
  log(message) {
    logs.push(String(message));

    if (global.CONSOLE_LOG) {
      console.log(message);
    }
  },

  error(message) {
    logs.push(`ERROR: ${message}`);

    if (global.CONSOLE_LOG) {
      console.error(message);
    }
  },

  warn(message) {
    logs.push(`WARN: ${message}`);

    if (global.CONSOLE_LOG) {
      console.warn(message);
    }
  },

  success(message) {
    logs.push(String(message));

    if (global.CONSOLE_LOG) {
      console.log(`\x1b[32m${message}\x1b[0m`);
    }
  },

  getLogs() {
    return logs.join('\n');
  },

  clearLogs() {
    logs.length = 0;
  }
};

module.exports = logger;
