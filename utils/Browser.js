class Browser {
    constructor(page) {
        this.page = page;
    }

    async navigateTo(url) {
        await this.page.goto(url);
    }

    async click(locator) {
        await locator.click();
    }

    async fill(locator, value) {
        await locator.fill(value);
    }

    async clear(locator) {
        await locator.clear();
    }

    async type(locator, value) {
        await locator.pressSequentially(value);
    }

    async waitForElementVisible(locator, timeout = 10000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async waitForElementHidden(locator, timeout = 10000) {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    async waitForElementToBeClickableAndClick(locator, timeout = 10000) {
        await locator.waitFor({ state: 'visible', timeout });
        await locator.click({ timeout });
    }

    async isVisible(locator) {
        return await locator.isVisible();
    }

    async isEnabled(locator) {
        return await locator.isEnabled();
    }

    async getText(locator) {
        return (await locator.innerText()).trim();
    }

    async getInputValue(locator) {
        return await locator.inputValue();
    }

    async getAttribute(locator, attribute) {
        return await locator.getAttribute(attribute);
    }

    async selectDropdown(locator, value) {
        await locator.selectOption(value);
    }

    async check(locator) {
        await locator.check();
    }

    async uncheck(locator) {
        await locator.uncheck();
    }

    async hover(locator) {
        await locator.hover();
    }

    async press(locator, key) {
        await locator.press(key);
    }

    async scrollIntoView(locator) {
        await locator.scrollIntoViewIfNeeded();
    }

    async waitForURL(url, timeout = 10000) {
        await this.page.waitForURL(url, { timeout });
    }

    async getCurrentURL() {
        return this.page.url();
    }

    async getPageTitle() {
        return await this.page.title();
    }

    async getElementCount(locator) {
        return await locator.count();
    }

    async takeScreenshot(filePath) {
        await this.page.screenshot({
            path: filePath,
            fullPage: true
        });
    }
}

module.exports = { Browser };