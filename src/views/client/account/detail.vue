<template>
  <div class="page" :data="tableData">
    <!-- 菜单 -->
    <!-- <div class="work-Title"><span class="workT">工作台</span> > 客户管理 > 账号管理 > 账号详情</div> -->
    <!-- 注册账号 -->
    <div class="Inp-Group-res">
      <Button class="bth" icon="md-return-left" @click="goback">返回上一页</Button>
      <div class="n-main">主账号详情</div>
      <div class="Inps-res">
        <div class="res-num">
          <p>用户账号</p>
          <div class="res-num-item change-item">
            <span>{{list.email}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【主账号】</span>
            <!-- <s class="blu1 les" @click="viewlog(2)">查看操作日志</span> -->
            <router-link :to="{path:'/client/account/viewLog/'+ list.id, query: {nus: '主账号', companyId: list.companyId, id: list.id, createTime: list.createTime, lastLoginTime: list.lastLoginTime, companyName: list.companyName, email: list.email, name: list.name, mobile: list.mobile}}" tag="span" class="blu1 les">查看操作日志</router-link>
            <span class="blu2" @click="change(0)">变更主账号</span>
            <!-- <span>变更主账号</span> -->
          </div>
        </div>
        <div class="res-num">
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名</p>
          <div class="res-num-item">
            <span class='item1'>{{list.name}}</span>
            <span class="res-date les">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机号</span>
            <span>{{list.mobile}}</span>
          </div>
        </div>
        <div class="res-num">
          <p>注册时间</p>
          <div class="res-num-item">
            <span class='item1'>{{createTime}}</span>
            <span class="res-date les">最后登录时间</span>
            <span>{{lastLoginTime}}</span>
          </div>
        </div>
        <div class="res-num">
          <p>所属公司</p>
          <div class="res-num-item">
            <span>{{list.companyName}}</span>
            <router-link :to="{path:'/client/corp/detail/'+ list.companyId}" tag="span" class="blu1 les">查看公司详情</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 子账号 -->
    <div class="new-number">
      <div class="new-num">
        <div class="n-list">子账号列表</div>
        <!-- <Tabs v-model="stm.systemCode"  class="tabs">
          <TabPane name="ads" label="广告主系统子账户"/>
          <TabPane name="resource" label="资源方系统子账户"/>
        </Tabs> -->
        <Tabs>
          <Tab-pane label="广告主系统子账户">
            <Table :columns="columns" :data="tableData"
            border stripe disabled-hover size="small" class="table"></Table>
            <div class="page-wrap" v-if="total > 0">
              <Page :total="total" show-total :page-size="query.pageSize" show-sizer
                :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
                @on-change="page => query.pageIndex = page"
                @on-page-size-change="pageSize => query.pageSize = pageSize"/>
            </div>
          </Tab-pane>
          <Tab-pane label="资源方系统子账户">
            <Table :columns="columns" :data="prelists"
            border stripe disabled-hover size="small" class="table"></Table>
            <div class="page-wrap" v-if="total > 0">
              <Page :total="total" show-total :page-size="query.pageSize" show-sizer
                :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
                @on-change="page => query.pageIndex = page"
                @on-page-size-change="pageSize => query.pageSize = pageSize"/>
            </div>
          </Tab-pane>
        </Tabs>
        <!-- <Table :columns="columns" :data="prelist"
        border stripe disabled-hover size="small" class="table"></Table>
        <div class="page-wrap" v-if="total > 0">
          <Page :total="total" show-total :page-size="query.pageSize" show-sizer
            :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
            @on-change="page => query.pageIndex = page"
            @on-page-size-change="pageSize => query.pageSize = pageSize"/>
        </div> -->
      </div>
    </div>
    <dlgChange  ref="change" :prelist="prelist"  @refreshDataList="search" v-if="changeVisible" @done="dlgEditDone"/>

  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { get } from '@/fn/ajax'
import {queryList , queryItem } from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice , clean } from '@/fn/object'
import dlgChange from './dlgChange.vue'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'



const defQuery = {
  id: '',
  companytId: '',
  phoneNmber: null,
  type: null,
  status: null,
  pageIndex: 1,
  pageSize: 20,
}

@Component({
  components: {
    dlgChange
  }
})
export default class Main extends ViewBase {
  // change = false
  changeVisible = false

  query = { ...defQuery }
  oldQuery: any = {}

  loading = false
  createTime = ''
  lastLoginTime = ''
  //  广告主
  list: any = []
  prelist: any = []
  //  资源方
  lists: any = []
  prelists: any = []
  total = 0
  ids = ''

