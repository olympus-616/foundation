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
 * Eos CLI - `newthought.js`
 *
 * Overview:
 * ----------
 * The `newthought.js` script creates a **new structured thought branch** for development.
 * This ensures that all work follows a standardized branching pattern.
 *
 * Purpose:
 * ---------
 * ✅ Generate a branch name with a **structured format**
 * ✅ Automatically switch to the new branch
 * ✅ Ensure **traceability** of thought branches for better organization
 * ✅ Keep contributor history clear for pull requests and merges
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
 * The `brain` value ensures that Eos knows which branch to use as the base for thought branches.
 *
 * Usage:
 * ------
 * Run manually:
 *   $ node scripts/eos/newthought.js "Feature XYZ"
 *
 * Or via the Eos CLI:
 *   $ node scripts/eos/index.js
 *   # Select "New Thought" from the interactive menu.
 *
 * Branch Naming Convention:
 * --------------------------
 * The generated branch name follows this format:
 *   @username/neuralpathway/<base>-<shortHash>-<timestamp>-<description>
 *
 * Example Output:
 * ---------------
 * ✅ Creating branch: @alchemisthomer/neuralpathway/3c969af-f86bacf-20250311201237-Test-Feature
 * Switched to a new branch '@alchemisthomer/neuralpathway/3c969af-f86bacf-20250311201237-Test-Feature'
 *
 * Script Flow:
 * ------------
 * 1️⃣  Fetches the **brain branch** from `.gitconfig`
 * 2️⃣  Determines the **base commit** (merge-base between HEAD and brain)
 * 3️⃣  Gets the **short commit hash** for easy identification
 * 4️⃣  Builds the branch name using:
 *     - `@username`
 *     - `neuralpathway/`
 *     - `base hash`
 *     - `short hash`
 *     - `timestamp`
 *     - `thought description`
 * 5️⃣  Creates and switches to the new branch
 *
 * Edge Cases Handled:
 * --------------------
 * - If `brain` is missing from `.gitconfig`, it exits with an error.
 * - If no thought description is provided, it still follows the naming convention.
 * - If a branch with the same name exists, it prevents accidental overwrites.
 *
 * Next Steps:
 * -----------
 * - 🔥 Auto-detect if a similar branch already exists to prevent duplication
 * - 🔥 Improve logging with branch metadata tracking
 * - 🔥 Add an option to link the new thought to an existing issue/ticket
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

  // Get the merge base and shorten it to 7 characters
  let base = shell
    .exec(`git merge-base HEAD ${brainBranch}`, { silent: true })
    .stdout.trim();
  base = base
    ? shell
        .exec(`git rev-parse --short ${base}`, { silent: true })
        .stdout.trim()
    : "";

  if (!base) {
    console.warn(
      `⚠ Warning: No common ancestor found between HEAD and ${brainBranch}. Using HEAD instead.`
    );
    base = shell
      .exec("git rev-parse --short HEAD", { silent: true })
      .stdout.trim();
  }

  const current = shell
    .exec("git rev-parse --short HEAD", { silent: true })
    .stdout.trim();
  const contributor = shell
    .exec("git config user.username", { silent: true })
    .stdout.trim()
    .replace(/ /g, "_");
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.]/g, "")
    .slice(0, 14);

  let label = process.argv[2] || "";
  let sanitizedLabel = label.replace(/ /g, "-").replace(/[()]/g, "");

  // If base and current are the same, remove base from the branch name
  const hashPart = base !== current ? `${base}-${current}` : `${current}`;

  const branchName = `@${contributor}/neuralpathway/${hashPart}-${timestamp}-${sanitizedLabel}`;

  console.log(`✅ Creating branch: ${branchName}`);
  shell.exec(`git checkout -b "${branchName}"`);
};

main();
