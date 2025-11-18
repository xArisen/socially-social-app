import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "pnpm-lock.yaml",
      "src/generated/**",
    ],
  },
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
