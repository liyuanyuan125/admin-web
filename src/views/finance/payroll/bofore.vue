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
      <template slot="acts-2">
        <Button
          type="primary"
          class="button-audit"
          :disabled="!(selectedIds.length > 0)"
          @click="auditVisible = true"
        >批量发票登记</Button>

        <Button
          type="primary"
          class="button-audit"
          :disabled="!(selectedIds.length > 0)"
          @click="pay(selectedIds)"
        >批量发票付款</Button>
      </template>

      <template slot="month" slot-scope="{ row: { year, month } }">
        <div class="row-acts">
          {{year}}-{{month}}
        </div>
      </template>

      <template slot="action" slot-scope="{ row: { id, invoiceStatus, payStatus } }">
        <div class="row-acts">
          <a v-if='invoiceStatus < 2'>发票登记</a>
          <a v-if='payStatus < 2' @click='pay([id])'>发票付款</a>
        </div>
      </template>
    </ListPage>
    <Pay @done='refresh' ref='pay' />
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
import Pay from './paymodel.vue'
import { EditDialog, Field } from '@/components/editForm'
import BatchAudit from '@/components/batchAudit'


@Component({
  components: {
    ListPage,
    EditDialog,
    BatchAudit,
    Pay
  }
})
export default class IndexPage extends ViewBase {

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get fetch() {
    return beforeList
  }

  get filters() {
    return beforefetch
  }

  get enums() {
    return beforenum
  }

  get columns() {
    return beforcoulm
  }

  selectedIds = [] as number[]

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