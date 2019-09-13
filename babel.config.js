module.exports = {
  presets: [[
    '@babel/preset-env',
    {
      debug: false,
      useBuiltIns: 'usage',
      corejs: '2.0.0',
    }
  ]],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-block-scoping'
  ]
}
