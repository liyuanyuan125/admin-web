/**
 * 所有的 ajax 请求，都要使用该组件进行
 * @author zhangpeng
 */

import axios from 'axios'
import event from './event'

const ajaxBaseUrl = VAR.ajaxBaseUrl

const isAbsoluteUrl = (url: string) => /^[a-z][a-z0-9+.-]*:/.test(url)

const emit = (r: any) => {
  r.handled = false
  event.emit(`ajax${r.code}`, r)
  return r
}

// 确保最终的数据，始终有值
const perfectData = ({ code, data, msg }: any = {}) => {
  return {
    code,
    data: data || {},
    msg: msg || '',
  }
}

const request = async (url: string, opts: object) => {
  const isAbs = isAbsoluteUrl(url)
  const finalUrl = isAbs ? url : ajaxBaseUrl + url

  let res: any

  try {
    res = await axios({
      baseURL: isAbs ? '' : ajaxBaseUrl,
      url: finalUrl,
      withCredentials: true,
      ...opts,
    })
  } catch (ex) {
    if (ex && ex.response) {
      const { status, data: html } = ex.response
      throw emit({ code: 888, data: { html }, msg: `http 错误：${status}` })
    } else {
      throw emit({ code: 810, data: { ex }, msg: '未知错误' })
    }
  }

  const { data } = res

  if (data && data.code !== undefined) {
    const result = perfectData(data)
    if (data.code == 0) {
      return result
    } else {
      throw emit(result)
    }
  } else {
    throw emit({ code: 800, data: { raw: data }, msg: '数据格式错误' })
  }
}

export async function get(url: string, data?: object, opts?: object) {
  return request(url, {
    method: 'get',
    params: {
      ...data,
      _: Date.now(),
    },
    ...opts,
  })
}

export async function post(url: string, data?: object, opts?: object) {
  return request(url, {
    method: 'post',
    data,
    ...opts,
  })
}

export async function put(url: string, data?: object, opts?: object) {
  return request(url, {
    method: 'put',
    data,
    ...opts,
  })
}

export async function del(url: string, data?: object, opts?: object) {
  return request(url, {
    method: 'delete',
    data,
    ...opts,
  })
}
