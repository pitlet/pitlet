const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule],
  'vue-css': [transformCss, transformVueStyle],
  js: [transformJsModule],
  css: [transformCss],
}

;(async () => {
  const bundler = createBundler({ transformFunctionMap })
  const assets = await collectAssets({ bundler })
  console.log(assets)
})()
