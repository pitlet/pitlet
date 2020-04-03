import { createTransformCowsay } from './transformCowsay'

test('basic', async () => {
  const options = {
    header: 'Hi',
  }
  const asset = {
    protocol: 'virtual',
    meta: {
      content: 'hello world',
    },
  }
  const transformed = await createTransformCowsay(options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `
 ____
< Hi >
 ----
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||

hello world`,
    },
  })
})
