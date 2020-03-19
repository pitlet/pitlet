import * as coffeescript from 'coffeescript'

export const transformCoffee = (api, options) => async asset => {
  const { content, sourceMap, ...otherMeta } = asset.meta
  const compiled = coffeescript.compile(content, {
    filename: 'index.coffee',
    bare: true,
    sourceMap: true,
    sourceRoot: '',
    sourceFiles: [],
    generatedFile: '',
  })
  if (sourceMap) {
    console.warn('Input Sourcemaps are not supported for coffeescript')
  }
  const newContent = compiled.js
  const newSourceMap = {
    ...JSON.parse(compiled.v3SourceMap),
    sourcesContent: [content],
  }
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      sourceMap: newSourceMap,
      ...otherMeta,
    },
  }
  return transformed
}
