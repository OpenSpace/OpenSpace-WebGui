// OpenSpace-WebGui CI/CD pipeline
//
// Builds the Web GUI for every branch and every pull request. Branch builds are published
// to  /data/deploy/gui/<commit sha>/gui.zip
// on the CDN host

properties([
  disableConcurrentBuilds()
])

def name = 'gui'
def deployDirectory = "/data/deploy/${name}"

// Pull requests are built to report a status back to GitHub, but they are not published.
// The branch behind the pull request is indexed as a branch of its own and that build is
// the one that publishes the archive
def isPullRequest = env.CHANGE_ID != null

node('server-liu-misc') {
  deleteDir()

  def commit
  stage("${name}/scm") {
    def scmVars = checkout(scm)
    commit = scmVars.GIT_COMMIT
    echo("Building ${env.BRANCH_NAME} at ${commit}")
  }

  def outputDirectory = "${deployDirectory}/${commit}"

  if (!isPullRequest) {
    def isPublished = false
    stage("${name}/check") {
      node('server-liu-cdn') {
        isPublished = sh(
          script: "test -e ${outputDirectory}/${name}.zip",
          label: "Check whether ${commit} has been published already",
          returnStatus: true
        ) == 0
      }
    }

    if (isPublished) {
      echo("${outputDirectory}/${name}.zip already exists. Skipping this commit")
      currentBuild.result = "NOT_BUILT";
      cleanWs()
      return
    }
  }

  stage("${name}/build") {
    timeout(time: 30, unit: 'MINUTES') {
      sh(
        script: "npm run build",
        label: "Build"
      );
    }
  }

  if (isPullRequest) {
    echo("Skipping the deployment as we are building a pull request")
    cleanWs()
    return
  }

  stage("${name}/package") {
    // The contents of `dist` have to be at the root of the archive as OpenSpace unzips it
    // directly into the folder that it then serves
    sh(
      script: "cd dist && zip -qr ../${name}.zip .",
      label: "Package ${name}.zip"
    );
    sh(
      script: "ls -l ${name}.zip",
      label: "Verify that ${name}.zip was created"
    );
    stash(name: "${name}-archive", includes: "${name}.zip")
  }

  stage("${name}/publish") {
    node('server-liu-cdn') {
      cleanWs()
      unstash("${name}-archive")
      sh(
        script: """
          mkdir -p ${outputDirectory}
          cp ${name}.zip ${outputDirectory}/${name}.zip
          chmod 755 ${outputDirectory}
          chmod 644 ${outputDirectory}/${name}.zip
        """,
        label: "Publish ${name}.zip"
      );
      echo("Published ${name}/${commit}/${name}.zip")
      cleanWs()
    }
  }

  cleanWs()
}
