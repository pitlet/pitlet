import { Asset, TransformWithApiAndOptions } from 'bsp-types'
import * as pug from 'pug'

interface Api {}

interface Options {}

export const transformPugPlain: Transform<Api, Options> = (
  api,
  options,
) => async asset => {
  const compilationOptions = {
    filename: 'index.pug',
    doctype: 'html',
  }
  const source = asset.content
  const template = pug.compile(source, compilationOptions)
  const newContent = template({})
  const newAsset: Asset = {
    type: 'html',
    content: newContent,
  }
  return newAsset
}
