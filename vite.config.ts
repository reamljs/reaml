import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

module.exports = defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "WAML",
      formats: ["iife"],
      fileName: () => `waml.js`,
    },
    terserOptions: {
      compress: {
        ecma: 2019,
        booleans_as_integers: true,
        keep_fargs: false,
        module: true,
        passes: 10,
        unsafe_arrows: true,
        unsafe_undefined: true,
        unsafe_proto: true,
        unsafe_regexp: true,
      },
      mangle: {
        toplevel: true,
        properties: {
          builtins: true,
          regex:
            /mount|createPropsObserver|listenObserver|appendScripts|initProps|updateProps|removeUnusedProps|invokeUpdate|props|createStatesObserver|registerStateComponent|registerDefineComponents|getStatesName|statesName|scripts|Component|States|StatesUpdate|PropsUpdate|Main|StatesComponent|PropsComponent|DefineComponent|ImportComponent|IfLogicComponent|ForLogicComponent|LoopComponent|MatchLogicComponent|Script|createObserver|Equal|NotEqual|GreaterThan|GreaterThanOrEqual|LessThan|LessThanOrEqual|FreeCondition|logicLexer|initLogic|getStyletag|overridesStyles|showContent|hideContent|addStylesheet|isRender|render|proxyProps|defaultProps|cond|initDefaultProps|statesPath|attrValue/,
        },
      },
    },
  },
  publicDir: path.resolve(__dirname, "dist"),
});
