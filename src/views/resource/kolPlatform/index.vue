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
      @selectionChange = selectionChange
      ref="listPage"
    >
      <template slot="acts-2" >
        <div class="bulk-button">
          <Button type="primary" @click="batchUpper(1)" >批量上架</Button>
          <Button type="primary" @click="batchUpper(2)" >批量下架</Button>
          <Button type="primary" @click="editPrice" >批量定价</Button>
        </div>
      </template>

      <template slot="settlementPrices" slot-scope="{row: {settlementPrices}}">
        <p v-for="(item, index) in (settlementPrices || [])" :key="index">
          {{item.categoryName}}￥{{item.settlementPrice}}
        </p>
      </template>
      <template slot="costPrices" slot-scope="{row: {costPrices}}">
         <p v-for="(item, index) in (costPrices || [])" :key="index">
          {{item.categoryName}}￥{{item.price}}
        </p>
      </template>
      <template slot="prices" slot-scope="{row: {prices}}">
         <p v-for="(item, index) in (prices || [])" :key="index">
          {{item.categoryName}}￥{{item.salePrice}}
        </p>
      </template>
      
      <template slot="action" slot-scope="{ row: { id, priceStatus, controlStatus} }">
        <div class="row-acts">
          <a v-if="[2].includes(controlStatus)" @click="batchUpper(1, id)">上架</a>
          <a v-if="[1].includes(controlStatus)" @click="batchUpper(2, id)">下架</a>
          <a v-if="[1, 3, 4].includes(priceStatus)" @click="singlePrice(id)">修改定价</a>
          <router-link v-if="[2].includes(priceStatus)" 
          :to="{name: 'resource-kolplatform-list-detail', params: {id, code: channelCode, type: 2}}">审核价格</router-link>
          <router-link :to="{name: 'resource-kolplatform-list-detail', params: {id, code: channelCode}}">查看</router-link>
        </div>
      </template>
    </ListPage>

    <Modal v-model="visPrice" width="500" title="批量修改定价"
    @on-ok="handleSubmit('all')" >
      <p class="price-text">您选择了{{selectedIds.length}}条KOL资源进行定价。</p>
        <Table :columns="columnPrice" :data="dataPrice"  border stripe>
          <template slot="value" slot-scope="{row, index}">
            <Input v-model="row.value"  />
          </template>
        </Table>
    </Modal>

    <Modal v-model="visSingle" width="500" title="修改定价" class="single-modal"
    @on-ok="handleSubmit('single')" >
        <Table :columns="colSinglePrice" :data="dataSinglePrice"  border stripe>
          <template slot="priceType" slot-scope="{row, index}">
            <Select v-model="row.priceType" @on-change="handleSelect(row.priceType, index)">
              <Option :value="1">固定价格</Option>
              <Option :value="2">成本价*系数</Option>
            </Select>
          </template>
          <template slot="value" slot-scope="{row, index}">
            <Input v-model="row.value"  />
          </template>
        </Table>
    </Modal>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { confirm, info, alert } from '@/ui/modal.ts'
import { queryList, kolUpper, kolOff, changePrice, details } from './data'

import { getChannelList } from '@/util/types'

const channelList = getChannelList()
const defaultChannel =  channelList[0].value

@Component({
  components: {
    ListPage,
  }
})
export default class KolPlatformIndex extends ViewBase {
  @Prop({ type: String, default: defaultChannel }) channel!: string

  channelCode = this.channel

  channelList = channelList

  publishCategoryList: any[] = []

  selectedIds = [] as number[]
  selectList: any[] = []

