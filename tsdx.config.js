const webWorkerLoader = require('rollup-plugin-web-worker-loader');

module.exports = {
  rollup(config) {
    if (config.output.format === 'umd') {
      delete config.external;
    }
    config.plugins.unshift(webWorkerLoader({
        extensions: [".sharedworker.js", ".worker.js"],
    }));
    return config;
  }
}