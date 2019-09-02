import moment from 'moment'

export const one = [
  { title: '充值订单号  ', key: 'streamNo' },
  { title: '充值金额  ', key: 'transactionAmount' },
  { title: '充值时间  ', key: 'remittanceDate', editor: 'dateTime' },
]

export const two = [
  { title: '消费订单号', key: 'streamNo' },
  { title: '消费金额', key: 'companyName' },
  { title: '消费类型', key: 'transactionAmount' },
  { title: '消费时间', key: 'remittanceDate', editor: 'dateTime' },
]

export const three = [
  { title: '消费订单号', key: 'streamNo' },
  { title: '退款金额', key: 'transactionAmount' },
  { title: '退款时间', key: 'transactionTime', editor: 'dateTime' },
]

export const four = [
  { title: '提现申请单编号', key: 'streamNo' },
  { title: '提现金额', key: 'transactionAmount' },
  { title: '提现申请时间', key: 'remittanceDate', editor: 'dateTime' },
  { title: '最后更新时间', key: 'transactionTime', editor: 'dateTime' },
]

export function filterone(str: string) {
  if (str == 'month') {
    const beginDate = moment().startOf('month').format('YYYYMMDD')
    const endDate = moment().endOf('month').format('YYYYMMDD')
    str = `${beginDate}-${endDate}`
  }
  return [
    {
      name: 'streamNo',
      defaultValue: '',
      type: 'input',
      width: 108,
      placeholder: '充值订单号'
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
      name: 'streamNo',
      defaultValue: '',
      type: 'input',
      width: 108,
      placeholder: '消费订单号'
    },
    {
      name: 'dateRange',
      defaultValue: str,
      type: 'dateRange',
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
      type: 'select',
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
      name: 'streamNo',
      defaultValue: '',
      type: 'input',
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
      name: 'streamNo',
      defaultValue: '',
      type: 'input',
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
    }
  ]
}

