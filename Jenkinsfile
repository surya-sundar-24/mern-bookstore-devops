pipeline {
  agent any

  environment {
    FRONT_IMG = "suryasundar/mern-frontend:${BUILD_NUMBER}"
    BACK_IMG  = "suryasundar/mern-backend:${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', credentialsId: 'github-creds', url: 'https://github.com/surya-sundar-24/mern-bookstore-devops.git'
      }
    }

    stage('Build Frontend') {
      steps {
        script {
          docker.image('node:16').inside {
          dir('Frontend') {  // <-- Capital 'F' here!
            sh 'mkdir -p .npm'     // <--- Create local folder
            sh 'npm config set cache $(pwd)/.npm --global'   // <--- Tell npm to use i
            sh 'npm install'
            sh 'npm run build'
            sh 'docker build -t $FRONT_IMG .'
            }
          }
        }
      }
    }

    stage('Build Backend') {
      steps {
        script {
          // Using a Docker container with Node.js to build the backend
          docker.image('node:16').inside {
            dir('Backend') {
              sh 'npm install'
              sh 'docker build -t $BACK_IMG .'
            }
          }
        }
      }
    }

    stage('Trivy Scan') {
      steps {
        sh '''
          trivy image $FRONT_IMG || true
          trivy image $BACK_IMG || true
        '''
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withDockerRegistry(credentialsId: 'docker-hub-creds', url: '') {
          sh 'docker push $FRONT_IMG'
          sh 'docker push $BACK_IMG'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          // Apply Kubernetes configurations and set images
          sh 'kubectl apply -f k8s/backend-deployment.yaml'
          sh 'kubectl apply -f k8s/frontend-deployment.yaml'
          sh 'kubectl set image deployment/mern-backend backend=$BACK_IMG'
          sh 'kubectl set image deployment/mern-frontend frontend=$FRONT_IMG'
        }
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
