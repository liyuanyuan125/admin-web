import moouth from './mouth.vue'

export const beforefetch =  [
  {
    name: 'accountCategoryCode',
    defaultValue: 0,
    type: 'select',
    width: 108,
    placeholder: '影城名称'
  },

  {
    name: 'channelDataId',
    defaultValue: '',
    type: 'input',
    width: 88,
    placeholder: '影城专资码'
  },

  {
    name: 'channelDataName',
    defaultValue: '',
    type: 'input',
    width: 168,
    placeholder: '资源方公司名称'
  },

  {
    name: 'hasSettlementPrice',
    defaultValue: 0,
    type: 'select',
    width: 128,
    placeholder: '账单编号'
  },

  {
    name: 'minFansCount',
    defaultValue: 0,
    type: 'number',
    width: 100,
    placeholder: '发票类型'
  },

  {
    name: 'maxFansCount',
    defaultValue: 0,
    type: 'number',
    width: 100,
    placeholder: '发票内容'
  },

  {
    name: 'time',
    defaultValue: '',
    type: moouth,
    width: 200,
    placeholder: '账单月份',
    // dealParam(value: string) {
    //   const [beginDate, endDate] = value ? value.split('-') : [null, null]
    //   return {
    //     startTime: beginDate,
    //     endTime: endDate
    //   }
    // }
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
        startTime: beginDate,
        endTime: endDate
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
  { title: '影城名称', key: 'name', minWidth: 100 },
  { title: '影城专资码', key: 'accountCategoryCode', minWidth: 60, editor: 'deprecated' },
  { title: '资源方名称', key: 'fansCount', minWidth: 60 },
  {
    title: '账单月份',
    key: 'kolId',
    minWidth: 90,
    link: {
      name: 'data-kol-associated-detail',
      params: (it: any) => ({ id: it.kolId })
    }
  },
  { title: '对账完成时间', key: 'kolName', minWidth: 100 },
  { title: '账单金额', key: 'provideInvoiceText', minWidth: 90 },
  { title: '发票类型', slot: 'price', minWidth: 270 },
  { title: '发票内容', key: 'status', minWidth: 65, editor: 'enum' },
  { title: '账单金额', key: 'provideInvoiceText', minWidth: 90 },
  { title: '发票类型', slot: 'price', minWidth: 270 },
  { title: '发票内容', key: 'status', minWidth: 65, editor: 'enum' },
  { title: '发票号', key: 'kolName', minWidth: 100 },
  { title: '收款账户名', key: 'provideInvoiceText', minWidth: 90 },
  { title: '收款银行', slot: 'price', minWidth: 270 },
  { title: '收款账号', slot: 'price', minWidth: 270 },
  { title: '操作', slot: 'action', minWidth: 50 }
]
