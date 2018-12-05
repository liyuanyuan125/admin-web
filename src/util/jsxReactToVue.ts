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
    } else if (key === 'v-html') {
      // 直接支持 v-html
      (res.domProps || (res.domProps = {})).innerHTML = data[key]
    } else if (key === 'v-model') {
      // 简单支持 v-model
      // 通过 vue-property-decorator 定义的组件，似乎不支持在 jsx 注册成 component-name
      // 的形式，但写成 ComponentName 的形式，直接写 value，typescript 编译出错，写成
      // v-model 就不报错了，但 jsx 不支持 v-model，于是在这里将 v-model 简单转成 value
      (res.attrs || (res.attrs = {})).value = data[key]
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
