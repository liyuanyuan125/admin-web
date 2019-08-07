<template>
  <div class="edit-page">
    <EditForm :fields="fields" :fetch="fetch" :submit="submit" :hideSubmit="isView" :labelWidth="120" @done="onDone">
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { success } from '@/ui/modal'
import { devLog } from '@/util/dev'
import table from './components/table.vue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import moment from 'moment'
import {
  queryItem,
  payAdvance,
  payRest,
  queryKolAcounts,
} from './data'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const ratioValidator: Validator = (rule, value: Array<{ value: number }>, callback) => {
  const total = value.reduce((sum, it) => (sum += it.value), 0)
  const error = isNaN(total) ? '请输入数字' : total > 100 ? '占比之和不能大于 100' : ''
  error ? callback(new Error(error)) : callback()
}

@Component({
  components: {
    EditForm
  }
})
export default class KolPaymentDetail extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'view' | 'edit'

  channelList: any[] = []

  // 本次支付金额
  payType: number = -1
  thisAmount: number = 0
  order: any[] = []
  subOrder: any[] = []
  paymentBill: any[] = []
  settlementPrice: any[] = []
  logList: any[] = []

  orderColumns: any[] = [
    {
      title: '订单编号',
      key: 'orderNo'
    },
    {
      title: '项目名称',
      key: 'projectName'
    },
    {
      title: '客户ID',
      key: 'companyId'
    },
    {
      title: '客户名称',
      key: 'companyName'
    },
    {
      title: '平台',
      key: 'channelCode'
    },
    {
      title: '推广品牌',
      key: 'brandName'
    },
    {
      title: '下单时间',
      key: 'createTime'
    },
    {
      title: '下单金额',
      key: 'totalFee'
    },
    {
      title: '商务确认金额',
      key: 'confirmFee'
    },
    {
      title: '订单状态',
      key: 'orderStatus'
    }
  ]

  subOrderColumns: any[] = [
    {
      title: '子订单编号',
      key: 'subOrderNo'
    },
    {
      title: 'KOL编号',
      key: 'kolId'
    },
    {
      title: 'KOL名称',
      key: 'kolName'
    },
    {
      title: '平台',
      key: 'channelCode'
    },
    {
      title: '项目类型',
      key: 'publishCategoryName'
    },
    {
      title: '推广时间',
      key: 'publishTime'
    },
    {
      title: '下单金额',
      key: 'salePrice'
    },
    {
      title: '商务修改金额',
      key: 'confirmPrice'
    },
    {
      title: '备注',
      key: 'confirmRemark'
    }
  ]

  paymentBillColumns: any[] = [
    {
      title: '支付类型',
      key: 'feeType'
    },
    {
      title: '付款金额',
      key: 'feeAmount'
    },
    {
      title: '付款时间',
      key: 'feeTime'
    },
    {
      title: '操作人',
      key: 'feePerson'
    },
    {
      title: '备注',
      key: 'freeRemark'
    }
  ]

  settlementPriceColumns: any[] = [
    {
      title: '分类',
      key: 'categoryName'
    },
    {
      title: '结算价',
      key: 'settlementPrice'
    },
    {
      title: '结算价有效期',
      key: 'effectiveDate'
    },
  ]

  logListColumns: any[] = [
    // {
    //   title: '序号',
    //   key: 'categoryName'
    // },
    {
      title: '操作时间',
      key: 'createTime'
    },
    {
      title: '操作人',
      key: 'userName'
    },
    {
      title: '操作内容',
      key: 'description'
    },
    {
      title: '操作人邮箱',
      key: 'email'
    },
  ]

  get isView() {
    return this.action == 'view'
  }

  get isEdit() {
    return this.action == 'edit'
  }

  get fields() {
    const isView = this.isView
    const readonly = isView

    const list: Field[] = [
      {
        name: 'id',
        defaultValue: this.id,
      },

      {
        name: '',
        defaultValue: '',
        span: 24,
        component: table,
        props: {
          list: this.order,
          columns: this.orderColumns
        },
        group: '订单基本信息'
      },

      {
        name: '',
        defaultValue: '',
        span: 24,
        component: table,
        props: {
          list: this.subOrder,
          columns: this.subOrderColumns
        },
        group: '子订单支付信息'
      },

      {
        name: '',
        defaultValue: '',
        span: 24,
        component: table,
        props: {
          list: this.paymentBill,
          columns: this.paymentBillColumns
        },
        group: '子订单金额信息'
      },

      {
        name: '',
        defaultValue: '',
        span: 24,
        component: table,
        props: {
          list: this.settlementPrice,
          columns: this.settlementPriceColumns
        },
        group: 'KOL平台账号结算信息'
      },

    ]

    readonly && list.forEach(it => (it.disabled = true)) && list.push(
      {
        name: '',
        defaultValue: '',
        span: 24,
        component: table,
        props: {
          list: this.logList,
          columns: this.logListColumns
        },
        group: '操作日志'
      }
    )

    !readonly && list.push(
      {
        name: 'payStatus',
        defaultValue: '',
        span: 24,
        label: '支付类型',
        text: true,
        group: '订单付款信息'
      },

      {
        name: 'totalFee',
        defaultValue: 0,
        span: 12,
        label: '子订单总付款金额',
        number: {
          type: 'number',
          prepend: '￥',
          append: '（按照结算价合计显示）'
        },
        disabled: true
      },

      {
        name: 'paidAmount',
        defaultValue: '',
        span: 24,
        text: true,
        visible: it => it.paidAmount,
        label: '已付款金额',
      },

      {
        name: 'thisAmount',
        defaultValue: 0,
        required: true,
        label: '本次付款金额',
        placeholder: '总结算金额*50%',
        number: {
          max: this.thisAmount
        },
        span: 12,
      },

      {
        name: 'remark',
        defaultValue: '',
        label: '备注',
        span: 22,
        input: {
          type: 'textarea',
          autosize: { maxRows: 8 },
        }
      },
    )

    return list
  }

  filters: Filter[] = []

  get columns() {
    return [
      { title: '序号', key: 'brandId', width: 70 },
      { title: '名称', key: 'order.brandName', minWidth: 70 },
    ] as ColumnExtra[]
  }

  item: any = null

  get submit() {
    if (this.action === 'view') {
      return null
    } else if (this.action === 'edit') {
      if (this.payType === -1) {
        return null
      }
      if (this.payType === 1) {
        return payAdvance
      } else if (this.payType === 2) {
        return payRest
      }
    }
  }

  async fetch() {
    let data = null
    if (this.action === 'edit' || this.action === 'view') {
      data = await queryItem({
        id: this.id
      })

      if (data.channelCodeList && data.channelCodeList.length > 0) {
        this.channelList = data.channelCodeList
      }

      // 子订单支付信息
      const paymentBill = data.item.paymentBill || null
      if ( paymentBill ) {
        if ( paymentBill.advanceFeeTime && paymentBill.advanceFee ) {
          this.paymentBill[0] = {
            feeType: '首款',
            feeAmount: paymentBill.advanceFee,
            feeTime: moment(paymentBill.advanceFeeTime).format(timeFormat),
            feePerson: paymentBill.advanceFeeOperatorName,
            freeRemark: paymentBill.advanceFeeRemark
          }
        }
        if ( paymentBill.restFeeTime && paymentBill.restFee ) {
          this.paymentBill[1] = {
            feeType: '尾款',
            feeAmount: paymentBill.restFee,
            feeTime: moment(paymentBill.restFeeTime).format(timeFormat),
            feePerson: paymentBill.restFeeOperatorName,
            freeRemark: paymentBill.restFeeRemark
          }
        }
      }

      // 订单基本信息
      const order = data.item.order || null
      if (order.orderId) {
        order.createTime = order.createTime ? moment(order.createTime).format(timeFormat) : '-'
        this.order.push(order)
      }

      // 子订单金额信息
      const subOrder = data.item.subOrder || null
      if (subOrder) {
        subOrder.publishTime = subOrder.publishTime ? moment(subOrder.publishTime).format(timeFormat) : '-'
        this.subOrder.push(data.item.subOrder)
      }

      // 结算价格列表
      const settlementPrice = data.item.settlementPrice || null
      if (settlementPrice && settlementPrice.length > 0) {
        // 接口返回的并非时间戳
        // settlementPrice.forEach((it: any) => {
        //   it.effectiveDate = it.effectiveDate ? moment(it.effectiveDate).format(timeFormat) : '-'
        // })
        this.settlementPrice = settlementPrice
      }

      // 日志
      const logList = data.logList || null
      if (logList && logList.length > 0) {
        // 接口返回的并非时间戳
        logList.forEach((it: any) => {
          it.createTime = it.createTime ? moment(it.createTime).format(timeFormat) : '-'
        })
        this.logList = logList
      }

      // 本次支付
      if ( data.item.paymentBill.thisAmount && data.item.paymentBill.thisAmount > 0) {
        this.thisAmount = data.item.paymentBill.thisAmount
      }

      if ( data.item.payStatusCode ) {
        this.payType = data.item.payStatusCode
      }

    }
    return data
  }

  async onDone() {
    await success('操作成功')
    this.$router.back()
  }
}
</script>

<style lang="less" scoped>
/deep/ .col-field-auth,
/deep/ .col-field-male-percent,
/deep/ .col-field-audit-pass {
  width: auto;
}

/deep/ .col-field-auth-name,
/deep/ .col-field-remark {
  left: 4px;
}

/deep/ .ui-field-male-percent,
/deep/ .ui-field-female-percent {
  .input-number {
    width: 78px;
  }
}
</style>
