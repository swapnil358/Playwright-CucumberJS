const fs = require('fs');
const path = require('path');

const authors = require('./author.json');
const jiraIssues = require('./jira.json');

const JIRA_BASE_URL = 'https://YOUR-COMPANY.atlassian.net';

function toArray(value) {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
}

function addAllureMapping() {
    const resultsDir = path.join(process.cwd(), 'allure-results');

    if (!fs.existsSync(resultsDir)) {
        return;
    }

    const files = fs.readdirSync(resultsDir);

    const allMappedJiraIds = new Set(
        Object.values(jiraIssues).flatMap(toArray)
    );

    for (const file of files) {
        if (!file.endsWith('-result.json')) {
            continue;
        }

        const filePath = path.join(resultsDir, file);

        try {
            const result = JSON.parse(
                fs.readFileSync(filePath, 'utf8')
            );

            const scenarioName = result.name;

            const scenarioAuthors = [
                ...new Set(toArray(authors[scenarioName]))
            ];

            const scenarioJiraIds = [
                ...new Set(toArray(jiraIssues[scenarioName]))
            ];

            result.labels = result.labels || [];
            result.links = result.links || [];

            // Remove existing author labels.
            result.labels = result.labels.filter(
                label => label.name !== 'author'
            );

            // Add each author as a separate label.
            for (const author of scenarioAuthors) {
                result.labels.push({
                    name: 'author',
                    value: author
                });
            }

            // Prevent duplicate author descriptions.
            const existingDescription = (result.description || '')
                .replace(/^Authors:.*(?:\r?\n|$)+/gm, '')
                .trim();

            result.description = scenarioAuthors.length
                ? `Authors: ${scenarioAuthors.join(', ')}` +
                  (existingDescription
                      ? `\n\n${existingDescription}`
                      : '')
                : existingDescription;

            // Remove previously mapped Jira links.
            result.links = result.links.filter(link => {
                return !(
                    allMappedJiraIds.has(link.name) &&
                    (
                        link.type === 'issue' ||
                        link.type === 'story'
                    )
                );
            });

            // Add each Jira link as a story link.
            for (const jiraId of scenarioJiraIds) {
                result.links.push({
                    type: 'story',
                    name: jiraId,
                    url: `${JIRA_BASE_URL}/browse/${jiraId}`
                });
            }

            // Save updated Allure result.
            fs.writeFileSync(
                filePath,
                JSON.stringify(result, null, 2),
                'utf8'
            );

        } catch (error) {
            // Ignore invalid or incomplete result files.
        }
    }
}

module.exports = {
    addAllureMapping
};