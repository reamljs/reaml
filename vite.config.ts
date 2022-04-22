import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

module.exports = defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "Reaml",
      fileName: () => `reaml.js`,
    },
  //   terserOptions: {
  //     compress: {
  //       ecma: 2019,
  //       booleans_as_integers: true,
  //       keep_fargs: false,
  //       module: true,
  //       passes: 10,
  //       unsafe_arrows: true,
  //       unsafe_undefined: true,
  //       unsafe_proto: true,
  //       unsafe_regexp: true,
  //     },
  //     mangle: {
  //       toplevel: true,
  //       // properties: {
  //       //   builtins: true,
  //       //   // regex:
  //       //   //   //g,
  //       // },
  //     },
  //   },
  },
  publicDir: path.resolve(__dirname, "dist"),
});
