const packagesToTranspile = [
  '@aeternity/aepp-components',
  '@aeternity/aepp-sdk'
];

module.exports = {
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
