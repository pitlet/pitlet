declare module 'imba/lib/compiler' {
  interface Options {
    readonly sourceMap?: boolean
    readonly comments?: boolean
    readonly target?: 'web'
    readonly sourcePath?: string
  }

  export function compile(
    content: string,
    options: Options,
  ): { toString: () => string }
}
