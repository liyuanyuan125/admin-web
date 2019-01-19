/** 事件处理函数 */
export type Handler = (...args: any[]) => any

/** 事件项 */
export interface HandlerMap {
  [name: string]: Handler
}

/** 事件处理函数与优先级 */
interface HandlerPriority {
  handler: Handler
  priority: boolean
}

/** 事件 Map */
interface EventMap {
  [key: string]: HandlerPriority[]
}

/** 事件类 */
export default class EventClass {
  private _eventMap: EventMap = {}

  /**
   * 监听事件
   * @param name 事件名
   * @param handler 事件处理函数
   * @param priority 优先级，默认为 true
   */
  on(name: string, handler: Handler, priority?: boolean): this
  /**
   * 监听事件
   * @param handlerMap 事件处理 Map
   * @param priority 优先级，默认为 true
   */
  on(handlerMap: HandlerMap, priority?: boolean): this
  on(name: any, handlerOrPriority: any = true, last = true) {
    const [ map, priority ]: [ HandlerMap, boolean ] = typeof name === 'string'
      ? [ { [name]: handlerOrPriority }, last ]
      : [ name, handlerOrPriority ]

    Object.entries(map).forEach(([key, handler]) => {
      const item = { handler, priority }
      ; (this._eventMap[key] || (this._eventMap[key] = [])).push(item)
    })

    return this
  }

  /**
   * 取消监听事件
   * @param name 事件名
   * @param handler 事件处理函数，可选，若不传，则取消 `name` 事件的所有监听者
   */
  off(name: string, handler?: Handler) {
    const list: HandlerPriority[] = this._eventMap[name] || []
    if (handler != null) {
      const index = list.findIndex(it => it.handler === handler)
      index > -1 && list.splice(index, 1)
    } else {
      this._eventMap[name] = []
    }
    return this
  }

  /**
   * 触发事件
   * @param name 事件名
   * @param args 参数列表
   */
  emit(name: string, ...args: any[]) {
    const list = this._eventMap[name] || []

    // 先优先执行 priority 为 true 的事件处理函数
    // 若某项事件处理函数，明确返回 false，则取消后续事件处理函数
    const canceled = list.filter(it => it.priority)
      .some(it => it.handler.apply(this, args) === false)

    // 优先级 priority 为 false 的最后执行，但上面若有事件处理函数
    // 明确返回 false，则此处的低优先级事件处理函数则不会被执行
    canceled || list.filter(it => !it.priority)
      .some(it => it.handler.apply(this, args) === false)

    return this
  }

  /**
   * 判断事件 `name` 是否有关联的事件处理函数
   * @param name 事件名
   */
  hasHandler(name: string) {
    return name in this._eventMap
  }
}
