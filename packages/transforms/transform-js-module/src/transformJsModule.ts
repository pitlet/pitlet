import * as babel from '@babel/core'
import babelPluginTransformModulesCommonjs from '@babel/plugin-transform-modules-commonjs'

const getDirectDependencies = (ast: babel.types.File) => {
  const { types: t } = babel
  const imports = ast.program.body.filter(node =>
    t.isImportDeclaration(node),
  ) as babel.types.ImportDeclaration[]
  const relativePaths = imports.map(node => node.source.value)
  return relativePaths
}

const BABEL_TRANSFORM_OPTIONS: babel.TransformOptions = {
  configFile: false,
  babelrc: false,
  // compact: true, // false might yield a performance benefit (not sure though)
  plugins: [
    [
      babelPluginTransformModulesCommonjs,
      {
        strict: true, // removes Object.defineProperty(exports, "__esModule", {value:true })
        strictMode: false, // removes "use strict"
        noInterop: true, // removes esmodule interop
      },
    ],
  ],
}

const transform = async (
  absolutePath: string,
  ast: babel.types.File,
  code: string,
) => {
  const { code: transformedCode } = (await babel.transformFromAstAsync(
    ast,
    code,
    {
      ...BABEL_TRANSFORM_OPTIONS,
      filename: absolutePath,
    },
  )) as babel.BabelFileResult
  return {
    transformedCode,
  }
}

export const transformJsModule = async asset => {
  const { content, ...otherMeta } = asset.meta
  const ast = (await babel.parseAsync(content)) as babel.types.File
  const directDependencies = getDirectDependencies(ast)
  const { transformedCode } = await transform(asset.absolutePath, ast, content)
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: transformedCode,
      directDependencies,
      ...otherMeta,
    },
  }
  return transformed
}
