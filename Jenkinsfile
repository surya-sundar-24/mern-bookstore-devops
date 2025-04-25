pipeline {
  agent any

  environment {
    FRONT_IMG = "yourdockerhub/frontend:${BUILD_NUMBER}"
    BACK_IMG  = "yourdockerhub/backend:${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git credentialsId: 'github-creds', url: 'https://github.com/youruser/mern-project.git'
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install && npm run build'
          sh 'docker build -t $FRONT_IMG .'
          sh 'trivy image $FRONT_IMG'
        }
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'npm install'
          sh 'docker build -t $BACK_IMG .'
          sh 'trivy image $BACK_IMG'
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withDockerRegistry([credentialsId: 'docker-hub-creds']) {
          sh 'docker push $FRONT_IMG'
          sh 'docker push $BACK_IMG'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl set image deployment/frontend frontend=$FRONT_IMG'
        sh 'kubectl set image deployment/backend backend=$BACK_IMG'
      }
    }
  }
}
