const path = require('path');

module.exports = {
  parser: 'postcss',
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: [
        path.join(__dirname, './src/index.html'),
        path.join(__dirname, './**/*.vue'),
        path.join(__dirname, './src/**/*.js')
      ],
      whitelistPatterns: [/^ae/],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    }),
    require('cssnano')({
      'preset': [
        'default',
        { 'discardComments': { 'removeAll': true } }
      ]
    })
  ]
}
