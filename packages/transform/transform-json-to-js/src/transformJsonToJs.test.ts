import { transformJsonToJs } from './transformJsonToJs'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: '{"hello":"world"}',
    },
  }
  const transformed = await transformJsonToJs(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: 'export default JSON.parse("{\\"hello\\":\\"world\\"}")',
    },
  })
  // expect(mockEmitError).toHaveBeenCalledTimes(0)
})

test('invalid json', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: '{"hello":}',
    },
  }
  const transformed = await transformJsonToJs(api, options)(asset)
  expect(transformed).toEqual(undefined)
  // expect(mockEmitError).toHaveBeenCalledTimes(1)
  // expect(mockEmitError).toHaveBeenCalledWith(
  //   new SyntaxError('Unexpected token } in JSON at position 9'),
  // )
})
