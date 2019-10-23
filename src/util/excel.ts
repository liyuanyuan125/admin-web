import xlsx from 'xlsx'
import { MapType } from '@/util/types'

/**
 * 将二维数组数据转成电子表格 book
 * @param data 二维数组数据
 * @param options 选项
 */
export function arrayToBook(data: any[][], {
  sheetName = 'sheet1'
} = {}) {
  const book = xlsx.utils.book_new()
  const sheet = xlsx.utils.aoa_to_sheet(data)
  xlsx.utils.book_append_sheet(book, sheet, sheetName)
  return book
}

/**
 * 导出表格选项
 */
export interface DownloadBookOptions {
  /** sheet 名，默认 sheet1 */
  sheetName?: string
  /** 导出的文件名，默认 export.xlsx */
  fileName?: string
}

/**
 * 将二维数组数据以电子表格形式下载
 * @param data 二维数组数据
 * @param name sheet 名，同时也是导出的文件名的名字（会自动加后缀 .xlsx）
 */
export function downloadBook(data: any[][], name?: string): void
/**
 * 将二维数组数据以电子表格形式下载
 * @param data 二维数组数据
 * @param options 选项
 */
// tslint:disable-next-line: unified-signatures
export function downloadBook(data: any[][], options?: DownloadBookOptions): void
export function downloadBook(data: any[][], param: string | DownloadBookOptions = {}) {
  const {
    sheetName = 'sheet1',
    fileName = 'export.xlsx'
  } = (typeof param === 'string' ? {
    sheetName: param,
    fileName: param + '.xlsx'
  } : param) as DownloadBookOptions
  const book = arrayToBook(data, { sheetName })
  xlsx.writeFile(book, fileName)
}

/**
 * 将对象数组，转成 downloadBook 等函数所用的二维数组数据
 * @param list 对象数组
 * @param cols 列配置
 */
export function objectListToData(
  list: any[],
  cols: Array<{ key: string, title: string }>
) {
  const headers = cols.map(it => it.title)
  const keys = cols.map(it => it.key)
  const rows = list.map((it, i) => keys.map(key => it[key]))
  const result = [ headers ].concat(rows)
  return result
}
