import { defineConfig } from "vite";
import { sync } from "glob"
import dts from "vite-plugin-dts"

export default () => {
  return defineConfig({
    plugins: [
      dts()
    ],
    build: {
      lib: {
        entry: sync('./src/**/*.ts')
      },
      rollupOptions: {
        external: ['electron'],
      },
    }
  })
}