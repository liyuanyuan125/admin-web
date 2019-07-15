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

/**
 * https://yapi.aiads-dev.com/project/142/interface/api/3054
 * @param query 查询条件
 */
export async function queryItem(query: any = {}) {
  const { id, channel } = query
  const { data } = await get(`/kol/channel-accounts/${channel}/${id}`)
  const result = {
    ...data,
    item: {
      ...data.item,
      intro: dot(data, 'item.customIntroduction') || '',
      authName: dot(data, 'item.authName') || '',
      fansCount: parseInt(dot(data, 'item.customFans.totalCount'), 10) || 0,
      malePercent: parseInt(dot(data, 'item.customFans.malePercent'), 10) || 0,
      femalePercent: parseInt(dot(data, 'item.customFans.femalePercent'), 10) || 0,
    },
    typeList: [
      { key: 1, text: '个人' },
      { key: 2, text: '公司' },
    ],
    authList: [
      { key: 0, text: '未认证' },
      { key: 1, text: '已认证' },
    ]
  }

  // result.item.photo = 'http://aiads-file.oss-cn-beijing.aliyuncs.com/IMAGE/MISC/bklm23duomr0008001f0.jpg'
  // result.item.provinceId = 4
  // result.item.cityId = 68

  return result
}
