const isDev = VAR.env == 'dev'

// clone 一份，以免被 vue 加工成带 ob 的格式，影响观感
const cloneArgs = (args: any[]) => JSON.parse(JSON.stringify(args))

/**
 * 开发环境下显示 log，其他情况下什么都不做
 */
export function devLog(...args: any[]) {
  // tslint:disable-next-line
  isDev && console.log(...cloneArgs(args))
}

/**
 * 开发环境下显示 info，其他情况下什么都不做
 */
export function devInfo(...args: any[]) {
  // tslint:disable-next-line
  isDev && console.info(...cloneArgs(args))
}

/**
 * 开发环境下显示 warn，其他情况下什么都不做
 */
export function devWarn(...args: any[]) {
  // tslint:disable-next-line
  isDev && console.warn(...cloneArgs(args))
}

/**
 * 开发环境下显示 error，其他情况下什么都不做
 */
export function devError(...args: any[]) {
  // tslint:disable-next-line
  isDev && console.error(...cloneArgs(args))
}
