import moment from 'moment'

export const one = [
  { title: '充值订单号  ', key: 'streamNo' },
  { title: '充值金额  ', key: 'transactionAmount' },
  { title: '充值时间  ', key: 'transactionTime', dateTime: true },
]

export const two = [
  { title: '消费订单号', key: 'streamNo' },
  { title: '消费金额', key: 'transactionAmount' },
  { title: '消费类型', key: 'transactionType', slot: 'status'  },
  { title: '消费时间', key: 'transactionTime', dateTime: true },
]

export const three = [
  { title: '消费订单号', key: 'streamNo' },
  { title: '退款金额', key: 'transactionAmount' },
  { title: '退款时间', key: 'transactionTime', dateTime: true },
]

export const four = [
  { title: '提现申请单编号', key: 'streamNo' },
  { title: '提现金额', key: 'transactionAmount' },
  { title: '提现申请时间', key: 'transactionTime', dateTime: true },
  { title: '最后更新时间', key: 'remittanceDate', slot: 'remittanceDate' },
]

export function filterone(str: string, companyId: any) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: 'streamNo',
      defaultValue: '',
      input: true,
      width: 108,
      placeholder: '充值订单号'
    },
    {
      name: 'dateRange',
      defaultValue: str,
      dateRange: true,
      width: 200,
      placeholder: '充值日期区间',
      dealParam(value: string) {
        const [beginDate, endDate] = value ? value.split('-') : [null, null]
        return {
          beginDate,
          endDate
        }
      }
    },
    {
      name: 'pageIndex',
      defaultValue: 1
    },
    {
      name: 'companyId',
      defaultValue: companyId
    },
    {
      name: 'transactionType',
      defaultValue: 1
    },
    {
      name: 'pageSize',
      defaultValue: 20
    }
  ]
}

export function filtertwo(str: string, companyId: any) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: 'streamNo',
      defaultValue: '',
      input: true,
      width: 108,
      placeholder: '消费订单号'
    },
    {
      name: 'dateRange',
      defaultValue: str,
      dateRange: true,
      width: 200,
      placeholder: '消费日期区间',
      dealParam(value: string) {
        const [beginDate, endDate] = value ? value.split('-') : [null, null]
        return {
          beginDate,
          endDate
        }
      }
    },
    {
      name: 'transactionTypes',
      defaultValue: 0,
      select: true,
      width: 100,
      placeholder: '发票类型',
      enumKey: 'statusList',
      dealParam(value: string) {
        if (!value || value == '2') {
          return '3,5,7'
        }
        return value
      }
    },
    {
      name: 'pageIndex',
      defaultValue: 1
    },
    {
      name: 'pageSize',
      defaultValue: 20
    },
    {
      name: 'companyId',
      defaultValue: companyId
    },
  ]
}

export function filterthree(str: string, companyId: any) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: 'dateRange',
      defaultValue: str,
      dateRange: true,
      width: 200,
      placeholder: '退款日期区间',
      dealParam(value: string) {
        const [beginDate, endDate] = value ? value.split('-') : [null, null]
        return {
          beginDate,
          endDate
        }
      }
    },
    {
      name: 'streamNo',
      defaultValue: '',
      input: true,
      width: 108,
      placeholder: '退款单号'
    },
    {
      name: 'pageIndex',
      defaultValue: 1
    },
    {
      name: 'pageSize',
      defaultValue: 20
    },
    {
      name: 'transactionType',
      defaultValue: 4
    },
    {
      name: 'companyId',
      defaultValue: companyId
    }
  ]
}

export function filterfour(str: string, companyId: any) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: 'dateRange',
      defaultValue: str,
      dateRange: true,
      width: 200,
      placeholder: '提现日期区间',
      dealParam(value: string) {
        const [beginDate, endDate] = value ? value.split('-') : [null, null]
        return {
          beginDate,
          endDate
        }
      }
    },
    {
      name: 'streamNo',
      defaultValue: '',
      input: true,
      width: 108,
      placeholder: '提现申请单'
    },
    {
      name: 'pageIndex',
      defaultValue: 1
    },
    {
      name: 'pageSize',
      defaultValue: 20
    },
    {
      name: 'transactionType',
      defaultValue: 8
    },
    {
      name: 'companyId',
      defaultValue: companyId
    }
  ]
}

