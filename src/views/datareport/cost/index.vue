<template>
  <div class="page">
    <div>
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="doSearch">
          <!-- <span style='color: red;'>*</span> -->
          <LazyInput v-model="query.id" placeholder="影片名称" class="input"/>
          <!-- <span style='color: red;margin-left: 5px;'>*</span> -->
          <LazyInput v-model="query.email" placeholder="预测票房" class="input"/>
          <Select v-model="query.status" placeholder="启用状态" clearable>
            <Option v-for="it in putInType" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
          <LazyInput v-if='query.status == 1' v-model="query.mobile" placeholder="天" class="input"/>
          <LazyInput v-if='query.status == 2' v-model="query.mobile" placeholder="人" class="input"/>
          <LazyInput v-model="query.companyName" placeholder="密钥周期" class="input"/>
          <Button type="success" @click="doSearch" class="btn-reset">确认</Button>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
      </div>
      <Table :columns="columns" :data="list" :loading="loading"
        border stripe disabled-hover size="small" class="table">
        </Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
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
import { queryList , setList} from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'

import {confirm , warning , success, toast , info } from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}


@Component({
  components: {
  }
})
// export default class Main extends ViewBase {
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    id: '',
    email: '',
    companyName: '',
    status: 1,
    pageIndex: 1,
    pageSize: 20,
  }
  query: any = {}

  loading = false
  list: any = []
  total = 0
  oldQuery: any = {}

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

  statusList = []





  columns = [
    { title: '省份', key: 'id', align: 'center', width: 100 },
    { title: '城市', key: 'email', align: 'center' },
    { title: '城市等级', key: 'mobile', align: 'center' },
    { title: '影城名称', width: 300, key: 'companyName', align: 'center' },
    { title: '影城编码', key: 'companyName', align: 'center' },
    { title: '影厅数', key: 'id', align: 'center' },
    { title: '座位数', key: 'id', align: 'center' },
    { title: '总场次(场)', key: 'id', align: 'center' },
    { title: '总人次(人)', key: 'id', align: 'center' },
    { title: '日均场次', key: 'id', align: 'center' },
    { title: '日均人次', key: 'id', align: 'center' },
  ]

  mounted() {
    // info('请输入影片名称，预测票房进行查询')
    // this.updateQueryByParam()
  }

  // search() {
  //   this.query.pageIndex = 1
  // }

  reloadSearch() {
    this.doSearch()
  }

  reset() {
    this.resetQuery()
  }

  async doSearch() {
    // console.log(this.query)
    // console.log(this.query.id)
    // console.log(this.query.email)
    if ((this.query.id == '' || this.query.id == undefined) ||
      (this.query.email == '' || this.query.email == undefined)) {
      info('请输入影片名称，预测票房进行查询')
      return
    }
    if (this.loading) {
      return
    }

    this.updateUrl()
    this.loading = true
    try {
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
      } } = await queryList(this.query)
      this.list = list
      if (this.list.length > 0) {
        this.list.push({
          id: '总计',
          email: 456
        })
      }
      this.total = total
      this.statusList = statusList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
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
