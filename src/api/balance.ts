import { get , post , put , del } from '@/fn/ajax'

/**
 * @param  {any} query
 * https://yapi.aiads-dev.com/project/76/interface/api/755
 */
export async function queryList(query: any) {
  const data = await get('/finance/xadvertiser/statistics', query)
  return data
}

/**
 * @param  {any} query
 * https://yapi.aiads-dev.com/project/76/interface/api/755
 */
export async function before() {
  // const data = await get('/finance/lineUnderRemittances/create/before')
  return {
    data: {
      remittanceTypeList: [
        {
          key: 'zfb',
          text: '支付宝'
        },
        {
          key: 'zib',
          text: '银行账户'
        }
      ]
    }
  }
  // return data
}
