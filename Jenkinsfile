pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        GITHUB_CREDENTIALS = credentials('github-creds')
    }

    stages {
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
                                rm -rf node_modules package-lock.json
                                mkdir -p .npm-cache
                                npm install --cache .npm-cache
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build -t $DOCKER_USER/mern-frontend ./Frontend
                        docker build -t $DOCKER_USER/mern-backend ./Backend
                        docker push $DOCKER_USER/mern-frontend
                        docker push $DOCKER_USER/mern-backend
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
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
