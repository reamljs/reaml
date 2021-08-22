module.exports = {
  entry: {
    waml: __dirname + "/src/index.ts",
  },
  output: {
    path: __dirname + "/dist",
  },
  options: {
    jsc: {
      parser: {
        syntax: "typescript",
        tsx: false,
        decorators: false,
        dynamicImport: false
      },
      minify: {
        compress: {
          unused: true
        },
        mangle: true
      }
    }
  }
};
