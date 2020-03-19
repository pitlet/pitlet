const OFFSET_CHAR_MAP = [
  'A',
  'C',
  'E',
  'G',
  'I',
  'K',
  'M',
  'O',
  'Q',
  'S',
  'U',
  'W',
  'Y',
]

const REVERSE_OFFSET_MAP = Object.fromEntries(
  OFFSET_CHAR_MAP.map((value, index) => [value, index]),
)

const getCharOffset = (char: string) => {
  if (!(char in REVERSE_OFFSET_MAP)) {
    throw new Error('invalid mapping')
  }
  return REVERSE_OFFSET_MAP[char]
}

const getOffsetString = (offset: number) => {
  if (offset > OFFSET_CHAR_MAP.length) {
    throw new Error('no')
  }
  const char = OFFSET_CHAR_MAP[offset]
  return `AA${char}A`
}

/**
 * Fixes the sourcemap for blocks
 */
export const transformVuePostTransformBlock = (api, options) => async asset => {
  let {
    content,
    sourceMap,
    vueOriginalSource,
    vueOriginalSourceContent,
    vueBlockOffset,
    ...otherMeta
  } = asset.meta
  const transformedContent = content
  const offsetMatch = sourceMap.mappings.match(/AA(\w)A/)
  let originalMappings = sourceMap.mappings
  if (offsetMatch) {
    vueBlockOffset += getCharOffset(offsetMatch[1])
    if (originalMappings.length > 4) {
      originalMappings = originalMappings.slice(5)
    } else {
      originalMappings = ''
    }
  }
  const offsetString = getOffsetString(vueBlockOffset)
  const transformedSourceMap = {
    ...sourceMap,
    sources: [vueOriginalSource],
    sourcesContent: [vueOriginalSourceContent],
    mappings: offsetString + ',' + originalMappings,
  }
  const transformed = {
    protocol: 'virtual',
    meta: {
      content: transformedContent,
      sourceMap: transformedSourceMap,
      ...otherMeta,
    },
  }
  return transformed
}
