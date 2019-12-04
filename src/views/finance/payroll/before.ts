import moouth from './mouth.vue'
import remoteselect from './data/index.vue'
import company from './data/company.vue'
import moment from 'moment'

export const beforefetch: any =  [
  {
    name: 'cinemaId',
    defaultValue: 0,
    component: remoteselect,
    width: 128,
    placeholder: '影城名称'
  },

  {
    name: 'code',
    defaultValue: '',
    input: true,
    width: 88,
    placeholder: '影城专资码'
  },

  {
    name: 'resourceId',
    defaultValue: 0,
    component: company,
    width: 168,
    placeholder: '资源方公司名称'
  },

  {
    name: 'resourceBillNo',
    defaultValue: '',
    input: true,
    width: 128,
    placeholder: '账单编号',
  },

  {
    name: 'invoiceType',
    defaultValue: 0,
    select: true,
    width: 100,
    placeholder: '发票类型',
    enumKey: 'invoiceTypeCodeList'
  },

  {
    name: 'invoiceStatus',
    defaultValue: '',
    select: true,
    width: 100,
    placeholder: '发票状态',
    enumKey: 'invoiceStatusList'
  },

  {
    name: 'time',
    defaultValue: '',
    component: moouth,
    width: 100,
    placeholder: '账单月份',
    dealParam(value: string) {
      return {
        yearMonth: value ? value.replace(/\-/, '')  : ''
      }
    }
  },

  {
    name: 'dateRange',
    defaultValue: '',
    dateRange: true,
    width: 200,
    placeholder: '对账时间',
    dealParam(value: string) {
      const [beginDate, endDate] = value ? value.split('-') : [null, null]
      return {
        applyBeginDate: beginDate,
        applyEndDate: endDate
      }
    }
  },

  {
    name: 'pageIndex',
    defaultValue: 1
  },

  {
    name: 'applyType',
    defaultValue: 1
  },

  {
    name: 'billStatus',
    defaultValue: 4
  },

  {
    name: 'pageSize',
    defaultValue: 20
  }
]

export const beforenum: any = [
  'applyTypeList',
  'billStatusList',
  'invoiceContentCodeList',
  'invoiceStatusList',
  'invoiceTypeCodeList',
  'payStatusList'
]

export const beforcoulm: any = [
  { title: '账单编号', key: 'resourceBillNo', minWidth: 65 },
  { title: '影城名称', key: 'cinemaName', minWidth: 100 },
  { title: '影城专资码', key: 'code', minWidth: 70, deprecated: true },
  { title: '资源方名称', key: 'resourceName', minWidth: 70 },
  {
    title: '账单月份',
    key: 'kolId',
    minWidth: 90,
    slot: 'month'
  },
  { title: '对账完成时间', key: 'approvalTime', minWidth: 100, dateTime: true },
  { title: '发票状态', key: 'invoiceStatus', minWidth: 110, enum: 'invoiceStatusList' },
  { title: '发票类型', key: 'invoiceType', minWidth: 100, slot: 'invoiceType' },
  { title: '发票内容', key: 'invoiceContentCode', minWidth: 65, enum: 'invoiceContentCodeList'},
  { title: '账单金额', key: 'amount', minWidth: 90 },
  { title: '发票号', key: 'invoiceNo', minWidth: 100 },
  { title: '收款账户名', key: 'accountName', minWidth: 90 },
  { title: '收款银行', key: 'accountBank', minWidth: 120 },
  { title: '收款账号', key: 'accountNumber',  minWidth: 120 },
  { title: '操作', slot: 'action',  minWidth: 120 }
]

export const commoncolums: any = [
  { title: '账单编号', align: 'center', key: 'resourceBillNo', minWidth: 65 },
  { title: '影城名称', align: 'center', key: 'cinemaName', minWidth: 100 },
  { title: '影城专资码', align: 'center', key: 'code', minWidth: 100,  },
  { title: '资源方名称', align: 'center', key: 'resourceName', minWidth: 100 },
  {
    title: '账单月份',
    key: 'billMonth',
    align: 'center',
    minWidth: 90,
  },
  { title: '对账完成时间', align: 'center', key: 'approvalTime', minWidth: 100,  },
  { title: '账单金额', align: 'center', key: 'amount', minWidth: 90 },
  { title: '发票状态', align: 'center', key: 'invoiceStatus', minWidth: 100, },
  { title: '发票类型', align: 'center', key: 'invoiceType', minWidth: 100, },
  { title: '发票内容', align: 'center', key: 'invoiceContentCode', minWidth: 65, },
  { title: '可申请付款金额', align: 'center', key: 'mayApplyAmount', minWidth: 90 },
  { title: '发票号', align: 'center', key: 'invoiceNo', minWidth: 100 },
  { title: '收款账户名', align: 'center', key: 'accountName', minWidth: 90 },
  { title: '收款银行', align: 'center', key: 'accountBank', minWidth: 120 },
  { title: '收款账号', align: 'center', key: 'accountNumber',  minWidth: 120 },
  { title: '申请付款金额', align: 'center', slot: 'action',  minWidth: 120 }
]
