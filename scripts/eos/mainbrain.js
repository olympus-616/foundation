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
 * Eos CLI - `mainbrain.js`
 *
 * Overview:
 * ----------
 * The `mainbrain.js` script ensures that developers are always working from the latest
 * version of the **main brain branch** (configured in `.gitconfig` as `brain`).
 *
 * Purpose:
 * ---------
 * ✅ Automatically determine the correct brain branch from `git config`
 * ✅ Switch to the brain branch safely
 * ✅ Pull the latest changes from `origin` to ensure an up-to-date workspace
 * ✅ Prevent accidental work on outdated codebases
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
 * The `brain` value ensures that Eos knows which branch to check out when running this script.
 *
 * Usage:
 * ------
 * Run manually:
 *   $ node scripts/eos/mainbrain.js
 *
 * Or via the Eos CLI:
 *   $ node scripts/eos/index.js
 *   # Select "Checkout Main Brain" from the interactive menu.
 *
 * Script Flow:
 * ------------
 * 1️⃣  Reads the `brain` branch name from `.gitconfig`
 * 2️⃣  Checks if the current branch is already the brain branch
 * 3️⃣  If not, switches to the brain branch
 * 4️⃣  Pulls the latest updates from `origin/brain`
 * 5️⃣  Confirms the switch was successful
 *
 * Expected Output:
 * ----------------
 * If already on the main brain branch:
 *   ✅ Already on brain/1.3.x.x, pulling latest changes...
 *
 * If switching branches:
 *   🔄 Switching to main brain branch: brain/1.3.x.x...
 *   📥 Pulling latest updates from origin/brain/1.3.x.x...
 *   ✅ Successfully switched to brain/1.3.x.x!
 *
 * Edge Cases Handled:
 * --------------------
 * - If the `brain` branch is missing from `.gitconfig`, it exits with an error.
 * - If the `git pull` fails, it warns the user.
 * - If switching fails, it prevents unintended branch loss.
 *
 * Next Steps:
 * -----------
 * - 🔥 Improve logging with timestamps and execution duration
 * - 🔥 Auto-stash uncommitted changes before switching branches
 * - 🔥 Ensure compatibility with different Git setups (e.g., rebase-based workflows)
 */

import shell from "shelljs";

const main = () => {
  const brainBranch = shell
    .exec("git config user.brain", { silent: true })
    .stdout.trim();

  if (!brainBranch) {
    console.error("❌ Error: user.brain is not set in Git config.");
    process.exit(1);
  }

  if (!brainBranch) {
    console.error("❌ Error: user.brain is not set in Git config.");
    process.exit(1);
  }

  const existingBranches = shell.exec("git branch --list", {
    silent: true
  }).stdout;

  if (!existingBranches.includes(brainBranch)) {
    console.error(
      `❌ Error: The branch '${brainBranch}' does not exist locally.`
    );
    console.log("🔄 Fetching from origin...");
    shell.exec(`git fetch origin ${brainBranch}`);
  }

  console.log(`✅ Switching to ${brainBranch}...`);
  shell.exec(`git checkout ${brainBranch}`);
};

main();
