import { transformMdx } from './transformMdx'

test('basic', async () => {
  const api = {}
  const options = {}
  const asset = {
    protocol: 'virtual',
    meta: {
      content: `<h1>hello world</h1>`,
    },
  }
  const transformed = await transformMdx(api, options)(asset)
  expect(transformed).toEqual({
    protocol: 'virtual',
    meta: {
      content: `
import React from 'react'
import { mdx } from '@mdx-js/react'

/* @jsx mdx */


const makeShortcode = name => function MDXDefaultShortcode(props) {
  console.warn(\"Component \" + name + \" was not imported, exported, or provided by MDXProvider as global scope\")
  return <div {...props}/>
};

const layoutProps = {
\u0020\u0020
};
const MDXLayout = \"wrapper\"
export default function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType=\"MDXLayout\">
    <h1>hello world</h1>
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;`,
    },
  })
})
