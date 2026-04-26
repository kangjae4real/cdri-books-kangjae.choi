import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["./src/components/typography.tsx"], // 폴리모픽 컴포넌트 패턴: HTML 태그 이름을 변수에 담는 것이라 안전함, Rule에 어긋나지 않음.
    rules: {
      "react-hooks/static-components": "off",
    },
  },
]);

export default eslintConfig;
