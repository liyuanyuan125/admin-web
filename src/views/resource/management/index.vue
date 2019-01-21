<template>
  <div class="page">
    <Tabs type="card"  :animated="false" @click="reset">
        <Tab-pane label="平台刊例价" key="key1">
          <div class="act-bar flex-box">
            <form class="form flex-1" @submit.prevent="search">
              <div @click="checkShow" style="float: left">
                <LazyInput v-model="diaries.name" placeholder="广告片ID/名称" class="input"/>
              </div>
              <Select style="width:240px" v-model="query.companyId" filterable>
                <Option v-for="it in companys" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
              <Button type="default" @click="reset" class="btn-reset">清空</Button>
            </form>
            <div class="acts">
              <Button type="success" @click="edit(0)">新建刊例价</Button>
            </div>
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
        <Tab-pane label="公司刊例价" key="key2">
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
        <Tab-pane label="实时刊例价查询" key="key3">
           实时刊例价查询
        </Tab-pane>
      </Tabs>
      <DlgEdit v-if="diariesShow" v-model="diaries" />
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { pingqueryList , comqueryList , companysList} from '@/api/management'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import DlgEdit from './dlgEdit.vue'

import {confirm , warning , success, toast } from '@/ui/modal'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
    DlgEdit
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
  diaries = {
    id: '1108',
    name: ''
  }
  diariesShow = false
  examine = false

  loading = false

  list: any = [] // 平台刊例价
  list2: any = [] // 公司刊例价


  total = 0
  total2 = 0

  oldQuery: any = {}
  typeList = []
  showTime: any = []


  statusList = []
  // 公司
  companys = []


  columns = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '影院定价等级', key: 'name', align: 'center' },
    { title: '30秒刊例价(元/千人次)', key: 'customerName', align: 'center',
     render: (hh: any, { row: { customerId , customerName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = '[' + customerId + '] '+ customerName
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '15秒折扣', key: 'specification', align: 'center',
     render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = specification + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '档期', key: 'length', align: 'center',
      render: (hh: any, { row: { length } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = length + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '开始日期',
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
      title: '结束日期',
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
      width: 90,
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const sta = status == 1 ? '停用' : '启用'
        return <div class='row-acts'>
          <a href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;
          <a href='javascript:;' on-click={this.del(id)}>删除</a>
        </div>
        /* tslint:enable */
      }
    }
  ]
  columns2 = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '公司名称', key: 'name', align: 'center' },
    { title: '影响影院', key: 'customerName', align: 'center',
     render: (hh: any, { row: { customerId , customerName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = '[' + customerId + '] '+ customerName
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '30秒刊例价(元/千人次)', key: 'specification', align: 'center',
     render: (hh: any, { row: { specification } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = specification + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '15秒折扣', key: 'length', align: 'center',
      render: (hh: any, { row: { length } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = length + 's'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '档期', key: 'transFee', align: 'center',
      render: (hh: any, { row: { transFee } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = transFee + '.00'
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '开始日期',
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
      title: '结束日期',
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
      width: 90,
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const sta = status == 1 ? '停用' : '启用'
        return <div class='row-acts'>
          <a href='javascript:;'>编辑</a>&nbsp;&nbsp;&nbsp;
          <a href='javascript:;' on-click={this.del(id)}>删除</a>
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
      } } = await pingqueryList(query)
      const { data: {
        items: list2,
        totalCount: total2,
      } } = await comqueryList(query)

      this.list = list // 平台刊例价
      this.list2 = list2 // 公司刊例价

      this.total = total // 平台刊例价
      this.total2 = total2 // 公司刊例价
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

  del(id: any) {

  }

  edit(id: any) {

  }

  checkShow() {
    this.diariesShow = true
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
/deep/ .ivu-tabs-bar {
  border-bottom: 0;
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
