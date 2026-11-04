
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

// ==================== HARD ASSERTIONS (5 PASS) ====================

Then('I should see the products page', async function () {

    logger.log('Starting products page hard assertions');

    // 1. Verify URL
    await assert.assertUrlContains('/inventory.html');

    // 2. Verify page title
    await assert.assertPageTitle('Swag Labs');

    // 3. Verify products heading
    await assert.assertElementTextEquals( this.loginPage.productsTitle, 'Products' );

    // 4. Verify products heading is visible
    await assert.assertElementIsVisible( this.loginPage.productsTitle );

    // 5. Verify products heading contains expected text
    await assert.assertElementContainsText( this.loginPage.productsTitle, 'Products' );

    logger.log('All 5 hard assertions completed successfully');
});

// ==================== SOFT ASSERTIONS ====================

Then('I should see a login error', async function () {

    logger.log('Verifying the login error is visible');

    await assert.softAssertElementIsVisible( this.loginPage.errorMessage, 'Login error visibility verification' );

    logger.log('Verifying the login error message');

    await assert.softAssertElementTextEquals( this.loginPage.errorMessage, 'Username and password do not match any user in this service', 'Login error message verification' );

    logger.log('Login error verification completed');
});

// ==================== CHECK SOFT ASSERTIONS ====================

Then('I check for all soft assertion failures', function () {
    assert.assertAll();
});
