/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextName = (list: any, name: string, defaltList: any) => {
  let res = ''
  if (list.length === 2) {
      res = 'home'
  } else {
    if (list.findIndex((item: any) => item.name === name) === list.length - 1) {
      res = list[list.length - 2].name
    } else {
      res = list[list.findIndex((item: any) => item.name === name) + 1].name
    }
  }
  return res
}
