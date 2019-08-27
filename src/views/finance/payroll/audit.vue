<template>
  <div class="index-page">

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      selectable
      :disabledIds='disabledIds'
      :selectedIds.sync="selectedIds"
      ref="listPage"
    >
      <template slot="acts">
        <!-- <Button
          type="success"
          icon="md-add-circle"
        >新建</Button> -->
      </template>

      <template slot="acts-2">
        <Button
          type="primary"
          class="button-audit"
          :disabled="!(selectedIds.length > 0)"
          @click="pay(selectedIds)"
        >批量审批</Button>
      </template>

      <template slot="audit" slot-scope="{ row: { id, approveStatus } }">
        <div class="row-acts">
          <a @click='pay([id])' v-if='approveStatus < 2'>审批</a>
          <router-link :to="{
            name: 'finance-payroll-detail',
            params: {id}
          }">查看</router-link>
        </div>
      </template>
    </ListPage>
    <Auditmodel @done='refresh' ref='pay' />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { beforeList, auditList } from '@/api/payroll'
import { alert, toast } from '@/ui/modal'
import Auditmodel from './data/auditmodel.vue'
import { EditDialog, Field } from '@/components/editForm'
import BatchAudit from '@/components/batchAudit'
import moouth from './mouth.vue'
import remoteselect from './data/index.vue'
import company from './data/company.vue'

const typeList = [
  { name: '待申请付款', value: 'before' },
  { name: '请款单审批', value: 'audit' },
  { name: '已申请付款', value: 'finish' },
]
const defaultType = typeList[0].value

@Component({
  components: {
    ListPage,
    EditDialog,
    BatchAudit,
    Auditmodel
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultType }) type!: string

  disabledIds: any = []
  items: any = null
  typeCode = this.type

  typeList = typeList

  selectedIds = [] as number[]

  auditVisible = false

  crawlVisible = false

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  async fetch(query: any) {
    const res = await auditList(query)
    this.items = res.data.items || null
    if ( this.items && this.items.length > 0 ) {
      this.disabledIds = this.items.filter((it: any) => {
        return it.approveStatus !== 1
      }).map((item: any) => {
        return item.id
      })
    }
    return res
  }

  get filters() {
    return  [
      {
        name: 'applyNumber',
        defaultValue: '',
        type: 'input',
        width: 108,
        placeholder: '订单编号'
      },

      {
        name: 'approveStatus',
        defaultValue: '',
        type: 'select',
        width: 108,
        placeholder: '审批状态',
        enumKey: 'approveStatusList'
      },

      {
        name: 'createName',
        defaultValue: '',
        type: 'input',
        width: 108,
        placeholder: '请款人'
      },

      {
        name: 'dateRange',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '请款日期',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
          return {
            queryStartTime: beginDate,
            queryEndTime: endDate
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
  }

  get enums() {
    return [
      'approveStatusList',
    ]
  }

  get columns() {
    return [
      { title: '请款单编号', key: 'applyNumber', minWidth: 65 },
      { title: '可申请的付款金额', key: 'mayApplyAmount', minWidth: 100 },
      { title: '申请付款金额', key: 'applyAmount', minWidth: 60, editor: 'deprecated' },
      { title: '请款人', key: 'createName', minWidth: 60 },
      {
        title: '请款时间',
        key: 'createTime',
        editor: 'dateTime',
        minWidth: 90,
      },
      { title: '审批状态', key: 'approveStatus', minWidth: 100, editor: 'enum' },
      { title: '操作', slot: 'audit',  minWidth: 120 }
    ]
  }

  pay(id: any) {
    this.$nextTick(() => {
      (this.$refs.pay as any).init(id)
    })
  }

  refresh() {
    this.listPage.update()
  }

}
</script>

<style lang="less" scoped>
.button-crawl {
  margin-left: 12px;
}

.price-table {
  margin: 4px 0;
  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
</style>
