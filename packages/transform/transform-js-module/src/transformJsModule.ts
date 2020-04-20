import * as babel from '@babel/core'
import babelPluginTransformModulesCommonjs from '@babel/plugin-transform-modules-commonjs'
import traverse from '@babel/traverse'

const getDirectDependencies = (ast: babel.types.File) => {
  const { types: t } = babel
  const imports = ast.program.body.filter((node) =>
    t.isImportDeclaration(node)
  ) as babel.types.ImportDeclaration[]
  const relativePaths = imports.map((node) => node.source.value)
  const dependencyAssets = relativePaths.map((relativePath) => ({
    protocol: 'filesystem',
    meta: {
      importee: relativePath,
    },
  }))
  traverse(ast, {
    enter(path) {
      if (
        t.isCallExpression(path.node) &&
        t.isIdentifier(path.node.callee) &&
        path.node.callee.name === 'require' &&
        t.isStringLiteral(path.node.arguments[0])
      ) {
        const importee = path.node.arguments[0].value
        dependencyAssets.push({
          protocol: 'filesystem',
          meta: {
            importee,
          },
        })
      } else if (t.isExportAllDeclaration(path.node)) {
        const importee = path.node.source.value
        dependencyAssets.push({
          protocol: 'filesystem',
          meta: {
            importee,
          },
        })
      } else if (t.isExportNamedDeclaration(path.node)) {
        const importee = path.node.source.value
        dependencyAssets.push({
          protocol: 'filesystem',
          meta: {
            importee,
          },
        })
      }
    },
  })
  return dependencyAssets
}

// ;(async () => {
//   const content = `export {part} from '@vue/runtime-dom'`
//   const ast = (await babel.parseAsync(content)) as babel.types.File
//   getDirectDependencies(ast) //?
// })()

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
  id: string,
  ast: babel.types.File,
  code: string,
  inputSourceMap: any
) => {
  const {
    code: transformedCode,
    map: transformedSourceMap,
  } = (await babel.transformFromAstAsync(ast, code, {
    ...BABEL_TRANSFORM_OPTIONS,
    filename: id,
    sourceMaps: true,
    inputSourceMap,
  })) as babel.BabelFileResult
  return {
    transformedCode,
    transformedSourceMap,
  }
}

export const transformJsModule = async (asset) => {
  const {
    content,
    type,
    directDependencies,
    sourceMap,
    ...otherMeta
  } = asset.meta
  const ast = (await babel.parseAsync(content)) as babel.types.File
  const { transformedCode, transformedSourceMap } = await transform(
    asset.meta.id,
    ast,
    content,
    sourceMap
  )
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: transformedCode,
      directDependencies: directDependencies || getDirectDependencies(ast),
      sourceMap: transformedSourceMap,
      type: 'js-module',
      ...otherMeta,
    },
  }
  return transformed
}
