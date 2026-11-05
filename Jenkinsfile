
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()

        buildDiscarder(
            logRotator(
                numToKeepStr: '20',
                artifactNumToKeepStr: '10'
            )
        )
    }

    parameters {
        string(
            name: 'TAG',
            defaultValue: '@e2e',
            description: 'Cucumber tag: @smoke, @regression or @e2e'
        )

        string(
            name: 'RETRY',
            defaultValue: '0',
            description: 'Number of retries for failed scenarios'
        )

        choice(
            name: 'HEADLESS',
            choices: ['true', 'false'],
            description: 'Run browser in headless mode'
        )

        string(
            name: 'PARALLEL',
            defaultValue: '1',
            description: 'Number of parallel Cucumber workers'
        )
    }

    environment {
        TEST_EXIT_CODE = '0'
        ALLURE_EXIT_CODE = '0'
    }

    stages {

        // 1. Checkout source code
        stage('Checkout') {
            steps {
                checkout scm

                echo 'GitHub source code checked out successfully'
            }
        }

        // 2. Validate Node.js and npm
        stage('Validate Environment') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'git --version'
            }
        }

        // 3. Install dependencies
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        // 4. Install Playwright Chromium
        stage('Install Playwright Browser') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

        // 5. Clean previous execution results
        stage('Clean Previous Results') {
            steps {
                bat '''
                    if exist allure-results (
                        rmdir /s /q allure-results
                    )

                    if exist allure-report (
                        rmdir /s /q allure-report
                    )

                    if exist reports (
                        rmdir /s /q reports
                    )

                    mkdir reports
                '''
            }
        }

        // 6. Execute Cucumber tests
        stage('Execute Cucumber Tests') {
            steps {
                script {

                    // Validate parallel worker count
                    if (!(params.PARALLEL ==~ /^[1-9][0-9]*$/)) {
                        error('PARALLEL must be a positive integer')
                    }

                    // Validate retry count
                    if (!(params.RETRY ==~ /^[0-9]+$/)) {
                        error('RETRY must be a non-negative integer')
                    }

                    def testStatus = bat(
                        returnStatus: true,
                        script: '''
                            npx cross-env TAG="%TAG%" RETRY="%RETRY%" HEADLESS="%HEADLESS%" PARALLEL="%PARALLEL%" npm test
                        '''
                    )

                    env.TEST_EXIT_CODE = "${testStatus}"

                    echo "Cucumber exit code: ${testStatus}"
                    echo "Selected tag: ${params.TAG}"
                    echo "Retry count: ${params.RETRY}"
                    echo "Headless mode: ${params.HEADLESS}"
                    echo "Parallel workers: ${params.PARALLEL}"
                }
            }
        }

        // 7. Generate Allure report even when tests fail
        stage('Generate Allure Report') {
            steps {
                script {

                    if (fileExists('allure-results')) {

                        def reportStatus = bat(
                            returnStatus: true,
                            script: 'npm run report:generate'
                        )

                        env.ALLURE_EXIT_CODE = "${reportStatus}"

                        echo "Allure report exit code: ${reportStatus}"

                    } else {

                        env.ALLURE_EXIT_CODE = '1'

                        echo 'Allure results directory not found'
                    }
                }
            }
        }

        // 8. Evaluate final build status
        stage('Evaluate Build Result') {
            steps {
                script {

                    if (env.TEST_EXIT_CODE != '0') {

                        currentBuild.result = 'FAILURE'

                        echo 'Cucumber test execution failed'

                    } else if (env.ALLURE_EXIT_CODE != '0') {

                        currentBuild.result = 'UNSTABLE'

                        echo 'Allure report generation failed'

                    } else {

                        echo 'Tests and Allure report completed successfully'
                    }
                }
            }
        }
    }

    post {
    always {
        echo 'Publishing Allure report...'

        archiveArtifacts(
            artifacts: 'allure-results/**, allure-report/**',
            allowEmptyArchive: true,
            fingerprint: true
        )

        script {
            if (fileExists('allure-report/index.html')) {
                publishHTML(target: [
                    reportName: 'Allure Report',
                    reportDir: 'allure-report',
                    reportFiles: 'index.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: true
                ])
            } else {
                echo 'Allure report not available'
            }
        }
    }

    success {
        echo 'Pipeline completed successfully!'
    }

    failure {
        echo 'Pipeline failed. Check the Allure report and console output.'
    }

    unstable {
        echo 'Pipeline completed with unstable status.'
    }

    cleanup {
        echo 'Pipeline execution completed.'
    }
}
}
