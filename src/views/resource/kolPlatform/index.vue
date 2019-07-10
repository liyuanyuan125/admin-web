<template>
  <div>
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
      @selectionChange="selectionChange"
      ref="listPage"
    >
      <template slot="acts">
        <Button type="primary" icon="md-add-circle" >新建</Button>
      </template>
      <template slot="acts-2" >
        <div class="bulk-button">
          <Button type="primary" >批量上架</Button>
          <Button type="primary" >批量下架</Button>
          <Button type="primary"  >批量定价</Button>
        </div>
      </template>

      <template slot="provideInvoice" slot-scope="{row: {provideInvoice}}">
        <span>{{provideInvoice ? '是' : '否'}}</span>
      </template>
      <template slot="settlementPrices" slot-scope="{row: {settlementPrices}}">
        <span v-for="(item, index) in (settlementPrices || [])" :key="index">
          {{item.categoryName}}￥{{item.settlementPrice}}
        </span>
      </template>
      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <a @click="">上架</a>
          <a >下架</a>
          <a >修改售价</a>
          <router-link :to="{name: 'resource-kolplatform-list-detail', params: {id}}">审核价格</router-link>
          <router-link :to="{name: 'resource-kolplatform-list-audit', params: {id}}">查看</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import AreaSelect, { areaParam } from '@/components/areaSelect'
import { queryList } from './data'

import {
  updateStatus,
  updateControlStatus,
  updatePricingLevelCode,
  updateBoxLevelCode,
  queryItem,
  addItem,
  updateItem
} from '@/api/cinema'

import EditDialog, { Field } from '@/components/editDialog'

import { getChannelList } from '@/util/types'

const channelList = getChannelList()
const defaultChannel =  channelList[0].value

@Component({
  components: {
    ListPage,
    CinemaChainSelect,
    AreaSelect,
    EditDialog
  }
})
export default class KolPlatformIndex extends ViewBase {
  @Prop({ type: String, default: defaultChannel }) channel!: string

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
        width: 128,
        placeholder: '平台账号分类'
      },

      {
        name: 'channelDataName',
        defaultValue: '',
        type: 'input',
        width: 128,
        placeholder: '账号名称'
      },

      {
        name: 'minFansCount',
        defaultValue: '',
        type: 'input',
        width: 100,
        placeholder: '粉丝数量下限'
      },
      {
        name: 'maxFansCount',
        defaultValue: '',
        type: 'input',
        width: 100,
        placeholder: '粉丝数量上限'
      },

      {
        name: 'priceStatus',
        defaultValue: 0,
        type: 'select',
        width: 128,
        placeholder: '定价状态',
        enumKey: 'priceStatusList'
      },

      {
        name: 'controlStatus',
        defaultValue: 0,
        type: 'select',
        width: 128,
        placeholder: '上架状态',
        enumKey: 'controlStatusList'
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
    'controlStatusList',
    'priceStatusList'
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', width: 65 },
      { title: '平台账号', key: 'channelDataId', width: 80 },
      { title: '平台账号名称', key: 'name', width: 110 },
      { title: '平台账号分类', key: 'accountCategoryCode', width: 90, editor: 'deprecated' },
      { title: '粉丝数', key: 'fansCount', width: 100 },
      { title: '关联的KOL编号', key: 'kolId', minWidth: 100 },
      { title: '关联的KOL名称', key: 'kolName', minWidth: 100 },
      { title: '是否提供发票', slot: 'provideInvoice', minWidth: 100 },
      { title: '结算价', slot: 'settlementPrices', width: 140 },
      { title: '成本价', key: 'prices', minWidth: 140 },
      { title: '销售价', key: 'salePrice', minWidth: 140 },
      { title: '上架状态', key: 'controlStatus', width: 100, editor: 'enum'},
      { title: '定价状态', key: 'priceStatus', width: 100, editor: 'enum'},
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  selectionChange(list: any[]) {
    // debugger
  }

  @Watch('channelCode')
  watchChannelCode(channel: string) {
    this.$router.push({
      name: 'resource-kolplatform-list',
      params: channel == defaultChannel ? {} : { channel }
    })
  }

  @Watch('channel')
  watchChannel(channel: string) {
    const listPage = this.$refs.listPage as ListPage
    listPage.query.channelCode = channel
  }
}
</script>

<style lang="less" scoped>
/deep/ .bulk-button {
  padding-top: 20px;
  .ivu-btn {
    margin-right: 15px;
  }
}
</style>
