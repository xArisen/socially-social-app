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
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "next/navigation",
            importNames: ["useRouter"],
            message: "Use the project useRouter hook instead.",
          },
          {
            name: "react-hook-form",
            importNames: ["useForm"],
            message: "Use the project useForm hook instead.",
          },
        ],
      },
    ],
    eqeqeq: ["error", "always"],
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
  },
});

export default eslintConfig;
