export const auditfetch = [
  {
    name: 'applyNumber',
    defaultValue: '',
    type: 'input',
    width: 108,
    placeholder: '订单编号'
  },

  {
    name: 'approveStatus',
    defaultValue: '',
    type: 'select',
    width: 108,
    placeholder: '审批状态',
    enumKey: 'approveStatusList'
  },

  {
    name: 'createName',
    defaultValue: '',
    type: 'input',
    width: 108,
    placeholder: '请款人'
  },

  {
    name: 'dateRange',
    defaultValue: '',
    type: 'dateRange',
    width: 200,
    placeholder: '请款日期',
    dealParam(value: string) {
      const [beginDate, endDate] = value ? value.split('-') : [null, null]
      return {
        queryStartTime: beginDate,
        queryEndTime: endDate
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

export const auditcoulm = [
  { title: '请款单编号', key: 'applyNumber', minWidth: 65 },
  { title: '可申请的付款金额', key: 'mayApplyAmount', minWidth: 100 },
  { title: '申请付款金额', key: 'applyAmount', minWidth: 60, editor: 'deprecated' },
  { title: '请款人', key: 'createName', minWidth: 60 },
  {
    title: '请款时间',
    key: 'createTime',
    editor: 'dateTime',
    minWidth: 90,
  },
  { title: '审批状态', key: 'approveStatus', minWidth: 100, editor: 'enum' },
  { title: '操作', slot: 'audit',  minWidth: 120 }
]

export const auditenum = [
  'approveStatusList',
]

