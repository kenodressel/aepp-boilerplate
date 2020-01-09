const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.EnvironmentPlugin(['PRIVATE_KEY', 'PUBLIC_KEY']),
    ],
  },
  chainWebpack: (config) => {
    config.module
      .rule('aes')
      .test(/\.aes$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
};
