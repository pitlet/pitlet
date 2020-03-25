import { obfuscate } from 'javascript-obfuscator'

interface Options {
  readonly seed: number
}

export const transformObfuscateJs = (
  api,
  { seed = Math.random() },
) => async asset => {
  const { content, ...otherMeta } = asset.meta
  const result = obfuscate(content, {
    seed,
  })
  const newContent = result.getObfuscatedCode()
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
