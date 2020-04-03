declare module 'cowsay' {
  interface Options {
    readonly text: string
  }
  export function say(options: Options): string
}
