// next.config.js
module.exports = {
    webpack: (config) => {
      // Webpackキャッシュを無効化
      config.cache = false;
      return config;
    },
  };
