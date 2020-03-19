declare module 'coffeescript' {
  interface Options {
    readonly literate?: boolean
    readonly filename?: string
    readonly debug?: boolean
    readonly bare?: boolean
    readonly sourceMap?: boolean
    readonly sourceRoot?: string
    readonly sourceFiles?: string[]
    readonly generatedFile?: string
    // transpile:
  }
  interface Result {
    readonly js: string
    readonly sourceMap: any
    readonly v3SourceMap: any
  }
  export function compile(source: string, options?: Options): Result
}
