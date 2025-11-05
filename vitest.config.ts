import { fileURLToPath } from "node:url"
import { mergeConfig, defineConfig, configDefaults } from "vitest/config"
import viteConfig from "./vite.config"

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        exclude: [
          "coverage/**",
          "dist/**",
          "**/node_modules/**",
          "**/[.]**",
          "packages/*/test?(s)/**",
          "**/*.d.ts",
          "**/virtual:*",
          "**/__x00__*",
          "**/\x00*",
          "cypress/**",
          "test?(s)/**",
          "test?(-*).?(c|m)[jt]s?(x)",
          "**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)",
          "**/__tests__/**",
          "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
          "**/capacitor.config.*",
          "**/vite.config.*",
          "**/vitest.config.*",
          "**/.{eslint,mocha,prettier}rc.{js,cjs,yml}",
        ],
      },
    },
  }),
)
