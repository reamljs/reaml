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
            /Component|PropsPrefix|States|StatesUpdate|Main|StatesComponent|DefineComponent|ImportComponent|IfLogicComponent|ForLogicComponent|LoopComponent|MatchLogicComponent|statesName|mount|render|clean|cleanShadow|observers|addVarsObserver|listenVarsObserver|getHost|content|defaultProps|props|applyProps|updateProps|cleanUglyProps|getOriginStatesName|createObservableStates|registerElements|getProps|Equal|NotEqual|GreaterThan|GreaterThanOrEqual|LessThan|LessThanOrEqual|attrValue|cond|op|initLogic|renderLogic|getStyletag|overridesStyles|showContent|hideContent|addStylesheet|initialValue|renderAs|parseRenderer|elementSelector|elementClass|elementTag|args|shadow|getAttrVal|getHTML|setHTML|createDeepElement|createStaticElement|isCleanup|iteratorCallback|tagAttributes|elementHost/,
        },
      },
    },
  },
  publicDir: path.resolve(__dirname, "dist"),
});
