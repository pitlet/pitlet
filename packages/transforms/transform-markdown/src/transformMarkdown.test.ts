import { transformMarkdown } from './transformMarkdown'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: '# hello: world',
    },
  }
  const transformed = await transformMarkdown(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `<h1 id="hello-world">hello: world</h1>\n`,
    },
  })
})
