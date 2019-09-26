module.exports = {
  presets: [[
    '@babel/preset-env',
    {
      debug: false,
      useBuiltIns: 'usage',
      corejs: 3
    }
  ]],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-modules-commonjs',
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
    '@babel/plugin-transform-block-scoping'
  ]
};