  statusList = []

  stm: any = {
    systemCode: 'ads'
  }

  columns = [
    { title: '用户账号', key: 'id', align: 'center' },
    { title: '姓名', key: 'name', align: 'center' },
    { title: '手机号', key: 'mobile', align: 'center' },
    {
      title: '创建时间',
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
      title: '最后登陆时间',
      key: 'lastLoginTime',
      align: 'center',
      render: (hh: any, { row: { lastLoginTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(lastLoginTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1) {
          return <span class={`status-${status}`}>{'已启用'}</span>
        } else if (status == 2) {
          return <span class={`status-${status}`}>{'已禁用'}</span>
        } else if (status == 3) {
          return <span class={`status-${status}`}>{'待激活'}</span>
        }
        
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: {id, createTime, lastLoginTime, companyName, email, companyId, name, mobile} }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <router-link to={{ name: 'client-account-viewLog', query:{id, createTime, lastLoginTime, companyName, email, companyId, name, mobile}, params: { id } }}>查看操作日志</router-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const prelist = (this.prelist || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return prelist
  }
  get tableDatas() {
    const cachedMap = this.cachedMap
    const prelists = (this.prelists || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return prelists
  }
  mounted() {
    const { id } = this.$route.params
    this.ids = id
    this.doSearch()
    // this.createTime = moment(this.list.createTime).format(timeFormat)
    // this.lastLoginTime = moment(this.list.lastLoginTime).format(timeFormat)
  }

  dlgEditDone() {
    this.doSearch()
  }

  change() {
    this.changeVisible = true
    const params = this.$route.params
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.change.init(params)
    })
  }

  search() {
    this.query.pageIndex = 1
  }

  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
  }
  //  查看日志
  viewlog(id: number) {
    const params = this.$route.params
    this.$router.push({ name: 'client-account-viewLog', params })
  }

  goback() {
    this.$router.go(-1)
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true

    const query = clean({ ...this.query })
    try {
      // 主账号详情 广告主
      const { data: {
        parentAccount: list,
        childAccountList: prelist,
      } } = await queryItem(this.$route.params.id , { systemCode: 'ads' })
      this.list = list
      this.prelist = prelist
      this.createTime = moment(this.list.createTime).format(timeFormat)
      this.lastLoginTime = moment(this.list.lastLoginTime).format(timeFormat)
      // 主账号详情 资源方
      const { data: {
        childAccountList: prelists,
      } } = await queryItem(this.$route.params.id , { systemCode: 'resource' })
      this.prelists = prelists
    } catch (ex) {
      // this.handleError(ex)
    } finally {
      this.loading = false
    }
  }
  @Watch('query', { deep: true })
  onQueryChange() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.doSearch()
  }
}
</script>

<style lang="less" scoped>
.sec {
  width: 254px;
  margin-left: 9%;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Inp-Group-res,
.res-Group {
  // background: #ecf0f4;
  padding: 10px;
  padding-top: 15px;
  margin: -10px -10px 0 -10px;
}
.res-Group {
  margin-top: -5px;
}
.Inps-res,
.res-Inps {
  width: 100%;
  height: 100%;
  padding-top: 7px;
  font-size: 13px;
  background: #fff;
  border: 1px solid #dcdee2;
}
.res-num {
  display: flex;
  width: 100%;
  line-height: 60px;
}
.res-num p {
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  display: block;
  float: left;
  max-height: 60px;
  text-align: left;
  margin-left: 0.5%;
}
.res-num-item {
  display: flex;
  width: 80%;
  height: 100%;
  // max-height: 60px;
}
.res-num-item span {
  display: inline-block;
  margin-left: 5%;
}
.item1 {
  width: 12%;
}
.blu1,
.blu2 {
  color: #53a1f3;
  cursor: pointer;
}
.new-number {
  // background: #ecf0f4;
  padding: 2px;
  margin: 1px -10px 0 -10px;
}
.new-num {
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #fff;
  font-size: 13px;
}
.n-list {
  margin: -5px 0 8px 5px;
  line-height: 38px;
  font-size: 16px;
  color: #2d8cf0;
  // border-bottom: 2px solid #ecf0f4;
}
.n-main {
  display: inline-block;
  margin: 0 0 5px 5px;
  line-height: 35px;
  font-size: 16px;
  color: #2d8cf0;
  // border-bottom: 2px solid #ecf0f4;
}
.table {
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
