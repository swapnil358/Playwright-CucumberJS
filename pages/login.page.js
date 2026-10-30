class LoginPage {
    constructor(page) {
        this.page = page;

        // SauceDemo login form locators
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('[data-test="error"]');

        // Inventory page locator
        this.productsTitle = page.locator('.title');
    }

    async open() {
        const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';
        await browser.navigateTo(baseUrl);
    }

    async login(username, password) {
        await browser.fill(this.usernameInput, username);
        await browser.fill(this.passwordInput, password);
        await browser.click(this.loginButton);
    }

    async getErrorMessage() {
        return await browser.getText(this.errorMessage);
    }
}

module.exports = { LoginPage };