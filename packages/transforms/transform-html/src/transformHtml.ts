import parse from 'posthtml-parser'
import posthtml from 'posthtml'

// const

const getScriptType = (src: string) => {
  if (src.endsWith('.ts')) {
    return 'ts'
  }
  if (src.endsWith('.js')) {
    return 'js'
  }
  throw new Error(`unknown script type ${src}`)
}

const getImageType = (src: string) => {
  if (src.endsWith('.jpg')) {
    return 'jpg'
  }
  if (src.endsWith('.png')) {
    return 'png'
  }
  throw new Error(`unknown image type ${src}`)
}

const getLinkStyleSheetType = (href: string) => {
  if (href.endsWith('.css')) {
    return 'css'
  }
  if (href.endsWith('.styl')) {
    return 'styl'
  }
  if (href.endsWith('.scss')) {
    return 'scss'
  }
  if (href.endsWith('.sass')) {
    return 'sass'
  }
  throw new Error(`unknown stylesheet type ${href}`)
}

export const transformHtml = (api, options) => async asset => {
  // TODO handle absolute paths that start with /
  const childAssets = []
  const ast = await posthtml([])
    .use(tree => {
      tree.walk(node => {
        if (node.tag === 'script' && node.attrs && node.attrs.src) {
          if (
            node.attrs.src.startsWith('https://') ||
            node.attrs.src.startsWith('http://') ||
            node.attrs.src.startsWith('//')
          ) {
            childAssets.push({
              protocol: 'http',
              meta: {
                importee: node.attrs.src,
                node,
              },
            })
          } else {
            childAssets.push({
              protocol: 'filesystem',
              meta: {
                importee: node.attrs.src,
                node,
              },
            })
          }
        } else if (node.tag === 'img' && node.attrs && node.attrs.src) {
          if (
            node.attrs.src.startsWith('https://') ||
            node.attrs.src.startsWith('http://') ||
            node.attrs.src.startsWith('//')
          ) {
            childAssets.push({
              protocol: 'http',
              meta: {
                importee: node.attrs.src,
                node,
              },
            })
          } else {
            childAssets.push({
              protocol: 'filesystem',
              meta: {
                importee: node.attrs.src,
                node,
              },
            })
          }
        } else if (
          node.tag === 'link' &&
          node.attrs &&
          node.attrs.rel === 'stylesheet' &&
          node.attrs.href
        ) {
          node //?
          if (
            node.attrs.href.startsWith('https://') ||
            node.attrs.href.startsWith('http://') ||
            node.attrs.href.startsWith('//')
          ) {
            childAssets.push({
              protocol: 'http',
              meta: {
                type: 'html-link',
                importee: node.attrs.href,
                node,
              },
            })
          } else {
            // TODO assert that it is a stylesheet
            childAssets.push({
              protocol: 'filesystem',
              meta: {
                importee: node.attrs.href,
                node,
              },
            })
          }
        }
        return node
      })
    })
    .process(asset.content)

  for (const childAsset of childAssets) {
    if (childAsset.meta.node) {
      if (childAsset.meta.node.tag === 'script') {
        childAsset.meta.node.attrs.src = 'index.js'
      }
      // childAsset.meta.node
      delete childAsset.meta.node
    }
  }
  ast.html //?
  // ;(await ast).html //?
  return childAssets
}

transformHtml(
  {},
  {},
)({
  type: 'virtual',
  content: `<DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="index.css">
</head>
  <body>
    <h1>hello world</h1>
    <!--<img src="https://source.unsplash.com/random">-->
    <script src="index.ts"></script>
  </body>
</html>
`,
}) //?
