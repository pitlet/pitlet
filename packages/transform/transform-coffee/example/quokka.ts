import { transformWithApiAndOptions } from '../src/transform'

const api = {
  getContent: async asset => asset.content,
}

const options = {}

const asset = { content: 'x=1', type: 'coffee' }

transformWithApiAndOptions(api)(options)(asset) //?
