
'use strict';

const { expect } = require('chai');
const logger = require('./LoggerUtil');

class Assert {
  constructor() {
    this.page = null;
    this.softFailures = [];
  }

  // ==================== LOGGING HELPERS ====================

  logPassed(message, expected, actual) {
    logger.log(
      `\x1b[32m✓\x1b[0m ${message} : Expected: ${expected} | Actual: ${actual} | Result: PASSED`
    );
  }

  logFailed(message, expected, actual, error) {
    logger.log(
      `\x1b[31m✗\x1b[0m ${message} : Expected: ${expected} | Actual: ${actual} | Result: FAILED`
    );

    if (error && error.message) {
      logger.log(`  Error: ${error.message}`);
    }
  }

  // Run assertion, log result and preserve original failures
  runAssertion(message, expected, getActual, assertion) {
    let actual;

    try {
      actual = getActual();

      const result = assertion(actual);

      if (result && typeof result.then === 'function') {
        return result
          .then(value => {
            this.logPassed(message, expected, actual);
            return value;
          })
          .catch(error => {
            this.logFailed(message, expected, actual, error);
            throw error;
          });
      }

      this.logPassed(message, expected, actual);
      return result;
    } catch (error) {
      this.logFailed(message, expected, actual, error);
      throw error;
    }
  }

  // ==================== PAGE SETUP ====================

  setPage(page) {
    this.page = page;
  }

  resetSoftAssertions() {
    this.softFailures = [];
  }

  // ==================== HARD ASSERTIONS ====================

  assertUrlContains(expected, message = 'URL contains expected text') {
    return this.runAssertion(
      message,
      expected,
      () => this.page.url(),
      actual => expect(actual, message).to.include(expected)
    );
  }

  assertUrlEquals(expected, message = 'URL matches expected value') {
    return this.runAssertion(
      message,
      expected,
      () => this.page.url(),
      actual => expect(actual, message).to.equal(expected)
    );
  }

  assertPageTitle(expected, message = 'Page title matches expected value') {
    return this.runAssertion(
      message,
      expected,
      () => this.page.title(),
      async actual => expect(await actual, message).to.equal(expected)
    );
  }

  assertEqual(actual, expected, message = 'Values are equal') {
    return this.runAssertion(
      message, expected, () => actual,
      value => expect(value, message).to.equal(expected)
    );
  }

  assertNotEqual(actual, expected, message = 'Values are not equal') {
    return this.runAssertion(
      message, expected, () => actual,
      value => expect(value, message).to.not.equal(expected)
    );
  }

  assertTrue(value, message = 'Value is true') {
    return this.runAssertion(
      message, true, () => value,
      actual => expect(actual, message).to.equal(true)
    );
  }

  assertFalse(value, message = 'Value is false') {
    return this.runAssertion(
      message, false, () => value,
      actual => expect(actual, message).to.equal(false)
    );
  }

  assertNull(value, message = 'Value is null') {
    return this.runAssertion(
      message, null, () => value,
      actual => expect(actual, message).to.equal(null)
    );
  }

  assertContainsText(actual, expected, message = 'Text contains expected value') {
    return this.runAssertion(
      message, expected, () => actual,
      value => expect(value, message).to.include(expected)
    );
  }

  assertDoesNotContainText(
    actual, expected, message = 'Text excludes unexpected value'
  ) {
    return this.runAssertion(
      message, `Not containing ${expected}`, () => actual,
      value => expect(value, message).to.not.include(expected)
    );
  }

  assertEqualIgnoreCase(actual, expected, message = 'Values match ignoring case') {
    return this.runAssertion(
      message, expected, () => actual,
      value => expect(value.toLowerCase(), message)
        .to.equal(expected.toLowerCase())
    );
  }

