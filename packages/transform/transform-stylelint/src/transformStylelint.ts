import { lint } from 'stylelint'

export const transformStylelint = (api, options) => async asset => {
  const { content } = asset.meta
  const result = await lint({
    code: content,
    config: {
      rules: [],
    },
  })
  console.log(result)
  return asset
}
