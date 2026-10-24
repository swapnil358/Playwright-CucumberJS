'use strict';

const { expect } = require('chai');

class Assert {
  constructor() {
    this.page = null;
    this.softFailures = [];
  }

  // Set current Playwright page
  setPage(page) {
    this.page = page;
  }

  // Reset soft assertions before each scenario
  resetSoftAssertions() {
    this.softFailures = [];
  }

  // ==================== HARD ASSERTIONS ====================

  assertUrlContains(expected, message) {
  expect(this.page.url(), message).to.include(expected);
}

  assertEqual(actual, expected, message) {
    expect(actual, message).to.equal(expected);
  }

  assertNotEqual(actual, expected, message) {
    expect(actual, message).to.not.equal(expected);
  }

  assertTrue(value, message) {
    expect(value, message).to.equal(true);
  }

  assertFalse(value, message) {
    expect(value, message).to.equal(false);
  }

  assertNull(value, message) {
    expect(value, message).to.equal(null);
  }

  assertContainsText(actual, expected, message) {
    expect(actual, message).to.include(expected);
  }

  assertDoesNotContainText(actual, expected, message) {
    expect(actual, message).to.not.include(expected);
  }

  assertEqualIgnoreCase(actual, expected, message) {
    expect(actual.toLowerCase(), message)
      .to.equal(expected.toLowerCase());
  }

  assertEqualIgnoreCaseAndWhitespace(actual, expected, message) {
    const actualText = actual.trim().replace(/\s+/g, ' ').toLowerCase();
    const expectedText = expected.trim().replace(/\s+/g, ' ').toLowerCase();

    expect(actualText, message).to.equal(expectedText);
  }

  assertArrayEquals(actual, expected, message) {
    expect(actual, message).to.deep.equal(expected);
  }

  assertArrayIncludes(actual, expected, message) {
    expect(actual, message).to.include(expected);
  }

  assertArrayNotIncludes(actual, expected, message) {
    expect(actual, message).to.not.include(expected);
  }

  assertNormalizedJsonEqual(actual, expected, message) {
    const actualJson = typeof actual === 'string'
      ? JSON.parse(actual)
      : actual;

    const expectedJson = typeof expected === 'string'
      ? JSON.parse(expected)
      : expected;

    expect(actualJson, message).to.deep.equal(expectedJson);
  }

  // ==================== PLAYWRIGHT ASSERTIONS ====================

  async assertElementTextEquals(locator, expected, message) {
    const actual = (await locator.textContent()) || '';
    expect(actual.trim(), message).to.equal(expected);
  }

  async assertElementTextEqualsIgnoreCase(locator, expected, message) {
    const actual = (await locator.textContent()) || '';

    expect(actual.trim().toLowerCase(), message)
      .to.equal(expected.trim().toLowerCase());
  }

  async assertElementContainsText(locator, expected, message) {
    const actual = (await locator.textContent()) || '';
    expect(actual, message).to.include(expected);
  }

  async assertElementIsVisible(locator, message) {
    expect(await locator.isVisible(), message).to.equal(true);
  }

  async assertElementIsNotVisible(locator, message) {
    expect(await locator.isVisible(), message).to.equal(false);
  }

  async assertElementIsEnabled(locator, message) {
    expect(await locator.isEnabled(), message).to.equal(true);
  }

  async assertElementIsDisabled(locator, message) {
    expect(await locator.isDisabled(), message).to.equal(true);
  }

  async assertElementIsChecked(locator, message) {
    expect(await locator.isChecked(), message).to.equal(true);
  }

  async assertElementIsNotChecked(locator, message) {
    expect(await locator.isChecked(), message).to.equal(false);
  }

  async assertElementValueEquals(locator, expected, message) {
    expect(await locator.inputValue(), message).to.equal(expected);
  }

  async assertElementAttributeEquals(locator, attribute, expected, message) {
    expect(await locator.getAttribute(attribute), message)
      .to.equal(expected);
  }

  async assertElementIsClickable(locator, message) {
    expect(await locator.isVisible(), message).to.equal(true);
    expect(await locator.isEnabled(), message).to.equal(true);
  }

  async assertPageTitle(expected, message) {
    expect(await this.page.title(), message).to.equal(expected);
  }

  async assertUrlContains(expected, message) {
    expect(this.page.url(), message).to.include(expected);
  }

  async assertUrlEquals(expected, message) {
    expect(this.page.url(), message).to.equal(expected);
  }

  async assertArrayOfElementsAreDisplayed(locators, message) {
    for (const locator of locators) {
      expect(await locator.isVisible(), message).to.equal(true);
    }
  }

  async assertArrayOfElementsTextEquals(locators, expectedTexts, message) {
    expect(locators.length, message).to.equal(expectedTexts.length);

    for (let i = 0; i < locators.length; i++) {
      const actual = (await locators[i].textContent()) || '';
      expect(actual.trim(), message).to.equal(expectedTexts[i]);
    }
  }

  // ==================== SOFT ASSERTIONS ====================

  async softAssertEqual(actual, expected, message) {
    try {
      this.assertEqual(actual, expected, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  async softAssertTrue(value, message) {
    try {
      this.assertTrue(value, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  async softAssertFalse(value, message) {
    try {
      this.assertFalse(value, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  async softAssertElementIsVisible(locator, message) {
    try {
      await this.assertElementIsVisible(locator, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  async softAssertElementTextEquals(locator, expected, message) {
    try {
      await this.assertElementTextEquals(locator, expected, message);
    } catch (error) {
      this.softFailures.push(error.message);
    }
  }

  assertAll() {
    if (this.softFailures.length === 0) {
      return;
    }

    const failures = this.softFailures.slice();
    this.softFailures = [];

    throw new Error(
      `Soft assertion failures (${failures.length}):\n- ${failures.join('\n- ')}`
    );
  }
}

// Create one shared instance
const assert = new Assert();

// Make it globally accessible
global.assert = assert;

module.exports = { Assert, assert };