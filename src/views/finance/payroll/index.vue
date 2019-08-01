<template>
  <div class="index-page">
    <Tabs v-model="typeCode" type="card" class="tabs">
      <TabPane
        v-for="it in typeList"
        :key="it.value"
        :name="it.value"
        :label="it.name"
      />
    </Tabs>

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
    <Pay ref='pay' />
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
    Pay
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultType }) type!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get fetch() {
    if (this.typeCode == 'before') {
      return beforeList
    } else if (this.typeCode == 'audit') {
      return auditList
    } else {
      return finishfetch
    }
  }

  get filters() {
    if (this.typeCode == 'before') {
      return beforefetch
    } else if (this.typeCode == 'audit') {
      return auditfetch
    } else {
      return finishfetch
    }
  }

  get enums() {
    if (this.typeCode == 'before') {
      return beforenum
    } else if (this.typeCode == 'audit') {
      return auditenum
    } else {
      return finishfetch
    }
  }

  get columns() {
    if (this.typeCode == 'before') {
      return beforcoulm
    } else if (this.typeCode == 'audit') {
      return auditcoulm
    } else {
      return finishfetch
    }
  }

  typeCode = this.type

  typeList = typeList

  selectedIds = [] as number[]

  auditVisible = false

  crawlVisible = false

  crawlFields: Field[] = [
    {
      name: 'channel',
      defaultValue: '',
      label: '平台',
      required: true,
      select: {
        enumList: typeList.map(it => ({ key: it.value, text: it.name }))
      },
      span: 21,
    },

    {
      name: 'account',
      defaultValue: '',
      label: '平台账号',
      required: true,
      input: true,
      span: 21,
    }
  ]

  pay(id: any) {
    this.$nextTick(() => {
      (this.$refs.pay as any).init(id)
    })
  }

  refresh() {
    this.listPage.update()
  }

  @Watch('typeCode')
  watchTypeCode(type: string) {
    this.$router.push({
      name: 'finance-payroll',
      params: type == defaultType ? {} : { type }
    })
  }

  @Watch('type')
  watchType() {
    this.refresh()
  }

  @Watch('filters', { deep: true })
  watchFilters(val: any) {
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
