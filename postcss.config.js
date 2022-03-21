const postcssPresetEnv = require('postcss-preset-env')
const postcssImport = require('postcss-import')
// const postcsseasings = require('postcss-easings')

module.exports = {
  plugins: [
    postcssImport(),
    // postcsseasings(),
    postcssPresetEnv({
      stage: 1,
    })
  ]
}