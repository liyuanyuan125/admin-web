type Handler = (...args: any[]) => any

interface EventMap {
  [key: string]: Handler[]
}

interface HandlerMap {
  [key: string]: Handler
}

export default class EventClass {
  private _eventMap: EventMap = {}

  on(name: string | HandlerMap, handler?: Handler) {
    const map = typeof name === 'string' ? { [name]: handler! } : name
    Object.entries(map).forEach(([key, val]) => {
      (this._eventMap[key] || (this._eventMap[key] = [])).push(val)
    })
    return this
  }

  off(name: string, handler?: Handler) {
    const list = this._eventMap[name] || []
    if (handler != null) {
      const index = list.indexOf(handler)
      index > -1 && list.splice(index, 1)
    } else {
      this._eventMap[name] = []
    }
    return this
  }

  emit(name: string, ...args: any[]) {
    (this._eventMap[name] || []).some(handler => {
      return handler.apply(this, args) === false
    })
    return this
  }

  hasHandler(name: string) {
    return name in this._eventMap
  }
}
