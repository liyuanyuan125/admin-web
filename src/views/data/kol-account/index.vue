<template>
  <div class="index-page" :key="channelCode">
    <Tabs v-model="channelCode" type="card" class="tabs">
      <TabPane
        v-for="it in channelList"
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

      <template slot="price" slot-scope="{ row: { priceList } }">
        <Table
          :columns="priceColumns"
          :data="priceList"
          size="small"
          disabled-hover
          class="price-table"
          v-if="priceList.length > 0"
        />
      </template>

      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <router-link :to="editRoute('audit', id)" v-if="status == 1">审核</router-link>
          <router-link :to="editRoute('edit', id)" v-else>编辑</router-link>
        </div>
      </template>
    </ListPage>

    <BatchAudit
      v-model="auditVisible"
      :summary="auditSummary"
      :submit="auditSubmit"
    />

    <EditDialog
      v-model="crawlVisible"
      title="抓取平台账号"
      :width="380"
      :fields="crawlFields"
      :fetch="() => ({ channel, account: '' })"
      :submit="crawlSubmit"
      hideSubmit
      hideReturn
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

import { getChannelList } from '@/util/types'

const channelList = getChannelList()
const defaultChannel = channelList[0].value

@Component({
  components: {
    ListPage,
    EditDialog,
    BatchAudit
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultChannel }) channel!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  channelCode = this.channel

  channelList = channelList

  fetch = queryList

  selectedIds = [] as number[]

  get filters(): Filter[] {
    return [
      {
        name: 'channelCode',
        defaultValue: this.channel,
      },

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
        name: 'channelDataName',
        defaultValue: '',
        type: 'input',
        width: 168,
        placeholder: '账号名称'
      },

      {
        name: 'hasSettlementPrice',
        defaultValue: 0,
        type: 'select',
        width: 128,
        placeholder: '是否有结算价'
      },

      {
        name: 'minFansCount',
        defaultValue: 0,
        type: 'number',
        width: 100,
        placeholder: '粉丝数量下限'
      },

      {
        name: 'maxFansCount',
        defaultValue: 0,
        type: 'number',
        width: 100,
        placeholder: '粉丝数量上限'
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
    'accountCategoryList',
    'statusList',
    'hasSettlementPriceList',
  ]

  get columns() {
    return [
      {
        title: '序号',
        key: 'id',
        width: 65,
        link: ({ item }) => this.editRoute('view', item.id)
      },
      {
        title: '账号',
        key: 'channelDataId',
        minWidth: 100,
      },
      { title: '名称', key: 'name', minWidth: 100 },
      { title: '分类', key: 'accountCategoryCode', minWidth: 60, enum: 'accountCategoryList' },
      { title: '粉丝数', key: 'fansCount', minWidth: 60 },

      {
        title: '关联KOL编号',
        key: 'kolId',
        minWidth: 90,
        link: ({ item }) => ({
          name: 'data-kol-associated-detail',
          params: { id: item.kolId }
        })
      },
      { title: '关联KOL名称', key: 'kolName', minWidth: 100 },
      { title: '是否提供发票', key: 'provideInvoiceText', minWidth: 90 },
      { title: '结算价/有效期', slot: 'price', minWidth: 270 },
      { title: '审核状态', key: 'status', minWidth: 65, enum: true },

      { title: '操作', slot: 'action', minWidth: 50 }
    ] as ColumnExtra[]
  }

  priceColumns = [
    { title: '类别', key: 'name', minWidth: 100 },
    { title: '价格', key: 'price', minWidth: 85, align: 'center' },
    { title: '有效期', key: 'date', minWidth: 75, align: 'center' },
  ]

  auditVisible = false

  crawlVisible = false

  get auditSummary() {
    const count = this.selectedIds.length
    return `您选择了${count}条KOL平台账号，审核通过后可以在“KOL资源列表”中操作定价和上架。`
  }

  crawlFields: Field[] = [
    {
      name: 'channel',
      defaultValue: '',
      label: '平台',
      required: true,
      select: {
        enumList: channelList.map(it => ({ key: it.value, text: it.name }))
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

  refresh() {
    this.listPage.update()
  }

  async auditSubmit({ agree, remark }: any) {
    const pdata = {
      channelCode: this.channel,
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
      channelCode: channel,
      channelDataId: account
    }
    await newItem(pdata)
    toast('操作成功')
    this.crawlVisible = false
    this.refresh()
  }

  editRoute(action: string, id: number) {
    return {
      name: 'data-kol-account-edit',
      params: { id, channel: this.channel, action }
    }
  }

  @Watch('channelCode')
  watchChannelCode(channel: string) {
    this.$router.push({
      name: 'data-kol-account',
      params: channel == defaultChannel ? {} : { channel }
    })
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
