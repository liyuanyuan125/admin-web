<template>
  <div class="index-page">
    <Tabs v-model="status" type="card" class="tabs">
      <TabPane
        v-for="it in statusList"
        :key="it.value"
        :name="it.value"
        :label="it.name"
      />
    </Tabs>

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      selectable
      :selectedIds.sync="selectedIds"
      ref="listPage"
      @inspect='onInspect'
    >

      <template slot="acts-2">
        <Button
          v-if=' astatus == 2'
          type="primary"
          class="button-audit"
          :disabled="!(selectedIds.length > 0)"
          @click="changeAll"
          
        >批量审核</Button>
        <Button
          v-else-if=' astatus == 4'
          type="primary"
          :disabled="!(selectedIds.length > 0)"
          @click="changeAll"
        >批量恢复</Button>
        <span v-else  ></span>
         </template>

      <template  slot="video" slot-scope="{row}" >
        <a style='margin-left: 5px;' v-for='(item,index) in row.videoDetails' :key='index'>{{item.videoName}} ({{item.videoLength}})s</a>
      </template>
      <template  slot="action" slot-scope="{row}" >
        <router-link v-if='row.approvalStatus == 2' @click.native="localitem( row.id , row , index )"  :to="{ name: 'order-supervision-detail', params: { id: row.id} }">审核</router-link>
        <!-- <a style='margin-right: 6px;' v-show='row.approvalStatus == 2' @click="change( row.id , row )">审核</a> -->
        <a style='margin-right: 6px;' v-show='row.approvalStatus == 4' @click="change( row.id , row )">恢复</a>
        <router-link v-if='row.approvalStatus != 2'  :to="{ name: 'order-supervision-detail', params: { id: row.id} }">详情</router-link>
      </template>
    </ListPage>
     <singvideoDlg ref="addOrUpdatevideo" v-if='videoVisible' @done="dlgEditDone" />

  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
// import { queryList, auditItem, newItem } from './data'
import { queryList , okpass ,  refuse } from '@/api/supervision'
import { alert, toast } from '@/ui/modal'
import { EditDialog, Field } from '@/components/editForm'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'

import compangList from './companyList.vue'
import videoList from './videoList.vue'
import cinemaList from './cinemaList.vue'
import singvideoDlg from './singvideoDlg.vue'



import { getChannelList } from '@/util/types'

const statusList: any = [
  {name: '待审核', value: '2'},
  {name: '已通过', value: '3'},
  {name: '已拒绝', value: '4'},
  {name: '未上传', value: '1'},
]
const defaultPay = statusList[0].value

@Component({
  components: {
    ListPage,
    EditDialog,
    singvideoDlg
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultPay }) pay!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }
  videoVisible = false

  status = this.pay

  statusList = statusList

  fetch = queryList

  query: any = null

  selectedIds = [] as number[]

  get astatus() {
    return this.query && this.query.status
  }

  get filters(): Filter[] {
    const aaa: any = [
      {
        name: 'status',
        defaultValue: this.pay,
      },

      {
        name: 'companyId',
        defaultValue: 0,
        type: compangList,
        width: 140,
        placeholder: '资源方公司'
      },

      {
        name: 'videoId',
        defaultValue: 0,
        type: videoList,
        width: 140,
        placeholder: '广告片'
      },

      {
        name: 'cinemaId',
        defaultValue: 0,
        type: cinemaList,
        width: 140,
        placeholder: '资源方影院'
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        width: 140,
        placeholder: '影片名称'
      },

      {
        name: 'dateRange',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '投放周期',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
          return {
            beginDate,
            endDate
          }
        }
      },

      {
        name: 'name2',
        defaultValue: '',
        type: 'input',
        width: 140,
        placeholder: '商务负责人'
      },

      {
        name: 'status',
        defaultValue: null,
        type: 'select',
        width: 100,
        placeholder: '状态',
        enumKey: 'statusList'
      },
    ]
    const bbb: any = [
      {
        name: 'name3',
        defaultValue: '',
        type: 'input',
        width: 140,
        placeholder: '审核人'
      },

      {
        name: 'dateRang3e',
        defaultValue: '',
        type: 'dateRange',
        width: 200,
        placeholder: '审核时间',
        dealParam(value: string) {
          const [beginDate, endDate] = value ? value.split('-') : [null, null]
          return {
            beginDate,
            endDate
          }
        }
      },
    ]
    const ccc: any = [
      {
        name: 'pageIndex',
        defaultValue: 1
      },

      {
        name: 'pageSize',
        defaultValue: 20
      }
    ]

    return this.status == '3' || this.status == '4' ? [...aaa , ...bbb , ...ccc] :
    [...aaa, ...ccc ]
  }

  enums = [
    'statusList',
  ]

  get columns() {
    const aaa: any = [
      { title: '资源方公司名称', key: 'resourceName',  align: 'center' },
      { title: '影院名称', key: 'cinemaName', align: 'center' },
      { title: '影片名称', key: 'cinemaName', align: 'center' },
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
      { title: '商务负责人', key: 'cinemaName', align: 'center' },
      { title: '上传人', key: 'cinemaName', align: 'center' },
      { title: '上传时间', key: 'cinemaName', align: 'center' },
    ]
    const ccc: any = [
      { title: '审核人', key: 'cinemaName', align: 'center' },
      { title: '审核时间', key: 'cinemaName', align: 'center' },
    ]
    const ddd: any = [
      { title: '状态', key: 'status', width: 100 , editor: 'enum' },
      { title: '操作', slot: 'action', maxWidth: 100 }
    ]

    return this.status == '3' || this.status == '4' ? [...aaa , ...ccc , ...ddd] :
    [...aaa, ...ddd ] as ColumnExtra[]
  }

  auditVisible = false
  changeAll() {
    this.videoVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdatevideo.init(this.selectedIds)
    })
  }
  dlgEditDone(id: any) {
    this.selectedIds = []
    this.refresh()
  }

  refresh() {
    this.listPage.update()
  }

  onInspect({ query }: any) {
    this.query = query
  }

  mounted() {
    this.listPage.query.status = 2
  }

  localitem(id: number, row: any , index: any) {
    const infos: any = {
      index,
      pageidx: this.query.pageIndex,
      pagese: this.query.pageSize
    }
    sessionStorage.setItem('supinfo' + id, JSON.stringify(infos))
  }

  @Watch('status')
  watchstatus(pay: string) {
    this.$router.push({
      name: 'order-supervision-newindex',
      params: pay == defaultPay ? {} : { pay }
    })
  }

  @Watch('pay')
  watchPay(pay: string) {
    this.listPage.query.status = pay
  }
}
</script>

<style lang="less" scoped>
.button-crawl {
  margin-left: 12px;
}

.price-table {
  margin: 4px 0;
  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
</style>
