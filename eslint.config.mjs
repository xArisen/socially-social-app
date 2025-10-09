import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

eslintConfig.push({
  rules: {
    curly: ["error", "all"],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "next/navigation",
            importNames: ["useRouter"],
            message: "Use the project hook useRouter.",
          },
        ],
      },
    ],
    "no-unused-vars": [
      "error",
      { args: "after-used", argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    eqeqeq: ["error", "always"],
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
  },
});

export default eslintConfig;
