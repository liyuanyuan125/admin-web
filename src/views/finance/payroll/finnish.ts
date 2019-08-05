import moouth from './mouth.vue'
import remoteselect from './data/index.vue'
import company from './data/company.vue'

export const finishfetch: any =  [
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
    enumKey: 'invoiceTypeList'
  },

  {
    name: 'invoiceContent',
    defaultValue: '',
    type: 'select',
    width: 100,
    placeholder: '发票内容',
    enumKey: 'invoiceContentList'
  },

  {
    name: 'status',
    defaultValue: '',
    type: 'select',
    width: 100,
    placeholder: '请款状态',
    enumKey: 'statusList'
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
        finishStartTime	: beginDate,
        finishEndTime: endDate
      }
    }
  },

  {
    name: 'dateRanges',
    defaultValue: '',
    type: 'dateRange',
    width: 200,
    placeholder: '请款日期',
    dealParam(value: string) {
      const [beginDate, endDate] = value ? value.split('-') : [null, null]
      return {
        applyStartTime: beginDate,
        applyEndTime: endDate
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

export const finishnum: any = [
  'statusList',
  'invoiceTypeList',
  'invoiceContentList',
]

export const finshcoulm: any = [
  { title: '账单编号', key: 'id', minWidth: 65 },
  { title: '请款单编号', key: 'applyId', minWidth: 65 },
  { title: '影城名称', key: 'cinemaName', minWidth: 100 },
  { title: '影城专资码', key: 'code', minWidth: 60, editor: 'deprecated' },
  { title: '资源方名称', key: 'resourceName', minWidth: 60 },
  {
    title: '账单月份',
    key: 'kolId',
    minWidth: 90,
    slot: 'month'
  },
  { title: '账单金额', key: 'billAmount', minWidth: 90 },
  { title: '可申请付款金额单金额', key: 'availableApplyAmount', minWidth: 130 },
  { title: '申请付款金额', key: 'applyAmount', minWidth: 90 },
  { title: '发票类型', key: 'invoiceType', minWidth: 100,  editor: 'enum', enumKey: 'invoiceTypeList' },
  { title: '发票内容', key: 'invoiceContent', minWidth: 65, editor: 'enum', enumKey: 'invoiceContentList'},
  { title: '发票号', key: 'invoiceNo', minWidth: 100 },
  { title: '收款账户名', key: 'receiveAccountName', minWidth: 90 },
  { title: '收款银行', key: 'receiveBank', minWidth: 120 },
  { title: '收款账号', key: 'receiveNo',  minWidth: 120 },
  { title: '操作', slot: 'action',  minWidth: 120 },
  { title: '对账完成时间', key: 'finishTime', minWidth: 100, editor: 'dateTime' },
  { title: '申请付款时间', key: 'payTime', minWidth: 100, editor: 'dateTime' },
]
