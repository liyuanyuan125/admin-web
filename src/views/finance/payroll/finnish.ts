export const finishfetch = [
  {
    name: 'accountCategoryCode',
    defaultValue: 0,
    type: 'select',
    width: 108,
    placeholder: '影城名称'
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
