import { get } from '@/fn/ajax'
import { dot, intDate, readableThousands } from '@/util/dealData'

/**
 * 查询 KOL 平台账号
 * @param query 查询条件
 * https://yapi.aiads-dev.com/project/142/interface/api/3198
 */
export async function queryList(query: any = {}) {
  const { data } = await get('/kol/channel-accounts', query)
  const result = {
    ...data,

    items: (data.items as any[] || []).map(it => ({
      ...it,
      fansCount: dot(it, 'customFans.totalCount'),
      kolIdText: it.kolId || '-',
      provideInvoiceText: it.provideInvoice ? '是' : '否',
      priceList: (it.settlementPrices as any[] || []).map(sub => {
        const price = readableThousands(sub.settlementPrice, '-', '0,0.00')
        return {
          name: sub.categoryName,
          price: price != '-' ? `￥${price}` : '-',
          date: intDate(sub.effectiveDate)
        }
      }),
    })),

    hasSettlementPriceList: [
      { key: 1, text: '有' },
      { key: 2, text: '无' },
    ]
  }
  return result
}
