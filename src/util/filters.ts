/// 定义一些常用的 filters，注意：所有定义的 filter，均以 filter 开头

import moment from 'moment'

const formatDate = 'YYYY-MM-DD'
const formatTime = 'HH:mm:ss'
const formatTimeNoSecond = 'HH:mm'

const filterDateCommon = (time: number | string | Date, format: string) =>
  moment(time).format(format)

interface DateTimeOptions {
  separator: string
  noSecond: boolean
}

const defaultDateTimeOptions: DateTimeOptions = {
  separator: ' ',
  noSecond: false
}

/**
 * 将时间加工成 YYYY-MM-DD 格式
 * @param time 时间
 */
export function filterDate(time: number | string | Date) {
  return filterDateCommon(time, formatDate)
}

/**
 * 将时间加工成 HH:mm:ss 格式
 * @param time 时间
 */
export function filterTime(time: number | string | Date) {
  return filterDateCommon(time, formatTime)
}

/**
 * 将时间加工成 YYYY-MM-DD HH:mm:ss 格式
 * @param time 时间
 * @param dateTimeSeparator 日期时间分隔符，默认为空格
 */
export function filterDateTime(time: number | string | Date, options: DateTimeOptions) {
  const opts = { ...defaultDateTimeOptions, ...options }
  const format = `${formatDate}${opts.separator}${opts.noSecond ? formatTimeNoSecond : formatTime}`
  return filterDateCommon(time, format)
}
