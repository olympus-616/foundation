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
 * Eos CLI - Olympus-Grid Local Development Automation Tool
 *
 * Overview:
 * ----------
 * Eos is a command-line tool designed to streamline local development workflows
 * for Olympus-Grid. It provides an interactive menu-driven interface that allows
 * developers to efficiently manage thought branches, automate commits, and
 * set up development, test, and beta environments.
 *
 * Features:
 * ----------
 * ✅ Checkout and sync the main brain branch (`brain/1.3.x.x`)
 * ✅ Clean up old branches after a successful PR merge
 * ✅ Create structured "thought" branches for development
 * ✅ Save and stage commits automatically
 * ✅ Automate setup and refresh of development environments
 * ✅ Standardize workflows for all Olympus-Grid contributors
 *
 * Required Git Configuration:
 * ---------------------------
 * Ensure that the following values are set in your `.gitconfig`:
 *
 *   [user]
 *       name = G.W. Homer
 *       username = alchemisthomer
 *       email = homer@olympus-616.net
 *       brain = brain/1.3.x.x
 *
 * The `brain` value ensures that Eos knows which branch to sync as the main reference.
 *
 * Usage:
 * ------
 * Run the CLI interactively:
 *   $ node scripts/eos/index.js
 *
 * Command Menu:
 * -------------
 * 1️⃣  Checkout Main Brain             - Switches to brain/1.3.x.x and pulls latest changes
 * 2️⃣  Clean Thoughts                  - Deletes all local branches except brain
 * 3️⃣  New Thought                     - Creates a new structured development branch
 * 4️⃣  Save Thought                    - Commits staged changes with a structured commit message
 * 5️⃣  Save All                        - Stages all files and commits them automatically
 * 6️⃣  New Development Environment     - Runs `./build.sh` to set up a fresh dev environment
 * 7️⃣  Refresh Existing Dev Environment - Runs `./rebuild.sh` to update an existing dev setup
 * 8️⃣  New Test Environment            - Runs `./test.sh` to create a test org
 * 9️⃣  New Beta Environment            - Runs `./beta.sh` to prepare a beta release
 * 🔟  New Namespace Org                - Runs `./build_ns.sh` to create a namespace org
 *
 * Notes:
 * ------
 * - The CLI auto-detects **Windows vs. Unix** and runs shell scripts accordingly.
 * - It restarts automatically after execution for continuous workflow efficiency.
 * - Ensure you have `bash` installed on Windows to execute `.sh` scripts.
 *
 * Next Steps:
 * -----------
 * - 🔥 Implement global CLI alias for `eos`
 * - 🔥 Add logging for execution tracking
 * - 🔥 Expand automation to deployment workflows
 */

import inquirer from "inquirer";
import { execSync } from "child_process";
import os from "os";

const isWindows = os.platform() === "win32";

const main = async () => {
  console.clear();
  console.log("🌅 Welcome to Eos - Your Local Dev CLI\n");

  let { command } = await inquirer.prompt([
    {
      type: "list",
      name: "command",
      message: "🌀 Choose an action:",
      choices: [
        { name: "1️⃣  Checkout Main Brain", value: "mainbrain" },
        { name: "2️⃣  Clean Thoughts", value: "cleanthoughts" },
        { name: "3️⃣  New Thought", value: "newthought" },
        { name: "4️⃣  Save Thought", value: "savethought" },
        {
          name: "5️⃣  Save All (git add . && eos savethought)",
          value: "saveall"
        },
        new inquirer.Separator(),
        {
          name: "6️⃣  New Development Environment (./build.sh)",
          value: "newdev"
        },
        {
          name: "7️⃣  Refresh Existing Dev Environment (./rebuild.sh)",
          value: "refreshdev"
        },
        { name: "8️⃣  New Test Environment (./test.sh)", value: "newtest" },
        { name: "9️⃣  New Beta Environment (./beta.sh)", value: "newbeta" },
        { name: "🔟  New Namespace Org (./build_ns.sh)", value: "newns" },
        new inquirer.Separator(),
        { name: "❌ Exit", value: "exit" }
      ]
    }
  ]);

  if (command === "exit") {
    console.log("👋 Exiting Eos CLI. Have a great day!");
    process.exit(0);
  }

  let args = [];
  if (command === "newthought" || command === "savethought") {
    const { input } = await inquirer.prompt([
      {
        type: "input",
        name: "input",
        message: `✏️ Enter ${
          command === "newthought" ? "thought name" : "commit message"
        }:`
      }
    ]);
    args.push(input);
  }

  // Handle Save All
  if (command === "saveall") {
    console.log("📌 Staging all changes...");
    execSync("git add .", { stdio: "inherit" });
    command = "savethought";
    const { input } = await inquirer.prompt([
      {
        type: "input",
        name: "input",
        message: "💾 Enter commit message for Save All:"
      }
    ]);
    args.push(input);
  }

  // Handle build scripts
  const scriptMap = {
    newdev: "build",
    refreshdev: "rebuild",
    newtest: "test",
    newbeta: "beta",
    newns: "build_ns"
  };

  if (scriptMap[command]) {
    const script = scriptMap[command];

    // Determine the correct command based on OS
    const runCommand = isWindows ? `bash ./${script}.sh` : `./${script}.sh`;

    console.log(`🚀 Running: ${runCommand}`);
    execSync(runCommand, { stdio: "inherit" });
  } else {
    // Run the selected command
    try {
      execSync(`node scripts/eos/${command}.js ${args.join(" ")}`, {
        stdio: "inherit"
      });
    } catch (error) {
      console.error(`❌ Error executing ${command}:`, error.message);
    }
  }

  // Restart CLI after execution
  setTimeout(main, 1000);
};

main();
