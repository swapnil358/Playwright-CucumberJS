
'use strict';

const { expect } = require('chai');
const logger = require('./LoggerUtil');

class Assert {

    constructor() {
        this.page = null;
        this.softFailures = [];
        this.currentStep = 'Unknown Cucumber step';
    }

    // ==================== LOGGING ====================

    logPassed(message, expected, actual) {
        logger.log(`\x1b[32m✓\x1b[0m ${message} : Expected: ${expected} | Actual: ${actual} | Result: PASSED`);
    }

    logFailed(message, expected, actual, error) {
        logger.log(`\x1b[31m✗\x1b[0m ${message} : Expected: ${expected} | Actual: ${actual} | Result: FAILED`);

        if (error && error.message) {
            logger.log(`  Error: ${error.message}`);
        }
    }

    // ==================== SOFT ASSERTION HELPERS ====================

    setCurrentStep(stepName) {
        this.currentStep = stepName;
    }

    getCallSite() {
    const stack = new Error().stack || '';
    const lines = stack.split('\n');

    const caller = lines.find(line =>
        line.includes('stepDef') &&
        line.includes('.js:') &&
        !line.includes('assert.js')
    );

    if (!caller) {
        return 'Location unavailable';
    }

    const match = caller.match(/\((.*)\)/);

    return match ? match[1] : caller.trim();
}

    recordSoftAssertion(condition, message, expected, actual, callSite) {
        const status = condition ? 'PASSED' : 'FAILED';

        const logMessage = [
            `* ${status}: ${message}`,
            `  Step     : ${this.currentStep}`,
            `  Location : ${callSite}`,
            `  Expected : ${expected}`,
            `  Actual   : ${actual}`
        ].join('\n');

        logger.log(logMessage);

        if (!condition) {
            this.softFailures.push(logMessage);
        }

        return condition;
    }

    // ==================== PAGE SETUP ====================

    setPage(page) {
        this.page = page;
    }

    resetSoftAssertions() {
        this.softFailures = [];
        this.currentStep = 'Unknown Cucumber step';
    }

    // ==================== HARD ASSERTIONS ====================

    assertUrlContains(expected) {
        let actual;

        try {
            actual = this.page.url();
            expect(actual, 'URL should contain expected text').to.include(expected);
            this.logPassed('URL contains expected text', expected, actual);
        } catch (error) {
            this.logFailed('URL contains expected text', expected, actual, error);
            throw error;
        }
    }

    assertUrlEquals(expected) {
        let actual;

        try {
            actual = this.page.url();
            expect(actual, 'URL should match expected value').to.equal(expected);
            this.logPassed('URL matches expected value', expected, actual);
        } catch (error) {
            this.logFailed('URL matches expected value', expected, actual, error);
            throw error;
        }
    }

    async assertPageTitle(expected) {
        let actual;

        try {
            actual = await this.page.title();
            expect(actual, 'Page title should match expected value').to.equal(expected);
            this.logPassed('Page title matches expected value', expected, actual);
        } catch (error) {
            this.logFailed('Page title matches expected value', expected, actual, error);
            throw error;
        }
    }

    assertEqual(actual, expected) {
        try {
            expect(actual, 'Values should be equal').to.equal(expected);
            this.logPassed('Values are equal', expected, actual);
        } catch (error) {
            this.logFailed('Values are equal', expected, actual, error);
            throw error;
        }
    }

    assertNotEqual(actual, expected) {
        try {
            expect(actual, 'Values should not be equal').to.not.equal(expected);
            this.logPassed('Values are not equal', `Not ${expected}`, actual);
        } catch (error) {
            this.logFailed('Values are not equal', `Not ${expected}`, actual, error);
            throw error;
        }
    }

    assertTrue(actual) {
        try {
            expect(actual, 'Value should be true').to.equal(true);
            this.logPassed('Value is true', true, actual);
        } catch (error) {
            this.logFailed('Value is true', true, actual, error);
            throw error;
        }
    }