  assertEqualIgnoreCaseAndWhitespace(
    actual, expected, message = 'Values match ignoring case and whitespace'
  ) {
    return this.runAssertion(
      message, expected, () => actual,
      value => {
        const normalizedActual = value.trim().replace(/\s+/g, ' ').toLowerCase();
        const normalizedExpected = expected.trim().replace(/\s+/g, ' ').toLowerCase();

        expect(normalizedActual, message).to.equal(normalizedExpected);
      }
    );
  }

  assertArrayEquals(actual, expected, message = 'Arrays are equal') {
    return this.runAssertion(
      message, JSON.stringify(expected), () => actual,
      value => expect(value, message).to.deep.equal(expected)
    );
  }

  assertArrayIncludes(actual, expected, message = 'Array includes expected value') {
    return this.runAssertion(
      message, expected, () => actual,
      value => expect(value, message).to.include(expected)
    );
  }

  assertArrayNotIncludes(actual, expected, message = 'Array excludes unexpected value') {
    return this.runAssertion(
      message, expected, () => actual,
      value => expect(value, message).to.not.include(expected)
    );
  }

  assertNormalizedJsonEqual(actual, expected, message = 'JSON values are equal') {
    return this.runAssertion(
      message, JSON.stringify(expected), () => actual,
      value => {
        const actualJson = typeof value === 'string' ? JSON.parse(value) : value;
        const expectedJson = typeof expected === 'string' ? JSON.parse(expected) : expected;

        expect(actualJson, message).to.deep.equal(expectedJson);
      }
    );
  }

  // ==================== PLAYWRIGHT ASSERTIONS ====================

  async assertElementTextEquals(locator, expected, message = 'Element text matches') {
    let actual;

    try {
      actual = (await locator.textContent()) || '';
      expect(actual.trim(), message).to.equal(expected);
      this.logPassed(message, expected, actual.trim());
    } catch (error) {
      this.logFailed(message, expected, actual, error);
      throw error;
    }
  }

  async assertElementTextEqualsIgnoreCase(
    locator, expected, message = 'Element text matches ignoring case'
  ) {
    let actual;

    try {
      actual = (await locator.textContent()) || '';
      expect(actual.trim().toLowerCase(), message)
        .to.equal(expected.trim().toLowerCase());

      this.logPassed(message, expected, actual.trim());
    } catch (error) {
      this.logFailed(message, expected, actual, error);
      throw error;
    }
  }

  async assertElementContainsText(
    locator, expected, message = 'Element contains expected text'
  ) {
    let actual;

    try {
      actual = (await locator.textContent()) || '';
      expect(actual, message).to.include(expected);
      this.logPassed(message, expected, actual);
    } catch (error) {
      this.logFailed(message, expected, actual, error);
      throw error;
    }
  }

  async assertElementIsVisible(locator, message = 'Element is visible') {
    let actual;

    try {
      actual = await locator.isVisible();
      expect(actual, message).to.equal(true);
      this.logPassed(message, true, actual);
    } catch (error) {
      this.logFailed(message, true, actual, error);
      throw error;
    }
  }

  async assertElementIsNotVisible(locator, message = 'Element is not visible') {
    let actual;

    try {
      actual = await locator.isVisible();
      expect(actual, message).to.equal(false);
      this.logPassed(message, false, actual);
    } catch (error) {
      this.logFailed(message, false, actual, error);
      throw error;
    }
  }

  async assertElementIsEnabled(locator, message = 'Element is enabled') {
    let actual;

    try {
      actual = await locator.isEnabled();
      expect(actual, message).to.equal(true);
      this.logPassed(message, true, actual);
    } catch (error) {
      this.logFailed(message, true, actual, error);
      throw error;
    }
  }

  async assertElementIsDisabled(locator, message = 'Element is disabled') {
    let actual;

    try {
      actual = await locator.isDisabled();
      expect(actual, message).to.equal(true);
      this.logPassed(message, true, actual);
    } catch (error) {
      this.logFailed(message, true, actual, error);
      throw error;
    }
  }

