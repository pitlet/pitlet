const OFFSET_CHAR_MAP = [
  'A', // 0
  'C', // 1
  'E', // 2
  'G', // 3
  'I', // 4
  'K', // 5
  'M', // 6
  'O', // 7
  'Q', // 8
  'S', // 9
  'U', // 10
  'W', // 11
  'Y', // 12
]

// TODO this is better but there is a bug with quokka atm
// const REVERSE_OFFSET_MAP = Object.fromEntries(
//   OFFSET_CHAR_MAP.map((value, index) => [value, index]),
// )

const REVERSE_OFFSET_MAP = Object.create(null)
for (let i = 0; i < OFFSET_CHAR_MAP.length; i++) {
  REVERSE_OFFSET_MAP[OFFSET_CHAR_MAP[i]] = i
}

const getCharOffset = (char: string) => {
  if (!(char in REVERSE_OFFSET_MAP)) {
    throw new Error('invalid mapping')
  }
  return REVERSE_OFFSET_MAP[char]
}

/**
 * Generates an empty mapping for the first x lines
 * @param offset - number of lines with an empty mapping
 * @example
 * getEmptyMapping(2) // `AAEA`
 */
const getEmptyMapping = (offset: number) => {
  if (offset > OFFSET_CHAR_MAP.length) {
    throw new Error('no')
  }
  const char = OFFSET_CHAR_MAP[offset]
  return `AA${char}A` // empty mapping for the first x lines
}

const getTransformedSourceMap = ({
  sourceMap,
  vueBlockOffset,
  vueOriginalSource,
  vueOriginalSourceContent,
}) => {
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
  const emptyMapping = getEmptyMapping(vueBlockOffset)
  const transformedSourceMap = {
    ...sourceMap,
    sources: [vueOriginalSource],
    sourcesContent: [vueOriginalSourceContent],
    mappings: emptyMapping + ',' + originalMappings,
  }
  return transformedSourceMap
}

/**
 * Fixes the sourcemap for blocks
 */
export const transformVuePostTransformBlock = async asset => {
  let {
    sourceMap,
    vueBlockOffset,
    vueOriginalSource,
    vueOriginalSourceContent,
    ...otherMeta
  } = asset.meta
  if (!sourceMap) {
    return asset
  }
  const transformedSourceMap = getTransformedSourceMap({
    sourceMap,
    vueBlockOffset,
    vueOriginalSource,
    vueOriginalSourceContent,
  })
  const transformed = {
    protocol: 'virtual',
    meta: {
      sourceMap: transformedSourceMap,
      ...otherMeta,
    },
  }
  return transformed
}
