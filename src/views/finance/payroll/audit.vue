<template>
  <div class="index-page">

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      selectable
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
          @click="auditVisible = true"
        >批量审批</Button>

        <Button
          type="primary"
          class="button-audit"
          :disabled="!(selectedIds.length > 0)"
          @click="pay(selectedIds)"
        >批量发票付款</Button>
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
import { beforefetch, beforenum, beforcoulm } from './before'
import { auditfetch, auditcoulm, auditenum } from './audit'
import { finishfetch } from './finnish'
import Auditmodel from './data/auditmodel.vue'
import { EditDialog, Field } from '@/components/editForm'
import BatchAudit from '@/components/batchAudit'

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

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get fetch() {
    return auditList
  }

  get filters() {
    return auditfetch
  }

  get enums() {
    return auditenum
  }

  get columns() {
    return auditcoulm
  }

  typeCode = this.type

  typeList = typeList

  selectedIds = [] as number[]

  auditVisible = false

  crawlVisible = false

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
