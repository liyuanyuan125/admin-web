import { Modal, Message } from 'iview'

// https://www.iviewui.com/components/modal

// { title, width, type = error/info/success/warning }
export function alert(msg: string, opts = {}) {
  return new Promise((resolve, reject) => {
    const cfg: any = {
      type: 'error',
      content: msg,
      onOk: () => {
        resolve()
      },
      onCancel: () => {
        reject()
      },
      ...opts
    }
    ; (Modal[cfg.type] || Modal.error).call(Modal, cfg)
  })
}

export function confirm(msg: string, opts = {}) {
  return alert(msg, { type: 'confirm', ...opts })
}

export function info(msg: string, opts = {}) {
  return alert(msg, { type: 'info', title: '信息', ...opts })
}

export function success(msg: string, opts = {}) {
  return alert(msg, { type: 'success', title: '成功', ...opts })
}

export function warning(msg: string, opts = {}) {
  return alert(msg, { type: 'warning', title: '警告', ...opts })
}

// { duration = 1.5, closable = false, type = success/info/warning/error/loading }
export function toast(msg: string, opts = {}) {
  const cfg: any = { content: msg, type: 'success', ...opts }
  ; (Message as any).config({
    top: cfg.top || Math.floor(window.innerHeight / 3)
  })
  ; (Message[cfg.type] || Message.success).call(Message, cfg)
}

export function loading(msg = 'loading', opts = {}) {
  toast(msg, { type: 'loading', ...opts })
}
