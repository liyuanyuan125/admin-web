import moment, { Moment } from 'moment'
import 'moment/locale/zh-cn'
import Vue from 'vue'

// 算法来自 iview 源码
export function clearHours(time: number | string | Date ) {
  const cloneDate = new Date(time)
  cloneDate.setHours(0, 0, 0, 0)
  return cloneDate.getTime()
}

// 算法来自 iview 源码
export function isInRange(time: number, a: number, b: number) {
  if (!a || !b) {
    return false
  }
  const [start, end] = [a, b].sort()
  return time >= start && time <= end
}

const defineLocale = (name: string, weekStart: number) => {
  moment.defineLocale(name, {
    parentLocale: 'zh-cn',
    week: {
      dow: weekStart,
      doy: 4
    }
  })
}

const changeLocale = <T>(date: Date, weekStart: number, action: (m: Moment) => T): T => {
  const locale = `zh-cn-dow-${weekStart}`
  const localeList = moment.locales()
  if (!localeList.includes(locale)) {
    defineLocale(locale, weekStart)
  }
  const result = action(moment(date).locale(locale))
  return result
}

export function thisWeek(date: Date, weekStart: number) {
  return changeLocale(date, weekStart, m => {
    const start = m.clone().startOf('week').toDate()
    const end = m.clone().endOf('week').toDate()
    return [start, end]
  })
}

export function weekNames(weekStart: number) {
  const list = moment().locale('zh-cn').localeData().weekdaysMin()
  const result = list.slice(weekStart).concat(list.slice(0, weekStart))
  return result
}

const regexDateRange = /^\d{4}-\d{2}-\d{2}\s+~\s+\d{4}-\d{2}-\d{2}$/

/**
 * 将 YYYY-MM-DD ~ YYYY-MM-DD 格式的字符串，解析成日期范围
 * @param string 字符串
 */
export function stringToRange(string: string) {
  const str = (string || '').trim()
  if (str == '' || !regexDateRange.test(str)) {
    return [null, null]
  }
  const [start, end] = str.split(/\s*~\s*/)
  const stime = Date.parse(start)
  const etime = Date.parse(end)
  if (isNaN(stime) || isNaN(etime)) {
    return [null, null]
  }
  const startTime = Math.min(stime, etime)
  const endTime = Math.max(stime, etime)
  return [new Date(startTime), new Date(endTime)]
}

const dateFormat = 'YYYY-MM-DD'

/**
 * 将开始日期、结束日期，加工成 YYYY-MM-DD ~ YYYY-MM-DD 格式的字符串
 * @param start 开始日期
 * @param end 结束日期
 */
export function toRange(start: Date | null, end: Date | null) {
  if (start == null || end == null) {
    return ''
  }
  const startPart = moment(start).format(dateFormat)
  const endPart = moment(end).format(dateFormat)
  return [startPart, endPart].join(' ~ ')
}

export function findChildren(vue: Vue, className: string) {
  if (vue.$children == null) {
    return undefined
  }

  let item = vue.$children.find(child => child.$el.classList.contains(className))
  if (item != null) {
    return item
  }

  vue.$children.some(child => {
    item = findChildren(child, className)
    return item != null
  })

  return item
}
