import { transformStylus } from './transformStylus'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `$width= 10px;

      h1 {
        width: $width;
      }`,
    },
  }
  const transformed = await transformStylus(api, options)(asset)
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
  // expect(mockGetContent).toHaveBeenCalledTimes(1)
  // expect(mockGetContent).toHaveBeenCalledWith(asset)
})

test('invalid stylus', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `$width:10px`,
    },
  }
  const transformed = await transformStylus(api, options)(asset)
  expect(transformed).toEqual(undefined)
  // expect(mockEmitError).toHaveBeenCalledTimes(1)
  // expect(mockGetContent).toHaveBeenCalledTimes(1)
  // expect(mockGetContent).toHaveBeenCalledWith(asset)
})

// TODO stylus bug `###`

// TODO stylus throw an internal parse Error that cannot be tested in jest because stylus doesn't export the Error class
