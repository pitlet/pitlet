import * as babel from '@babel/core'
import babelPluginTransformReactJsx from '@babel/plugin-transform-react-jsx'

const BABEL_TRANSFORM_OPTIONS: babel.TransformOptions = {
  configFile: false,
  babelrc: false,
  plugins: [
    [
      babelPluginTransformReactJsx,
      {
        pragma: 'h',
        pragmaFrag: 'Fragment',
      },
    ],
  ],
}

const transform = async (id: string, code: string) => {
  const {
    code: transformedCode,
    map: transformedSourceMap,
  } = (await babel.transformAsync(code, {
    ...BABEL_TRANSFORM_OPTIONS,
    filename: id,
    sourceMaps: true,
  })) as babel.BabelFileResult
  return {
    transformedCode,
    transformedSourceMap,
  }
}

export const transformPreact = async asset => {
  const { content, type, sourceMap, ...otherMeta } = asset.meta
  const { transformedCode, transformedSourceMap } = await transform(
    asset.meta.id,
    content,
  )
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: transformedCode,
      sourceMap: transformedSourceMap,
      ...otherMeta,
    },
  }
  return transformed
}
