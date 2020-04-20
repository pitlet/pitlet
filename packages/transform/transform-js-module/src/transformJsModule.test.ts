import { transformJsModule } from './transformJsModule'

test('import from node_modules', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `import React from 'react'`,
    },
  }
  const transformed = await transformJsModule(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js-module',
      content: `var _react = require("react");`,
      sourceMap: {
        version: 3,
        mappings: 'AAAA',
        names: [],
        sources: ['unknown'],
        sourcesContent: ["import React from 'react'"],
      },
      directDependencies: [
        {
          protocol: 'filesystem',
          meta: {
            importee: 'react',
          },
        },
      ],
    },
  })
})

test('relative import', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `import foo from './foo'`,
    },
  }
  const transformed = await transformJsModule(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js-module',
      content: `var _foo = require("./foo");`,
      sourceMap: {
        version: 3,
        mappings: 'AAAA',
        names: [],
        sources: ['unknown'],
        sourcesContent: ["import foo from './foo'"],
      },
      directDependencies: [
        {
          protocol: 'filesystem',
          meta: {
            importee: './foo',
          },
        },
      ],
    },
  })
})

test('input sourcemap', () => {
  // TODO
})

test('commonjs dependencies', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `const React = require("react")`,
    },
  }
  const transformed = await transformJsModule(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js-module',
      content: `const React = require("react");`,
      sourceMap: {
        version: 3,
        mappings: 'AAAA,MAAMA,KAAK,GAAGC,OAAO,CAAC,OAAD,CAArB',
        names: ['React', 'require'],
        sources: ['unknown'],
        sourcesContent: ['const React = require("react")'],
      },
      directDependencies: [
        {
          protocol: 'filesystem',
          meta: {
            importee: 'react',
          },
        },
      ],
    },
  })
})

test('export all', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `export * from '@vue/runtime-dom'`,
    },
  }
  const transformed = await transformJsModule(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js-module',
      content: `var _runtimeDom = require(\"@vue/runtime-dom\");

Object.keys(_runtimeDom).forEach(function (key) {
  if (key === \"default\" || key === \"__esModule\") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _runtimeDom[key];
    }
  });
});`,
      sourceMap: {
        version: 3,
        mappings: 'AAAA;;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA',
        names: [],
        sources: ['unknown'],
        sourcesContent: [`export * from '@vue/runtime-dom'`],
      },
      directDependencies: [
        {
          protocol: 'filesystem',
          meta: {
            importee: '@vue/runtime-dom',
          },
        },
      ],
    },
  })
})

test('export part', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `export {run} from '@vue/runtime-dom'`,
    },
  }
  const transformed = await transformJsModule(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      type: 'js-module',
      content: `Object.defineProperty(exports, \"run\", {
  enumerable: true,
  get: function () {
    return _runtimeDom.run;
  }
});

var _runtimeDom = require(\"@vue/runtime-dom\");`,
      sourceMap: {
        version: 3,
        mappings: ';;;;;;;AAAA',
        names: [],
        sources: ['unknown'],
        sourcesContent: [`export {run} from '@vue/runtime-dom'`],
      },
      directDependencies: [
        {
          protocol: 'filesystem',
          meta: {
            importee: '@vue/runtime-dom',
          },
        },
      ],
    },
  })
})
