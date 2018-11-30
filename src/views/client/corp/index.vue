<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.id" placeholder="公司ID" class="input input-id"/>
        <LazyInput v-model="query.name" placeholder="公司名称" class="input"/>
        <LazyInput v-model="query.userAccount" placeholder="用户账号" class="input"/>
        <Select v-model="query.type" placeholder="资源方" clearable>
          <Option v-for="it in typeList" :key="it.id" :value="it.id"
            :label="it.name">{{it.name}}</Option>
        </Select>
        <Select v-model="query.status" placeholder="状态" clearable>
          <Option v-for="it in statusList" :key="it.id" :value="it.id"
            :label="it.name">{{it.name}}</Option>
        </Select>
        <Select v-model="query.bizUserId" placeholder="关联商务" clearable>
          <Option v-for="it in bizUserList" :key="it.id" :value="it.id"
            :label="it.name">{{[it.name, it.group, it.title].join(' | ')}}</Option>
        </Select>
        <Select v-model="query.aptitudeStatus" placeholder="资质状态" clearable>
          <Option v-for="it in aptitudeStatusList" :key="it.id" :value="it.id"
            :label="it.name">{{it.name}}</Option>
        </Select>
        <!-- <Button type="primary" @click="search" icon="md-search" class="btn-search">查询</Button> -->
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" @click="edit(0)">创建</Button>
      </div>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table"></Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" show-total :page-size="query.pageSize" show-sizer
        :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { get } from '@/fn/ajax'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { clean } from '@/fn/object'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD<br>HH:mm:ss'

const defQuery = {
  id: null,
  name: '',
  userAccount: '',
  type: null,
  status: null,
  bizUserId: null,
  aptitudeStatus: null,
  pageIndex: 1,
  pageSize: 20,
}

@Component
export default class Main extends View {
  query = { ...defQuery }

  oldQuery: any = null

  loading = false
  list = []
  total = 0

  typeList = []

  resTypeList = []

  statusList = []

  bizUserList = []

  clientLevelList = []

  aptitudeStatusList = []

  columns = [
    { title: '公司ID', key: 'id', width: 90, align: 'center' },
    { title: '公司名称', key: 'name', align: 'center' },
    { title: '资源方', key: 'isResOwner', width: 80, align: 'center' },
    { title: '资源方类型', key: 'resTypeName', width: 100, align: 'center' },
    { title: '客户等级', key: 'clientLevelName', width: 80, align: 'center' },
    { title: '关联商务', key: 'bizUserName', width: 80, align: 'center' },
    {
      title: '创建时间',
      key: 'createTime',
      width: 100,
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
      key: 'updateTime',
      width: 100,
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
      width: 80,
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`status-${status}`}>{statusText}</span>
        /* tslint:enable */
      }
    },
    {
      title: '公司资质',
      key: 'aptitudeStatusText',
      width: 90,
      align: 'center',
      render: (hh: any, { row: { aptitudeStatus, aptitudeStatusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`aptitude-status-${aptitudeStatus}`}>{aptitudeStatusText}</span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (hh: any, { row: { id } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <router-link to={{ name: 'client-corp-detail', params: { id } }}>详情</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]

  get cachedMap() {
    return {
      type: makeMap(this.typeList),
      resType: makeMap(this.resTypeList),
      status: makeMap(this.statusList),
      bizUser: makeMap(this.bizUserList),
      clientLevel: makeMap(this.clientLevelList),
      aptitudeStatus: makeMap(this.aptitudeStatusList)
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        isResOwner: it.type == 1 ? '是' : '-',
        resTypeName: cachedMap.resType[it.resType],
        bizUserName: cachedMap.bizUser[it.bizUserId],
        statusText: cachedMap.status[it.status],
        clientLevelName: cachedMap.clientLevel[it.clientLevel],
        aptitudeStatusText: cachedMap.aptitudeStatus[it.aptitudeStatus],
      }
    })
    return list
  }

  mounted() {
    this.doSearch()
  }

  search() {
    this.query.pageIndex = 1
  }

  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data: {
        items: list,
        totalCount: total,
        typeList,
        resTypeList,
        statusList,
        bizUserList,
        clientLevelList,
        aptitudeStatusList,
      } }: any = await get('/mock/corp-list', query)
      this.list = list
      this.total = total
      this.typeList = typeList
      this.resTypeList = resTypeList
      this.statusList = statusList
      this.bizUserList = bizUserList
      this.clientLevelList = clientLevelList
      this.aptitudeStatusList = aptitudeStatusList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  edit(id: number) {
    const params: any = id > 0 ? { id } : {}
    this.$router.push({ name: 'client-corp-edit', params })
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

  .input-id {
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
</style>
