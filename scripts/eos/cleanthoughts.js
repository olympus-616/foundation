#!/usr/bin/env node

/*****************************************************************************
 * Copyright (C) 2025 CloudPremise LLC d/b/a Olympus-Grid, Inc.
 *
 * This software is licensed under the GNU Affero General Public License (AGPL-3.0).
 * You are free to use, modify, and distribute it under the terms of AGPL-3.0,
 * provided that any modified versions or network-based services using this code
 * are also open-sourced under the same license.
 *
 * ENTERPRISE USE: If you intend to use Olympus-Grid **in a commercial, SaaS, or
 * enterprise environment**, and do not wish to comply with AGPL-3.0 (e.g., open-source
 * your modifications), you **must obtain a commercial license from CloudPremise LLC
 * d/b/a Olympus-Grid, Inc.**
 *
 * Commercial licenses include:
 * - Enterprise deployments
 * - SaaS implementations
 * - Large-scale business applications
 *
 * For commercial licensing, enterprise support, or alternative terms, contact:
 * CloudPremise LLC d/b/a Olympus-Grid, Inc. - legal@cloudpremise.com
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *****************************************************************************/

/**
 * Eos CLI - `cleanthoughts.js`
 *
 * Overview:
 * ----------
 * The `cleanthoughts.js` script removes all **local thought branches**, ensuring
 * a clean working environment **after merging and pushing changes**.
 *
 * Purpose:
 * ---------
 * ✅ Ensure developers start fresh after a PR merge
 * ✅ Automatically switch to the **main brain branch** before cleaning up
 * ✅ Remove all **local branches** except the main brain branch
 * ✅ Prevent confusion from outdated or unnecessary branches
 *
 * Required Git Configuration:
 * ---------------------------
 * Ensure the following values are set in your `.gitconfig`:
 *
 *   [user]
 *       name = G.W. Homer
 *       username = alchemisthomer
 *       email = homer@olympus-616.net
 *       brain = brain/1.3.x.x
 *
 * The `brain` value ensures that Eos knows which branch to **keep** while deleting others.
 *
 * Usage:
 * ------
 * Run manually:
 *   $ node scripts/eos/cleanthoughts.js
 *
 * Or via the Eos CLI:
 *   $ node scripts/eos/index.js
 *   # Select "Clean Thoughts" from the interactive menu.
 *
 * Script Flow:
 * ------------
 * 1️⃣  Fetches the **brain branch** from `.gitconfig`
 * 2️⃣  Checks out the **brain branch** to ensure a safe cleanup
 * 3️⃣  Pulls the **latest updates** from `origin/brain`
 * 4️⃣  Lists all **local branches** and removes them, except the brain branch
 * 5️⃣  Confirms the cleanup was **successful**
 *
 * Expected Output:
 * ----------------
 * ✅ Checked out to main brain: brain/1.3.x.x
 * 📥 Pulling latest updates from origin/brain/1.3.x.x...
 * 🧹 The following branches will be deleted:
 *    - @alchemisthomer/neuralpathway/9b20589-20250310232856
 *    - @alchemisthomer/neuralpathway/f86bacf-20250311201237-Test-Feature
 * ✅ Cleanup complete!
 *
 * Edge Cases Handled:
 * --------------------
 * - If `brain` is missing from `.gitconfig`, it exits with an error.
 * - If already on the brain branch, it skips switching branches.
 * - If there are **no branches to delete**, it safely exits.
 * - Prevents **accidental deletion of the main brain branch**.
 *
 * Next Steps:
 * -----------
 * - 🔥 Add an **undo feature** (e.g., stash deleted branches temporarily)
 * - 🔥 Add an option to **delete remote branches** as well
 * - 🔥 Improve logging for better debugging and automation tracking
 */

import inquirer from "inquirer";
import shell from "shelljs";

const main = async () => {
  const brainBranch = shell
    .exec("git config user.brain", { silent: true })
    .stdout.trim();

  if (!brainBranch) {
    console.error("❌ Error: user.brain is not set in Git config.");
    process.exit(1);
  }

  // Get the current branch
  const currentBranch = shell
    .exec("git rev-parse --abbrev-ref HEAD", { silent: true })
    .stdout.trim();

  // If on a branch that will be deleted, switch to brainBranch first
  if (currentBranch !== brainBranch) {
    console.log(`🔄 Switching to main brain branch: ${brainBranch}...`);
    shell.exec(`git checkout ${brainBranch}`);
  }

  // Pull latest from main brain branch
  console.log(`📥 Pulling latest updates from origin/${brainBranch}...`);
  const pullResult = shell.exec(`git pull origin ${brainBranch}`, {
    silent: false
  });

  if (pullResult.code !== 0) {
    console.error(
      "❌ Failed to pull latest changes. Please resolve conflicts manually."
    );
    process.exit(1);
  }

  // Get a list of all local branches, removing unwanted characters
  const branches = shell
    .exec("git branch --format='%(refname:short)'", { silent: true })
    .stdout.trim()
    .split("\n")
    .map((branch) => branch.replace(/['"]/g, "").trim());

  // Filter out the main brain branch explicitly
  const branchesToDelete = branches.filter(
    (branch) => branch !== brainBranch && branch.length > 0
  );

  if (branchesToDelete.length === 0) {
    console.log("✅ No branches to clean. Everything is up to date.");
    process.exit(0);
  }

  console.log(
    `🧹 The following branches will be deleted:\n${branchesToDelete.join(
      "\n"
    )}\n`
  );

  // Ask for confirmation before deleting
  const { confirmDelete } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmDelete",
      message: "Are you sure you want to delete these branches?",
      default: false
    }
  ]);

  if (!confirmDelete) {
    console.log("❌ Cleanup aborted.");
    process.exit(0);
  }

  // Delete each branch except brainBranch
  branchesToDelete.forEach((branch) => {
    console.log(`🗑️ Deleting: ${branch}...`);
    shell.exec(`git branch -D ${branch}`);
  });

  console.log(`✅ Cleanup complete! You are now on the latest ${brainBranch}.`);
};

main();
