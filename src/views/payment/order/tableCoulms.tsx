import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

export const columns = [
  { title: '订单编号', key: 'id', align: 'center' },
  { title: '订单名称', key: 'email', align: 'center' },
  { title: '客户ID', key: 'companyName', align: 'center' },
  { title: '客户名称', key: 'companyName', align: 'center' },
  { title: '平台', key: 'companyName', align: 'center' },
  { title: '推广平台', key: 'companyName', align: 'center' },
  {
    title: '下单时间',
    width: 120,
    key: 'createTime',
    align: 'center',
    render: (hh: any, { row: { createTime } }: any) => {
      /* tslint:disable */
      const h = jsxReactToVue(hh)
      const html = moment(createTime).format(timeFormat)
      return <span class='datetime' v-html={html}></span>
      /* tslint:enable */
    }
  },
  { title: '下单金额', key: 'companyName', align: 'center' },
  { title: '商务确认金额', key: 'companyName', align: 'center' },
  {
    title: '订单状态',
    key: 'statusText',
    align: 'center',
    render: (hh: any, { row: { status, statusText } }: any) => {
      /* tslint:disable */
      const h = jsxReactToVue(hh)
      if (status == 1) {
        return <span class={`status-${status}`}>启用</span>
      } else if (status == 2) {
        return <span class={`status-${status}`}>停用</span>
      } else if (status == 3) {
        return <span class={`status-${status}`}>待激活</span>
      }
      /* tslint:enable */
    }
  }
]

// 子订单编号
export const okcolumns = [
  { title: '子订单编号',  key: 'id', align: 'center' },
  { title: 'KOL编号', key: 'email', align: 'center' },
  { title: 'KOL名称', width: 70, key: 'companyName', align: 'center' },
  { title: '推广平台', key: 'companyName', align: 'center' },
  { title: '项目类型',  key: 'companyName', align: 'center' },
  { title: '下单金额',  key: 'companyName', align: 'center' },
  { title: '商务修改金额',  key: 'companyName', align: 'center' },
  { title: '备注',  key: 'companyName', align: 'center' },
  { title: '结算金额',  key: 'companyName', align: 'center' },
]

// 子订单支付信息
export const editokcolumns = [
  { title: '支付类型',  key: 'id', align: 'center' },
  { title: '付款金额', key: 'email', align: 'center' },
  { title: '付款时间', width: 70, key: 'companyName', align: 'center' },
  { title: '操作人', key: 'companyName', align: 'center' },
  { title: '备注',  key: 'companyName', align: 'center' },
]

// KOL平台账号结算信息
export const ordercolumns = [
  { title: '分类',  key: 'id', align: 'center' },
  { title: '结算价', key: 'email', align: 'center' },
  { title: '结算价有效期', key: 'companyName', align: 'center' },
]

// 操作日志
export const logcolumns = [
  { title: '序号',  key: 'id', align: 'center' },
  { title: '操作类型', key: 'email', align: 'center' },
  { title: '操作时间', width: 70, key: 'companyName', align: 'center' },
  { title: '操作人', key: 'companyName', align: 'center' },
  { title: '字段',  key: 'companyName', align: 'center' },
  { title: '原值',  key: 'companyName', align: 'center' },
  { title: '新值',  key: 'companyName', align: 'center' },
]

