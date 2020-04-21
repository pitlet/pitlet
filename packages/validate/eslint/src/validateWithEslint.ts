import { CLIEngine, Linter } from 'eslint'

class ValidationError extends Error {
  code = 'VALIDATION_ERROR'
  constructor() {
    super()
  }
}

export interface ValidateWithEslintOptions {
  readonly parserOptions: Linter.ParserOptions
  readonly baseConfig: {
    readonly [key: string]: any
  }
}

export const validateWithEslint = (options) => async (asset) => {
  const { content, id } = asset.meta
  const engine = new CLIEngine({
    parserOptions: options.parserOptions,
    useEslintrc: false,
    baseConfig: options.baseConfig,
    allowInlineConfig: true,
    cache: false,
    extensions: ['js', 'vue'],
    rules: {},
  })
  const { results, errorCount, warningCount } = engine.executeOnText(
    content,
    id
  )
  if (errorCount > 0 || warningCount > 0) {
    console.log(results.map((x) => x.messages))
    throw new ValidationError()
  }
  return asset
}