  async assertElementIsChecked(locator, message = 'Element is checked') {
    let actual;

    try {
      actual = await locator.isChecked();
      expect(actual, message).to.equal(true);
      this.logPassed(message, true, actual);
    } catch (error) {
      this.logFailed(message, true, actual, error);
      throw error;
    }
  }

  async assertElementIsNotChecked(locator, message = 'Element is not checked') {
    let actual;

    try {
      actual = await locator.isChecked();
      expect(actual, message).to.equal(false);
      this.logPassed(message, false, actual);
    } catch (error) {
      this.logFailed(message, false, actual, error);
      throw error;
    }
  }

  async assertElementValueEquals(locator, expected, message = 'Element value matches') {
    let actual;

    try {
      actual = await locator.inputValue();
      expect(actual, message).to.equal(expected);
      this.logPassed(message, expected, actual);
    } catch (error) {
      this.logFailed(message, expected, actual, error);
      throw error;
    }
  }

  async assertElementAttributeEquals(
    locator, attribute, expected, message = 'Element attribute matches'
  ) {
    let actual;

    try {
      actual = await locator.getAttribute(attribute);
      expect(actual, message).to.equal(expected);
      this.logPassed(message, expected, actual);
    } catch (error) {
      this.logFailed(message, expected, actual, error);
      throw error;
    }
  }

  async assertElementIsClickable(locator, message = 'Element is visible and enabled') {
    let actual;

    try {
      const visible = await locator.isVisible();
      const enabled = await locator.isEnabled();
      actual = `visible=${visible}, enabled=${enabled}`;

      expect(visible, message).to.equal(true);
      expect(enabled, message).to.equal(true);

      this.logPassed(message, 'visible=true, enabled=true', actual);
    } catch (error) {
      this.logFailed(message, 'visible=true, enabled=true', actual, error);
      throw error;
    }
  }

  async assertArrayOfElementsAreDisplayed(
    locators, message = 'All elements are displayed'
  ) {
    let actual = [];

    try {
      for (const locator of locators) {
        actual.push(await locator.isVisible());
      }

      expect(actual.every(Boolean), message).to.equal(true);
      this.logPassed(message, true, actual);
    } catch (error) {
      this.logFailed(message, true, actual, error);
      throw error;
    }
  }

  async assertArrayOfElementsTextEquals(
    locators, expectedTexts, message = 'Element texts match expected values'
  ) {
    let actual = [];

    try {
      expect(locators.length, message).to.equal(expectedTexts.length);

      for (const locator of locators) {
        actual.push(((await locator.textContent()) || '').trim());
      }

      expect(actual, message).to.deep.equal(expectedTexts);
      this.logPassed(message, expectedTexts, actual);
    } catch (error) {
      this.logFailed(message, expectedTexts, actual, error);
      throw error;
    }
  }

  // ==================== SOFT ASSERTIONS ====================

  async softAssertEqual(actual, expected, message = 'Soft equality assertion') {
    try {
      this.assertEqual(actual, expected, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  async softAssertTrue(value, message = 'Soft true assertion') {
    try {
      this.assertTrue(value, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  async softAssertFalse(value, message = 'Soft false assertion') {
    try {
      this.assertFalse(value, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  async softAssertElementIsVisible(locator, message = 'Soft element visibility assertion') {
    try {
      await this.assertElementIsVisible(locator, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  async softAssertElementTextEquals(
    locator, expected, message = 'Soft element text assertion'
  ) {
    try {
      await this.assertElementTextEquals(locator, expected, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  assertAll() {
    if (this.softFailures.length === 0) {
      this.logPassed('All soft assertions passed', 0, 0);
      return;
    }

    const failures = this.softFailures.slice();
    this.softFailures = [];

    const error = new Error(
      `Soft assertion failures (${failures.length}):\n- ${failures.join('\n- ')}`
    );

    this.logFailed('Soft assertions failed', 0, failures.length, error);
    throw error;
  }
}

// Shared instance
const assert = new Assert();
global.assert = assert;

module.exports = { Assert, assert };
