const packagesToTranspile = [
  '@aeternity/aepp-components',
  '@aeternity/aepp-sdk',
];

// Set your credentials here for testing without a wallet
/*

process.env.PUBLIC_KEY = '';
process.env.SECRET_KEY = '';
 */

const SDK = require('@aeternity/aepp-sdk');

const keyPair = SDK.Crypto.generateKeyPair();
process.env.PUBLIC_KEY = keyPair.publicKey;
process.env.SECRET_KEY = keyPair.secretKey;

module.exports = {
  verbose: true,
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.(aes|svg)$': 'jest-raw-loader',
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${packagesToTranspile.join('|')})/)`,
  ],
  testURL: 'http://localhost/',
};
