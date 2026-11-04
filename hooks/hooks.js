const { Before, After, BeforeStep, AfterStep, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { Assert } = require('../utils/assert');
const logger = require('../utils/LoggerUtil');
const { addAllureMapping } = require('../utils/allureMapping');
const { Browser } = require('../utils/Browser');

global.CONSOLE_LOG = true;
global.assert = new Assert();

setDefaultTimeout(30000);

// ==================== BEFORE SCENARIO ====================

Before(async function (scenario) {
  logger.clearLogs();

  this.scenarioName = scenario.pickle.name;

  logger.log(`Starting scenario: ${this.scenarioName}`);

  // Launch Playwright browser
  this.browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });

  // Create browser context and page
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  // Initialise global browser utility
  global.browser = new Browser(this.page);

  // Initialise global assertion utility
  assert.setPage(this.page);
  assert.resetSoftAssertions();

  logger.log('Browser, context and page created');
});

// ==================== BEFORE STEP ====================

BeforeStep(function ({ pickleStep }) {

  // Automatically capture current Cucumber step
  assert.setCurrentStep(pickleStep.text);

  logger.success(`Starting step: ${pickleStep.text}`);
});

// ==================== AFTER STEP ====================

AfterStep(async function ({ pickleStep, result }) {
    if (result.status === Status.FAILED) {
        logger.error(`Step failed: ${pickleStep.text}`);

        if (this.page) {
            const screenshot = await this.page.screenshot({ fullPage: true });

            await this.attach(screenshot, {
                mediaType: 'image/png',
                fileName: 'failure-screenshot.png'
            });
        }

        await this.attach(logger.getLogs(), {
            mediaType: 'text/plain',
            fileName: 'execution-logs.txt'
        });
    }
});

// ==================== AFTER SCENARIO ====================

After(async function (scenario) {

  logger.log( `Scenario: ${scenario.pickle.name} - ${scenario.result?.status}` );
  try {
    if (this.context) {
      await this.context.close();
    }

    if (this.browser) {
      await this.browser.close();
    }
  } finally {
    logger.log('Browser resources closed');
  }
});

// ==================== AFTER ALL ====================

AfterAll(function () {
  addAllureMapping();
});
