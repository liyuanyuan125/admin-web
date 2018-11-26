declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'iview' {
  const iView: any
  export default iView
  // tslint:disable-next-line
  export const Modal: any
  // tslint:disable-next-line
  export const Message: any
}

declare module 'env' {
  export const ajaxBaseUrl: string
}
