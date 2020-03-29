import { transformJsonToJs } from './transformImba'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `greeting = 'hello world'`,
    },
  }
  const transformed = await transformJsonToJs(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `var self = {};
self.:setGreeting('hello world');
`,
    },
  })
})
