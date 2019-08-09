<template>
  <div class="edit-page">
    <EditForm
      :fields="fields"
      :fetch="fetch"
      :submit="submit"
      :hideSubmit="isView"
      :labelWidth="88"
      @done="onDone"
      ref="editForm"
    >
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { queryPurchaseItem, queryPurchaseItemByIds, getTaxFee, newPurchaseItem } from './data'
import OrderTable from './components/orderTable.vue'
import BivariateTable from '@/components/bivariateTable'
import LogTable from './components/logTable.vue'
import { alert, success } from '@/ui/modal'
import { MapType, CancelableEvent } from '@/util/types'
import { devLog } from '@/util/dev'
import { debounce } from 'lodash'

const actionMap: MapType<any> = {
  view: null,
  new: newPurchaseItem,
}

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: String, default: 'view' }) action!: 'view' | 'new'

  /**
   * 当 action 为 view 时，是发票 ID，
   * 当 action 为 new 时，是数据 ID 列表
   */
  @Prop({ type: Array, default: () => [] }) ids!: number[]

  /**
   * 业务类型：1 kol、2 映前广告
   */
  @Prop({ type: Number }) businessType!: number

  get editForm() {
    return this.$refs.editForm as EditForm
  }

  get isView() {
    return this.action == 'view'
  }

  get isNew() {
    return this.action == 'new'
  }

  get fields() {
    const isNew = this.isNew
    const isView = this.isView
    const readonly = isView

    const list: Field[] = [
      // {
      //   name: 'id',
      //   defaultValue: this.ids[0],
      // },

      {
        name: 'orderList',
        defaultValue: [],
        group: '订单基本信息',
        component: OrderTable,
        props: {
          columns: [
            { title: '账单编号', key: 'billNo', width: 100, align: 'center' },
            { title: '影院名称', key: 'cinemaName', minWidth: 150, align: 'center' },
            { title: '影院专资码', key: 'cinemaCode', width: 100, align: 'center' },
            { title: '资源方名称', key: 'resourceName', minWidth: 100, align: 'center' },
            { title: '账单月份', key: 'billMonthText', width: 80, align: 'center' },

            { title: '账单生成时间', key: 'billCreateTimeText', width: 135, align: 'center' },
            { title: '曝光人次/千人次', key: 'personCount', width: 110, align: 'center' },
            { title: '账单金额', key: 'billFee', width: 100, align: 'center' },
            { title: '账单状态', key: 'billStatusText', width: 100, align: 'center' },
          ]
        },
        span: 23,
      },

      {
        name: 'basicInfo',
        defaultValue: [],
        group: '发票申请单信息',
        component: BivariateTable,
        props: {
          widths: [100, 130],
          aligns: [, 'left', 'left'],
        },
        span: 23,
      },
    ]

    readonly && list.forEach(it => it.disabled = true)

    readonly && list.push(
      {
        name: 'logList',
        defaultValue: [],
        component: LogTable,
        group: '操作日志',
        visibleCol: () => isView
      }
    )

    isNew && list.push(
      {
        name: 'invoiceNo',
        defaultValue: '',
        label: '发票编号',
        group: '开票',
        span: 7,
        required: true,
        input: true,
      },

      {
        name: 'invoiceType',
        defaultValue: '',
        label: '发票类型',
        span: 7,
        required: true,
        select: {
          enumKey: 'invoiceTypeList'
        },
        offsetRight: 8
      },

      {
        name: 'invoiceDate',
        defaultValue: 0,
        label: '发票日期',
        span: 7,
        required: true,
        date: true,
      },

      {
        name: 'taxRate',
        defaultValue: '',
        label: '税率',
        span: 7,
        select: {
          enumKey: 'taxRateList'
        },
        offsetRight: 8,
        watch: async (taxRate, { item }) => {
          try {
            item.taxFreeFee = 0
            item.taxFee = 0
            const { taxFreeFee, taxFee } = await getTaxFee({
              taxRate,
              totalTaxFee: item.totalTaxFee
            })
            item.taxFreeFee = taxFreeFee
            item.taxFee = taxFee
          } catch (ex) {
            this.handleError(ex)
          }
        }
      },

      {
        name: 'totalTaxFee',
        defaultValue: 0,
        label: '含税金额',
        span: 7,
        text: true,
      },

      {
        name: 'taxFreeFee',
        defaultValue: 0,
        label: '未税金额',
        span: 7,
        text: true,
        placeholder: '待计算',
      },

      {
        name: 'taxFee',
        defaultValue: 0,
        label: '税金',
        span: 7,
        text: true,
        placeholder: '待计算',
      },

      {
        name: 'materialQuality',
        defaultValue: 0,
        label: '发票材质',
        span: 7,
        select: {
          enumKey: 'invoiceMaterialQualityList'
        }
      },

      {
        name: 'expressCompany',
        defaultValue: '',
        label: '快递公司',
        span: 7,
        input: true,
      },

      {
        name: 'expressNo',
        defaultValue: '',
        label: '快递单号',
        span: 7,
        input: true,
      },
    )

    return list
  }

  submit = actionMap[this.action]

  filterCinema: ((item: any) => any) | null = null

  async fetch() {
    const data = this.isView
      ? await queryPurchaseItem({ id: this.ids[0] })
      : await queryPurchaseItemByIds({
        ids: this.ids.join(','),
        businessType: this.businessType,
      })
    return data
  }

  async onDone() {
    await success('操作成功')
    this.$router.back()
  }
}
</script>

<style lang="less" scoped>
</style>
