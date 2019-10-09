<template>
  <div class="page">
    <div>
      <div class="act-bar flex-box">
        <form class="form flex-1">
          <!-- <span style='color: red;'>*</span> -->
          <Select
             class='sels'
             v-model='query.movieId'
             clearable
             filterable
             placeholder="影片名称"
             style='width: 150px;'
             remote
             :remote-method="movieIdMethod"
             @on-clear="movieList = []"
              >
              <Option
                v-for="(item, index) in movieList"
                :key="item.id"
                :value="item.id"
              >{{item.name}}</Option>
            </Select>
          <!-- <span style='color: red;margin-left: 5px;'>*</span> -->
          <InputNumber  v-model="query.box" :min='0' placeholder="预测票房" class="input"/>
          <Select v-model="query.type" placeholder="投放类型选择">
            <Option v-for="it in putInType" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <!-- <Select v-if='showUrl == false' v-model="defaultCount" placeholder="投放类型选择1111111">
            2<Option v-for="it in putInType" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select> -->
          <InputNumber :min='0' v-if='query.type == 1' v-model="query.typeCount" placeholder="天" class="input"/>
          <InputNumber :min='0' v-if='query.type == 2' v-model="query.typeCount" placeholder="人" class="input"/>
          <InputNumber :min='0' v-model="query.week" placeholder="密钥周期" class="input"/>
          <Button type="primary" @click="search" class="btn-reset">搜索</Button>
          <Button type="primary" @click="viewCinema" class="btn-reset">+上传影城列表</Button>

          <!-- <Button type="default" @click="reset" class="btn-reset">清空</Button> -->
          <Button v-if='list.length > 0' type="default" @click="exportData" class="btn-reset">导出</Button>
        </form>
      </div>
      <Table ref='table' :columns="columns" :data="list" :loading="loading"
        border stripe disabled-hover size="small" class="table">
        <template slot="hallCount" slot-scope="{row}" >
          <span v-if='row.hallCount == null'>-</span>
          <span v-else >{{formatNumber(row.hallCount , 2)}}</span>
        </template>
        <template slot="seatCount" slot-scope="{row}" >
          <span v-if='row.seatCount == null'>-</span>
          <span v-else >{{formatNumber(row.seatCount , 2)}}</span>
        </template>
        <template slot="showCount" slot-scope="{row}" >
          <span v-if='row.showCount == null'>-</span>
          <span v-else >{{formatNumber(row.showCount , 2)}}</span>
        </template>
        <template slot="personCount" slot-scope="{row}" >
          <span v-if='row.personCount == null'>-</span>
          <span v-else >{{formatNumber(row.personCount , 2)}}</span>
        </template>
        <template slot="averageShowCount" slot-scope="{row}" >
          <span v-if='row.averageShowCount == null'>-</span>
          <span v-else >{{formatNumber(row.averageShowCount , 2)}}</span>
        </template>
        <template slot="averagePersonCount" slot-scope="{row}" >
          <span v-if='row.averagePersonCount == null'>-</span>
          <span v-else >{{formatNumber(row.averagePersonCount , 2)}}</span>
        </template>

      </Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    </div>
    <DlgEdit ref="addOrUpdate" v-if="addOrUpdateVisible" @done="done" />
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { costList } from '@/api/dataReport'
import { queryList } from '@/api/film-ed'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import { formatNumber } from '@/util/validateRules'
import DlgEdit from './dlgEdit.vue'

