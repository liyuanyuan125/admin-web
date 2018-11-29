declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'iview' {
  const iView: any
  export default iView
  export const Modal: any   // tslint:disable-line
  export const Message: any // tslint:disable-line
  export const Input: any // tslint:disable-line
}

declare module 'iview/dist/locale/zh-CN' {
  const locale: any
  export default locale
}

declare module 'env' {
  export const ajaxBaseUrl: string
  export const debug: boolean
}