  get filters(): Filter[] {
    return [
      {
        name: 'channelCode',
        defaultValue: this.channel,
      },
      {
        name: 'status',
        defaultValue: 2,
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
      { title: '是否提供发票', key: 'provideInvoiceText', minWidth: 100 },
      { title: '结算价', slot: 'settlementPrices', width: 140 },
      { title: '成本价', slot: 'costPrices', minWidth: 140 },
      { title: '销售价', slot: 'prices', minWidth: 140 },
      // { title: '审核状态', slot: 'status', minWidth: 140 },
      { title: '上架状态', key: 'controlStatus', width: 100, editor: 'enum'},
      { title: '定价状态', key: 'priceStatus', width: 100, editor: 'enum'},
      { title: '操作', slot: 'action', width: 140 }
    ] as ColumnExtra[]
  }

  // 多个定价
  visPrice = false
  columnPrice = [
    { title: '价格类型', key: 'text', align: 'center'},
    { title: '定价方式', key: 'priceText', align: 'center'},
    { title: '系数', slot: 'value', align: 'center', render: (h: any, params: any) => {
      return h('Input', {
        on: {
            'on-blur': (event: any) => {
              this.handleBlur(event.target.value, params.index, 1)
            },
        },
      })
    }
    },
  ]
  dataPrice: any[] = []

  // 单个定价
  visSingle = false
  colSinglePrice = [
    { title: '价格类型', key: 'text', align: 'center'},
    { title: '定价方式', slot: 'priceType', align: 'center'},
    { title: '系数/价格', slot: 'value', align: 'center',  render: (h: any, params: any) => {
      return h('Input', {
        on: {
            'on-blur': (event: any) => {
              this.handleBlur(event.target.value, params.index, 2)
            },
        },
      })
    }
    },
  ]
  dataSinglePrice: any[] = []

  async fetch(query: any) {
    const res = await queryList(query)
    this.publishCategoryList = res.publishCategoryList
    return res
  }

  async batchUpper(status: number, id?: number) {
    // status 1, 2来区分上下架
    const channelCode = this.channelCode
    const text = status == 1 ? '上架' : '下架'
    if (!id) {
      if (!this.selectedIds.length) {
        await alert(`请选择${text}数据`, {
          title: '提示'
        })
        return
      }
    }
    const ids = id ? Array.of(id) : this.selectedIds
    await confirm(`您选择了${ids.length}条数据进行${text }`, {
      title: `${text}操作`
    })
    try {
      if (status == 1) { // 上架
        const { data } = await kolUpper({
          channelCode,
          ids
        })
      } else { // 下架
        const { data } = await kolOff({
          channelCode,
          ids
        })
      }
      (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async editPrice() {
    if (this.selectedIds.length) {
      this.visPrice = true
      this.dataPrice = this.publishCategoryList.map((item: any, index) => {
        return {
          text: item.text,
          categoryCode: item.key,
          priceText: '成本价*系数',
          priceType: 2,
          value: '',
        }
      })
    } else {
      await info('请勾选数据进行批量定价操作', {
        title: '提示'
      })
    }
  }

  // 单个修改定价
  singlePrice(id: number) {
    this.selectedIds = Array.of(id)
    this.visSingle = true
    this.dataSinglePrice = this.publishCategoryList.map((item: any, index) => {
      return {
        text: item.text,
        categoryCode: item.key,
        priceType: 1,
        value: '',
      }
    })
  }
  handleSelect(val: any, ind: any) {
     this.dataSinglePrice[ind].priceType = val
  }

  async handleSubmit(code: string) {
    // 区分批量操作/单个操作 code
    const prices = code == 'all' ? this.dataPrice : this.dataSinglePrice
    try {
      const { data } = await changePrice({
        channelCode: this.channelCode,
        ids: this.selectedIds,
        prices,
      });
      (this.$refs.listPage as any).update()
      this.dataPrice = []
      this.dataSinglePrice = []
      this.selectedIds = []
      this.selectList = []
      this.visPrice = false
      this.visSingle = false
    } catch (ex) {
      this.handleError(ex)
      this.visPrice = false
      this.visSingle = false
    }
  }

  handleBlur(val: any, index: any, num: number) {
    if (num == 1) {
      this.dataPrice[index].value = val
    } else {
      this.dataSinglePrice[index].value = val
    }
  }

  selectionChange(list: any) {
    this.selectList = list
  }

  @Watch('channelCode')
  watchChannelCode(channel: string) {
    this.selectedIds = []
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
.table-header {
  span {
    flex: 1;
  }
}
.price-text {
  text-align: center;
  padding: 10px 0;
}
.single-modal {
  /deep/ .ivu-table-wrapper {
    overflow: inherit;
  }
}
</style>
