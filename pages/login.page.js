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
    await this.page.goto(baseUrl);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return (await this.errorMessage.textContent())?.trim();
  }
}

module.exports = { LoginPage };
