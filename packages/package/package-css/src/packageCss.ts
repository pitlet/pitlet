export const packageCss = async (
  assets,
  workspaceFolder: string,
  entryId: string
) => {
  let cssCode = ``
  let lineOffset = 1
  const sourceRoot = workspaceFolder
  const sourceMap = {
    version: 3,
    file: 'modules.js',
    sections: [],
    sourceRoot,
  }
  for (const asset of assets) {
    if (asset.meta.type !== 'css') {
      continue
    }
    if (asset.meta.sourceMap) {
      sourceMap.sections.push({
        offset: {
          line: lineOffset,
          column: 0,
        },
        map: {
          version: 3,
          file: asset.meta.sourceMap.file,
          mappings: asset.meta.sourceMap.mappings,
          names: asset.meta.sourceMap.names,
          sources: asset.meta.sourceMap.sources,
          sourcesContent: asset.meta.sourceMap.sourcesContent,
          sourceRoot,
        },
      })
    }
    cssCode += asset.meta.content
    lineOffset += asset.meta.content!.split('\n').length
  }
  cssCode += '\n'
  const stringifiedSourceMap = JSON.stringify(sourceMap)
  cssCode += `//# sourceMappingURL=./main.css.map`
  cssCode += '\n'
  return [
    {
      type: 'write',
      destinationPath: 'main.css',
      content: cssCode,
    },
    {
      type: 'write',
      destinationPath: 'main.css.map',
      content: stringifiedSourceMap,
    },
  ]
}
