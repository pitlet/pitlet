import { transformSwc } from './transformSwc'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `import React from 'react'`,
    },
  }
  const transformed = await transformSwc(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `'use strict';
var _react = _interopRequireDefault(require('react'));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
`,
    },
  })
})
