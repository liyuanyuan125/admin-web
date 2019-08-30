import moment from 'moment'

export const one = [
  { title: '充值订单号  ', key: 'companyId' },
  { title: '充值金额  ', key: 'companyName' },
  { title: '充值时间  ', key: 'balance' },
]

export const two = [
  { title: '消费订单号', key: 'companyId' },
  { title: '消费金额', key: 'companyName' },
  { title: '消费类型', key: 'balance' },
  { title: '消费时间', key: 'balance' },
]

export const three = [
  { title: '消费订单号', key: 'companyId' },
  { title: '退款单号', key: 'companyName' },
  { title: '退款金额', key: 'balance' },
  { title: '退款时间', key: 'balance' },
]

export const four = [
  { title: '提现申请单编号', key: 'companyId' },
  { title: '提现金额', key: 'companyName' },
  { title: '提现申请时间', key: 'balance' },
  { title: '最后更新时间', key: 'balance' },
]

export function filterone(str: string) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: '充值订单号',
      defaultValue: '',
      type: 'input',
      width: 108,
      placeholder: 'id'
    },
    {
      name: 'dateRange',
      defaultValue: str,
      type: 'dateRange',
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
      name: 'pageSize',
      defaultValue: 20
    }
  ]
}

export function filtertwo(str: string) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: '充值订单号',
      defaultValue: '',
      type: 'input',
      width: 108,
      placeholder: 'id'
    },
    {
      name: 'dateRange',
      defaultValue: str,
      type: 'dateRange',
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
      name: 'pageSize',
      defaultValue: 20
    }
  ]
}

export function filterthree(str: string) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: '充值订单号',
      defaultValue: '',
      type: 'input',
      width: 108,
      placeholder: 'id'
    },
    {
      name: 'dateRange',
      defaultValue: str,
      type: 'dateRange',
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
      name: 'pageSize',
      defaultValue: 20
    }
  ]
}

export function filterfour(str: string) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: '充值订单号',
      defaultValue: '',
      type: 'input',
      width: 108,
      placeholder: 'id'
    },
    {
      name: 'dateRange',
      defaultValue: str,
      type: 'dateRange',
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
      name: 'pageSize',
      defaultValue: 20
    }
  ]
}

