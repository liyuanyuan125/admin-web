const wellKnownDefValMap = {
  page: 1
}

/**
 * 漂亮化请求参数
 * @param data 数据
 * @param defValMap 默认数据
 */
export function prettyQuery(data: any, defValMap: any = {}) {
  const defMap = { ...wellKnownDefValMap, ...defValMap }

  return Object.keys(data).reduce((map: any, key) => {
    const val = data[key]
    const str = (val + '').trim()
    const def = key in defMap ? defMap[key] : null
    if (val != null && str != '' && str != def) {
      map[key] = str
    }
    return map
  }, {})
}

/// buildUrl

const rUrlParams = /^([^?]*)(?:\?)?(.*)$/

const decode = (s: any) => s != null ? decodeURIComponent(s).trim() : null

const obj2Param = (obj: any) => {
  const list = Object.entries(obj).map(it => {
    // 过滤掉 null，但不过滤空串，以便 k1=v1&onlykey&k2=v2
    const [key, val] = it.map(decode)
    return key !== '' && val !== null
      ? [key, val].join('=').replace(/=$/, '')
      : null
  })

  return list.join('&')
}

const param2Obj = (str: string) => {
  return str.split('&').reduce((ret: any, it) => {
      const s = it.trim()
      if (s) {
          const [key, val] = s.split('=').map(decode)
          // 保留空串，以免丢掉不带值的 KEY
          ret[key!] = val || ''
      }
      return ret
  }, {})
}

const decodeParams = (obj: any) => {
  const newObj: any = {}
  Object.entries(obj).forEach(it => {
      const [key, val] = it.map(decode)
      newObj[key!] = val
  })
  return newObj
}

/**
 * 构建新的 URL
 * @param url 现有的 URL，可以带有 query 参数
 * @param query query 字符串或对象，去除某个参数，可以使用 { some: null }
 */
export function buildUrl(url: string, query: any) {
  const durl = decodeURI(url)
  const params = (typeof query === 'string' ? param2Obj : decodeParams)(query)

  const [ , prefix = '', oldQuery = '' ] = durl.match(rUrlParams) || []
  const newParams = { ...param2Obj(oldQuery), ...params }
  const newQuery = obj2Param(newParams)

  return encodeURI((prefix + '?' + newQuery).replace(/\?$/, ''))
}

const getParams = () => param2Obj(location.search.replace(/^\?/, ''))

/**
 * 获取 url 参数
 * @param name 参数名，不传则获取全部
 * @param defVal 参数默认值
 */
export function urlParam(name?: string, defVal = null) {
  const params = getParams()
  return name ? (name in params ? params[name] : defVal) : params
}