    assertFalse(actual) {
        try {
            expect(actual, 'Value should be false').to.equal(false);
            this.logPassed('Value is false', false, actual);
        } catch (error) {
            this.logFailed('Value is false', false, actual, error);
            throw error;
        }
    }

    assertNull(actual) {
        try {
            expect(actual, 'Value should be null').to.equal(null);
            this.logPassed('Value is null', null, actual);
        } catch (error) {
            this.logFailed('Value is null', null, actual, error);
            throw error;
        }
    }

    assertContainsText(actual, expected) {
        try {
            expect(actual, 'Text should contain expected value').to.include(expected);
            this.logPassed('Text contains expected value', expected, actual);
        } catch (error) {
            this.logFailed('Text contains expected value', expected, actual, error);
            throw error;
        }
    }

    assertDoesNotContainText(actual, expected) {
        try {
            expect(actual, 'Text should not contain unexpected value').to.not.include(expected);
            this.logPassed('Text excludes unexpected value', expected, actual);
        } catch (error) {
            this.logFailed('Text excludes unexpected value', expected, actual, error);
            throw error;
        }
    }

    assertEqualIgnoreCase(actual, expected) {
        try {
            expect(actual.toLowerCase(), 'Values should match ignoring case')
                .to.equal(expected.toLowerCase());
            this.logPassed('Values match ignoring case', expected, actual);
        } catch (error) {
            this.logFailed('Values match ignoring case', expected, actual, error);
            throw error;
        }
    }

    assertEqualIgnoreCaseAndWhitespace(actual, expected) {
        try {
            const actualValue = actual.trim().replace(/\s+/g, ' ').toLowerCase();
            const expectedValue = expected.trim().replace(/\s+/g, ' ').toLowerCase();

            expect(actualValue, 'Values should match ignoring case and whitespace').to.equal(expectedValue);
            this.logPassed('Values match ignoring case and whitespace', expected, actual);
        } catch (error) {
            this.logFailed('Values match ignoring case and whitespace', expected, actual, error);
            throw error;
        }
    }

    assertArrayEquals(actual, expected) {
        try {
            expect(actual, 'Arrays should be equal').to.deep.equal(expected);
            this.logPassed('Arrays are equal', expected, actual);
        } catch (error) {
            this.logFailed('Arrays are equal', expected, actual, error);
            throw error;
        }
    }

    assertArrayIncludes(actual, expected) {
        try {
            expect(actual, 'Array should include expected value').to.include(expected);
            this.logPassed('Array includes expected value', expected, actual);
        } catch (error) {
            this.logFailed('Array includes expected value', expected, actual, error);
            throw error;
        }
    }

    assertArrayNotIncludes(actual, expected) {
        try {
            expect(actual, 'Array should not include unexpected value').to.not.include(expected);
            this.logPassed('Array excludes unexpected value', expected, actual);
        } catch (error) {
            this.logFailed('Array excludes unexpected value', expected, actual, error);
            throw error;
        }
    }

    assertNormalizedJsonEqual(actual, expected) {
        try {
            const actualJson = typeof actual === 'string' ? JSON.parse(actual) : actual;
            const expectedJson = typeof expected === 'string' ? JSON.parse(expected) : expected;

            expect(actualJson, 'JSON values should be equal').to.deep.equal(expectedJson);
            this.logPassed('JSON values are equal', expectedJson, actualJson);
        } catch (error) {
            this.logFailed('JSON values are equal', expected, actual, error);
            throw error;
        }
    }

    // ==================== PLAYWRIGHT ASSERTIONS ====================

    async assertElementTextEquals(locator, expected) {
        let actual;

        try {
            actual = (await locator.textContent()) || '';
            expect(actual.trim(), 'Element text should match').to.equal(expected);
            this.logPassed('Element text matches', expected, actual.trim());
        } catch (error) {
            this.logFailed('Element text matches', expected, actual, error);
            throw error;
        }
    }

