const meta = {
  content: 'console.log(2);',
  sourceMap: {
    version: 3,
    file: 'index.js',
    mappings: 'AAEAA,QAAQC,IAAI',
    names: ['console', 'log'],
    sources: ['src/index.ts'],
    sourcesContent: [
      `const enum NUMBERS {
  ONE = 1
}
console.log(NUMBERS.ONE + NUMBERS.ONE);
`,
    ],
  },
}

const v = {
  version: 3,
  file: 'index.js',
  sources: ['webpack:///./src/index.ts'],
  sourcesContent: [
    'const enum NUMBERS {\n  ONE = 1\n}\nconsole.log(NUMBERS.ONE + NUMBERS.ONE);\n',
  ],
  names: [],
  mappings: 'AAGA,OAAO,CAAC,GAAG,CAAC,0BAA0B',
}

const map = Buffer.from(JSON.stringify(meta.sourceMap)).toString('base64')
const code = `eval(\`${meta.content}\n//# sourceMappingURL=data:application/json;base64,${map}\n//# sourceURL=webpack:///./src/index.ts\`)` //?
