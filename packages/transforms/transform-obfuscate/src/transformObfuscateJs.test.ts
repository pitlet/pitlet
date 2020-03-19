import { transformObfuscateJs } from './transformObfuscateJs'

test('basic', async () => {
  const api = {}
  const options = {
    seed: 0.1234,
  }
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'const greeting = "hello world"',
    },
  }
  const transformed = await transformObfuscateJs(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `const _0x157c=['hello\\x20world'];(function(_0x37bf25,_0x157c09){const _0xddf9c4=function(_0x2e9249){while(--_0x2e9249){_0x37bf25['push'](_0x37bf25['shift']());}};_0xddf9c4(++_0x157c09);}(_0x157c,0x14e));const _0xddf9=function(_0x37bf25,_0x157c09){_0x37bf25=_0x37bf25-0x0;let _0xddf9c4=_0x157c[_0x37bf25];return _0xddf9c4;};const greeting=_0xddf9('0x0');`,
    },
  })
})
