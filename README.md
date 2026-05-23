# create-all-in-one-eslint

> 🚀 Interactive CLI to scaffold a modern ESLint flat config in seconds.

Pick the plugins you need — React, TypeScript, Import sorting, Accessibility, Promises — and get a production-ready `eslint.config.mjs` generated instantly with all dependencies installed.

---

## Quick Start

Run this single command in the root of any JavaScript/TypeScript project:

```bash
npx create-all-in-one-eslint@latest
```

That's it! You'll see an interactive checkbox prompt. Select the plugins you want, press Enter, and you're done.

### Other Package Managers

```bash
# Bun
bunx create-all-in-one-eslint@latest

# PNPM
pnpm dlx create-all-in-one-eslint@latest

# Yarn
yarn dlx create-all-in-one-eslint@latest
```

---

## What It Does

1. **Shows an interactive checkbox prompt** — choose which ESLint plugins to include.
2. **Generates `eslint.config.mjs`** — uses the modern [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files) format.
3. **Installs all dependencies** — detects your package manager (`npm`, `bun`, `pnpm`, or `yarn`) and installs only what you selected.

---

## Available Plugins

| Plugin | What It Does |
|---|---|
| **TypeScript** | Adds `typescript-eslint` for type-aware linting |
| **React** | Adds `eslint-plugin-react` with recommended rules |
| **React Hooks** | Enforces Rules of Hooks via `eslint-plugin-react-hooks` |
| **Import-X** | Auto-sorts and groups imports via `eslint-plugin-import-x` |
| **JSX A11y** | Catches accessibility issues via `eslint-plugin-jsx-a11y` |
| **Promise** | Enforces promise best practices via `eslint-plugin-promise` |
| **Next.js** | Core Web Vitals and best practices via `@next/eslint-plugin-next` |
| **Tailwind CSS** | Auto-sorts classes and catches invalid ones via `eslint-plugin-tailwindcss` |
| **Prettier (Config)** | Turns off conflicting ESLint formatting rules via `eslint-config-prettier` |
| **Node.js** | Catches Node-specific bugs via `eslint-plugin-n` |

No plugins are **checked by default** — just select the ones you need.

---

## Example Output

If you select all plugins, the generated `eslint.config.mjs` will look like:

```js
import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHook from "eslint-plugin-react-hooks";
import importX from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginPromise from "eslint-plugin-promise";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginPromise.configs["flat/recommended"],
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  {
    plugins: {
      "react-hooks": reactHook,
      "import-x": importX,
      "jsx-a11y": jsxA11y,
    },
  },
  {
    settings: {
      react: { version: "detect" },
    },
  },
  {
    rules: {
      "no-console": "warn",
      "eqeqeq": ["error", "always"],
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "import-x/order": ["error", { /* ... */ }],
      "jsx-a11y/anchor-is-valid": ["error", { /* ... */ }],
      "promise/always-return": "error",
      // ... and more
    },
  },
  {
    ignores: ["node_modules", ".next", ".turbo", "build", "out", "coverage"],
  },
];
```

---

## Requirements

- **Node.js** >= 18
- An existing project with a `package.json` (run `npm init -y` if you don't have one)

---

## FAQ

### Can I run this in an existing project?
Yes! It will create (or overwrite) the `eslint.config.mjs` file and install the selected plugins as `devDependencies`.

### Which ESLint version does it use?
It installs ESLint v9+ which supports the flat config format.

### Does it support Next.js?
Yes. The import ordering rules include `next/*` path groups out of the box.

---

## License

MIT © [Jainik Patel](https://github.com/Jainik-1743)
