const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      process: require.resolve("process/browser"),
      path: require.resolve("path-browserify"), // path 폴리필 추가
      os: require.resolve("os-browserify/browser"),
    },
  };

  config.plugins = (config.plugins || []).concat([
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ]);

  return config;
};