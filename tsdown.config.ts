import { defineConfig } from "tsdown"

export default defineConfig({
  entry: "src/index.ts",
  outDir: "dist",
  format: "esm",
  platform: "node",
  target: "es2022",
  unbundle: false,
  dts: true,
  minify: true,
  sourcemap: false,
  clean: true,
})
