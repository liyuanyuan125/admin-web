<template>
  <div class="page">
    <div>
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.id" placeholder="订单编号" class="input"/>
          <!-- <LazyInput v-model="query.planIdNum" placeholder="广告计划ID" class="input"/> -->
          <!-- <Select v-model="query.xadvertiserId" placeholder="广告主公司名称" style='width: 150px;'  filterable>
            <Option v-for="it in adscompany" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select> -->
          <Select
             class='sels'
             v-model='query.xadvertiserId'
             clearable
             filterable
             placeholder="广告主公司名称"
             style='width: 150px;'
             remote
             :remote-method="adsremoteMethod"
             @on-clear="adscompany = []"
              >
              <Option
                v-for="(item, index) in adscompany"
                :key="index"
                :value="item.id"
              >{{item.name}}</Option>
            </Select>
            <Select
             class='sels'
             v-model='query.resourceId'
             clearable
             filterable
             placeholder="资源方公司名称"
             style='width: 150px;'
             remote
             :remote-method="resourceremoteMethod"
             @on-clear="resourcescompany = []"
              >
              <Option
                v-for="(item, index) in resourcescompany"
                :key="index"
                :value="item.id"
              >{{item.name}}</Option>
            </Select>
            <Select
             class='sels'
             v-model='query.planId'
             clearable
             filterable
             placeholder="广告计划名称"
             style='width: 150px;'
             remote
             :remote-method="planremoteMethod"
             @on-clear="planlist = []"
              >
              <Option
                v-for="(item, index) in planlist"
                :key="index"
                :value="item.id"
              >{{item.name}}</Option>
            </Select>
          <!-- <Select v-model="query.planId" placeholder="广告计划名称" style='width: 150px;'  filterable>
            <Option v-for="it in planlist" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select> -->
<!--           <Select v-model="query.resourceId" placeholder="资源方公司名称" style='width: 150px;'  filterable>
            <Option v-for="it in resourcescompany" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select> -->
           <Select
             class='sels'
             v-model='query.cinemaId'
             clearable
             filterable
             placeholder="影院名称/专资编码查询"
             style='width: 150px;'
             remote
             :remote-method="remoteMethod"
             @on-clear="movieList = []"
              >
              <Option
                v-for="(item, index) in movieList"
                :key="index"
                :value="item.id"
              >【{{item.code}}】{{item.shortName}}</Option>
            </Select>
            <Select v-model="query.status" placeholder="订单状态" style='width: 120px;' clearable>
              <Option v-for="it in statusList" v-if='it.key != 0' :key="it.key" :value="it.key"
                :label="it.text">{{it.text}}</Option>
            </Select>
            <Select v-model="query.xadvertType" placeholder="广告类型" style='width: 120px;' clearable>
              <Option v-for="it in advertTypeCodeList" v-if='it.key != 0' :key="it.key" :value="it.key"
                :label="it.text">{{it.text}}</Option>
            </Select>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
      </div>
      <Table :columns="columns" :data="tableData" :loading="loading"
        border stripe disabled-hover size="small" class="table">
        <template slot="targetCount" slot-scope="{row}">
          <span>{{row.receiveCount}} / {{row.targetCount}}</span>
        </template>
        <template slot="advertType" slot-scope="{row}">
          <span v-if='row.advertType == null'>-</span>
          <span v-for='(its,index) in advertTypeCodeList' v-if='row.advertType == its.key'>{{its.text}}</span>
        </template>
        <template slot="status" slot-scope="{row}">
          <span v-for='(its,index) in statusList' v-if='row.status == its.key'>{{its.text}}</span>
        </template>
          <template slot="spaction" slot-scope="{row}">
          <a href="javascript:;" v-show='row.status == 4 || row.status == 2' @click='waiting(row.id)'>设为待接单</a>
          <!-- 待接单 、 执行中 、 已拒绝删除操作 -->
          <a href="javascript:;" v-show='row.status == 1 || row.status == 4 || row.status == 2' @click='deletes(row.id)'>删除&nbsp;&nbsp;&nbsp;</a>
          <!-- <a v-show='row.status == 3' v-auth="'advert.executeOrder:settlement'" @click="change(row.id, row)">结算</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
          <!-- <router-link v-show='row.status == 3' v-auth="'advert.executeOrder:info'" :to="{ name: 'order-list-detail', params: { id: row.id , status: row.status } }">详情</router-link> -->
          <router-link  v-auth="'advert.executeOrder:info'" :to="{ name: 'order-list-detail', params: { id: row.id , status: row.status } }">详情</router-link>
        </template>
        </Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          placement='top'
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    </div>
    <Dlgjie  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
    <waitorder  ref="waitaddOrUpdate"   @refreshDataList="search" v-if="waitaddOrUpdateVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList , company , planlist , movielist , dels , chgstatus} from '@/api/orderSys'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import Dlgjie from './dlgjie.vue'
