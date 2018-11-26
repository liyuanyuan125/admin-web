/**
 * 用于将 React 格式的 jsx 转换成 Vue 格式的 jsx
 * @author zhangpeng
 */

const isTopLevel: any = {
  class: true,
  staticClass: true,
  style: true,
  key: true,
  ref: true,
  slot: true
}

const isNestable: any = {
  on: true,
  nativeOn: true,
  domProps: true,
  hook: true
}

const transformData = (data: any) => {
  const res: any = {}
  let hyphenIndex
  let nestKey
  for (const key in data) {
    if (isTopLevel[key]) {
      res[key] = data[key]
    } else if (
      (hyphenIndex = key.indexOf('-')) > 0 &&         // tslint:disable-line
      isNestable[nestKey = key.slice(0, hyphenIndex)]
    ) {
      const subKey = key.slice(hyphenIndex + 1)
      ; (res[nestKey] || (res[nestKey] = {}))[subKey] = data[key]
    } else {
      (res.attrs || (res.attrs = {}))[key] = data[key]
    }
  }
  return res
}

export default function(h: any) {
  return (tag: any, data: any, ...res: any[]) => {
    const props = data && transformData(data)
    const children = res.filter(it => !!it)
    return h(tag, props, children)
  }
}
