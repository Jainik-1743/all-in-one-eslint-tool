#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { checkbox } from "@inquirer/prompts";
import pc from "picocolors";
import figlet from "figlet";
import gradient from "gradient-string";

const packagesMap = {
  typescript: ["typescript-eslint"],
  react: ["eslint-plugin-react"],
  reactHooks: ["eslint-plugin-react-hooks"],
  importX: ["eslint-plugin-import-x"],
  jsxA11y: ["eslint-plugin-jsx-a11y"],
  promise: ["eslint-plugin-promise"]
};

// Base dependencies that are always required
const baseDependencies = [
  "eslint",
  "@eslint/js",
  "globals"
];

async function run() {
  console.clear();
  const title = figlet.textSync("ESLint Tool", { font: "Standard" });
  console.log(gradient(["#4facfe", "#00f2fe", "#4facfe"]).multiline(title));
  console.log(pc.cyan("\nWelcome to create-all-in-one-eslint setup! 🚀\n"));

  const answers = await checkbox({
    message: "Which ESLint plugins would you like to include?",
    choices: [
      { name: "TypeScript", value: "typescript" },
      { name: "React", value: "react" },
      { name: "React Hooks", value: "reactHooks" },
      { name: "Import-X (Better import sorting)", value: "importX" },
      { name: "JSX A11y", value: "jsxA11y" },
      { name: "Promise", value: "promise" },
    ]
  });

  if (answers.length === 0) {
    console.log(pc.yellow("No plugins selected. Exiting..."));
    process.exit(0);
  }

  // Generate imports
  let importsStr = `import pluginJs from "@eslint/js";\nimport globals from "globals";\n`;
  if (answers.includes("typescript")) importsStr += `import tseslint from "typescript-eslint";\n`;
  if (answers.includes("react")) importsStr += `import pluginReact from "eslint-plugin-react";\n`;
  if (answers.includes("reactHooks")) importsStr += `import reactHook from "eslint-plugin-react-hooks";\n`;
  if (answers.includes("importX")) importsStr += `import importX from "eslint-plugin-import-x";\n`;
  if (answers.includes("jsxA11y")) importsStr += `import jsxA11y from "eslint-plugin-jsx-a11y";\n`;
  if (answers.includes("promise")) importsStr += `import pluginPromise from "eslint-plugin-promise";\n`;

  // Generate config array elements
  const configElements = [
    `  pluginJs.configs.recommended,`
  ];

  if (answers.includes("typescript")) {
    configElements.push(`  ...tseslint.configs.recommended,`);
  }
  
  if (answers.includes("react")) {
    configElements.push(`  pluginReact.configs.flat.recommended,`);
  }
  
  if (answers.includes("promise")) {
    configElements.push(`  pluginPromise.configs["flat/recommended"],`);
  }

  configElements.push(`  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },`);
  configElements.push(`  { languageOptions: { globals: globals.browser } },`);

  const pluginsObj = [];
  if (answers.includes("reactHooks")) pluginsObj.push(`"react-hooks": reactHook`);
  if (answers.includes("importX")) pluginsObj.push(`"import-x": importX`);
  if (answers.includes("jsxA11y")) pluginsObj.push(`"jsx-a11y": jsxA11y`);

  if (pluginsObj.length > 0) {
    configElements.push(`  {
    plugins: {
      ${pluginsObj.join(",\n      ")}
    },
  },`);
  }

  if (answers.includes("react")) {
    configElements.push(`  {
    settings: {
      react: { version: "detect" },
    },
  },`);
  }

  // Combine rules
  let rulesObj = [];
  rulesObj.push(`"no-console": "warn"`, `"eqeqeq": ["error", "always"]`);

  if (answers.includes("react")) {
    rulesObj.push(
      `"react/react-in-jsx-scope": "off"`,
      `"react/jsx-uses-react": "off"`,
      `"react/no-array-index-key": "error"`,
      `"react/jsx-sort-props": "error"`,
      `"react/sort-default-props": "error"`,
      `"react/sort-comp": "error"`
    );
  }

  if (answers.includes("reactHooks")) {
    rulesObj.push(
      `"react-hooks/rules-of-hooks": "error"`,
      `"react-hooks/exhaustive-deps": "warn"`
    );
  }

  if (answers.includes("importX")) {
    rulesObj.push(
      `"import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["sibling", "parent"], "index", "unknown"],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "next/*", group: "external", position: "before" }
          ],
          pathGroupsExcludedImportTypes: ["react", "next/*"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        }
      ]`
    );
  }

  if (answers.includes("jsxA11y")) {
    rulesObj.push(
      `"jsx-a11y/anchor-is-valid": ["error", { aspects: ["invalidHref", "preferButton"] }]`,
      `"jsx-a11y/no-noninteractive-element-interactions": ["error", { handlers: ["onClick", "onMouseDown", "onMouseUp", "onKeyPress", "onKeyDown", "onKeyUp"] }]`
    );
  }

  if (answers.includes("promise")) {
    rulesObj.push(
      `"promise/always-return": "error"`,
      `"promise/no-return-wrap": "error"`,
      `"promise/param-names": "error"`,
      `"promise/catch-or-return": "error"`,
      `"promise/no-native": "off"`,
      `"promise/no-nesting": "warn"`,
      `"promise/no-promise-in-callback": "warn"`,
      `"promise/no-callback-in-promise": "warn"`,
      `"promise/avoid-new": "warn"`,
      `"promise/no-new-statics": "error"`,
      `"promise/no-return-in-finally": "warn"`,
      `"promise/valid-params": "warn"`,
      `"promise/no-multiple-resolved": "error"`
    );
  }

  if (rulesObj.length > 0) {
    configElements.push(`  {
    rules: {
      ${rulesObj.join(",\n      ")}
    }
  },`);
  }

  configElements.push(`  {
    ignores: ["node_modules", ".next", ".turbo", "build", "out", "coverage", "eslint.config.mjs"],
  },`);

  const fileContent = `${importsStr}
/** @type {import('eslint').Linter.Config[]} */
export default [
${configElements.join("\n")}
];
`;

  // Write the file
  const targetPath = path.join(process.cwd(), "eslint.config.mjs");
  fs.writeFileSync(targetPath, fileContent, "utf8");
  console.log(pc.green(`\n✅ Created eslint.config.mjs`));

  // Determine dependencies to install
  const depsToInstall = [...baseDependencies];
  for (const answer of answers) {
    depsToInstall.push(...packagesMap[answer]);
  }

  console.log(pc.cyan(`\n📦 Installing dependencies: ${depsToInstall.join(", ")}...`));
  
  // Try to detect package manager or fallback to npm
  let pm = "npm";
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("bun")) pm = "bun";
  else if (userAgent.startsWith("pnpm")) pm = "pnpm";
  else if (userAgent.startsWith("yarn")) pm = "yarn";
  else {
    let currentDir = process.cwd();
    while (currentDir !== path.parse(currentDir).root) {
      if (fs.existsSync(path.join(currentDir, "bun.lockb"))) { pm = "bun"; break; }
      if (fs.existsSync(path.join(currentDir, "pnpm-lock.yaml"))) { pm = "pnpm"; break; }
      if (fs.existsSync(path.join(currentDir, "yarn.lock"))) { pm = "yarn"; break; }
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) break;
      currentDir = parentDir;
    }
  }

  const installCmd = `${pm} ${pm === "yarn" ? "add -D" : pm === "bun" ? "add -d" : "install -D"} ${depsToInstall.join(" ")}`;
  
  try {
    execSync(installCmd, { stdio: "inherit" });
    console.log(pc.green(`\n🎉 All done! ESLint configuration is ready.`));
  } catch (error) {
    console.log(pc.red(`\n❌ Failed to install dependencies. Please run:`));
    console.log(pc.yellow(installCmd));
  }
}

run().catch((err) => {
  console.error(pc.red("An error occurred:"), err);
  process.exit(1);
});
