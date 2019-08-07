import { get, post, put } from '@/fn/ajax'
import {
  dot,
  fillByKeyText,
  getEnumText,
  formatValidDateTime
} from '@/util/dealData'
import { KeyText, MapType } from '@/util/types'
import { keyBy } from 'lodash'
import moment from 'moment'
import { devLog } from '@/util/dev'

export const typeList = [
  {
    name: 'sale',
    label: '销售发票',
    route: { name: 'finance-invoice-sale' },
  },
  {
    name: 'purchase',
    label: '采购发票',
    route: { name: 'finance-invoice-purchase' },
  },
]

/**
 * 查询销售发票
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/142/interface/api/2726
 */
export async function querySaleList(query: any = {}) {
  const { data } = await get('/kol/sale-invoices', query)
  const result = {
    ...data,
    items: (data.items as any[] || []).map(it => ({
      ...it,
      orderNoText: (it.orderNo || []).join('; ')
    }))
  }
  return result
}

/**
 * 查询销售发票详情
 * https://yapi.aiads-dev.com/project/142/interface/api/3054
 * @param query 查询条件
 */
export async function querySaleItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/kol/sale-invoices/${id}`)
  const {
    logList = [],
    invoiceApply = {},
    invoiceTypeList = []
  } = data

  // status: 1 待商务审核，2 商务审核不通过，3 待开票，4 已开票

  const { agree = false, refuseReason = '', status = 0 } = invoiceApply

  const taxRateList = (data.taxRateList as number[] || []).map(key => ({ key, text: `${key}%` }))

  const result = {
    ...data,
    taxRateList,
    item: {
      orderList: (data.items as any[]).map(
        it => fillByKeyText(it, {
          orderStatus: data.orderStatusList
        })
      ),
      basicInfo: [
        ['资质信息', '开户名', invoiceApply.name || '-'],
        ['', '注册地址', invoiceApply.address || '-'],
        ['', '纳税人识别号', invoiceApply.taxId || '-'],
        ['', '开户行支行名称', invoiceApply.accountBank || '-'],
        ['', '银行账号', invoiceApply.accountNumber || '-'],

        ['通讯地址', '联系人', invoiceApply.contact || '-'],
        ['', '联系电话', invoiceApply.contactTelphone || '-'],
        ['', '联系地址', invoiceApply.addressDetail || '-'],

        ['开票信息', '开票内容', invoiceApply.invoiceContent || '-'],
        ['', '开票金额', invoiceApply.totalTaxFee || '-'],
        ['', '开票类型', getEnumText(invoiceTypeList, invoiceApply.invoiceType)],
        ['', '申请时间', formatValidDateTime(invoiceApply.applyTime)],
      ],

      // 开票信息
      invoiceNo: '',
      invoiceType: '',
      invoiceDate: 0,
      taxRate: '',

      totalTaxFee: invoiceApply.totalTaxFee,
      taxFreeFee: null,
      taxFee: null,

      materialQuality: 0,
      expressCompany: '',
      expressNo: '',

      // 审核是否通过，默认通过
      auditPass: agree,
      // 是否被审核过（通过或拒绝）
      audited: status > 1,
      refuseReason,

      logList,
    },
  }

  return result
}

/**
 * 保存销售发票
 * https://yapi.aiads-dev.com/project/142/interface/api/2838
 * @param item 数据
 */
export async function newSaleItem(item: any) {
  const pdata = {
    invoiceNo: item.invoiceNo,
    invoiceType: item.invoiceType,
    invoiceDate: item.invoiceDate,
    taxRate: item.taxRate,
    materialQuality: item.materialQuality,
    expressCompany: item.expressCompany,
    expressNo: item.expressNo,
    applyId: item.applyId
  }
  const { data } = await post('/kol/sale-invoices', pdata)
  return data
}

/**
 * 商务审核发票
 * https://yapi.aiads-dev.com/project/142/interface/api/2750
 * @param item 数据
 */
export async function auditSaleItem(item: any) {
  const pdata = {
    agree: item.auditPass,
    refuseReason: item.refuseReason
  }
  const { data } = await put(`/kol/sale-invoices/${item.id}/approval`, pdata)
  return data
}

/**
 * 计算税金
 * https://yapi.aiads-dev.com/project/193/interface/api/5456
 * @param query 查询条件
 */
export async function getTaxFee(query: any = {}) {
  const { data } = await get('/invoice/tax-fee', query)
  return data
}

/**
 * 查询采购发票
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/193/interface/api/5399
 */
export async function queryPurchaseList(query: any = {}) {
  const { data } = await get('/invoice/purchase-invoices', query)
  const result = {
    ...data,
    items: (data.items as any[] || []).map(it => ({
      ...it,
    }))
  }
  return result
}


