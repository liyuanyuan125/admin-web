/***
 * 通用验证规则库
 *
 * NOTE:
 *
 * 1、不通用的规则不要放在这里
 *
 * 2、所有的验证规则，均为函数，并以 validate 开头，返回 string 值或 undefined，
 *    如果 string 为空或 undefined，则表示验证通过；非空 string 是错误消息
 *
 * 3、目前，所有函数必须为「同步」函数，异步验证稍后有需要再讨论
 */

/**
 * 验证密码
 * @param password 密码值
 */
export function validatePassword(password: string): string | undefined {
  if (password === '') {
    return '密码不能为空'
  }

  if (/\s/.test(password)) {
    return '密码不能含有空格'
  }

  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return '密码必须大小写字母、数字组合，缺一不可'
  }

  // 一般直接在 input 上设置 maxlength 为 16，此处就不验证过长了，最后一条规则兜底
  if (password.length < 8) {
    return '密码过短，不能少于 8 位'
  }

  if (!/^[a-zA-Z\d]{8,16}$/.test(password)) {
    return '密码不合法，合法的密码：8-16 位大小写字母、数字组合'
  }
}

/**
 * 验证中国手机号
 * @param mobile 手机号
 */
export function validataTel(mobile: string): string | undefined {
  const reg = /^[1][0-9]{10}$/
  if (!reg.test(mobile)) {
    return '输入手机号格式有误'
  }
}

/**
 * 验证邮箱地址
 * @param email 邮箱
 */
export function validateEmail(email: string): string | undefined {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  if (!reg.test(email)) {
    return '邮箱格式错误'
  }
}


/**
 * 年月日转换时间戳格式
 */
export function formatTimestamp(val: any) {
  if (!val) {
    return ''
  }
  return new Date(val).getTime()
}

/**
 * 数字格式化保留两位小数每个三位加逗号
 */
export function formatNumber(num: number, type?: any) {
  if (num != undefined) {
    if (type == 2) {
       return num.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    } else {
       return num.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    }
  }
}

/**
 * 日期转换格式
 * type = 2 格式转化去除 -
 */
type strFor = string | number
export function formatConversion(str: strFor, type?: number) {
  str = str + ''
  if (type == 2) {
    return str.replace(/-/g, '')
  }
  return str.replace(/^(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
}

/**
 * 获取当前日期
 * 格式 = 20190616
 */
export function getTodayDate() {
  const todayDate = new Date().toLocaleDateString().split('/')
  const year = todayDate[0]
  const mouth = todayDate[1].length == 1 ? '0' + todayDate[1] :  todayDate[1]
  const date = todayDate[2].length == 1 ? '0' + todayDate[2] :  todayDate[2]
  return `${year}${mouth}${date}`
}

/**
 * 数字规则
 * 千用逗号表示，万用万字表示保留一位小数，亿保留2位小数
 */
export function roleNumber(num: string | number) {
  num = '' + num
  if (num.length < 4) {
    return num
  } else if (num.length == 4) {
    return num.replace(/^(\d{1})(\d{3})$/, '$1,$2')
  } else if (num.length >= 5 ) {
    const tenThousand = (Number(num) / 10000).toFixed(1)
    return `${tenThousand}万`
  } else if (num.length >= 9) {
    const calculate = (Number(num) / 100000000).toFixed(2)
    return `${calculate}亿`
  } else {
    return 0
  }
}
