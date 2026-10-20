
const {
  Before,
  After,
  Status,
  setDefaultTimeout
} = require('@cucumber/cucumber');

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

setDefaultTimeout(30000);

Before(async function () {
  this.browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false'
  });

  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

   console.log('Before hook: page created =', !!this.page);
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
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
  }

  if (this.context) await this.context.close();
  if (this.browser) await this.browser.close();
});
