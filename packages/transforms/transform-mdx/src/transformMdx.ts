import mdx from '@mdx-js/mdx'

interface Options {
  readonly renderer: any
}

const DEFAULT_RENDERER = `
import React from 'react'
import { mdx } from '@mdx-js/react'
`

export const transformMdx = (
  api,
  { renderer = DEFAULT_RENDERER },
) => async asset => {
  const { content, ...otherMeta } = asset.meta
  let result
  try {
    result = await mdx(content, { renderer })
  } catch (error) {
    // api.emitError(error)
    return
  }
  const newContent = `${renderer}\n${result}`
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: newContent,
      ...otherMeta,
    },
  }
  return transformed
}
