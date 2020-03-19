import { transformWithApiAndOptions } from '../src/transform'

const api = {
  emitError: console.error,
  getContent: async asset => asset.content,
}

const options = {}

const asset = { content: 'hello: world', type: 'yml' }

transformWithApiAndOptions(api)(options)(asset) //?
