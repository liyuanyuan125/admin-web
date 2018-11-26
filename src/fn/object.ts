/**
 * 取 object 的某些属性，作为新对象
 *
 * @param object 要提取属性的对象
 * @param keys 字符串数组，或以 , 号分割的字符串
 *
 * @return object 新生成的对象
 */
export function slice(object: any, keys: string|string[]): object {
    const keyList = keys instanceof Array ? keys : keys.split(',')
    const newo: any = {}
    for (const n in keyList) {
        if (keyList.hasOwnProperty(n)) {
            const key = keyList[n]
            const val = object[key]
            val !== undefined && (newo[key] = val)
        }
    }
    return newo
}
