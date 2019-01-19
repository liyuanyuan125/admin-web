<template>
  <div class="page">
    <Tabs type="card"  :animated="false" @click="reset">
        <Tab-pane label="待审核" key="key1">
          <div class="act-bar flex-box">
            <form class="form flex-1" @submit.prevent="search">
              <LazyInput v-model="query.query" placeholder="广告片ID/名称" class="input"/>
              <Select style="width:240px" v-model="query.companyId" filterable>
                <Option v-for="it in companys" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
              <Button type="default" @click="reset" class="btn-reset">清空</Button>
            </form>
          </div>
          <Table :columns="columns" :data="list" :loading="loading"
            border stripe disabled-hover size="small" class="table"></Table>

          <div class="page-wrap" v-if="total > 0">
            <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
              show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
              @on-change="page => query.pageIndex = page"
              @on-page-size-change="pageSize => query.pageSize = pageSize"/>
          </div>
        </Tab-pane>
        <Tab-pane label="待支付" key="key2">
          <div class="act-bar flex-box">
            <form class="form flex-1" @submit.prevent="search">
              <LazyInput v-model="query.query" placeholder="广告片ID/名称" class="input"/>
              <Select style="width:240px" v-model="query.companyId" filterable>
                <Option v-for="it in companys" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
              <Button type="default" @click="reset" class="btn-reset">清空</Button>
            </form>
          </div>
          <Table :columns="columns2" :data="list2" :loading="loading"
            border stripe disabled-hover size="small" class="table"></Table>

          <div class="page-wrap" v-if="total2 > 0">
            <Page :total="total2" :current="query.pageIndex" :page-size="query.pageSize"
              show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
              @on-change="page => query.pageIndex = page"
              @on-page-size-change="pageSize => query.pageSize = pageSize"/>
          </div>
        </Tab-pane>
        <Tab-pane label="待转码" key="key3">
           <div class="act-bar flex-box">
            <form class="form flex-1" @submit.prevent="search">
              <LazyInput v-model="query.query" placeholder="广告片ID/名称" class="input"/>
              <Select style="width:240px" v-model="query.companyId" filterable>
                <Option v-for="it in companys" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
              <Button type="default" @click="reset" class="btn-reset">清空</Button>
            </form>
          </div>
          <Table :columns="columns3" :data="list3" :loading="loading"
            border stripe disabled-hover size="small" class="table"></Table>

          <div class="page-wrap" v-if="total3 > 0">
            <Page :total="total3" :current="query.pageIndex" :page-size="query.pageSize"
              show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
              @on-change="page => query.pageIndex = page"
              @on-page-size-change="pageSize => query.pageSize = pageSize"/>
          </div>
        </Tab-pane>
        <Tab-pane label="已完成" key="key4">
           <div class="act-bar flex-box">
            <form class="form flex-1" @submit.prevent="search">
              <LazyInput v-model="query.query" placeholder="广告片ID/名称" class="input"/>
              <Select style="width:240px" v-model="query.companyId" filterable>
                <Option v-for="it in companys" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
              <Button type="default" @click="reset" class="btn-reset">清空</Button>
            </form>
          </div>
          <Table :columns="columns4" :data="list4" :loading="loading"
            border stripe disabled-hover size="small" class="table"></Table>

          <div class="page-wrap" v-if="total4 > 0">
            <Page :total="total4" :current="query.pageIndex" :page-size="query.pageSize"
              show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
              @on-change="page => query.pageIndex = page"
              @on-page-size-change="pageSize => query.pageSize = pageSize"/>
          </div>
        </Tab-pane>
        <Tab-pane label="审核已拒绝" key="key5">
           <div class="act-bar flex-box">
            <form class="form flex-1" @submit.prevent="search">
              <LazyInput v-model="query.query" placeholder="广告片ID/名称" class="input"/>
              <Select style="width:240px" v-model="query.companyId" filterable>
                <Option v-for="it in companys" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
              <Button type="default" @click="reset" class="btn-reset">清空</Button>
            </form>
          </div>
          <Table :columns="columns2" :data="list5" :loading="loading"
            border stripe disabled-hover size="small" class="table"></Table>

          <div class="page-wrap" v-if="total5 > 0">
            <Page :total="total5" :current="query.pageIndex" :page-size="query.pageSize"
              show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
              @on-change="page => query.pageIndex = page"
              @on-page-size-change="pageSize => query.pageSize = pageSize"/>
          </div>
        </Tab-pane>
        <Tab-pane label="已取消" key="key6">
           <div class="act-bar flex-box">
            <form class="form flex-1" @submit.prevent="search">
              <LazyInput v-model="query.query" placeholder="广告片ID/名称" class="input"/>
              <Select style="width:240px" v-model="query.companyId" filterable>
                <Option v-for="it in companys" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
              <Button type="default" @click="reset" class="btn-reset">清空</Button>
            </form>
          </div>
          <Table :columns="columns6" :data="list6" :loading="loading"
            border stripe disabled-hover size="small" class="table"></Table>

          <div class="page-wrap" v-if="total6 > 0">
            <Page :total="total6" :current="query.pageIndex" :page-size="query.pageSize"
              show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
              @on-change="page => query.pageIndex = page"
              @on-page-size-change="pageSize => query.pageSize = pageSize"/>
          </div>
        </Tab-pane>
      </Tabs>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList , companysList} from '@/api/planfilm'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