import {confirm , warning , success, toast , info } from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component({
  components: {
    DlgEdit
  }
})
// export default class Main extends ViewBase {
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery: any = {
    movieId: null,
    box: null,
    typeCount: null,
    type: 1,
    week: null,
    pageIndex: 1,
    pageSize: 20,
    codes: null
  }

  query: any = {}
  oldQuery: any = {}

  defaultCount: any = 1

  loading = false
  list: any = []
  movieList: any = []

  showUrl: any = false

  addOrUpdateVisible = false
  total = 0
  loadings = false

  // 投放类型
  putInType: any = [
    {
      key: 1,
      text: '投放时长'
    },
    {
      key: 2,
      text: '投放人次'
    },
  ]

  movieName: any = ''


  bbb: any = []

  columns = [
    { title: '省份', key: 'provinceName', align: 'center', width: 100 },
    { title: '城市', key: 'cityName', align: 'center' },
    { title: '城市等级', key: 'grade', align: 'center' },
    { title: '影城名称', width: 300, key: 'cinemaName', align: 'center' },
    { title: '影城编码', key: 'code', align: 'center' },
    { title: '影厅数', slot: 'hallCount', align: 'center' },
    { title: '座位数', slot: 'seatCount', align: 'center' },
    { title: '总场次(场)', slot: 'showCount', align: 'center' },
    { title: '总人次(人)', slot: 'personCount', align: 'center' },
    { title: '日均场次', slot: 'averageShowCount', align: 'center' },
    { title: '日均人次', slot: 'averagePersonCount', align: 'center' },
  ]

  exportcolumns = [
    { title: '导出时间', key: 'exportDate', align: 'center', width: 100 },
    { title: '筛选条件', key: 'query', align: 'center', width: 100 },
    { title: '省份', key: 'provinceName', align: 'center', width: 100 },
    { title: '城市', key: 'cityName', align: 'center' },
    { title: '城市等级', key: 'grade', align: 'center' },
    { title: '影城名称', width: 300, key: 'cinemaName', align: 'center' },
    { title: '影城编码', key: 'code', align: 'center' },
    { title: '影厅数', key: 'hallCount', align: 'center' },
    { title: '座位数', key: 'seatCount', align: 'center' },
    { title: '总场次(场)', key: 'showCount', align: 'center' },
    { title: '总人次(人)', key: 'personCount', align: 'center' },
    { title: '日均场次', key: 'averageShowCount', align: 'center' },
    { title: '日均人次', key: 'averagePersonCount', align: 'center' },
  ]

  mounted() {
    this.updateQueryByParam()
    this.query.type = 1
    this.query.week = 45
    if ( this.$route.query.box != undefined ) {
      this.query.box = Number(this.$route.query.box)
      this.query.typeCount = Number(this.$route.query.typeCount)
      this.search()
    }
  }

  get formatNumber() {
    return formatNumber
  }

  done(outputs: any) {
    // console.log(outputs)
    this.query.codes = outputs.join(',')
    this.search()
  }

    // 影片列表搜索
  async movieIdMethod(querys: any) {
    try {
      if (querys) {
        this.loadings = true
        const {
          data: { items }
        } = await queryList({
          name: querys,
        })
        this.movieList = items || []
        if (items.length > 0) {
          this.movieName = items[0].name
        }
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  // 下载
  exportData() {
    (this.$refs.table as any).exportCsv({
        filename: '成本核算报表',
        columns: this.exportcolumns,
        data: ([...this.bbb, ...this.list.slice(1)]).map((it: any) => {
          return {
            ...it,
          }
        })
    })
  }

  // 上传影城
  viewCinema() {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init()
    })
  }

  // reset() {
  //   this.query = {
  //     movieId: '',
  //     box: null,
  //     typeCount: null,
  //     type: 1,
  //     week: 45,
  //     pageIndex: 1,
  //     pageSize: 20,
  //   }
  //   this.list = []
  //   this.doSearch()
  // }

  search() {
    this.showUrl = true
    this.doSearch()
  }

  async doSearch() {
    if (this.showUrl == false) {
      return
    }
    if ((this.query.movieId == '' || this.query.movieId == undefined) ||
      (this.query.box == null || this.query.box == undefined)) {
      info('请输入影片名称，预测票房进行查询')
      return
    }
    if (this.query.type == 1) {
      if (this.query.typeCount == null) {
        info('请输入投放天数')
        return
      }
      if (this.query.typeCount > this.query.week) {
        info('投放天数不可大于密钥周期')
        return
      }
    }
    if (String(this.query.typeCount).indexOf('.') == 1) {
      info('投放天数跟人次为整数')
      return
    }
    if (this.query.type == 2 && this.query.week == null) {
      this.query.week = 45
    }

    // this.query.movieId = this.query.movieId.split('.')[0]

    if (this.loading) {
      return
    }

    this.updateUrl()
    this.loading = true
    try {
      const { data: {
        items: list,
        totalCount: total,
        sumHallCount,
        sumSeatCount,
        sumShowCount,
        sumPersonCount,
        sumAverageShowCount,
        sumAveragePersonCount,
      } } = await costList(this.query)
      this.list = list
      if (this.list.length > 0) {
        this.list.push({
          provinceName: '总计',
          hallCount: sumHallCount,
          seatCount: sumSeatCount,
          showCount: sumShowCount,
          personCount: sumPersonCount,
          averageShowCount: sumAverageShowCount,
          averagePersonCount: sumAveragePersonCount,
        })
      }
      const a = this.movieName == '' ? '影片名称：全部' : '影片名称' + this.movieName
      const b = this.query.box == null ? '预测票房：全部' : '预测票房' + this.query.box
      const c = this.query.type == 1 ? '投放时长：' + this.query.typeCount :
      '投放人次：' + (this.query.typeCount == null ? '暂无' : this.query.typeCount)
      const d = this.query.week == null ? '密钥周期：45' : '密钥周期' + this.query.week
      this.bbb = [
        {
          exportDate: moment((new Date().getTime())).format(timeFormat),
          query: a + ' ' + b + ' ' + c + ' ' + d,
          ...this.list[0]
        }
      ]
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // handlepageChange(size: any) {
  //   this.query.pageIndex = size
  //   this.search()
  // }
  // handlePageSize(size: any) {
  //   this.query.pageIndex = size
  //   this.search()
  // }

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
