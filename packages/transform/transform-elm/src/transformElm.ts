import elmCompiler from 'node-elm-compiler'
import * as path from 'path'
export const transformElm = (api, options) => async (asset) => {
  asset.meta.absolutePath //?
  return await elmCompiler.compileToString([asset.meta.absolutePath], {
    output: '.js',
  })
}

transformElm(
  {},
  {}
)({
  type: 'virtual',
  meta: {
    absolutePath: path.join(__dirname, 'fixture', 'src', 'Hello.elm'),
    content: `module HelloWorld exposing (main)

  import Html exposing (Html, text)


  main : Html msg
  main =
      Html.text "Hello, World!"
  `,
  },
}) //?
