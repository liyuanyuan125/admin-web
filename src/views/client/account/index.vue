<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.id" placeholder="账号ID" class="input input-corp-id"
            @on-enter="ev => query.id = ev.target.value" @on-blur="ev => query.id = ev.target.value"/>
            <LazyInput type="email" v-model="query.email" placeholder="账号" class="input input-corp-id"
            @on-enter="ev => query.email = ev.target.value" @on-blur="ev => query.email = ev.target.value"/>
          <LazyInput v-model="query.companyName" placeholder="公司名称" class="input"/>
          <DatePicker type="daterange" @on-change="dateChange" v-model="showTime" placement="bottom-end" placeholder="注册时间" class="input" style="width: 200px"></DatePicker>
          <!-- <Date-picker type="date" v-model="query.createTime" placeholder="注册时间" on-change="selectTime" class="input" style="width: 200px"></Date-picker> -->
          <!-- <Date-picker type="date" v-model="query.UpdateTime" placeholder="更新时间" on-change="selectTime"  class="input" style="width: 200px"></Date-picker>           -->
          <Select v-model="query.status" placeholder="启用状态" clearable>
            <Option v-for="it in statusList" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
        <div class="acts">
          <Button type="success" @click="edit(0)">创建</Button>
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
    <dlgVerify  ref="change"   @refreshDataList="search" v-if="changeVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { get } from '@/fn/ajax'
import { queryList } from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { numberify, numberKeys } from '@/fn/typeCast'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import DlgEdit from './dlgEdit.vue'
import dlgVerify from './dlgVerify.vue'

import {confirm} from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const defQuery = {
  id: null,
  email: null,
  companyName: '',
  status: null,
  pageIndex: 1,
  pageSize: 20,
  startTime: 0,
  endTime: 0
}


@Component({
  components: {
    DlgEdit,
    dlgVerify
  }
})
export default class Main extends View {
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false


  examine = false
  query = { ...defQuery }

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
      key: 'beginCreateTime',
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
      key: 'endCreateTime',
      align: 'center',
      render: (hh: any, { row: { updateTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(updateTime).format(timeFormat)
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
        return <div class='row-acts'>
          <a on-click={this.change.bind(this, row.id, row)}>{statusText}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <router-link to={{ name: 'client-account-detail', params: { id } }}>详情</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
      // type: makeMap(this.typeList),
      status: makeMap(this.statusList),
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        // typeName: cachedMap.type[it.type],
        statusText: cachedMap.status[it.status],
      }
    })
    return list
  }

  mounted() {
    const urlQuery = slice(urlParam(), Object.keys(defQuery))
    this.query = numberify({ ...defQuery, ...urlQuery }, numberKeys(defQuery))
    // this.doSearch()
    !!this.query.startTime ? this.showTime[0] = moment(this.query.startTime).format(timeFormat) : this.showTime[0] = ''
    !!this.query.endTime ? this.showTime[1] = moment(this.query.endTime).format(timeFormat) : this.showTime[1] = ''
  }

  updateUrl() {
    const query = prettyQuery(this.query, defQuery)
    const url = buildUrl(location.pathname, query)
    history.replaceState(null, '', url)
  }

  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.query.startTime = new Date(data[0]).getTime()) : this.query.startTime = 0
     !!data[1] ? (this.query.endTime = new Date(data[1]).getTime()) : this.query.endTime = 0
  }

  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }
  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
    this.showTime = []
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    const query = clean({ ...this.query })
    for (const [key, value] of Object.entries(this.oldQuery)) {
      if (key != 'startTime' && value != 0) {
        query[key] = value
      }
      if (key != 'endTime' && value != 0) {
        query[key] = value
      }
    }
    try {
      const { data: {
        items: list,
        totalCount: total,
        // typeList,
        // company,
        company2,
        statusList,
      } } = await queryList(query)
      this.list = list
      this.total = total
      // this.typeList = typeList
      // this.company = company
      this.company2 = company2
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
  change(id: number, row: any) {
    // alert('123132132')
    try {
      confirm('您确定更改当前状态信息吗？')
      // await dels({id})
      this.$Message.success({
        content: `删除成功`,
      })
      this.reloadSearch()
    } catch (ex) {
      // this.handleError(ex)
    }
  }

  // change(id: number, row: any) {
  //   this.changeVisible = true
  //   this.$nextTick(() => {
  //     const myThis: any = this
  //     myThis.$refs.change.init(id)
  //   })
  // }

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

.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
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
// .info-type-inp span {
//   margin-left: 1%;
//   color: #53A1F3;
//   cursor: pointer;
//   text-decoration: underline;
// }
// .info-type Button {
//   margin-top: 2%;
//   margin-left: 24%;
// }
  </style>
