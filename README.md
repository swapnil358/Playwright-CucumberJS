# Playwright CucumberJS Automation Framework

A scalable end-to-end test automation framework built using **Playwright, JavaScript, CucumberJS, and Allure Reports**. This framework follows Behaviour-Driven Development (BDD) principles and supports reusable step definitions, tagged execution, retries, screenshots on failure, structured logging, and test metadata mapping.

## Features

- **Playwright:** Modern browser automation.
- **CucumberJS:** BDD testing using Gherkin feature files.
- **Page Object Model (POM):** Separation of page locators and application interactions.
- **Reusable step definitions:** Shared steps across multiple scenarios.
- **Tag-based execution:** Run smoke, regression, positive, or negative scenarios.
- **Retry mechanism:** Configure retries for failed scenarios.
- **Allure reporting:** Detailed execution reports with test steps and failure information.
- **Automatic screenshots:** Capture screenshots when steps fail.
- **Custom logging:** Centralised logger utility with console output control.
- **Assertion utility:** Reusable assertion methods.
- **Author mapping:** Associate multiple authors with each scenario.
- **Jira integration:** Attach multiple Jira story links to test results.
- **Parallel execution:** Configure Cucumber workers for concurrent test execution.
- **Git integration:** Use `.gitignore` to exclude generated reports and dependencies.

## Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript | Programming language |
| Node.js | JavaScript runtime |
| Playwright | Browser automation |
| CucumberJS | BDD test execution |
| Gherkin | Feature and scenario definitions |
| Allure | Test reporting |
| Chai | Assertions, if used by the assertion utility |
| Git and GitHub | Version control |

## Project Structure

```text
Playwright-Cucumber_Framework/
│
├── features.js/
│   └── support/
│       └── login.feature
│
├── hooks/
│   └── hooks.js
│
├── stepDef/
│   └── login.steps.js
│
├── pages/
│   └── LoginPage.js
│
├── utils/
│   ├── assert.js
│   ├── LoggerUtil.js
│   ├── allureMapping.js
│   ├── author.json
│   └── jira.json
│
├── screenshots/
├── reports/
├── allure-results/
├── allure-report/
│
├── cucumber.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

*Note: Adjust the example page and step-definition filenames to match the actual files in your repository.*

## Prerequisites

Install the following before running the framework:

- Node.js and npm
- Git
- A supported browser installed through Playwright
- Java, if required by your installed Allure CLI distribution
- Allure Commandline, for generating and opening HTML reports

Verify your installations:

```bash
node --version
npm --version
git --version
```

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd Playwright-Cucumber_Framework
```

Install the dependencies:

```bash
npm install
```

Install the Playwright Chromium browser if it is not already installed:

```bash
npx playwright install chromium
```

## Running Tests

### Run all scenarios

```bash
npx cucumber-js
```

### Run tests in headed mode

If your `package.json` contains the `test:headed` script:

```bash
npm run test:headed
```

Alternatively, with your existing `HEADLESS` environment-variable configuration:

```bash
npx cross-env HEADLESS=false cucumber-js
```

### Run smoke tests

```bash
npx cucumber-js --tags "@smoke"
```

### Run regression tests

```bash
npx cucumber-js --tags "@regression"
```

### Run positive tests

```bash
npx cucumber-js --tags "@positive"
```

### Run negative tests

```bash
npx cucumber-js --tags "@negative"
```

### Run scenarios with multiple tags

Run scenarios tagged with both `@smoke` and `@positive`:

```bash
npx cucumber-js --tags "@smoke and @positive"
```

Run scenarios tagged with either `@smoke` or `@regression`:

```bash
npx cucumber-js --tags "@smoke or @regression"
```

## Retry Configuration

The framework can read the retry count from the `RETRY` environment variable.

For example, to retry failed scenarios twice:

```bash
npx cross-env RETRY=2 cucumber-js
```

The configured retry value is controlled by `cucumber.js`:

```javascript
retry: process.env.RETRY
    ? Number(process.env.RETRY)
    : 0
```

A retry count of `0` disables retries.

## Parallel Execution

CucumberJS supports parallel scenario execution through the `parallel` setting in `cucumber.js`.

Example:

```javascript
parallel: 2
```