    async assertElementTextEqualsIgnoreCase(locator, expected) {
        let actual;

        try {
            actual = (await locator.textContent()) || '';

            expect(actual.trim().toLowerCase(), 'Element text should match ignoring case')
                .to.equal(expected.trim().toLowerCase());

            this.logPassed('Element text matches ignoring case', expected, actual.trim());
        } catch (error) {
            this.logFailed('Element text matches ignoring case', expected, actual, error);
            throw error;
        }
    }

    async assertElementContainsText(locator, expected) {
        let actual;

        try {
            actual = (await locator.textContent()) || '';
            expect(actual, 'Element should contain expected text').to.include(expected);
            this.logPassed('Element contains expected text', expected, actual);
        } catch (error) {
            this.logFailed('Element contains expected text', expected, actual, error);
            throw error;
        }
    }

    async assertElementIsVisible(locator) {
        let actual;

        try {
            actual = await locator.isVisible();
            expect(actual, 'Element should be visible').to.equal(true);
            this.logPassed('Element is visible', true, actual);
        } catch (error) {
            this.logFailed('Element is visible', true, actual, error);
            throw error;
        }
    }

    async assertElementIsNotVisible(locator) {
        let actual;

        try {
            actual = await locator.isVisible();
            expect(actual, 'Element should not be visible').to.equal(false);
            this.logPassed('Element is not visible', false, actual);
        } catch (error) {
            this.logFailed('Element is not visible', false, actual, error);
            throw error;
        }
    }

    async assertElementIsEnabled(locator) {
        let actual;

        try {
            actual = await locator.isEnabled();
            expect(actual, 'Element should be enabled').to.equal(true);
            this.logPassed('Element is enabled', true, actual);
        } catch (error) {
            this.logFailed('Element is enabled', true, actual, error);
            throw error;
        }
    }

    async assertElementIsDisabled(locator) {
        let actual;

        try {
            actual = await locator.isDisabled();
            expect(actual, 'Element should be disabled').to.equal(true);
            this.logPassed('Element is disabled', true, actual);
        } catch (error) {
            this.logFailed('Element is disabled', true, actual, error);
            throw error;
        }
    }

    async assertElementIsChecked(locator) {
        let actual;

        try {
            actual = await locator.isChecked();
            expect(actual, 'Element should be checked').to.equal(true);
            this.logPassed('Element is checked', true, actual);
        } catch (error) {
            this.logFailed('Element is checked', true, actual, error);
            throw error;
        }
    }

    async assertElementIsNotChecked(locator) {
        let actual;

        try {
            actual = await locator.isChecked();
            expect(actual, 'Element should not be checked').to.equal(false);
            this.logPassed('Element is not checked', false, actual);
        } catch (error) {
            this.logFailed('Element is not checked', false, actual, error);
            throw error;
        }
    }

    async assertElementValueEquals(locator, expected) {
        let actual;

        try {
            actual = await locator.inputValue();
            expect(actual, 'Element value should match').to.equal(expected);
            this.logPassed('Element value matches', expected, actual);
        } catch (error) {
            this.logFailed('Element value matches', expected, actual, error);
            throw error;
        }
    }

    async assertElementAttributeEquals(locator, attribute, expected) {
        let actual;

        try {
            actual = await locator.getAttribute(attribute);
            expect(actual, 'Element attribute should match').to.equal(expected);
            this.logPassed('Element attribute matches', expected, actual);
        } catch (error) {
            this.logFailed('Element attribute matches', expected, actual, error);
            throw error;
        }
    }

