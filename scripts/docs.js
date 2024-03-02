const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const config = {
  mainRepoPath: path.join(__dirname, ".."),
  wikiRepoURL: "https://github.com/vitor-peixoto/test.wiki.git",
  wikiFolderName: "docs",
  remoteBranch: "origin/master",
};

// Function to check for changes
function checkForChanges() {
  try {
    // Compare local branch with the remote branch
    const diffOutput = execSync(`git diff --name-only ${config.remoteBranch}`, {
      cwd: config.mainRepoPath,
      encoding: "utf-8",
    });

    const changedFiles = diffOutput
      .split("\n")
      .filter((file) => file.startsWith(config.wikiFolderName + "/"));

    if (changedFiles.length > 0) {
      console.log(
        "Changes detected in docs folder. Pushing changes to wiki..."
      );

      // Initialize Git repository within the docs folder
      execSync("git init", {
        cwd: path.join(config.mainRepoPath, config.wikiFolderName),
      });

      // Add all files
      execSync("git add .", {
        cwd: path.join(config.mainRepoPath, config.wikiFolderName),
      });

      // Commit changes
      execSync('git commit -m "Update docs folder"', {
        cwd: path.join(config.mainRepoPath, config.wikiFolderName),
      });

      // Set remote URL
      execSync(`git remote add origin ${config.wikiRepoURL}`, {
        cwd: path.join(config.mainRepoPath, config.wikiFolderName),
      });

      // Push changes to the wiki repository
      execSync("git push -u origin master --force", {
        cwd: path.join(config.mainRepoPath, config.wikiFolderName),
      });

      console.log("Changes pushed to wiki.");

      // Remove the Git repository from the docs folder
      if (
        fs.existsSync(
          path.join(config.mainRepoPath, config.wikiFolderName, ".git")
        )
      ) {
        fs.rmSync(
          path.join(config.mainRepoPath, config.wikiFolderName, ".git"),
          {
            recursive: true,
            force: true,
          }
        );
      }
    } else {
      console.log("No changes detected in docs folder.");
    }
  } catch (err) {
    console.error("Error:", err.stderr || err);
  }
}

// Check for changes initially
checkForChanges();
