const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      vm: require.resolve("vm-browserify"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"), // 필요한 경우 path-browserify로 설정
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
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
