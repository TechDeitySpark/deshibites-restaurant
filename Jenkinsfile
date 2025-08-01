pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = credentials('docker-registry')
        IMAGE_NAME = 'deshibites-app'
        AWS_CREDENTIALS = credentials('aws-credentials')
        EC2_HOST = credentials('ec2-host')
        EC2_SSH_KEY = credentials('ec2-ssh-key')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('frontend') {
                    sh 'npm run test -- --coverage --passWithNoTests'
                }
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'frontend/coverage/lcov.info'
                }
            }
        }
        
        stage('Build Application') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    image.tag("latest")
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        def image = docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                        image.push()
                        image.push("latest")
                    }
                }
            }
        }
        
        stage('Deploy to EC2') {
            when {
                branch 'main'
            }
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ec2-user@${EC2_HOST} "
                            # Update system
                            sudo yum update -y
                            
                            # Install Docker if not present
                            if ! command -v docker &> /dev/null; then
                                sudo yum install -y docker
                                sudo systemctl start docker
                                sudo systemctl enable docker
                                sudo usermod -a -G docker ec2-user
                            fi
                            
                            # Create app directory
                            sudo mkdir -p /opt/deshibites
                            cd /opt/deshibites
                            
                            # Pull latest image
                            sudo docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                            
                            # Stop old container
                            sudo docker stop deshibites-app || true
                            sudo docker rm deshibites-app || true
                            
                            # Run new container
                            sudo docker run -d \\
                                --name deshibites-app \\
                                -p 80:80 \\
                                -p 443:443 \\
                                --restart unless-stopped \\
                                ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                            
                            # Clean up
                            sudo docker image prune -af
                            
                            echo 'Deployment completed successfully!'
                        "
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
            // Send success notification (Slack, email, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Send failure notification
        }
    }
}
