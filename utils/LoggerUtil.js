const logs = [];

const logger = {
  log(message) {
    const formattedMessage = `***** ${message}`;
    logs.push(formattedMessage);

    if (global.CONSOLE_LOG) {
      console.log(formattedMessage);
    }
  },

  error(message) {
    const formattedMessage = `${message}`;
    logs.push(formattedMessage);

    if (global.CONSOLE_LOG) {
      console.error(formattedMessage);
    }
  },

  warn(message) {
    const formattedMessage = `${message}`;
    logs.push(formattedMessage);

    if (global.CONSOLE_LOG) {
      console.warn(formattedMessage);
    }
  },

  success(message) {
    const formattedMessage = `${message}`;
    logs.push(formattedMessage);

    if (global.CONSOLE_LOG) {
      console.log(formattedMessage);
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