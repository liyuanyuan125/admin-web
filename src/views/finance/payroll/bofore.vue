<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      selectable
      @selectionChange='selectchange'
      :selectedIds.sync="selectedIds"
      ref="listPage"
    >
      <template slot="acts-2">
        <Button
          type="primary"
          class="button-invoice"
          :disabled="!(selectedIds.length > 0)"
          @click="batchInvoice"
        >批量发票登记</Button>

        <Button
          type="primary"
          class="button-pay"
          :disabled="!(selectedIds.length > 0)"
          @click="pay(selectedIds)"
        >批量申请付款</Button>
      </template>

      <template slot="month" slot-scope="{ row: { year, month } }">
        <div class="row-acts">
          {{year}}-{{month}}
        </div>
      </template>

      <template slot="invoiceType" slot-scope="{ row: { invoiceStatus, invoiceType} }">
        <div class="row-acts" v-if='invoiceStatus == 1'>
          无发票
        </div>
        <div v-else>
          {{format(invoiceType)}}
        </div>
      </template>

      <template slot="action" slot-scope="{ row: { id, invoiceStatus, payStatus } }">
        <div class="row-acts">
          <router-link :to="invoiceRoute([id])" v-if="invoiceStatus == 2">发票登记</router-link>
          <a v-if='payStatus < 2' @click='pay([id])'>申请付款</a>
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
import { toMap } from '@/fn/array'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

@Component({
  components: {
    ListPage,
    EditDialog,
    BatchAudit,
    Pay
  }
})
export default class IndexPage extends ViewBase {

  flag: any = true
  allselectdata: any = []
  checkId: any = []
  disabledIds: any = []
  val: any = 1
  items: any = null
  data: any = null
  selectvalue: any = 1
  get listPage() {
    return this.$refs.listPage as ListPage
  }

  selectedIds = [] as number[]

  selectchange(data: any) {
    const ids = this.data.map((it: any) => it.id)
    const dataId = data.map((it: any) => it.id)
    data.forEach((item: any) => {
      if (!this.checkId.includes(item.id)) {
        this.checkId.push(item.id)
        this.allselectdata.push(item)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
    this.allselectdata = this.allselectdata.filter((it: any) => !filterId.includes(it.id))
  }

  async fetch(query: any) {
    const res = await beforeList(query)
    this.data = res.data.items || null
    return res
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

  batchInvoice() {
    const ids = this.selectedIds
    this.allselectdata.forEach((it: any) => {
      if (it.invoiceStatus != 2) {
        this.flag = false
      } else {
        this.flag = true
      }
    })
    if (this.flag) {
      this.$router.push(this.invoiceRoute(ids))
    } else {
      this.showWaring('该账单发票状态不对，请检查选中的账单')
    }
  }

  format(val: any) {
    const invkey = makeMap((this.listPage.enumType as any).invoiceTypeCodeList)
    return val ? invkey[val] : '-'
  }

  chanselect(val: any) {
    this.listPage.update()
    this.selectvalue = val
    this.selectedIds = []
  }

  invoiceRoute(ids: number[]) {
    return {
      name: 'finance-invoice-purchase-new',
      params: {
        action: 'new',
        ids: ids.join(','),
        businessType: '2'
      }
    }
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
.button-pay {
  margin-left: 8px;
}
</style>
