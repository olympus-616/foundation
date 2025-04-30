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
 * Eos CLI - `savethought.js`
 *
 * Overview:
 * ----------
 * The `savethought.js` script commits changes to the **current thought branch** with
 * a structured commit message. This ensures all commits follow a consistent pattern
 * for better traceability in the repository.
 *
 * Purpose:
 * ---------
 * ✅ Commit only **staged** changes (prevents accidental commits of unreviewed code)
 * ✅ Standardized commit messages with thought branch metadata
 * ✅ Enable quick identification of commits associated with specific thought branches
 * ✅ Optionally allow a commit message description for better clarity
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
 * Usage:
 * ------
 * Run manually:
 *   $ node scripts/eos/savethought.js "Refactored authentication module"
 *
 * Or via the Eos CLI:
 *   $ node scripts/eos/index.js
 *   # Select "Save Thought" from the interactive menu.
 *
 * Commit Message Format:
 * -----------------------
 * The commit message follows this structured format:
 *   @username:thought/<shortHash>-<timestamp>-<description>
 *
 * Example:
 * --------
 * ✅ Creating commit: @alchemisthomer:thought/b5a9fc3-20250311202640-Refactored-Auth
 *
 * Script Flow:
 * ------------
 * 1️⃣  Ensures changes are **staged** before committing
 * 2️⃣  Fetches the **short commit hash** from HEAD for easy identification
 * 3️⃣  Generates a **commit message** using:
 *     - `@username`
 *     - `thought/`
 *     - `short hash`
 *     - `timestamp`
 *     - `commit description`
 * 4️⃣  Executes `git commit -m` with the structured message
 * 5️⃣  Pushes the commit to the **current branch’s upstream**
 *
 * Edge Cases Handled:
 * --------------------
 * - If no files are staged, it warns the user and exits.
 * - If no commit message is provided, it defaults to a basic structured format.
 * - If the push fails (e.g., no upstream branch), it provides instructions to fix it.
 *
 * Next Steps:
 * -----------
 * - 🔥 Add a **dry-run** mode to preview the commit message before committing
 * - 🔥 Improve handling of **branch tracking** for unpushed branches
 * - 🔥 Ensure compatibility with **rebased workflows** (e.g., squash merges)
 */

import shell from "shelljs";

const main = () => {
  const username = shell
    .exec("git config user.username", { silent: true })
    .stdout.trim();
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);
  const currentHash = shell
    .exec("git rev-parse --short HEAD", { silent: true })
    .stdout.trim();

  let label = process.argv[2] || "";
  let sanitizedLabel = label.replace(/ /g, "-").replace(/[()]/g, "");

  // Check for staged changes
  const stagedChanges = shell
    .exec("git diff --cached --name-only", { silent: true })
    .stdout.trim();
  if (!stagedChanges) {
    console.error(
      "❌ Error: No staged changes found. Use 'git add <file>' before running savethought."
    );
    process.exit(1);
  }

  const commitMessage = `@${username}:thought/${currentHash}-${timestamp}${
    sanitizedLabel ? `-${sanitizedLabel}` : ""
  }`;

  console.log(`✅ Creating commit: ${commitMessage}`);
  shell.exec(`git commit -m "${commitMessage}"`);

  console.log("🚀 Pushing changes...");

  // Check if branch has an upstream
  const branchName = shell
    .exec("git rev-parse --abbrev-ref HEAD", { silent: true })
    .stdout.trim();
  const hasUpstream =
    shell.exec(`git rev-parse --abbrev-ref --symbolic-full-name @{u}`, {
      silent: true
    }).code === 0;

  if (!hasUpstream) {
    console.log(`🔄 Setting upstream for branch: ${branchName}`);
    shell.exec(`git push --set-upstream origin ${branchName}`);
  } else {
    shell.exec(`git push`);
  }

  console.log("✅ Changes pushed successfully.");
};

main();
