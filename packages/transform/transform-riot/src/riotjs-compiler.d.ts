declare module '@riotjs/compiler' {
  interface Options {
    readonly file?: string
  }

  interface CompileResult {
    readonly code: string
    readonly map: any
  }

  export function compile(source: string, options: Options): CompileResult
}
