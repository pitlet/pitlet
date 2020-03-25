import sass from 'sass'

const r = sass.renderSync({
  data: `h1
  color: orangered
`,
  sourceMap: '',
  omitSourceMapUrl: true,
  indentedSyntax: true,
  sourceMapContents: true,
  file: 'index.sass',
  sourceMapRoot: '',
})

r //?

r.map //?

r.css //?
