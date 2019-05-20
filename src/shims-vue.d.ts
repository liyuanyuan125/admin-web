declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

// TODO: 去除这里的声明，改成小写
declare module 'iview' {
  const iView: any
  export default iView
  export const Modal: any       // tslint:disable-line
  export const Message: any     // tslint:disable-line
  export const Input: any       // tslint:disable-line
  export const InputNumber: any // tslint:disable-line
  export const Select: any      // tslint:disable-line
  export const DatePicker: any  // tslint:disable-line
}

declare module 'iview/dist/locale/zh-CN' {
  const locale: any
  export default locale
}

declare module 'clipboard' {
  const clipboard: any
  export default clipboard
}

interface VarType {
  env: string
  baseUrl: string
  ajaxBaseUrl: string
}

declare const VAR: VarType
