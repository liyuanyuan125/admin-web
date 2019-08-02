<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >

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
import { beforeList, finishlist } from '@/api/payroll'
import { alert, toast } from '@/ui/modal'
import { finishfetch, finishnum, finshcoulm } from './finnish'
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
    return finishlist
  }

  get filters() {
    return finishfetch
  }

  get enums() {
    return finishnum
  }

  get columns() {
    return finshcoulm
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
