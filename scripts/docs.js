const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const mainRepoPath = path.join(__dirname, "..");
const wikiRepoURL = "https://github.com/vitor-peixoto/test.wiki.git";
const docsFolder = "docs";
const remoteBranch = "origin/master"; // Change this to match your remote branch

// Function to check for changes
function checkForChanges() {
  try {
    // Compare local branch with the remote branch
    const diffOutput = execSync(`git diff --name-only ${remoteBranch}`, {
      cwd: mainRepoPath,
      encoding: "utf-8",
    });

    const changedFiles = diffOutput
      .split("\n")
      .filter((file) => file.startsWith(docsFolder + "/"));

    if (changedFiles.length > 0) {
      console.log(
        "Changes detected in docs folder. Pushing changes to wiki..."
      );

      // Initialize Git repository within the docs folder
      execSync("git init", { cwd: path.join(mainRepoPath, docsFolder) });

      // Add all files
      execSync("git add .", { cwd: path.join(mainRepoPath, docsFolder) });

      // Commit changes
      execSync('git commit -m "Update docs folder"', {
        cwd: path.join(mainRepoPath, docsFolder),
      });

      // Set remote URL
      execSync(`git remote add origin ${wikiRepoURL}`, {
        cwd: path.join(mainRepoPath, docsFolder),
      });

      // Push changes to the wiki repository
      execSync("git push -u origin master --force", {
        cwd: path.join(mainRepoPath, docsFolder),
      });

      console.log("Changes pushed to wiki.");

      // Remove the Git repository from the docs folder
      fs.rmdirSync(path.join(mainRepoPath, docsFolder, ".git"), {
        recursive: true,
      });
    } else {
      console.log("No changes detected in docs folder.");
    }
  } catch (err) {
    console.error("Error:", err.stderr || err);
  }
}

// Check for changes initially
checkForChanges();