import waitorder from './waitorder.vue'

import {confirm , warning , success, toast } from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}


@Component({
  components: {
    Dlgjie,
    waitorder
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    pageIndex: 1,
    pageSize: 20,
    id: null,
    resourceId: null,
    xadvertiserId: null,
    cinemaId: null,
    planId: null,
    xadvertType: null,
    status: null,
  }
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false

  waitaddOrUpdateVisible = false


  examine = false

  loading = false
  loadings = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []
  showTime: any = []

  // 状态列表
  statusList: any = []
  // 计划状态列表
  advertTypeCodeList: any = []
  // 计划列表
  planlist: any = []
  // 广告主公司列表
  adscompany: any = []
  // 资源方公司列表
  resourcescompany: any = []
  // 影院列表
  movieList: any = []



  columns = [
    { title: '订单编号', key: 'id', width: 80, align: 'center' },
    { title: '广告主公司名称', key: 'advertiserName', align: 'center' },
    // { title: '关联销售', key: 'advertiserName', align: 'center' },
    // { title: '广告计划ID', key: 'advertiserName', align: 'center' },
    { title: '广告计划',  key: 'planName', align: 'center' },
    { title: '资源方公司名称', key: 'resourceName', align: 'center' },
    { title: '广告类型', slot: 'advertType', align: 'center', width: 90 },
    { title: '接单影院/派单影院', slot: 'targetCount', align: 'center', width: 90},
    {
      title: '接单时间',
      key: 'createTime',
      align: 'center',
      width: 180,
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
      slot: 'status',
      align: 'center',
      width: 90,
    },
    {
      title: '操作',
      slot: 'spaction',
      width: 80,
      align: 'center',
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

  // 影院搜索
  async remoteMethod(querys: any) {
    try {
      if (querys) {
        this.loadings = true
        const {
          data: { items }
        } = await movielist({
          query: querys,
        })
        this.movieList = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  // 广告主公司搜索
  async adsremoteMethod(querys: any) {
    try {
      if (querys) {
        this.loadings = true
        const {
          data: { items }
        } = await company({
          shortName: querys,
          typeCode: 'ads'
        })
        this.adscompany = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

 // 资源方公司搜索
  async resourceremoteMethod(querys: any) {
    try {
      if (querys) {
        this.loadings = true
        const {
          data: { items }
        } = await company({
          shortName: querys,
          typeCode: 'resource'
        })
        this.resourcescompany = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  // 广告计划搜索
  async planremoteMethod(querys: any) {
    try {
      if (querys) {
        this.loadings = true
        const {
          data: { items }
        } = await planlist({
          name: querys,
        })
        this.planlist = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
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
    // this.resetQuery()
    this.query = {
      pageIndex: 1,
      pageSize: 20,
      resourceId: 0,
      resourceCompanyId: 0,
      planId: 0,
      planType: 0,
      status: 0,
    }
    this.doSearch()
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
        advertTypeCodeList: advertTypeCodeList
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.statusList = statusList
      this.advertTypeCodeList = advertTypeCodeList
    // 广告计划列表
    // const plandata = await planlist({pageSize: 100000})
    // this.planlist = plandata.data.items
    // // 公司列表
    // const adscmy = await company({typeCode: 'ads' , pageSize: 100000})
    // const rescmy = await company({typeCode: 'resource' , pageSize: 100000})
    // this.adscompany = adscmy.data.items
    // this.resourcescompany = rescmy.data.items
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

  async deletes(id: any) {
    try {
      await confirm('删除订单时将同步删除该订单的监播、上刊等数据；是否确认删除？')
      await dels(id)
      this.$Message.success({
        content: `删除成功`,
      })
      this.reloadSearch()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async waiting(id: any) {
    this.waitaddOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.waitaddOrUpdate.init(id)
    })
    // try {
    //   await confirm('设为待接单时将同步删除该订单的监播、上刊等数据；是否确认？')
    //   await chgstatus({id})
    //   this.$Message.success({
    //     content: `修改成功`,
    //   })
    //   this.reloadSearch()
    // } catch (ex) {
    //   this.handleError(ex)
    // }
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
