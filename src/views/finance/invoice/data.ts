import { get, post, put } from '@/fn/ajax'
import {
  dot,
  getEnumText,
  formatValidDateTime,
  joinAddress
} from '@/util/dealData'
import { sum } from 'lodash'
import { devLog } from '@/util/dev'

export const navList = [
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
    invoiceApply: basic = {},
    invoiceTypeList = [],
    invoiceContentList = [],
    orderStatusList = []
  } = data

  // status: 1 待商务审核，2 商务审核不通过，3 待开票，4 已开票

  const { agree = false, refuseReason = '', status = 0 } = basic

  const taxRateList = (data.taxRateList as number[] || []).map(key => ({ key, text: `${key}%` }))

  const result = {
    ...data,
    taxRateList,
    item: {
      orderList: (data.items as any[]).map(
        it => ({
          ...it,
          orderStatusText: getEnumText(orderStatusList, it.orderStatus),
          createTimeText: formatValidDateTime(it.createTime)
        })
      ),
      basicInfo: [
        ['资质信息', '开户名', basic.name || '-'],
        ['', '注册地址', basic.address || '-'],
        ['', '纳税人识别号', basic.taxId || '-'],
        ['', '开户行支行名称', basic.accountBank || '-'],
        ['', '银行账号', basic.accountNumber || '-'],

        ['通讯地址', '联系人', basic.contact || '-'],
        ['', '联系电话', basic.contactTelphone || '-'],
        [
          '',
          '联系地址',
          joinAddress([
            basic.contactProvinceName,
            basic.contactCityName,
            basic.contactCountyName,
            basic.addressDetail
          ])
        ],

        ['开票信息', '开票内容', getEnumText(invoiceContentList, basic.invoiceContent)],
        ['', '开票金额', basic.totalTaxFee || '-'],
        ['', '开票类型', getEnumText(invoiceTypeList, basic.invoiceType)],
        ['', '申请时间', formatValidDateTime(basic.applyTime)],
      ],

      // 开票信息
      invoiceNo: '',
      invoiceType: '',
      invoiceDate: 0,
      taxRate: '',

      totalTaxFee: basic.totalTaxFee,
      taxFreeFee: null,
      taxFee: null,

      materialQuality: 0,
      expressCompany: '',
      expressNo: '',

      status,

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
    applyId: item.id
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
      billINoText: (it.billINo || []).join('\n'),
    }))
  }
  return result
}

const dealPurchaseItem = (data: any) => {
  const {
    billStatusList = [],
  } = data

  const taxRateList = (data.taxRateList as number[] || []).map(key => ({ key, text: `${key}%` }))

  const orderList = (data.items as any[] || []).map(it => ({
    ...it,
    billMonthText: it.billMonth > 0
      ? String(it.billMonth).replace(/(\d{4})(\d{2})/, '$1-$2')
      : '-',
    billCreateTimeText: formatValidDateTime(it.billCreateTime),
    billStatusText: getEnumText(billStatusList, it.billStatus)
  }))

  const totalTaxFee = sum(orderList.map(it => it.billFee || 0))

  const result = {
    ...data,
    taxRateList,
    item: {
      orderList,

      // 开票信息
      invoiceNo: '',
      invoiceType: '',
      invoiceContent: '',
      memo: '',

      invoiceDate: 0,
      totalTaxFee,
      taxRate: '',
      taxFreeFee: null,
      taxFee: null,

      materialQuality: 0,
      expressCompany: '',
      expressNo: '',

      logList: data.logList || [],
    },
  }

  return result
}

/**
 * 查询采购发票详情
 * https://yapi.aiads-dev.com/project/193/interface/api/5398
 * @param query 查询条件
 */
export async function queryPurchaseItem(query: any = {}) {
  const { id } = query
  const { data } = await get(`/invoice/purchase-invoices/${id}`)
  const result = dealPurchaseItem(data)
  return result
}

/**
 * 查询采购登记发票详情
 * https://yapi.aiads-dev.com/project/193/interface/api/5395
 * @param query 查询条件
 */
export async function queryPurchaseItemByIds(query: any = {}) {
  const { data } = await get('/invoice/purchase-invoices/register', query)
  const result = dealPurchaseItem(data)
  return result
}

/**
 * 保存采购发票
 * https://yapi.aiads-dev.com/project/193/interface/api/5393
 * @param item 数据
 */
export async function newPurchaseItem(item: any) {
  const pdata = {
    invoiceNo: item.invoiceNo,
    invoiceType: item.invoiceType,
    invoiceContent: item.invoiceContent,
    memo: item.memo,

    invoiceDate: item.invoiceDate,
    totalTaxFee: item.totalTaxFee,
    taxRate: item.taxRate,

    materialQuality: item.materialQuality,
    expressCompany: item.expressCompany,
    expressNo: item.expressNo,

    businessType: item.businessType,
    billIds: (item.orderList as any[]).map(it => it.billId),
  }
  const { data } = await post('/invoice/purchase-invoices/save', pdata)
  return data
}
