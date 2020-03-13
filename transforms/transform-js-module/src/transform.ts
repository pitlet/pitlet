import babel from '@babel/core'

interface Api {}

interface Options {}

export const transformJsDev: Transform<Api, Options> = ((api,
options) = async asset => {
  const transformed: TransformedAsset = {}
})
