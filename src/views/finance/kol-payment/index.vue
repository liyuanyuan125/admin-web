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
        >批量审核</Button>

        <Button
          type="primary"
          class="button-crawl"
          @click="crawlVisible = true"
        >抓取平台账号</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <router-link
            :to="{
              name: 'data-kol-account-edit',
              params: {
                id,
                channel,
                action: status == 1 ? 'audit' : 'edit'
              }
            }"
          >{{status == 1 ? '审核' : '编辑'}}</router-link>
        </div>
      </template>
    </ListPage>

    <BatchAudit
      v-model="auditVisible"
      :summary="auditSummary"
      :submit="auditSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList, auditItem, newItem } from './data'
import { alert, toast } from '@/ui/modal'
import { EditDialog, Field } from '@/components/editForm'
import BatchAudit from '@/components/batchAudit'

@Component({
  components: {
    ListPage,
    EditDialog,
    BatchAudit
  }
})
export default class IndexPage extends ViewBase {

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  fetch = queryList

  selectedIds = [] as number[]

  get filters(): Filter[] {
    return [

      {
        name: 'accountCategoryCode',
        defaultValue: 0,
        type: 'select',
        width: 108,
        placeholder: '账号分类'
      },

      {
        name: 'channelDataId',
        defaultValue: '',
        type: 'input',
        width: 88,
        placeholder: '账号 Id'
      },

      {
        name: 'invoiceStatus',
        defaultValue: 0,
        enumKey: 'invoiceStatusList',
        type: 'select',
        width: 128,
        placeholder: '发票状态'
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

  enums = [
    'invoiceStatusList',
    'payStatusList',
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', minWidth: 65 },
      { title: '订单编号', key: 'mainOrderNo', minWidth: 65 },
      { title: '子订单编号', key: 'subOrderNo', minWidth: 100 },
      { title: 'KOL编号', key: 'kolId', minWidth: 60 },
      { title: 'KOL名称', key: 'kolName', minWidth: 60 },
      // { title: '平台', key: 'channelCode', editor: 'channelCodeList', minWidth: 100 },
      { title: '订单创建时间', key: 'subOrderCreateTime', slot: 'price', minWidth: 270 },
      { title: '推广品牌', key: 'brandName', minWidth: 65 },
      { title: '结算金额', key: 'status', minWidth: 65 },


      { title: '已付款金额', key: 'paidAmount', minWidth: 65 },
      { title: '待付款金额', key: 'unpaidAmount', minWidth: 65 },
      { title: '付款状态', key: 'payStatus', minWidth: 65 },
      { title: '发票状态', key: 'invoiceStatus', minWidth: 65, editor: 'invoiceStatusList'},
      { title: '操作', slot: 'action', minWidth: 50 }
    ] as ColumnExtra[]
  }

  auditVisible = false

  crawlVisible = false

  get auditSummary() {
    const count = this.selectedIds.length
    return `您选择了${count}条KOL平台账号，审核通过后可以在“KOL资源列表”中操作定价和上架。`
  }

  refresh() {
    this.listPage.update()
  }

  async auditSubmit({ agree, remark }: any) {
    const pdata = {
      ids: this.selectedIds,
      agree,
      remark: agree ? '' : remark
    }
    await auditItem(pdata)
    toast('操作成功')
    this.selectedIds = []
    this.auditVisible = false
    this.refresh()
  }

  async crawlSubmit({ channel, account }: any) {
    const pdata = {
      channelDataId: account
    }
    await newItem(pdata)
    toast('操作成功')
    this.crawlVisible = false
    this.refresh()
  }

  @Watch('channel')
  watchChannel(channel: string) {
    this.listPage.query.channelCode = channel
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
