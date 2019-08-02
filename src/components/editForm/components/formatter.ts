import { realThousands } from '@/util/dealData'
import { MapType } from '@/util/types'
import { chunkJoin } from '@/fn/string'

export type Formatter = (value: number | string) => string

export default {
  /** 将数字千分位显示 */
  thousands: (value: number | string) => realThousands(value),

  /** 银行账号显示 */
  bank: (value: number | string) => chunkJoin(value)
} as MapType<Formatter>
