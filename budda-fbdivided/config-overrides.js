const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process"),
    buffer: require.resolve("buffer"),
  };

  config.plugins = (config.plugins || []).concat([
    new NodePolyfillPlugin(),
    new webpack.ProvidePlugin({
      process: "process",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  return config;
};