
const {
  Before,
  After,
  BeforeStep,
  AfterStep,
  AfterAll,
  Status,
  setDefaultTimeout
} = require('@cucumber/cucumber');

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

// Before scenario
Before(async function (scenario) {
  logger.clearLogs();

  this.scenarioName = scenario.pickle.name;
  logger.log(`Starting scenario: ${this.scenarioName}`);

  this.browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false'
  });

  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  global.browser = new Browser(this.page);
  assert.setPage(this.page);
  assert.resetSoftAssertions();

  logger.log('Browser, context and page created');
});

// Before step
BeforeStep(function ({ pickleStep }) {
  logger.success(`Starting step: ${pickleStep.text}`);
});

// After step
AfterStep(async function ({ pickleStep, result }) {
  if (result.status === Status.PASSED) {
    logger.log(`Step passed: ${pickleStep.text}`);
  }

  if (result.status === Status.FAILED) {
    logger.error(`Step failed: ${pickleStep.text}`);

    if (result.message) {
      logger.error(result.message);
    }

    if (this.page) {
      const screenshot = await this.page.screenshot({
        fullPage: true
      });

      await this.attach(screenshot, {
        mediaType: 'image/png',
        fileName: 'failure-screenshot.png'
      });

      const screenshotDir = path.join(
        process.cwd(),
        'screenshots'
      );

      fs.mkdirSync(screenshotDir, { recursive: true });

      const screenshotPath = path.join(
        screenshotDir,
        `failure-${Date.now()}.png`
      );

      fs.writeFileSync(screenshotPath, screenshot);

      logger.log(`Screenshot saved: ${screenshotPath}`);
    }

    await this.attach(logger.getLogs(), {
      mediaType: 'text/plain',
      fileName: 'execution-logs.txt'
    });
  }
});

// After scenario
After(async function (scenario) {
  logger.log(
    `Scenario: ${scenario.pickle.name} - ${scenario.result?.status}`
  );

  if (this.context) {
    await this.context.close();
  }

  if (this.browser) {
    await this.browser.close();
  }

  logger.log('Browser resources closed');
});

// Add author and Jira mapping after all scenarios
AfterAll(function () {
  addAllureMapping();
});
