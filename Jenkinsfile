
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
            defaultValue: '',
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
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'GitHub source code checked out successfully'
            }
        }

        stage('Validate Environment') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'git --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browser') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

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

        stage('Execute Cucumber Tests') {
            steps {
                script {

                    if (!(params.PARALLEL ==~ /^[1-9][0-9]*$/)) {
                        error('PARALLEL must be a positive integer')
                    }

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

        stage('Evaluate Build Result') {
            steps {
                script {
                    if (env.TEST_EXIT_CODE != '0') {
                        currentBuild.result = 'FAILURE'
                        echo 'Cucumber test execution failed'
                    } else {
                        echo 'Cucumber test execution completed successfully'
                    }
                }
            }
        }
    }

    post {

        always {
            echo 'Publishing Allure report...'

            archiveArtifacts(
                artifacts: 'allure-results/**',
                allowEmptyArchive: true,
                fingerprint: true
            )

            script {
                if (fileExists('allure-results')) {

                    allure([
                        includeProperties: false,
                        jdk: '',
                        results: [[
                            path: 'allure-results'
                        ]]
                    ])

                    echo 'Allure report published successfully'

                } else {
                    echo 'Allure results directory not found. Report skipped.'
                }
            }
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output and Allure Report.'
        }

        unstable {
            echo 'Pipeline completed with unstable status.'
        }

        cleanup {
            echo 'Pipeline execution completed.'
        }
    }
}
