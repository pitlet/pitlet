import { compileStyleAsync } from '@vue/compiler-sfc'
import { Asset, Transform } from '../types'

interface Api {}

interface Options {}

export const transformVueStyle: Transform<Api, Options> = (
  api,
  options,
) => async asset => {
  const { code, map, errors } = await compileStyleAsync({
    source: asset.content,
    filename: 'index.vue',
    id: 'data-v-123',
    scoped: true,
  })
  if (errors.length) {
    throw errors[0]
  }
  const transformed: VirtualAsset = {
    protocol: 'virtual',
    content: code,
    id: asset.id,
  }
  return transformed
}
