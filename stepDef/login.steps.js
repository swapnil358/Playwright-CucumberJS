
const { Given, When, Then } = require('@cucumber/cucumber');
const { LoginPage } = require('../pages/login.page');
const logger = require('../utils/LoggerUtil');

Given('I open the login page', async function () {
  logger.log('Opening the login page');

  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open();

  logger.log('Login page opened successfully');
});

When(
  'I login with username {string} and password {string}',
  async function (username, password) {
    logger.log(`Logging in with username: ${username}`);

    await this.loginPage.login(username, password);

    logger.log('Login action completed');
  }
);

Then('I should see the products page', async function () {
  logger.log('Verifying the products page URL');

  await assert.assertUrlContains('/inventory.html');

  logger.log('Verifying the products page title');

  await assert.assertElementTextEquals(
    this.loginPage.productsTitle,
    'Products'
  );

  logger.log('Products page verification completed');
});

Then('I should see a login error', async function () {
  logger.log('Verifying the login error is visible');

  await assert.assertElementIsVisible(
    this.loginPage.errorMessage
  );

  logger.log('Verifying the login error message');

  await assert.assertElementContainsText(
    this.loginPage.errorMessage,
    'Username and password do not match any user in this service'
  );

  logger.log('Login error verification completed');
});
