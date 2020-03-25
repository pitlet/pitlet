import sass from 'sass'

interface Api {}

interface Options {
  /**
   * Enable Sass Indented Syntax for parsing the data string or file.
   * @default false
   */
  readonly indentedSyntax?: boolean
}

export const transformSass = ((api,
{ indentedSyntax = false }) = async asset => {
  const { content, ...otherMeta } = asset.meta
  const { error, result } = await new Promise<{
    error: sass.SassException
    result: sass.Result
  }>(resolve => {
    sass.render(
      {
        file: 'index.scss',
        data: content,
        indentedSyntax,
      },
      (error, result) => {
        resolve({ error, result })
      },
    )
  })
  if (error) {
    throw new Error(error.message)
  }
  const transformed: Asset = {
    protocol: 'virtual',
    meta: {
      content: result.css,
      ...otherMeta,
    },
  }
})
