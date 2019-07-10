<template>
  <div class="index-page">
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
        <Button
          type="success"
          icon="md-add-circle"
        >新建</Button>
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
const defaultChannel = channelList[0].value

@Component({
  components: {
    ListPage,
    CinemaChainSelect,
    AreaSelect,
    EditDialog
  }
})
export default class IndexPage extends ViewBase {
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
      { title: '序号', key: 'id', width: 65 },
      { title: '账号', key: 'channelDataId', width: 80 },
      { title: '名称', key: 'name', minWidth: 100 },
      { title: '分类', key: 'accountCategoryCode', width: 60, editor: 'deprecated' },
      { title: '粉丝数', key: 'fansCount', width: 60 },

      { title: '关联KOL编号', key: 'kolIdText', width: 90 },
      { title: '关联KOL名称', key: 'kolName', width: 100 },
      { title: '是否提供发票', key: 'provideInvoiceText', width: 90 },
      { title: '结算价/有效期', slot: 'price', width: 270 },
      { title: '审核状态', key: 'status', width: 65, editor: 'enum' },

      { title: '操作', slot: 'action', width: 65 }
    ] as ColumnExtra[]
  }

  priceColumns = [
    { title: '类别', key: 'name' },
    { title: '价格', key: 'price', width: 75, align: 'center' },
    { title: '有效期', key: 'date', width: 75, align: 'center' },
  ]

  selectionChange(list: any[]) {
    // debugger
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
    const listPage = this.$refs.listPage as ListPage
    listPage.query.channelCode = channel
  }
}
</script>

<style lang="less" scoped>
.settlement-price-list {
  text-align: left;
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
