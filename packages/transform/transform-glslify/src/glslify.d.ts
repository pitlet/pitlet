declare module 'glslify' {
  interface Options {
    readonly basedir?: string
  }

  export function compile(source: string, options?: Options): string
}
