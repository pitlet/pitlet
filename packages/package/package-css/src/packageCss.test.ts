import { packageCss } from './packageCss'

test('basic', async () => {
  const assets = [
    {
      protocol: 'virtual',
      meta: {
        type: 'css',
        id: `/test/index.css`,
        content: `h1 {font-size: 24px}`,
        directDependencies: [],
        resolvedDirectDependencies: [],
      },
    },
  ]
  const packaged = await packageCss(assets, '/test', assets[0].meta.id)
  const mainCss = packaged.find(
    (operation) => operation.destinationPath === 'main.css'
  )
  const mainCssMap = packaged.find(
    (operation) => operation.destinationPath === 'main.css.map'
  )
  expect(mainCss).toEqual({
    type: 'write',
    destinationPath: 'main.css',
    content: `h1 {font-size: 24px}
//# sourceMappingURL=./main.css.map
`,
  })
  expect(mainCssMap).toEqual({
    type: 'write',
    content:
      '{"version":3,"file":"modules.js","sections":[],"sourceRoot":"/test"}',
    destinationPath: 'main.css.map',
  })
})
