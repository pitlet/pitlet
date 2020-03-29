import { transformRiot } from './transformRiot'

test('basic', async () => {
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `<app>
  <h1>Hi Riot!</h1>
  <md content={ content } />

  <script>
    export default {}
  </script>

  <style>
    h1 {
      font-size: 24px;
    }
  </style>
</app>`,
    },
  }
  const transformed = await transformRiot(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `export default {
  'css': \`app h1,[is=\"app\"] h1{ font-size: 24px; }\`,
  'exports': {},

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<h1>Hi Riot!</h1><md expr0=\"expr0\"></md>', [{
      'type': bindingTypes.TAG,
      'getComponent': getComponent,

      'evaluate': function(scope) {
        return 'md';
      },

      'slots': [],

      'attributes': [{
        'type': expressionTypes.ATTRIBUTE,
        'name': 'content',

        'evaluate': function(scope) {
          return scope.content;
        }
      }],

      'redundantAttribute': 'expr0',
      'selector': '[expr0]'
    }]);
  },

  'name': 'app'
};`,
    },
  })
  // expect(mockEmitError).toHaveBeenCalledTimes(0)
})
