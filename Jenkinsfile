pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        SITE_DIR = 'outputs'
        ARTIFACT_DIR = 'dist'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Static Site') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            set -eu

                            test -f "$SITE_DIR/index.html"
                            test -f "$SITE_DIR/styles.css"
                            test -f "$SITE_DIR/script.js"

                            grep -q "./styles.css" "$SITE_DIR/index.html"
                            grep -q "./script.js" "$SITE_DIR/index.html"
                            grep -q "21118-315137091_large.mp4" "$SITE_DIR/index.html"
                        '''
                    } else {
                        bat '''
                            if not exist "%SITE_DIR%\\index.html" exit /b 1
                            if not exist "%SITE_DIR%\\styles.css" exit /b 1
                            if not exist "%SITE_DIR%\\script.js" exit /b 1

                            findstr /C:"./styles.css" "%SITE_DIR%\\index.html" >nul || exit /b 1
                            findstr /C:"./script.js" "%SITE_DIR%\\index.html" >nul || exit /b 1
                            findstr /C:"21118-315137091_large.mp4" "%SITE_DIR%\\index.html" >nul || exit /b 1
                        '''
                    }
                }
            }
        }

        stage('Package Website') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            set -eu
                            rm -rf "$ARTIFACT_DIR"
                            mkdir -p "$ARTIFACT_DIR"
                            tar -czf "$ARTIFACT_DIR/neondrive-${BUILD_NUMBER}.tar.gz" -C "$SITE_DIR" .
                        '''
                    } else {
                        bat '''
                            if exist "%ARTIFACT_DIR%" rmdir /s /q "%ARTIFACT_DIR%"
                            mkdir "%ARTIFACT_DIR%"
                            powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%SITE_DIR%\\*' -DestinationPath '%ARTIFACT_DIR%\\neondrive-%BUILD_NUMBER%.zip' -Force"
                        '''
                    }
                }
            }
        }

        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }

    post {
        success {
            echo 'Website pipeline completed successfully.'
        }
        failure {
            echo 'Website pipeline failed. Check the stage logs above.'
        }
    }
}
