<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <Select v-model="query.adsCompanyId" placeholder="广告主公司名称" style='width: 200px;' clearable>
            <Option v-for="it in adscompany" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
          <!-- <LazyInput v-model="query.companyName" placeholder="广告计划名称" class="input"/> -->
          <Select v-model="query.planId" placeholder="广告计划名称" style='width: 200px;' clearable>
            <Option v-for="it in planlist" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
          <Select v-model="query.resourceCompanyId" placeholder="资源方公司名称" style='width: 200px;' clearable>
            <Option v-for="it in resourcescompany" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
          <Select v-model="query.planType" placeholder="订单类型" style='width: 200px;' clearable>
            <Option v-for="it in planTypeList" v-if='it.key != 0' :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <Select v-model="query.status" placeholder="订单状态" style='width: 200px;' clearable>
            <Option v-for="it in statusList" v-if='it.key != 0' :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
      </div>
      <Table :columns="columns" :data="tableData" :loading="loading"
        border stripe disabled-hover size="small" class="table"></Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    </div>
    <Dlgjie  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
    <!-- <dlgVerify  ref="change"   @refreshDataList="search" v-if="changeVisible" @done="dlgEditDone"/> -->
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList , planlist , company } from '@/api/orderSys'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
// import { numberify, numberKeys } from '@/fn/typeCast'
// import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import Dlgjie from './dlgjie.vue'
// import dlgVerify from './dlgVerify.vue'

import {confirm , warning , success, toast } from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}


@Component({
  components: {
    Dlgjie,
    // dlgVerify
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    pageIndex: 1,
    pageSize: 20,
    adsCompanyId: 0,
    resourceCompanyId: 0,
    planId: 0,
    planType: 0,
    status: 0,
  }
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false


  examine = false

  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []
  showTime: any = []

  // 状态列表
  statusList: any = []
  // 计划状态列表
  planTypeList: any = []
  // 计划列表
  planlist: any = []
  // 广告主公司列表
  adscompany: any = []
  // 资源方公司列表
  resourcescompany: any = []



  columns = [
    { title: '订单编号', key: 'id', width: 60, align: 'center' },
    { title: '广告主公司名称', width: 230, key: 'advertiserName', align: 'center' },
    { title: '广告计划', width: 200, key: 'planName', align: 'center' },
    { title: '资源方公司名称', width: 230, key: 'resourceName', align: 'center' },
    { title: '订单类型', key: 'planType', align: 'center', width: 80,
      render: (hh: any, { row: { planType } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (planType == 1) {
          return <span>标准单</span>
        } else if (planType == 2) {
          return <span>加速单</span>
        } else if (planType == 3) {
          return <span>优享单</span>
        }
        /* tslint:enable */
      }
    },
    {
      title: '接单时间',
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      width: 80,
      render: (hh: any, { row: { status } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1) {
          return <span class={`status-1`}>待执行</span>
        } else if (status == 2) {
          return <span class={`status-2`}>执行中</span>
        }
         else if (status == 3) {
          return <span class={`status-3`}>已完成</span>
        }
         else if (status == 4) {
          return <span class={`status-4`}>已关闭</span>
        }else if (status == 5) {
          return <span class={`status-5`}>已结算</span>
        }
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 3) {
          return <div class='row-acts'>
            <a on-click={this.change.bind(this, row.id, row)}>结算</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <router-link to={{ name: 'order-list-detail', params: { id , status } }}>详情</router-link>
          </div>
        } else {
          return <div class='row-acts'>
            <router-link to={{ name: 'order-list-detail', params: { id , status } }}>详情</router-link>
          </div>
        }
        
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
      status: this.statusList,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        // statusText: it.status,
      }
    })
    return list
  }

  mounted() {
    this.updateQueryByParam()
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
    try {
        // 订单列表
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
        planTypeList: planTypeList
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.statusList = statusList
      this.planTypeList = planTypeList
    // 广告计划列表
    const plandata = await planlist({pageSize: 100000})
    this.planlist = plandata.data.items
    // 公司列表
    const adscmy = await company({typeCode: 'ads' , pageSize: 100000})
    const rescmy = await company({typeCode: 'resource' , pageSize: 100000})
    this.adscompany = adscmy.data.items
    this.resourcescompany = rescmy.data.items
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

   // 结算
  change(id: number, row: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
    })
  }

  dlgEditDone() {
    this.doSearch()
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

.btn-search,
.btn-reset {
  margin-left: 8px;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Add-Inp {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 15px;
}
.Add-Inp span {
  display: inline-block;
  width: 7%;
  text-align: right;
  margin-right: 4%;
}
.Add-Inp input {
  display: inline-block;
}
.button2 {
  width: 6%;
  height: 40px;
  margin-left: 5%;
}
.page-f {
  margin-top: 10px;
  font-size: 15px;
}
.bge {
  background: #fff;
  padding: 5px;
}
.info {
  width: 35%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 20%;
  font-size: 14px;
  z-index: 10;
}
.info-ver {
  width: 100%;
  height: 43px;
  line-height: 43px;
  padding-left: 3%;
  border-bottom: 1px solid #ccc;
}
.info-ver .info-Icon {
  float: right;
  margin-right: 3%;
  font-weight: bold;
  margin-top: 10px;
}
.info-type {
  padding: 17px;
}
.info-type-t {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.info-type-t div {
  display: inline-block;
  width: 50%;
}
.info-type-t div span {
  margin-left: 10%;
}
.info-type-t .ivu-radio-group {
  margin-left: 5%;
}
.info-inp {
  margin-left: 5%;
}
.table {
  margin-top: 16px;
  /deep/ .status-2 {
    color: #19be6b;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
  </style>
