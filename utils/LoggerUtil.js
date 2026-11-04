
const logs = [];

const COLORS = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

const logger = {

    // Normal logging
    log(message) {
        const formattedMessage = `***** ${message}`;
        logs.push(formattedMessage);

        if (global.CONSOLE_LOG) {
            console.log(formattedMessage);
        }
    },

    // Error logging - entire message in red
    error(message) {
        const formattedMessage = `***** ${message}`;
        logs.push(formattedMessage);

        if (global.CONSOLE_LOG) {
            console.error(`${COLORS.red}${formattedMessage}${COLORS.reset}`);
        }
    },

    // Warning logging - entire message in yellow
    warn(message) {
        const formattedMessage = `***** ${message}`;
        logs.push(formattedMessage);

        if (global.CONSOLE_LOG) {
            console.warn(`${COLORS.yellow}${formattedMessage}${COLORS.reset}`);
        }
    },

    // Success logging - entire message in green
    success(message) {
        const formattedMessage = `${message}`;
        logs.push(formattedMessage);

        if (global.CONSOLE_LOG) {
            console.log(`${COLORS.green}${formattedMessage}${COLORS.reset}`);
        }
    },

    // Passed assertion - only tick in green
    pass(message) {
        const formattedMessage = `***** ${message}`;
        logs.push(formattedMessage);

        if (global.CONSOLE_LOG) {
            const output = formattedMessage.replace(
                '✓',
                `${COLORS.green}✓${COLORS.reset}`
            );

            console.log(output);
        }
    },

    // Failed assertion - only cross in red
    fail(message) {
        const formattedMessage = `${message}`;
        logs.push(formattedMessage);

        if (global.CONSOLE_LOG) {
            const output = formattedMessage.replace(
                '✗',
                `${COLORS.red}✗${COLORS.reset}`
            );

            console.log(output);
        }
    },

    // Retrieve execution logs
    getLogs() {
        return logs.join('\n');
    },

    // Clear execution logs
    clearLogs() {
        logs.length = 0;
    }
};

module.exports = logger;
