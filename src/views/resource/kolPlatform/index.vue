<template>
  <div class="page">
      <Tabs v-model="query.status" type="card" class="tabs">
        <TabPane name="1" label="微信公众号"/>
        <TabPane name="2" label="新浪微博"/>
        <TabPane name="3" label="小红书"/>
        <TabPane name="4" label="抖音"/>
      </Tabs>

      <div class="flex-box">
          <form class="form-list" @submit.prevent="search">
              <Select v-model="query.accountClass" filterable clearable placeholder="平台账号分类" class="select-company">
                <Option v-for="it in accountClass" :key="it.key" :value="it.key">{{it.text}}</Option>
              </Select>
               <Select v-model="query.priceStatu" filterable clearable placeholder="定价状态" class="select-company">
                <Option v-for="it in priceStatus" :key="it.key" :value="it.key">{{it.text}}</Option>
              </Select>
               <Select v-model="query.upShelfStatu" filterable clearable placeholder="上架状态" class="select-company">
                <Option v-for="it in upperShelfStatus" :key="it.key" :value="it.key">{{it.text}}</Option>
              </Select>
              <LazyInput v-model="query.name" placeholder="账号名称" class="input"/>
              <LazyInput v-model="query.downLimit" placeholder="粉丝区间下限" class="up-limit" /> 万 -
              <LazyInput v-model="query.upLimit" placeholder="粉丝区间下限" class="up-limit" /> 万
              <Button type="default" class="btn-reset"  @click="reset">清空</Button>
          </form>
      </div>

      <div class="batch-btn">
        <Button type="primary" class="btn">批量上架</Button>
        <Button type="primary" class="btn">批量下架</Button>
        <Button type="primary" class="btn">批量定价</Button>
      </div>
      <Table :columns="columns" :data="list" :loading="loading"  border stripe disabled-hover size="small" class="table" 
      @on-select-all="allSelect" @on-selection-change="handleSelect">
          <template slot="operate" slot-scope="{row}">
              <!-- 待上架( 待定价：定价， 待审核：审核价格， 一定价：修改售价，审核不通过：修改售价) -->
              <div class="operate-btn">
                <span @click="handlePrice">定价</span>
                <span @click="upShelf(row.id)">待上架</span>
                <span @click="downShelf(row.id)">下架</span>
                <span @click="$router.push({name: 'resource-kolplatform-list-audit', params: {id: row.id}})">审核价格</span>
                <span>修改售价</span>
                <span @click="$router.push({name: 'resource-kolplatform-list-detail', params: {id: row.id}})">查看</span>
              </div>
          </template>
      </Table>

      <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="pageIndex" :page-size="pageSize" class="page-list"
        show-total show-sizer show-elevator
        @on-change=""
        @on-page-size-change=""/>
    </div>

      <Modal v-model="visiblePrice.visible" :title ='visiblePrice.title' class="priceModal" width="700" 
      @on-ok="handleSubmit">
          <Table :columns="columnPrice" :data="dataPrice"  border stripe class="table" >
              <template slot="costPrice" slot-scope="{row}">
                  <span>￥{{row.costPrice}}</span>
              </template>
              <template slot="sellingPrice" slot-scope="{row}">
                  <span>￥{{row.sellingPrice}}</span>
              </template>
              <template slot="priceType" slot-scope="{row, index}">
                  <Select v-model="row.ids"  @on-change="handlePriceSelect(row, index)"  placeholder="定价方式" class="up-limit">
                     <Option v-for="it in priceTypeList" :key="it.key" :value="it.key">{{it.text}}</Option>
                  </Select>
              </template>
              <template slot="number" slot-scope="{row, index}">
                  <Input v-model="row.numval" ref="priceNum" @on-blur="handleEntry(row, index)" @on-enter="handleEntry(row, index)" placeholder="固定值或系数" class="up-limit"/>
              </template>
              <template slot="selling" slot-scope="{row, index}">
                  <Input v-model="row.result" class="input-display up-limit" placeholder="自动计算"/>
                  <span v-if="index == 0">{{result1}}</span>
                  <span v-if="index == 1">{{result2}}</span>
                  <span v-if="index == 2">{{result3}}</span>
                  <span v-if="index == 3">{{result4}}</span>
              </template>
          </Table> 
      </Modal>
  </div>
</template>

