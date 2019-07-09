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
        <Button
          type="success"
          icon="md-add-circle"
        >新建</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'data-cinema-hall', params: { id } }"
            v-auth="'theater.cinemas:info'"
          >查看影厅</router-link>
          <a @click="editShow(id)" v-auth="'theater.cinemas:modify'">编辑</a>
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

      // {
      //   name: 'chainId',
      //   defaultValue: 0,
      //   type: CinemaChainSelect,
      //   width: 168,
      //   minWidth: 168
      // },

      // {
      //   ...areaParam,
      //   type: AreaSelect,
      //   width: 160,
      //   placeholder: '地区名称'
      // },

      // {
      //   name: 'status',
      //   defaultValue: 0,
      //   type: 'select',
      //   width: 85,
      //   placeholder: '营业状态'
      // },

      // {
      //   name: 'controlStatus',
      //   defaultValue: 0,
      //   type: 'select',
      //   width: 85,
      //   placeholder: '控制状态'
      // },

      // {
      //   name: 'hallDataStatus',
      //   defaultValue: 0,
      //   type: 'select',
      //   width: 85,
      //   placeholder: '影厅数据'
      // },

      // {
      //   name: 'pricingLevelCode',
      //   defaultValue: '',
      //   type: 'select',
      //   width: 85,
      //   placeholder: '定价级别',
      //   enumKey: 'pricingLevelList'
      // },

      // {
      //   name: 'boxLevelCode',
      //   defaultValue: '',
      //   type: 'select',
      //   width: 85,
      //   placeholder: '票房级别',
      //   enumKey: 'boxLevelList'
      // },

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
    'controlStatusList',
    'hallDataStatusList',
    'pricingLevelList',
    'boxLevelList',
    'gradeList'
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', width: 65 },
      { title: '平台账号', key: 'channelDataId', width: 80 },
      { title: '平台账号名称', key: 'name', width: 110 },
      { title: '平台账号分类', key: 'accountCategoryCode', width: 90, editor: 'deprecated' },
      { title: '粉丝数', key: 'fansCount', width: 60 },

      // { title: '院线', key: 'chainName', minWidth: 90, editor: 'deprecated' },
      // { title: '省份', key: 'provinceName', width: 80 },
      // { title: '城市', key: 'cityName', width: 80 },
      // { title: '区县', key: 'countyName', width: 80 },
      // { title: '级别', key: 'gradeCode', width: 60, editor: 'deprecated' },
      // {
      //   title: '营业状态',
      //   key: 'status',
      //   width: 70,
      //   editor: 'poptipSelect',
      //   updateField: updateStatus,
      //   auth: 'theater.cinemas:change-status'
      // },
      // {
      //   title: '控制状态',
      //   key: 'controlStatus',
      //   width: 75,
      //   editor: 'poptipSelect',
      //   updateField: updateControlStatus,
      //   auth: 'theater.cinemas:change-control-status'
      // },
      // {
      //   title: '定价级别',
      //   key: 'pricingLevelCode',
      //   width: 75,
      //   editor: 'poptipSelect',
      //   updateField: updatePricingLevelCode,
      //   auth: 'theater.cinemas:change-pricing-level'
      // },
      // {
      //   title: '票房级别',
      //   key: 'boxLevelCode',
      //   width: 75,
      //   editor: 'poptipSelect',
      //   updateField: updateBoxLevelCode,
      //   auth: 'theater.cinemas:change-box-level'
      // },
      // { title: '操作', slot: 'action', width: 100 }
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
</style>