// import DlgEdit from './dlgEdit.vue'

import {confirm , warning , success, toast } from '@/ui/modal'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    query: '',
    companyId: null,
    status: 1,
    pageIndex: 1,
    pageSize: 20,
  }
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false


  examine = false

  loading = false

  list: any = [] // 待审核
  list2: any = [] // 待支付
  list3: any = [] // 待转码
  list4: any = [] // 已完成
  list5: any = [] // 已拒绝
  list6: any = [] // 已取消

  total = 0
  total2 = 0
  total3 = 0
  total4 = 0
  total5 = 0
  total6 = 0

  oldQuery: any = {}
  typeList = []
  showTime: any = []


  statusList = []
  // 公司
  companys = []


  columns = [
    { title: '广告片ID', key: 'id', align: 'center' },
    { title: '广告片名称', key: 'name', align: 'center' },
    { title: '客户', key: 'customerName', align: 'center',
     render: (hh: any, { row: { customerId , customerName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = '[' + customerId + '] '+ customerName
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '规格', key: 'specification', align: 'center',
     render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = specification + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '时长', key: 'length', align: 'center',
      render: (hh: any, { row: { length } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = length + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '转制费(元)', key: 'transFee', align: 'center',
      render: (hh: any, { row: { transFee } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = transFee + '.00'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '创建时间',
      key: 'applyTime',
      align: 'center',
      render: (hh: any, { row: { applyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(applyTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const sta = status == 1 ? '停用' : '启用'
        return <div class='row-acts'>
          <router-link to={{ name: 'gg-film-detail', params: { status , id } }}>审核</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]
  columns2 = [
    { title: '广告片ID', key: 'id', align: 'center' },
    { title: '广告片名称', key: 'name', align: 'center' },
    { title: '客户', key: 'customerName', align: 'center',
     render: (hh: any, { row: { customerId , customerName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = '[' + customerId + '] '+ customerName
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '规格', key: 'specification', align: 'center',
     render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = specification + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '时长', key: 'length', align: 'center',
      render: (hh: any, { row: { length } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = length + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '转制费(元)', key: 'transFee', align: 'center',
      render: (hh: any, { row: { transFee } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = transFee + '.00'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '创建时间',
      key: 'applyTime',
      align: 'center',
      render: (hh: any, { row: { applyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(applyTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '审核人',
      key: 'approvalUser',
      align: 'center',
      render: (hh: any, { row: { approvalName , approvalEmail } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = approvalEmail + '【' + approvalName + '】'
        if (approvalName == null && approvalEmail == null ) {
          return <span class='datetime' v-html={'-'}></span>
        } else {
          return <span class='datetime' v-html={html}></span>
        }
        /* tslint:enable */
      }
    },
    {
      title: '审核时间',
      key: 'approvalTime',
      align: 'center',
      render: (hh: any, { row: { approvalTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(approvalTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const sta = status == 1 ? '停用' : '启用'
        return <div class='row-acts'>
          <router-link to={{ name: 'gg-film-detail', params: { status , id } }}>详情</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]
  columns3 = [
    { title: '广告片ID', key: 'id', align: 'center' },
    { title: '广告片名称', key: 'name', align: 'center' },
    { title: '客户', key: 'customerName', align: 'center',
     render: (hh: any, { row: { customerId , customerName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = '[' + customerId + '] '+ customerName
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '规格', key: 'specification', align: 'center',
     render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = specification + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '时长', key: 'length', align: 'center',
      render: (hh: any, { row: { length } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = length + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '转制费(元)', key: 'transFee', align: 'center',
      render: (hh: any, { row: { transFee } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = transFee + '.00'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '创建时间',
      key: 'applyTime',
      align: 'center',
      render: (hh: any, { row: { applyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(applyTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '支付时间',
      key: 'payTime',
      align: 'center',
      render: (hh: any, { row: { payTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(payTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const sta = status == 1 ? '停用' : '启用'
        return <div class='row-acts'>
          <router-link to={{ name: 'gg-film-detail', params: { status , id } }}>详情</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]
  columns4 = [
    { title: '广告片ID', key: 'id', align: 'center' },
    { title: '广告片名称', key: 'name', align: 'center' },
    { title: '客户', key: 'customerName', align: 'center',
     render: (hh: any, { row: { customerId , customerName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = '[' + customerId + '] '+ customerName
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '规格', key: 'specification', align: 'center',
     render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = specification + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '时长', key: 'length', align: 'center',
      render: (hh: any, { row: { length } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = length + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '转制费(元)', key: 'transFee', align: 'center',
      render: (hh: any, { row: { transFee } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = transFee + '.00'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '创建时间',
      key: 'applyTime',
      align: 'center',
      render: (hh: any, { row: { applyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(applyTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '转码时间',
      key: 'transTime',
      align: 'center',
      render: (hh: any, { row: { transTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(transTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const sta = status == 1 ? '停用' : '启用'
        return <div class='row-acts'>
          <router-link to={{ name: 'gg-film-detail', params: { status , id } }}>详情</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]
  columns6 = [
    { title: '广告片ID', key: 'id', align: 'center' },
    { title: '广告片名称', key: 'name', align: 'center' },
    { title: '客户', key: 'customerName', align: 'center',
     render: (hh: any, { row: { customerId , customerName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = '[' + customerId + '] '+ customerName
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '规格', key: 'specification', align: 'center',
     render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = specification + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '时长', key: 'length', align: 'center',
      render: (hh: any, { row: { length } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = length + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '转制费(元)', key: 'transFee', align: 'center',
      render: (hh: any, { row: { transFee } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = transFee + '.00'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '创建时间',
      key: 'applyTime',
      align: 'center',
      render: (hh: any, { row: { applyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(applyTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '取消时间',
      key: 'cancelTime',
      align: 'center',
      render: (hh: any, { row: { cancelTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(cancelTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const sta = status == 1 ? '停用' : '启用'
        return <div class='row-acts'>
          <router-link to={{ name: 'gg-film-detail', params: { status , id } }}>详情</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]

  mounted() {
    this.updateQueryByParam()
    this.doSearch()
  }



  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }
  reset() {
    this.resetQuery()
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    const query = clean({ ...this.query })
    // const query: any = {}
    try {
      // 待审核
      const { data: {
        items: list,
        totalCount: total,
      } } = await queryList({ status: 1,
                              companyId: query.companyId,
                              query: query.query,
                              pageIndex: query.pageIndex,
                              pageSize: query.pageSize
                            })
      const { data: {
        items: list2,
        totalCount: total2,
      } } = await queryList({ status: 2,
                              companyId: query.companyId,
                              query: query.query,
                              pageIndex: query.pageIndex,
                              pageSize: query.pageSize
                            })
      const { data: {
        items: list3,
        totalCount: total3,
      } } = await queryList({ status: 3,
                              companyId: query.companyId,
                              query: query.query,
                              pageIndex: query.pageIndex,
                              pageSize: query.pageSize
                            })
      const { data: {
        items: list4,
        totalCount: total4,
      } } = await queryList({ status: 4,
                              companyId: query.companyId,
                              query: query.query,
                              pageIndex: query.pageIndex,
                              pageSize: query.pageSize
                            })
      const { data: {
        items: list5,
        totalCount: total5,
      } } = await queryList({ status: 5,
                              companyId: query.companyId,
                              query: query.query,
                              pageIndex: query.pageIndex,
                              pageSize: query.pageSize
                            })
      const { data: {
        items: list6,
        totalCount: total6,
      } } = await queryList({ status: 6,
                              companyId: query.companyId,
                              query: query.query,
                              pageIndex: query.pageIndex,
                              pageSize: query.pageSize
                            })
      this.list = list // 待审核
      this.list2 = list2 // 待支付
      this.list3 = list3 // 待转码
      this.list4 = list4 // 已完成
      this.list5 = list5 // 已拒绝
      this.list6 = list6 // 已取消

      this.total = total // 待审核
      this.total2 = total2 // 待支付
      this.total3 = total3 // 待转码
      this.total4 = total4 // 已完成
      this.total5 = total5 // 已拒绝
      this.total6 = total6 // 已取消
      // 公司列表
      const { data: {
        items: companys
      } } = await companysList({ pageSize: 1000000 })
      this.companys = companys
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }
  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.doSearch()
  }
}
</script>

<style lang="less" scoped>
.form {
  .input,
  /deep/ .ivu-select {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }

  .input-corp-id {
    width: 80px;
  }
}
.table {
  margin-top: 20px;
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
/deep/ .ivu-tabs-bar .ivu-tabs-nav-container {
  height: 70px !important;
}
/deep/ .nav-text {
  width: 100%;
  margin-left: 0.02%;
}
/deep/ .ivu-tabs-tab {
  border-radius: 0 !important;
  background: #fff;
  color: #222;
  width: 16.66%;
  height: 70px !important;
  margin-right: 0 !important;
  text-align: center;
  line-height: 60px;
  font-size: 16px;
  border: 2px solid #fff !important;
  border-left: 0 !important;
}
/deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
  border-color: #fff !important;
}
/deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  color: #222;
}

</style>
