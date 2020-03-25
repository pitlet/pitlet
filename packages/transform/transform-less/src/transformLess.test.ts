import { transformLess } from './transformLess'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `@width: 10px;

      h1 {
        width: @width;
      }`,
    },
  }
  const transformed = await transformLess(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `h1 {
  width: 10px;
}
`,
    },
  })
  // expect(mockEmitError).toHaveBeenCalledTimes(0)
})

test('invalid less', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `###`,
    },
  }
  const transformed = await transformLess(api, options)(asset)
  expect(transformed).toEqual(undefined)
  // expect(mockEmitError).toHaveBeenCalledTimes(1)
  // expect(mockEmitError).toHaveBeenCalledWith(new Error('Unrecognised input'))
  // expect(mockGetContent).toHaveBeenCalledTimes(1)
  // expect(mockGetContent).toHaveBeenCalledWith(asset)
})
