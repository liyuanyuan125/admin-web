<template>
  <div class="pages">
    <Row class="shouDlg-header">
      <form class="form flex-1" @submit.prevent="search">
          <Col span='5'>
            <compangList v-model='query.companyId' @done="dlgEditDone"/>
          </Col>
          <Col span='5' >
            <videoList v-model='query.videoId'/>
          </Col>
          <Col span='5' >
            <cinemaList v-model='query.cinemaId'/>
          </Col>
          <Col span='5' >
            <Select v-model="query.status" placeholder="状态" style='width: 200px;'  filterable>
              <Option v-for="it in statusList" :key="it.key" :value="it.key"
                :label="it.text">{{it.text}}</Option>
            </Select>
          </Col>
          <Col span='3'>
            <Button type="default" @click="reset" class="btn-reset">清空</Button>
          </Col>
        </form>
    </Row>
      <Button style='margin-top: 16px;' type="primary" @click="changeAll">批量审核</Button>
    <Table ref="selection" :columns="columns" @on-selection-change="onselect" :data="list" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template  slot="action" slot-scope="{row}" >
        <a style='margin-right: 6px;' v-show='row.approvalStatus == 2' @click="change( row.id , row )">审核</a>
        <router-link  :to="{ name: 'order-supervision-detail', params: { id: row.id} }">详情</router-link>
      </template>
      <template  slot="video" slot-scope="{row}" >
        <a style='margin-left: 5px;' v-for='(item,index) in row.videoDetails' :key='index'>{{item.videoName}} ({{item.videoLength}})s</a>
        <!-- <a href="#">{{row}}}</a> -->
      </template>
    </Table>
    <div class="page-wrap" v-if="total > 0">
       <Page class="page" :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
    </div>
    <singDlg ref="addOrUpdate" v-if="addOrUpdateVisible"  @done="dlgEditDone" />
    <singvideoDlg ref="addOrUpdatevideo" v-if='videoVisible' @done="dlgEditDone" />
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList , okpass ,  refuse } from '@/api/supervision'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import {confirm , warning , success, toast , info } from '@/ui/modal'
import { numberify, numberKeys } from '@/fn/typeCast'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import singDlg from './singDlg.vue'
import singvideoDlg from './singvideoDlg.vue'
import compangList from './companyList.vue'
import videoList from './videoList.vue'
import cinemaList from './cinemaList.vue'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
    singDlg,
    singvideoDlg,
    compangList,
    videoList,
    cinemaList
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    companyId: null,
    cinemaId: null,
    videoId: null,
    status: null,
    pageIndex: 1,
    pageSize: 20,
  }

  query: any = {}

  addOrUpdateVisible = false
  changeVisible = false
  videoVisible = false
  loading = false
  list = []
  total = 0

  ids: any = []

  statusList: any = []
  oldQuery: any = {}

  columns = [
    {
      type: 'selection',
      title: '全选',
      width: 60,
      align: 'center'
    },
    { title: '资源方公司名称', key: 'resourceName',  align: 'center' },
    { title: '影院名称', key: 'cinemaName', align: 'center' },
    { title: '广告片', slot: 'video', align: 'center' },
    {
      title: '投放周期',
      key: 'beginDate',
      width: 150,
      align: 'center',
      render: (hh: any, { row: { beginDate , endDate} }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const a = String(beginDate)
        const start = a.slice(0, 4) + '-' + a.slice(4, 6) + '-' + a.slice(6, 8)
        const b = String(endDate)
        const end = b.slice(0, 4) + '-' + b.slice(4, 6) + '-' + b.slice(6, 8)
        return <span> {start} ~ {end}</span>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'approvalStatus',
      width: 60,
      align: 'center',
      render: (hh: any, { row: { approvalStatus} }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (approvalStatus == 1) {
        return <span class={`status-1`}>未上传</span>
      } else if (approvalStatus == 2) {
        return <span class={`status-2`}>待审核</span>
      } else if (approvalStatus == 3) {
        return <span class={`status-3`}>已通过</span>
      } else if (approvalStatus == 4) {
        return <span class={`status-4`}>已拒绝</span>
      } else if (approvalStatus == 0) {
        return <span class={`status-4`}>未知</span>
      }
        /* tslint:enable */
      }
    },
    { title: '操作', width: '80',  slot: 'action', align: 'center' },
  ]

  mounted() {
    // this.doSearch()
    this.updateQueryByParam()
  }

  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }

  onselect(row: any , selection: any) {
    this.ids = row.map((it: any) => {
      return it.id
    })
  }

  dlgEditDone(id: any) {
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
      } } = await queryList(this.query)
      this.list = list
      this.total = total
      this.statusList = statusList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.query.pageIndex = val
    this.doSearch()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.query.pageSize = val
    this.doSearch()
  }



  changeAll() {
    if (this.ids.length == 0) {
      info('请先选择需要审核的信息')
      return
    }

    this.videoVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdatevideo.init(this.ids)
    })
  }

  change(id: number, row: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id , row)
    })
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
.pages {
  padding: 20px 10px 2px 10px;
}
</style>
