/**
 * 提供一组处理数据的工具方法
 */

export function zeroAsEmpty(val: any) {
    return val !== 0 && val !== '0' ? val : ''
}

export function batchZeroAsEmpty(data: any, fields: string) {
    const list = fields.split(',')
    list.forEach(name => data[name] = zeroAsEmpty(data[name]))
    return data
}

export function delFields(list: any[], fields: string) {
    const fieldList = fields.split(',')
    list.forEach(it => {
        fieldList.forEach(field => delete it[field])
    })
}
