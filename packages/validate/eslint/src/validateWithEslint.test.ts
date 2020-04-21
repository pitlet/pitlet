import { validateWithEslint } from './validateWithEslint'

describe('js', () => {
  const options = {
    baseConfig: {
      extends: ['eslint:recommended'],
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  }

  test('invalid code', async () => {
    const asset = {
      protocol: 'virtual',
      meta: {
        content: 'let x = unknown',
        absolutePath: '/test/index.js',
      },
    }
    await expect(validateWithEslint(options)(asset)).rejects.toEqual(
      new Error()
    )
  })

  test('valid code', async () => {
    const asset = {
      protocol: 'virtual',
      meta: {
        content: 'export const x = 1',
        absolutePath: '/test/index.js',
      },
    }
    await expect(validateWithEslint(options)(asset)).resolves.toBe(asset)
  })
})

describe('vue', () => {
  const options = {
    baseConfig: {
      extends: ['eslint:recommended', 'plugin:vue/recommended'],
    },
  }
  test('invalid code', async () => {
    const asset = {
      protocol: 'virtual',
      meta: {
        content: `<template>
  <h1>hello world
</template>        `,
        absolutePath: '/test/index.vue',
      },
    }
    await expect(validateWithEslint(options)(asset)).rejects.toEqual(
      new Error()
    )
  })

  test('valid code', async () => {
    const asset = {
      protocol: 'virtual',
      meta: {
        content: `<template>
  <h1>hello world</h1>
</template>        `,
        absolutePath: '/test/index.vue',
      },
    }
    await expect(validateWithEslint(options)(asset)).resolves.toBe(asset)
  })
})
