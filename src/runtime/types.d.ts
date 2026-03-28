declare module 'jsesc' {
  interface JsescOptions {
    es6?: boolean
    quotes?: 'single' | 'double' | 'backtick'
    wrap?: boolean
    compact?: boolean
  }
  function jsesc(value: string, options?: JsescOptions): string
  export default jsesc
}

declare module '#sidebase-pdf/tailwind' {
  export const tailwindCss: string
}

declare module '#sidebase-pdf/pagedjs' {
  export const polyfill: string
}

declare module '#sidebase-pdf/user-css' {
  export const userCss: string
}

declare module '#pdf' {
  export { usePDF } from '@sidebase/nuxt-pdf/components'
}

declare module '#pdf/components' {
  export * from '@sidebase/nuxt-pdf/components'
}
