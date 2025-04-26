pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds'
        GITHUB_CREDENTIALS_ID = 'github-creds'
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: "${GITHUB_CREDENTIALS_ID}", url: 'https://github.com/surya-sundar-24/mern-bookstore-devops.git', branch: 'main'
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.image('node:16').inside('-u 0:0') { // Run as root inside the container temporarily
                        dir('Frontend') {
                            sh '''
                                mkdir -p .npm-cache
                                npm install --cache .npm-cache
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    docker.image('node:16').inside('-u 0:0') {
                        dir('Backend') {
                            sh '''
                                mkdir -p .npm-cache
                                npm install --cache .npm-cache
                            '''
                        }
                    }
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                echo 'Running Trivy Scan...'
                // Trivy scanning steps here
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Images to DockerHub...'
                // docker build & push commands
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                // kubectl apply -f manifests/
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
