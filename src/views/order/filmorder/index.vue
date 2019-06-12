<template>
  <div class="page">
    <div >
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.id" placeholder="订单编号" class="input"/>
          <Select v-model="query.companyId" placeholder="公司名称" style='width: 200px;'  filterable>
            <Option v-for="it in company" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
          <DatePicker type="daterange" @on-change="dateChange" v-model="showTime" placement="bottom-end" placeholder="下单时间" class="input" style="width: 200px"></DatePicker>
          <Select v-model="query.movieId" placeholder="影片名称" style='width: 200px;'  filterable>
            <Option v-for="it in filmdata" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
          <Select v-model="query.resourceType" placeholder="资源类型" style='width: 200px;'  filterable>
            <Option v-for="it in typeList" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <Select v-model="query.status" placeholder="单据状态" style='width: 200px;' clearable>
            <Option v-for="it in statusList" v-if='it.key != 0' :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
      </div>
      <Table :columns="columns" :data="list" :loading="loading"
        border stripe disabled-hover size="small" class="table">
        <template slot="id" slot-scope="{row}">
          <router-link  :to="{ name: 'order-filmorder-filmexamine', params: { id: row.id , status: 0 } }">{{row.id}}</router-link>
        </template>
        <template slot="up" slot-scope="{row}">
          <span v-for='(it , index) in offlineResourceTypeList' :key='index' v-if='it.key == row.brandResource.offlines[0].channelCode'>{{it.text}}</span>
        </template>
        <template slot="down" slot-scope="{row}">
          <span v-for='(it , index) in channelCodeList' :key='index' v-if='it.key == row.brandResource.onlines[0].channelCode'>{{it.text}}</span>
        </template>
        <template slot="spaction" slot-scope="{row}">
          <router-link v-show='row.status == 1' :to="{ name: 'order-filmorder-filmexamine', params: { id: row.id , status: row.status } }">审核订单</router-link>
          <router-link v-show='row.status == 2' :to="{ name: 'resource-film-index-edit', params: { id: row.id } }">上传资源</router-link>
          <span v-show='row.status != 1 && row.status != 2'>--</span>
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
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { planlist , company } from '@/api/orderSys'
import { queryList , film  } from '@/api/filmorder'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'

import {confirm , warning , success, toast } from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'



@Component({
  components: {
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    pageIndex: 1,
    pageSize: 20,
    id: null,
    movieId: null,
    companyId: null,
    status: null,
    resourceType: null,
    startTime: null,
    endTime: null
  }
  query: any = {}


  examine = false

  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []
  showTime: any = []

  // 公司列表
  company: any = []
  // 影片列表
  filmdata: any = []
  // 单据状态
  statusList: any = []
  // 线下资源类型
  offlineResourceTypeList: any = []
  // 渠道
  channelCodeList: any = []


  columns = [
    { title: '订单编号', slot: 'id', width: 60, align: 'center' },
    { title: '公司id', key: 'companyId', align: 'center' , width: 60, },
    { title: '公司名称',  key: 'companyName', align: 'center' },
    { title: '项目名称', key: 'projectName', align: 'center' },
    { title: '关联影片id', key: 'movieId', align: 'center' , width: 70, },
    { title: '关联的影片名称', key: 'movieName', align: 'center' },
    {
      title: '下单时间',
      key: 'frontCreateTime',
      align: 'center',
      width: 150,
      render: (hh: any, { row: { frontCreateTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(frontCreateTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '影片资源类型',
      key: 'typeList',
      align: 'center',
      width: 90,
      render: (hh: any, { row: { typeList } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == '1') {
          return <span class={`status-1`}>物料</span>
        } else if (status == '2') {
          return <span class={`status-2`}>电子卷</span>
        } else {
          return <span class={`status-3`}>-</span>
        }
        /* tslint:enable */
      }
    },
    { title: '品牌方线上资源', slot: 'up', width: 100, align: 'center' },
    { title: '品牌方线下资源', slot: 'down', width: 100, align: 'center' },
    {
      title: '订单状态',
      key: 'status',
      align: 'center',
      width: 80,
      render: (hh: any, { row: { status } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1) {
          return <span class={`status-1`}>待审核</span>
        } else if (status == 2) {
          return <span class={`status-2`}>待上传资源</span>
        }
         else if (status == 3) {
          return <span class={`status-3`}>待下载资源</span>
        }
         else if (status == 4) {
          return <span class={`status-4`}>已取消</span>
        }else if (status == 5) {
          return <span class={`status-5`}>审核拒绝</span>
        }else if (status == 6) {
          return <span class={`status-6`}>待上传推广效果图</span>
        }else if (status == 7) {
          return <span class={`status-7`}>完成</span>
        }
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      slot: 'spaction',
      width: 80,
      align: 'center',
    }
  ]
  mounted() {
    this.updateQueryByParam()

    !!this.query.startTime ? this.showTime[0] =
    moment(this.query.startTime).format(timeFormat) : this.showTime[0] = ''
    !!this.query.endTime ? this.showTime[1] =
    moment(this.query.endTime).format(timeFormat) : this.showTime[1] = ''
  }

  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.query.startTime = new Date(data[0]).getTime() - 28800000) : this.query.startTime = 0
     !!data[1] ? (this.query.endTime = new Date(data[1]).getTime() + 57600000) : this.query.endTime = 0
  }

  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }
  reset() {
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
    const query: any = {}
    for (const [key, value] of Object.entries(this.oldQuery)) {
      if (key != 'startTime' && value != 0) {
        query[key] = value
      }
      if (key != 'endTime' && value != 0) {
        query[key] = value
      }
    }
    try {
        // 订单列表
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
        offlineResourceTypeList: offlineResourceTypeList,
        channelCodeList: channelCodeList,
        typeList: typeList
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.statusList = statusList
      this.offlineResourceTypeList = offlineResourceTypeList
      this.channelCodeList = channelCodeList
      this.typeList = typeList
    // 公司列表
    const adscmy = await company({pageSize: 800000})
    this.company = adscmy.data.items
    // 影片列表
    // const filmdata = await film({pageSize: 800000})
    // this.filmdata = filmdata.data.items
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
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
