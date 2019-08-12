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
import { querySaleItem, getTaxFee, newSaleItem, auditSaleItem } from './data'
import OrderTable from './components/orderTable.vue'
import BivariateTable from '@/components/bivariateTable'
import LogTable from './components/logTable.vue'
import { alert, success } from '@/ui/modal'
import { MapType, CancelableEvent } from '@/util/types'
import { devLog } from '@/util/dev'
import { debounce } from 'lodash'

const actionMap: MapType<any> = {
  new: newSaleItem,
  view: null,
  audit: auditSaleItem
}

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'new' | 'view' | 'audit'

  /**
   * status: 1 待商务审核，2 商务审核不通过，3 待开票，4 已开票
   */
  status = 0

  get editForm() {
    return this.$refs.editForm as EditForm
  }

  get isNew() {
    return this.action == 'new'
  }

  get isView() {
    return this.action == 'view'
  }

  get isAudit() {
    return this.action == 'audit'
  }

  get fields() {
    const isNew = this.isNew
    const isView = this.isView
    const isAudit = this.isAudit
    const readonly = isView || isAudit

    const list: Field[] = [
      {
        name: 'id',
        defaultValue: this.id,
      },

      {
        name: 'orderList',
        defaultValue: [],
        group: '订单基本信息',
        component: OrderTable,
        props: {
          columns: [
            { title: '订单编号', key: 'orderNo', width: 100, align: 'center' },
            { title: '订单名称', key: 'projectName', minWidth: 120, align: 'center' },
            { title: '客户ID', key: 'companyId', width: 80, align: 'center' },
            { title: '客户名称', key: 'companyName', width: 150, align: 'center' },
            { title: '下单时间', key: 'createTimeText', width: 130, align: 'center' },
            { title: '订单金额', key: 'confirmFee', width: 90, align: 'center' },
            { title: '支付首款金额', key: 'advanceFee', width: 90, align: 'center' },
            { title: '支付尾款金额', key: 'restFee', width: 90, align: 'center' },
            { title: '退款金额', key: 'refundFee', width: 90, align: 'center' },
            { title: '订单状态', key: 'orderStatusText', width: 90, align: 'center' },
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
        name: 'audited',
        defaultValue: false,
      },

      {
        name: 'auditPass',
        defaultValue: true,
        disabled: isView || this.status != 1,
        switch: true,
        group: '审核意见',
        label: '审核通过',
        span: 6,
        visibleCol: item => isAudit || item.audited,
        autoWidth: true,
      },

      {
        name: 'refuseReason',
        defaultValue: '',
        disabled: isView || this.status != 1,
        required: true,
        input: {
          prepend: '审核不通过的理由'
        },
        span: 8,
        visible: item => !item.auditPass,
        visibleCol: item => isAudit || item.audited
      },

      {
        name: 'logList',
        defaultValue: [],
        component: LogTable,
        group: '操作日志',
        visibleCol: () => isView
      }
    )

    isNew && this.status == 3 && list.push(
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
    const data = await querySaleItem({
      id: this.id
    })
    this.status = data.item.status
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
