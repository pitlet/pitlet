import * as cowsay from 'cowsay'

interface TransformCowsayOptions {
  readonly header?: string
}

interface Asset {
  readonly protocol: 'virtual'
  readonly meta: {
    readonly content: string
  }
}

export const createTransformCowsay = (
  options: TransformCowsayOptions,
) => async (asset: Asset) => {
  const { content, ...otherMeta } = asset.meta
  const header = `\n${cowsay.say({ text: options.header || 'what?' })}\n`
  const newContent = `${header}\n${content}`
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