<script lang='ts'>
import {Component, Mixins, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { confirm } from '@/ui/modal.ts'

@Component
export default class KolMain extends  Mixins(ViewBase, UrlManager) {
    total = 1
    pageIndex = 1
    pageSize = 20

    query = {}

    // 选中select
    selectList = []
    // 账号分类
    accountClass = [
        {key: 1, text: '母婴育儿'},
        {key: 2, text: '美容美妆'},
        {key: 3, text: '时尚穿搭'},
    ]
    // 定价状态
    priceStatus = [
        {key: 1, text: '以定价'},
        {key: 2, text: '未定价'},
        {key: 3, text: '待审核'},
        {key: 4, text: '审核不通过'},
    ]
    // 上架状态
    upperShelfStatus = [
        {key: 1, text: '待上架'},
        {key: 2, text: '已上架'},
        {key: 3, text: '已下架'},
    ]
    // 定价弹框
    visiblePrice = {
        visible: false,
        title: '定价'
    }
    // 定价类型
    result1: number | string = ''
    result2: number | string = ''
    result3: number | string = ''
    result4: number | string = ''

    priceTypeList = [
        {key: 1, text: '固定价格'},
        {key: 2, text: '成本价*系数'}
    ]
    columnPrice = [
        { title: '价格类型', key: 'priceStatus', align: 'center'},
        { title: '成本价', slot: 'costPrice', align: 'center'},
        { title: '当前销售价', slot: 'sellingPrice', align: 'center'},
        { title: '定价方式', slot: 'priceType', align: 'center'},
        { title: '数值', slot: 'number', align: 'center'},
        { title: '售价', slot: 'selling', align: 'center'},
    ]
    dataPrice: any = [
        {
            priceStatus: '多图文第1条',
            costPrice: 400,
            sellingPrice: 800,
            types: 1,
            ids: 1,
            result: ''
        },
        {
            priceStatus: '多图文第2条',
            costPrice: 400,
            sellingPrice: 800,
            types: 2,
            ids: 1,
            result: ''
        },
        {
            priceStatus: '多图文第3条',
            costPrice: 400,
            sellingPrice: 800,
            types: 3,
            ids: 1,
            result: ''
        },
        {
            priceStatus: '单图文',
            costPrice: 400,
            sellingPrice: 800,
            type: 4,
            ids: 1,
            result: ''
        },
    ]

    loading = false
    columns = [
        {type: 'selection', width: 50},
        {title: '平台账号', key: 'account', minWidth: 100},
        {title: '平台账号名称', key: 'name', minWidth: 100},
        {title: '平台账号分类', key: 'classification', minWidth: 100},
        {title: '粉丝数', key: 'fansNum', minWidth: 80},
        {title: '关联的KOL编号', key: 'kolCode', minWidth: 100},
        {title: '关联的KOL名称', key: 'kolName', minWidth: 100},
        {title: '是否提供发票', key: 'hasInvoice', minWidth: 100},
        {title: '结算价', key: 'settlementPrice', minWidth: 120},
        {title: '成本价', key: 'costPrice', minWidth: 120},
        {title: '销售价', key: 'sellingPrice', minWidth: 70},
        {title: '上架状态', key: 'upShelf', minWidth: 70},
        {title: '定价状态', key: 'priceStatu', minWidth: 70},
        {title: '操作', fixed: 'right', slot: 'operate', minWidth: 200},
    ]
    list = [
        {
            account: 'xxxx',
            name: 'xxxx',
            classification: 'xxxx',
            fansNum: 'xxxx',
            kolCode: 'xxx',
            kolName: 'xxx',
            hasInvoice: 'xxx',
            settlementPrice: 'xxx',
            costPrice: 'xxxx',
            sellingPrice: 'xxx',
            upShelf: 1,
            priceStatu: 1,
            id: 1,
        },
        {
            account: 'xxxx',
            name: 'xxxx',
            classification: 'xxxx',
            fansNum: 'xxxx',
            kolCode: 'xxx',
            kolName: 'xxx',
            hasInvoice: 'xxx',
            settlementPrice: 'xxx',
            costPrice: 'xxxx',
            sellingPrice: 'xxx',
            upShelf: 2,
            priceStatu: 2,
            id: 2
        },
        {
            account: 'xxxx',
            name: 'xxxx',
            classification: 'xxxx',
            fansNum: 'xxxx',
            kolCode: 'xxx',
            kolName: 'xxx',
            hasInvoice: 'xxx',
            settlementPrice: 'xxx',
            costPrice: 'xxxx',
            sellingPrice: 'xxx',
            upShelf: 3,
            priceStatu: 3,
            id: 3
        },
        {
            account: 'xxxx',
            name: 'xxxx',
            classification: 'xxxx',
            fansNum: 'xxxx',
            kolCode: 'xxx',
            kolName: 'xxx',
            hasInvoice: 'xxx',
            settlementPrice: 'xxx',
            costPrice: 'xxxx',
            sellingPrice: 'xxx',
            upShelf: 3,
            priceStatu: 4,
            id: 4
        },
    ]
    mounted() {
        this.search()
    }
    search() {}
    _emptyOption() {
        const list: any = this.query
        for (const item in list) {
            if (list[item]) {
               list[item] = null
            }
        }
    }
    reset() {
        this._emptyOption()
    }
    // 上架
    async upShelf(id: any) {
        await confirm(`是否对${id}KOL资源进行上架`, { title: '上架'})
    }
    // 下架
    async downShelf(id: any) {
        await confirm(`是否对${id}KOL资源进行下架`, { title: '下架'})
    }

    // 定价
    handlePrice() {
        this.visiblePrice.visible = true
    }
    handleRow(row: any, index: number) {
        // 重新定义一个数组，把添加的数据存入里面，暂时获取不到table list的值
        if (row.ids == 1) {
            this.result1 = index == 0 ? row.numval : ''
            this.result2 = index == 1 ? row.numval : ''
            this.result3 = index == 2 ? row.numval : ''
            this.result4 = index == 3 ? row.numval : ''
        } else {
            this.result1 = index == 0 ? row.numval * row.costPrice : ''
            this.result2 = index == 1 ? row.numval * row.costPrice : ''
            this.result3 = index == 2 ? row.numval * row.costPrice : ''
            this.result4 = index == 3 ? row.numval * row.costPrice : ''
        }
    }
    handlePriceSelect(row: any, index: number) {
        if (row.numval) { // 数值必须存在
            this.handleRow(row, index)
        }
    }
    handleEntry(row: any, index: any) {
         this.handleRow(row, index)
    }

    handleSubmit() {}

    allSelect(option: any) {
        this.selectList = option
    }
    handleSelect(option: any) {
        this.selectList = option
    }

    @Watch('query', { deep: true})
    watchQuery() {
        this.pageIndex = 1
        this.search()
    }
}

</script>
<style lang='less' scoped>
@import '../less/common.less';
</style>