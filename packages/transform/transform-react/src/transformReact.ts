import * as babel from '@babel/core'
import babelPresetReact from '@babel/preset-react'

const BABEL_TRANSFORM_OPTIONS: babel.TransformOptions = {
  configFile: false,
  babelrc: false,
  presets: [babelPresetReact],
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

export const transformReact = async asset => {
  const {
    content,
    type,
    directDependencies,
    sourceMap,
    ...otherMeta
  } = asset.meta
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
