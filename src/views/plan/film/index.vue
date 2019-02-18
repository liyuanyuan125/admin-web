<template>
  <div class="page">
    <Tabs v-model="query.status" type="card" class="tabs">
      <TabPane name="1" label="待审核"/>
      <TabPane name="2" label="待支付"/>
      <TabPane name="3" label="待转码"/>
      <TabPane name="4" label="已完成"/>
      <TabPane name="5" label="审核已拒绝"/>
      <TabPane name="6" label="已取消"/>
    </Tabs>

    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.query" placeholder="广告片ID/名称" class="input"/>
        <Select v-model="query.companyId" filterable clearable class="select-company">
          <Option v-for="it in companys" :key="it.id" :value="it.id">{{it.name}}</Option>
        </Select>
        <Button type="default" class="btn-reset" @click="reset">清空</Button>
      </form>
    </div>

    <Table :columns="columns" :data="list" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot="customerName" slot-scope="{ row: { customerId , customerName } }">
        [{{customerId}}] {{customerName}}
      </template>

      <template slot="specification" slot-scope="{ row: { specification } }">
        {{specification}}s
      </template>

      <template slot="length" slot-scope="{ row: { length } }">
        {{length}}s
      </template>

      <template slot="transFee" slot-scope="{ row: { transFee } }">
        {{transFee}}.00
      </template>

      <template slot="applyTime" slot-scope="{ row: { applyTime } }">
        <span class="datetime">{{applyTime|dateTime}}</span>
      </template>

      <template slot="approvalUser" slot-scope="{ row: { approvalEmail, approvalName } }">
        <span class="empty-as-hyphen">{{ approvalEmail || approvalName
          ? `${approvalEmail}【${approvalName}】` : '' }}</span>
      </template>

      <template slot="approvalTime" slot-scope="{ row: { approvalTime } }">
        <span class="datetime">{{approvalTime|dateTime}}</span>
      </template>

      <template slot="payTime" slot-scope="{ row: { payTime } }">
        <span class="datetime">{{payTime|dateTime}}</span>
      </template>

      <template slot="transTime" slot-scope="{ row: { transTime } }">
        <span class="datetime">{{transTime|dateTime}}</span>
      </template>

      <template slot="cancelTime" slot-scope="{ row: { cancelTime } }">
        <span class="datetime">{{cancelTime|dateTime}}</span>
      </template>

      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <router-link :to="{ name: 'gg-film-detail',
            params: { id , status } }">{{ status == 1 ? '审核' : '详情'}}</router-link>
        </div>
      </template>
    </Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { queryList , companysList } from '@/api/planfilm'
import { clean } from '@/fn/object'
import { filterDateTime } from '@/util/filters'

@Component({
  filters: {
    dateTime: filterDateTime
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    query: '',
    companyId: null,
    status: '1',
    pageIndex: 1,
    pageSize: 20,
  }

  oldQuery: any = {}

  query: any = {}

  loading = false

  list: any = []

  total = 0

  // 公司列表
  companys = []

  get columns() {
    const status = this.query.status
    return [
      { title: '广告片ID', key: 'id', width: 70 },
      { title: '广告片名称', key: 'name' },
      { title: '客户', slot: 'customerName' },
      { title: '规格', slot: 'specification', width: 60 },
      { title: '时长', slot: 'length', width: 60 },
      { title: '转制费(元)', slot: 'transFee', width: 110 },
      { title: '创建时间', slot: 'applyTime', width: 135 },
      status in { 2: 1, 5: 1 } && { title: '审核人', slot: 'approvalUser', width: 110 },
      status in { 2: 1, 5: 1 } && { title: '审核时间', slot: 'approvalTime', width: 135 },
      status == 3 && { title: '支付时间', slot: 'payTime', width: 135 },
      status == 4 && { title: '转码时间', slot: 'transTime', width: 135 },
      status == 6 && { title: '取消时间', slot: 'cancelTime', width: 135 },
      { title: '操作', slot: 'action', width: 60 },
    ]
    .filter(it => !!it)
    .map((it: any) => ({ align: 'center', ...it }))
  }

  mounted() {
    this.updateQueryByParam()
    this.fetch()
    this.fetchCompanys()
  }

  search() {
    this.query.pageIndex = 1
  }

  reset() {
    this.resetQuery('status,pageSize')
  }

  async fetch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }
    this.updateUrl()

    this.loading = true
    const query = clean({ ...this.query })
    try {
      this.list = [] // 确保在切换 tab 时，不显示前一个 tab 的数据

      const { data: { items: list, totalCount: total } } = await queryList(query)
      this.list = list
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  async fetchCompanys() {
    try {
      const { data: { items: companys } } = await companysList()
      this.companys = companys.filter((it: any) => it.status == 1)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.fetch()
  }
}
</script>

<style lang="less" scoped>
.tabs {
  /deep/ .ivu-tabs-bar {
    margin-bottom: 10px;
  }
}

.form {
  .input,
  /deep/ .ivu-select {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }
  .select-company {
    width: 240px;
  }
}

.table {
  margin-top: 10px;
  /deep/ .ivu-table-cell {
    padding-left: 4px;
    padding-right: 4px;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
  /deep/ .row-acts > a {
    margin: 0 4px;
  }
}
.datetime:only-child:empty {
  &::before {
    content: '-';
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
</style>
