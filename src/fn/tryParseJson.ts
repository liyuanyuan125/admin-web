/**
 * 尝试解析 JSON，解析不成功，返回默认值
 * @param json JSON 字符串
 * @param defaultValue 默认值
 */
export default function(json: string, defaultValue: any = null) {
  try {
    return JSON.parse(json)
  } catch (ex) {
    return defaultValue
  }
}
