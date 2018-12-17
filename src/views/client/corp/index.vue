<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.companyId" placeholder="公司ID" class="input input-id"/>
        <LazyInput v-model="query.shortName" placeholder="公司名称" class="input"/>
        <Select v-model="query.type" placeholder="客户类型" clearable>
          <Option v-for="it in typeList" :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
        <Select v-model="query.status" placeholder="状态" clearable>
          <Option v-for="it in statusList" :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
        </Select>
        <!-- <Select v-model="query.businessDirector" placeholder="关联商务" clearable>
          <Option v-for="it in bizUserList" :key="it.id" :value="it.id"
            :label="it.text">{{[it.name, it.group, it.title].join(' | ')}}</Option>
        </Select> -->
        <Select v-model="query.approveStatus" placeholder="审核状态" clearable>
          <Option v-for="it in aptitudeStatusList" :key="it.key" :value="it.key"
            :label="it.text">{{it.text}}</Option>
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
import { queryList } from '@/api/corp'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const defQuery = {
  companyId: null,
  shortName: '',
  type: null,
  status: 0,
  businessDirector: 0,
  approveStatus: 0,
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
  // 业务类型列表
  typeList = []
  // 启用状态列表
  resTypeList = []
  // 资质审核状态列表
  statusList = []

  aptitudeStatusList = []

  columns = [
    { title: '公司ID', key: 'id', align: 'center' },
    { title: '公司名称', key: 'name', width: 200 , align: 'center' },
    { title: '客户类型', key: 'customerLevel', align: 'center' },
    { title: '客户等级', key: 'customerLevel', align: 'center' },
    { title: '关联商务', key: 'businessDirectorName', align: 'center' },
    {
      title: '创建时间',
      key: 'createTimeTemp',
      width: 160 ,
      align: 'center',
      render: (hh: any, { row: { createTimeTemp } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTimeTemp).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '更新时间',
      key: 'modifyTimeTemp',
      width: 160 ,
      align: 'center',
      render: (hh: any, { row: { modifyTimeTemp } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(modifyTimeTemp).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'statusString',
      align: 'center',
      render: (hh: any, { row: { statusString, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`status-${statusString}`}>{statusText}</span>
        /* tslint:enable */
      }
    },
    {
      title: '审核状态',
      key: 'approveStatusString',
      align: 'center',
      render: (hh: any, { row: { approveStatusString, aptitudeStatusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`aptitude-status-${approveStatusString}`}>{aptitudeStatusText}</span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (hh: any, { row: { id, statusString } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const edit = statusString == 1 ? '编辑' : '审核'
        return <div class='row-acts'>
          <router-link class="operation" to={{ name: 'client-corp-detail', params: { id } }}>删除</router-link>
          <router-link class="operation" to={{ name: 'client-corp-edit', params: { id } }}>{edit}</router-link>
          <router-link class="operation" to={{ name: 'client-corp-detail', params: { id } }}>详情</router-link>
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
      aptitudeStatus: makeMap(this.aptitudeStatusList)
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        isResOwner: it.type == 1 ? '是' : '-',
        resTypeName: cachedMap.resType[it.typeString],
        statusText: cachedMap.status[it.statusString],
        aptitudeStatusText: cachedMap.aptitudeStatus[it.approveStatusString],
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
        approveStatusList,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.typeList = typeList
      this.resTypeList = resTypeList
      this.statusList = statusList
      this.aptitudeStatusList = approveStatusList
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
  /deep/ .row-acts {
    .operation {
      margin-right: 6px;
    }
  }
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
</style>
