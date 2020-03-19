import { CLIEngine } from 'eslint'

export const transformEslint = (api, options) => async asset => {
  const { content } = await asset.meta
  const engine = new CLIEngine({
    useEslintrc: false,
    baseConfig: {},
    allowInlineConfig: true,
    cache: false,
    extensions: ['js'],
    rules: {},
  })
  const { results, errorCount, warningCount } = engine.executeOnText(
    content,
    'index.js',
  )
  if (errorCount === 0 && warningCount === 0) {
    return asset
  }
  console.log(JSON.stringify(results))
  return asset
}
