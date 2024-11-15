const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "process": require.resolve("process/browser"),
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "crypto": require.resolve("crypto-browserify"),
  };

  config.plugins = (config.plugins || []).concat ([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);
  
  return config;
};
