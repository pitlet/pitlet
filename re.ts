// @ts-ignore
import * as typeMap from './typeMap.json'

const typeRE = new RegExp('.(' + Object.keys(typeMap).join('|') + ')$')

const getType = absolutePath => {
  const match = absolutePath.match(typeRE)
  if (!match) {
    throw new Error('unknown type')
  }
  if (!(match[1] in typeMap)) {
    throw new Error('invalid typeMap')
  }
  return typeMap[match[1]]
}

const file = '/test/index.svelte'
getType(file) //?
