
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('playwright/test');
const { LoginPage } = require('../pages/login.page');

Given('I open the login page', async function () {
  console.log('Step: this.page exists =', !!this.page);

  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open();
});

When(
  'I login with username {string} and password {string}',
  async function (username, password) {
    await this.loginPage.login(username, password);
  }
);

Then('I should see the products page', async function () {
  await expect(this.page).toHaveURL(/inventory\.html/);

  await expect(
    this.page.getByText('Products', { exact: true })
  ).toBeVisible();
});

Then('I should see a login error', async function () {
  await expect(this.loginPage.errorMessage).toBeVisible();

  await expect(this.loginPage.errorMessage)
    .toContainText('Username and password do not match');
});
