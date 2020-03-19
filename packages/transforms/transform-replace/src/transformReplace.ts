// TODO optimize if it's a number or a string (and don't include JSON.parse("42") for 42)

type Transform<Api, Options> = (
  api: Api,
  options: Options,
) => (asset: any) => Promise<any>

interface Options {
  readonly replacements: {
    readonly [key: string]: string
  }
}

interface Api {}

export const transformReplace: Transform<Api, Options> = (
  api,
  { replacements },
) => async asset => {
  const { content, ...otherMeta } = asset.meta
  let newContent = content
  for (const [searchValue, replacement] of Object.entries(replacements)) {
    const searchValueRE = new RegExp(searchValue, 'g')
    newContent = newContent.replace(searchValueRE, replacement)
  }
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
