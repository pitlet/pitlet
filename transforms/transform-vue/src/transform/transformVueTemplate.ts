import { compileTemplate } from '@vue/compiler-sfc'
import { Transform, TransformedAsset } from '../types'

interface Api {}

interface Options {}

export const transformVueTemplate: Transform<Api, Options> = (
  api,
  options,
) => async asset => {
  const { code, errors } = compileTemplate({
    source: asset.content,
    filename: 'index.vue',
  })
  if (errors.length) {
    throw new Error(errors[0].toString())
  }
  const transformed: VirtualAsset = {
    protocol: 'virtual',
    content: code,
    id: asset.id,
  }
  return transformed
}
