pipeline {
  agent any

  environment {
    NOTIFY_EMAIL       = "devops@invicara.com"
    NPM_RC_FILE        = credentials("npmrc-npmjs")
    NPM_PKG_NAME       = "create-twinit-app"
    NPM_RELEASE_BRANCH = "master"
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: "30"))
  }

  stages {
    stage("Release") {
      agent {
        docker {
          image "550983980260.dkr.ecr.us-west-2.amazonaws.com/nodejs:18"
          args "-e HOME=/var/lib/jenkins -v ${env.NPM_RC_FILE}:/var/lib/jenkins/.npmrc -e npm_config_cache=/tmp"
          reuseNode true
        }
      }

      steps {
        script {
          echo "Installing dependencies ..."
          sh "npm ci"

          if ("${env.BRANCH_NAME}" != "${env.NPM_RELEASE_BRANCH}") {
            echo "Current branch ${env.BRANCH_NAME} is not the release branch ${env.NPM_RELEASE_BRANCH}"
            return
          }

          local_version = getShellOutput(script: "node -e \"process.stdout.write(require('./package').version)\"").replaceAll(/\+.+/, '')

          remote_version = []

          viewStatusCode = sh script: "npm view --json ${env.NPM_PKG_NAME} > /dev/null 2>&1", returnStatus: true
          if (viewStatusCode == 0) {
            versionList = getShellOutput(script: "npm view --json ${env.NPM_PKG_NAME}")
            remote_versions = readJSON(text: versionList)["versions"]
          }

          echo "Found local version ${local_version} and remote versions: ${remote_versions}"
          if (remote_versions.contains(local_version)) {
            echo "Local version already exists, skipping publish step"
          } else {
            echo "Versions are different, publishing"
            sh "npm publish"
          }
        }
      }
    }
  }

  post {
    failure {
      emailext(
        attachLog: true,
        to: env.NOTIFY_EMAIL,
        recipientProviders: [developers()],
        body: "For more information:\n\n${env.JOB_URL}",
        subject: "FAILURE: ${env.JOB_NAME} failed"
      )
    }
  }
}