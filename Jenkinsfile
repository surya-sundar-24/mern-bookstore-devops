pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-creds')
        GITHUB_CREDENTIALS = credentials('github-creds')
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                git credentialsId: 'github-creds', url: 'https://github.com/surya-sundar-24/mern-bookstore-devops.git', branch: 'main'
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    docker.image('node:16').inside {
                        dir('Frontend') {
                            sh '''
                                echo "Cleaning old node_modules and lock file..."
                                rm -rf node_modules package-lock.json .npm-cache
                                mkdir -p .npm-cache
                                echo "Installing frontend dependencies..."
                                npm install --cache .npm-cache || true
                                echo "Building frontend..."
                                npm run build
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    docker.image('node:16').inside {
                        dir('Backend') {
                            sh '''
                                echo "Cleaning backend modules..."
                                rm -rf node_modules package-lock.json
                                echo "Installing backend dependencies..."
                                npm install
                            '''
                        }
                    }
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                    echo "Running Trivy scan..."
                    trivy fs --exit-code 0 --severity MEDIUM,HIGH .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "Logging in to Docker Hub..."
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                        echo "Building Docker images..."
                        docker build -t $DOCKER_USER/mern-frontend ./Frontend
                        docker build -t $DOCKER_USER/mern-backend ./Backend

                        echo "Pushing Docker images to Docker Hub..."
                        docker push $DOCKER_USER/mern-frontend
                        docker push $DOCKER_USER/mern-backend
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "Deploying to Kubernetes..."
                    kubectl apply -f k8s/
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs for details.'
        }
    }
}
