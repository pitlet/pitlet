import { transformSucrase } from './transformSucrase'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `import React from 'react'
const Button = () => <button>button</button>`,
    },
  }
  const transformed = await transformSucrase(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `"use strict";const _jsxFileName = "index.jsx"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _react = require('react'); var _react2 = _interopRequireDefault(_react);
const Button = () => _react2.default.createElement('button', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 2}}, \"button\")`,
      sourceMap: undefined,
    },
  })
})
