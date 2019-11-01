/***
 * 所有的 modal 包装方法，均支持 promise，并且永远不 reject，所以
 * 1、不要定义 onOk，直接使用 await
 * 2、要处理 cancel，传 onCancel
 */

import { Modal, Message } from 'iview'

// https://www.iviewui.com/components/modal

/**
 * iView Modal 配置对象，并从原配置对象中去掉 onOk
 */
export interface ModalConfig {
  /**
   * 标题，默认为空
   */
  title?: string

  /**
   * 内容，默认为空
   */
  content?: string

  /**
   * 宽度，单位 px，默认 416
   */
  width?: number | string

  /**
   * 确定按钮的文字，默认「确定」
   */
  okText?: string

  /**
   * 取消按钮的文字，只在Modal.confirm()下有效，默认「取消」
   */
  cancelText?: string

  /**
   * 点击确定按钮时，确定按钮是否显示 loading 状态，开启则需手动
   * 调用Modal.remove()来关闭对话框，默认 false
   */
  loading?: boolean

  /**
   * 页面是否可以滚动，默认 false
   */
  scrollable?: boolean

  /**
   * 是否可以按 Esc 键关闭，默认 false
   */
  closable?: boolean

  // 不要定义 onOk，直接使用 await
  // /**
  //  * 点击确定的回调
  //  */
  // onOk?: () => any

  /**
   * 点击取消的回调，只在Modal.confirm()下有效
   */
  onCancel?: () => any
}

const newConfirm = (msg: string, options: any = {}) => {
  if ('onOk' in options) {
    throw new Error('don\'t use `onOk`, use `await` or `then` instead')
  }
  return new Promise(resolve => {
    const opts = {
      icon: 'confirm',
      content: msg,
      showCancel: false,
      onOk: () => {
        resolve()
      },
      ...options
    }

    // TODO: 使用了 iview 未文档化的特性
    let instance = Modal.newInstance({
      closable: false,
      maskClosable: false,
      footerHide: true,
    })

    opts.onRemove = () => {
      instance = null
    }

    instance.show(opts)
  })
}

/**
 * 显示错误信息对话框，一般来说 alert 默认带一个错误提示图标
 * @param msg 要显示的消息
 * @param config 选项
 */
export function alert(msg: string, config = {} as ModalConfig) {
  return newConfirm(msg, {
    icon: 'error',
    ...config
  })
}

/**
 * 显示确认对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function confirm(msg: string, config = {} as ModalConfig) {
  return newConfirm(msg, {
    showCancel: true,
    ...config
  })
}

/**
 * 显示提示信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function info(msg: string, config = {} as ModalConfig) {
  return newConfirm(msg, {
    icon: 'info',
    title: '信息',
    ...config
  })
}

/**
 * 显示成功信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function success(msg: string, config = {} as ModalConfig) {
  return newConfirm(msg, {
    icon: 'success',
    title: '成功',
    ...config
  })
}

/**
 * 显示错误信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function error(msg: string, config = {} as ModalConfig) {
  return newConfirm(msg, {
    icon: 'error',
    title: '出错了',
    ...config
  })
}

/**
 * 显示警告信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function warning(msg: string, config = {} as ModalConfig) {
  return newConfirm(msg, {
    icon: 'warning',
    title: '警告',
    ...config
  })
}

/**
 * Toast 类型
 */
export type ToastType = 'error' | 'info' | 'success' | 'warning' | 'loading'

/**
 * iView Message 配置对象，但多加了一个 type 对象
 */
export interface ToastConfig {
  /**
   * Toast 类型
   */
  type?: ToastType

  /**
   * 提示内容
   */
  content?: string

  /**
   * 自动关闭的延时，单位秒，不关闭可以写 0，默认为 1.5
   */
  duration?: number

  /**
   * 关闭时的回调
   */
  onClose?: () => any

  /**
   * 是否显示关闭按钮
   */
  closable?: boolean
}

/**
 * 显示全局 toast 提示
 * @param msg 要显示的消息
 * @param config 配置
 */
export function toast(msg: string, config = {} as ToastConfig) {
  const cfg: any = { content: msg, type: 'success', ...config }
  ; (Message as any).config({
    top: cfg.top || Math.floor(window.innerHeight / 3)
  })
  return (Message[cfg.type] || Message.success).call(Message, cfg)
}

/**
 * 显示全局 loading 提示
 * @param msg 要显示的消息
 * @param config 配置
 */
export function loading(msg = 'loading', config = {} as ToastConfig) {
  return toast(msg, { type: 'loading', ...config })
}
