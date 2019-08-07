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
import { querySaleItem, newItem, auditItem } from './data'
import OrderTable from './components/orderTable.vue'
import BivariateTable from '@/components/bivariateTable'
import LogTable from './components/logTable.vue'
import { alert, success } from '@/ui/modal'
import { MapType, CancelableEvent } from '@/util/types'
import { devLog } from '@/util/dev'
import { debounce } from 'lodash'

const actionMap: MapType<any> = {
  new: newItem,
  view: null,
  audit: auditItem
}

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'new' | 'view' | 'audit'

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
        disabled: isView,
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
        disabled: isView,
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
        offsetRight: 8
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
        placeholder: '选择税率后计算',
      },

      {
        name: 'taxFee',
        defaultValue: 0,
        label: '税金',
        span: 7,
        text: true,
        placeholder: '选择税率后计算',
      },

      {
        name: 'materialQuality',
        defaultValue: 0,
        label: '发票材质',
        span: 7,
        select: {
          enumKey: 'materialQualityList'
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
