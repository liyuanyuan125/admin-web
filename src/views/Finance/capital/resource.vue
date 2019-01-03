<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <!-- <LazyInput v-model="query.id" placeholder="账号ID" class="input input-corp-id"
            @on-enter="ev => query.id = ev.target.value" @on-blur="ev => query.id = ev.target.value"/>
          <LazyInput type="email" v-model="query.email" placeholder="账号" class="input input-corp-id"
            @on-enter="ev => query.email = ev.target.value" @on-blur="ev => query.email = ev.target.value"/> -->
          <LazyInput v-model="query.id" placeholder="账号ID" class="input"/>
          <LazyInput v-model="query.email" placeholder="邮箱账号" class="input"/>
          <LazyInput v-model="query.companyName" placeholder="公司名称" class="input"/>
          <DatePicker type="daterange" @on-change="dateChange" v-model="showTime" placement="bottom-end" placeholder="注册时间" class="input" style="width: 200px"></DatePicker>
          <!-- <Date-picker type="date" v-model="query.createTime" placeholder="注册时间" on-change="selectTime" class="input" style="width: 200px"></Date-picker> -->
          <!-- <Date-picker type="date" v-model="query.UpdateTime" placeholder="更新时间" on-change="selectTime"  class="input" style="width: 200px"></Date-picker>           -->
          <Select v-model="query.status" placeholder="启用状态" clearable>
            <Option v-for="it in statusList" :key="it.key" :value="it.key"
              :label="it.text == '是' ? '启用' : '停用'">{{it.text == '是' ? '启用' : '停用'}}</Option>
          </Select>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
        <div class="acts">
          <Button type="success" icon="md-add-circle" @click="edit(0)">新建</Button>
        </div>
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
    <DlgEdit  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
    <!-- <dlgVerify  ref="change"   @refreshDataList="search" v-if="changeVisible" @done="dlgEditDone"/> -->
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList , setList} from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import DlgEdit from './dlgEdit.vue'

import {confirm , warning , success, toast } from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}


@Component({
  components: {
    DlgEdit,
  }
})
// export default class Main extends ViewBase {
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    id: '',
    email: '',
    companyName: '',
    status: null,
    pageIndex: 1,
    pageSize: 20,
    beginCreateTime: 0,
    endCreateTime: 0
  }
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false


  examine = false
  // query = { ...defQuery }

  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []
  showTime: any = []


  statusList = []

  // company = []

  company2 = []


  columns = [
    { title: '账号ID', key: 'id', align: 'center' },
    { title: '邮箱账号', key: 'email', align: 'center' },
    { title: '公司名称', width: 400, key: 'companyName', align: 'center' },
    {
      title: '注册时间',
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
      title: '更新时间',
      key: 'modifyTime',
      align: 'center',
      render: (hh: any, { row: { modifyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(modifyTime).format(timeFormat)
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
        return <span class={`status-${status}`}>{statusText}</span>
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
          <a on-click={this.change.bind(this, row.id, row)}>{sta}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <router-link to={{ name: 'client-account-detail', params: { id } }}>详情</router-link>
        </div>
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
        statusText: it.status == 1 ? '启用' : '停用',
      }
    })
    return list
  }

  mounted() {
    // const urlQuery = slice(urlParam(), Object.keys(defQuery))
    // this.query = numberify({ ...defQuery, ...urlQuery }, numberKeys(defQuery))
    // this.doSearch()
    this.updateQueryByParam()

    !!this.query.beginCreateTime ? this.showTime[0] =
    moment(this.query.beginCreateTime).format(timeFormat) : this.showTime[0] = ''
    !!this.query.endCreateTime ? this.showTime[1] =
    moment(this.query.endCreateTime).format(timeFormat) : this.showTime[1] = ''
  }

  // updateUrl() {
  //   const query = prettyQuery(this.query, defQuery)
  //   const url = buildUrl(location.pathname, query)
  //   history.replaceState(null, '', url)
  // }

  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.query.beginCreateTime = new Date(data[0]).getTime() - 28800000) : this.query.beginCreateTime = 0
     !!data[1] ? (this.query.endCreateTime = new Date(data[1]).getTime() + 57600000) : this.query.endCreateTime = 0
  }

  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }
  reset() {
    // const { pageSize } = this.query
    // this.query = { ...defQuery, pageSize }
    this.resetQuery()
    this.showTime = []
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    // const query = clean({ ...this.query })
    const query: any = {}
    for (const [key, value] of Object.entries(this.oldQuery)) {
      if (key != 'beginCreateTime' && value != 0) {
        query[key] = value
      }
      if (key != 'endCreateTime' && value != 0) {
        query[key] = value
      }
    }
    try {
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.statusList = statusList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

   // 新增
  edit(id: number, row: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
    })
  }
  // 修改状态
  async change(id: number, row: any) {
    try {
      await confirm('您确定' + (row.statusText == '启用' ? '停用' : '启用') + '当前状态信息吗？')
      await setList ({
        id,
        status: row.status == 1 ? 2 : 1
      })
      this.$Message.success({
        content: `更改成功`,
      })
      this.reloadSearch()
    } catch (ex) {
    }
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
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
