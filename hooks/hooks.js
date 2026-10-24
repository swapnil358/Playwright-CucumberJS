
const {
  Before,
  After,
  BeforeStep,
  AfterStep,
  Status,
  setDefaultTimeout
} = require('@cucumber/cucumber');

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { Assert } = require('../utils/assert');
const logger = require('../utils/LoggerUtil');


global.CONSOLE_LOG = true;

global.assert = new Assert();

setDefaultTimeout(30000);

Before(async function (scenario) {
  logger.log(`Starting scenario: ${scenario.pickle.name}`);

  this.browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false'
  });

  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  assert.setPage(this.page);
  assert.resetSoftAssertions();

  logger.log('Browser, context and page created');
});

BeforeStep(function ({ pickleStep }) {
  logger.success(`Starting step: ${pickleStep.text}`);
});

AfterStep(function ({ pickleStep, result }) {
  if (result.status === Status.PASSED) {
    logger.log(`Step passed: ${pickleStep.text}`);
  } else if (result.status === Status.FAILED) {
    logger.error(`Step failed: ${pickleStep.text}`);

    if (result.message) {
      logger.error(result.message);
    }
  } else {
    logger.warn(`Step status: ${result.status} - ${pickleStep.text}`);
  }
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    logger.error(`Scenario failed: ${scenario.pickle.name}`);

    if (this.page) {
      const screenshotDir = path.join(process.cwd(), 'screenshots');
      fs.mkdirSync(screenshotDir, { recursive: true });

      const screenshotPath = path.join(
        screenshotDir,
        `failure-${Date.now()}.png`
      );

      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      await this.attach(
        fs.readFileSync(screenshotPath),
        'image/png'
      );

      logger.log(`Failure screenshot saved: ${screenshotPath}`);
    }
  } else {
    logger.log(
      `Scenario completed: ${scenario.pickle.name} - ${scenario.result?.status}`
    );
  }

  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();

  logger.log('Browser resources closed');
});
