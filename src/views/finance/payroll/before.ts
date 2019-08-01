import moouth from './mouth.vue'
import remoteselect from './data/index.vue'
import company from './data/company.vue'

export const beforefetch =  [
  {
    name: 'cinemaId',
    defaultValue: 0,
    type: remoteselect,
    width: 108,
    placeholder: '影城名称'
  },

  {
    name: 'code',
    defaultValue: '',
    type: 'input',
    width: 88,
    placeholder: '影城专资码'
  },

  {
    name: 'resourceId',
    defaultValue: 0,
    type: company,
    width: 168,
    placeholder: '资源方公司名称'
  },

  {
    name: 'hasSettlementPrice',
    defaultValue: '',
    type: 'input',
    width: 128,
    placeholder: '账单编号',
  },

  {
    name: 'invoiceType',
    defaultValue: 0,
    type: 'select',
    width: 100,
    placeholder: '发票类型',
    enumKey: 'invoiceTypeCodeList'
  },

  {
    name: 'invoiceContent',
    defaultValue: '',
    type: 'select',
    width: 100,
    placeholder: '发票内容',
    enumKey: 'invoiceStatusList'
  },

  {
    name: 'time',
    defaultValue: '',
    type: moouth,
    width: 200,
    placeholder: '账单月份',
    dealParam(value: string) {
      return {
        yearMonth: value ? new Date(value).getTime() : ''
      }
    }
  },

  {
    name: 'dateRange',
    defaultValue: '',
    type: 'dateRange',
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
    name: 'pageSize',
    defaultValue: 20
  }
]

export const beforenum = [
  'applyTypeList',
  'billStatusList',
  'invoiceContentCodeList',
  'invoiceStatusList',
  'invoiceTypeCodeList',
  'payStatusList'
]

export const beforcoulm = [
  { title: '账单编号', key: 'id', minWidth: 65 },
  { title: '影城名称', key: 'cinemaName', minWidth: 100 },
  { title: '影城专资码', key: 'code', minWidth: 60, editor: 'deprecated' },
  { title: '资源方名称', key: 'resourceName', minWidth: 60 },
  {
    title: '账单月份',
    key: 'kolId',
    minWidth: 90,
    slot: 'month'
  },
  { title: '对账完成时间', key: 'approvalTime', minWidth: 100, editor: 'dateTime' },
  { title: '发票类型', key: 'invoiceType', minWidth: 100,  editor: 'enum', enumKey: 'invoiceTypeCodeList' },
  { title: '发票内容', key: 'invoiceContentCode', minWidth: 65, editor: 'enum', enumKey: 'invoiceContentCodeList'},
  { title: '账单金额', key: 'amount', minWidth: 90 },
  { title: '发票号', key: 'invoiceNo', minWidth: 100 },
  { title: '收款账户名', key: 'accountName', minWidth: 90 },
  { title: '收款银行', key: 'accountBank', minWidth: 120 },
  { title: '收款账号', key: 'accountNumber',  minWidth: 120 },
  { title: '操作', slot: 'action',  minWidth: 120 }
]

export const commoncolums: any = [
  { title: '账单编号', key: 'id', minWidth: 65 },
  { title: '影城名称', key: 'cinemaName', minWidth: 100 },
  { title: '影城专资码', key: 'code', minWidth: 100,  },
  { title: '资源方名称', key: 'resourceName', minWidth: 100 },
  {
    title: '账单月份',
    key: 'billMonth',
    minWidth: 90,
  },
  { title: '对账完成时间', key: 'approvalTime', minWidth: 100,  },
  { title: '账单金额', key: 'amount', minWidth: 90 },
  { title: '发票类型', key: 'invoiceType', minWidth: 100, },
  { title: '发票内容', key: 'invoiceContentCode', minWidth: 65, },
  { title: '可申请付款金额', key: 'mayApplyAmount', minWidth: 90 },
  { title: '发票号', key: 'invoiceNo', minWidth: 100 },
  { title: '收款账户名', key: 'accountName', minWidth: 90 },
  { title: '收款银行', key: 'accountBank', minWidth: 120 },
  { title: '收款账号', key: 'accountNumber',  minWidth: 120 },
  { title: '操作', slot: 'action',  minWidth: 120 }
]