    async assertElementIsClickable(locator) {
        let actual;

        try {
            const visible = await locator.isVisible();
            const enabled = await locator.isEnabled();

            actual = `visible=${visible}, enabled=${enabled}`;

            expect(visible, 'Element should be visible').to.equal(true);
            expect(enabled, 'Element should be enabled').to.equal(true);

            this.logPassed('Element is clickable', 'visible=true, enabled=true', actual);
        } catch (error) {
            this.logFailed('Element is clickable', 'visible=true, enabled=true', actual, error);
            throw error;
        }
    }

    async assertArrayOfElementsAreDisplayed(locators) {
        let actual = [];

        try {
            for (const locator of locators) {
                actual.push(await locator.isVisible());
            }

            expect(actual.every(Boolean), 'All elements should be displayed').to.equal(true);
            this.logPassed('All elements are displayed', true, actual);
        } catch (error) {
            this.logFailed('All elements are displayed', true, actual, error);
            throw error;
        }
    }

    async assertArrayOfElementsTextEquals(locators, expectedTexts) {
        let actual = [];

        try {
            expect(locators.length, 'Number of elements should match').to.equal(expectedTexts.length);

            for (const locator of locators) {
                actual.push(((await locator.textContent()) || '').trim());
            }

            expect(actual, 'Element texts should match expected values').to.deep.equal(expectedTexts);
            this.logPassed('Element texts match expected values', expectedTexts, actual);
        } catch (error) {
            this.logFailed('Element texts match expected values', expectedTexts, actual, error);
            throw error;
        }
    }

    // ==================== SOFT ASSERTIONS ====================

    softAssertEqual(actual, expected) {
        const callSite = this.getCallSite();

        try {
            expect(actual, 'Values should be equal').to.equal(expected);
            return this.recordSoftAssertion(true, 'Values are equal', expected, actual, callSite);
        } catch (error) {
            return this.recordSoftAssertion(false, 'Values are equal', expected, actual, callSite);
        }
    }

    softAssertTrue(actual) {
        const callSite = this.getCallSite();

        try {
            expect(actual, 'Value should be true').to.equal(true);
            return this.recordSoftAssertion(true, 'Value is true', true, actual, callSite);
        } catch (error) {
            return this.recordSoftAssertion(false, 'Value is true', true, actual, callSite);
        }
    }

    softAssertFalse(actual) {
        const callSite = this.getCallSite();

        try {
            expect(actual, 'Value should be false').to.equal(false);
            return this.recordSoftAssertion(true, 'Value is false', false, actual, callSite);
        } catch (error) {
            return this.recordSoftAssertion(false, 'Value is false', false, actual, callSite);
        }
    }

    async softAssertElementIsVisible(locator) {
        const callSite = this.getCallSite();
        let actual;

        try {
            actual = await locator.isVisible();
            expect(actual, 'Element should be visible').to.equal(true);
            return this.recordSoftAssertion(true, 'Element is visible', true, actual, callSite);
        } catch (error) {
            return this.recordSoftAssertion(false, 'Element is visible', true, actual === undefined ? error.message : actual, callSite);
        }
    }

    async softAssertElementTextEquals(locator, expected) {
        const callSite = this.getCallSite();
        let actual;

        try {
            actual = (await locator.textContent()) || '';
            actual = actual.trim();

            expect(actual, 'Element text should match').to.equal(expected);

            return this.recordSoftAssertion(true, 'Element text matches', expected, actual, callSite);
        } catch (error) {
            return this.recordSoftAssertion(false, 'Element text matches', expected, actual === undefined ? error.message : actual, callSite);
        }
    }

    // ==================== ASSERT ALL ====================

assertAll() {
    if (this.softFailures.length === 0) {
        logger.log('* ✓ All soft assertions passed successfully');
        return;
    }

    const failures = this.softFailures.slice();

    this.softFailures = [];

    throw new Error( `Total Soft Assertion Failures: ${failures.length}\n\n` + failures.join('\n\n') );
}
}

// ==================== GLOBAL INSTANCE ====================

const assert = new Assert();

global.assert = assert;

module.exports = { Assert, assert };