This configures two Cucumber workers. Adjust the number based on machine capacity and test stability.

**Important:** Run Allure metadata mapping only after all workers have completed writing their result files to avoid concurrent file updates.

## Allure Reporting

The framework uses `allure-cucumberjs` to produce Allure result files.

### Generate the report

```bash
npm run report:generate
```

### Open the report

```bash
npm run report:open
```

### Generate and open the report

```bash
npm run report
```

These commands assume the corresponding scripts are configured in `package.json`:

```json
{
  "scripts": {
    "report:generate": "allure generate allure-results --clean -o allure-report",
    "report:open": "allure open allure-report",
    "report": "npm run report:generate && npm run report:open"
  }
}
```

The `allure-results` directory contains the raw execution results. The `allure-report` directory contains the generated HTML report.

## Author and Jira Story Mapping

The framework supports mapping multiple authors and multiple Jira IDs to each scenario.

### `utils/author.json`

```json
{
  "Login with valid credentials": [
    "Swapnil",
    "John",
    "Mike"
  ],
  "Login with invalid credentials": [
    "Triveni",
    "Samaya",
    "Rahul"
  ]
}
```

### `utils/jira.json`

```json
{
  "Login with valid credentials": [
    "PROJ-101",
    "PROJ-102",
    "PROJ-103"
  ],
  "Login with invalid credentials": [
    "PROJ-104",
    "PROJ-105",
    "PROJ-106"
  ]
}
```

Replace these example Jira IDs with actual issues from your Jira project.

The `utils/allureMapping.js` utility maps author labels, adds the author list to the Allure description, and attaches Jira links to the relevant test result.

Ensure the Jira base URL in the mapping utility matches your organisation's Jira domain.

## Example Feature File

```gherkin
Feature: SauceDemo Login

  @smoke @positive
  Scenario: Login with valid credentials
    Given I open the login page
    When I login with username "standard_user" and password "secret_sauce"
    Then I should see the products page

  @regression @negative
  Scenario: Login with invalid credentials
    Given I open the login page
    When I login with username "invalid_user" and password "wrong_password"
    Then I should see a login error
```

## Logging and Failure Diagnostics

The framework uses `utils/LoggerUtil.js` for centralised logging.

Typical logging responsibilities include:

- Scenario start and completion.
- Step execution status.
- Assertion results.
- Error details.
- Screenshot and log attachment when a step fails.

The `CONSOLE_LOG` flag can be used to control whether messages are printed to the console, provided the logger is configured to honour it.

## Assertions

Reusable assertion methods are maintained in `utils/assert.js`.

Examples of assertion responsibilities include:

- URL validation.
- Element visibility.
- Text validation.
- Equality and inequality checks.
- Boolean conditions.
- Null checks.

Keeping assertions in a common utility helps standardise failure messages and reporting across step definitions.

## Git and `.gitignore`

Generated files and dependencies should generally not be committed.

Example `.gitignore` entries:

```gitignore
node_modules/
allure-results/
allure-report/
reports/
screenshots/
.env
.env.*
*.log
.DS_Store
Thumbs.db
```

Commit the framework source, feature files, configuration files, `package.json`, `package-lock.json`, and README.

Do not commit passwords, access tokens, or other secrets.

## Best Practices

1. Keep locators and page interactions inside page objects.
2. Keep step definitions focused on business-readable actions.
3. Reuse assertion and logging utilities.
4. Use tags to separate smoke and regression suites.
5. Avoid hard-coded waits when Playwright's auto-waiting can be used.
6. Keep test data separate from automation logic.
7. Use descriptive scenario names so metadata mapping remains reliable.
8. Run metadata mapping after parallel workers finish.
9. Exclude generated reports from source control unless your team explicitly requires them.
10. Review failed scenarios and screenshots before rerunning tests.

## Future Enhancements

- CI/CD integration with Jenkins or GitHub Actions.
- Browser and environment matrix execution.
- API test automation.
- Accessibility testing.
- Visual regression testing.
- Docker-based execution.
- Enhanced test dashboards and historical trend analysis.

## Author

**Swapnil Bodade**

Software Test Automation | Playwright | JavaScript | CucumberJS | Selenium | CI/CD

## License

Add the appropriate licence for your project if you intend to distribute or publish it.
