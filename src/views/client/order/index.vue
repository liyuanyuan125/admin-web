<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.workorderId" placeholder="变更编号" class="input" style="width: 200px"/>
          <DatePicker type="daterange" @on-change="dateChange" v-model="showTime" placement="bottom-end" placeholder="申请日期" class="input" style="width: 200px"></DatePicker>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
      </div>
      <Table v-auth="'customer.workorders:list'" :columns="columns" :data="tableData" :loading="loading"
        border stripe disabled-hover size="small" class="table"></Table>

      <div v-auth="'customer.workorders:list'" class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    </div>
    <DlgEdit  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
    <!-- <dlgVerify   ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/> -->
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList , companysList } from '@/api/order'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
// import { numberify, numberKeys } from '@/fn/typeCast'
// import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import DlgEdit from './dlgEdit.vue'
// import dlgVerify from './dlgVerify.vue'

import {confirm , warning , success, toast } from '@/ui/modal'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'


@Component({
  components: {
    DlgEdit,
    // dlgVerify
  }
})
// export default class Main extends View {
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    id: '',
    // email: '',
    // companyName: '',
    // status: null,
    pageIndex: 1,
    pageSize: 20,
    applyStartTime: 0,
    applyEndTime: 0
  }
  query: any = {}
  shows = true
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false


  examine = false
  // query = { ...defQuery }

  loading = false
  list = []
  total = 0
  oldQuery: any = {}
  typeList = []
  showTime: any = []

  // 状态列表
  approveStatusList = []

  // 公司列表
  company: any = []

  columns = [
    { title: '变更编号', key: 'id', width: 100 , align: 'center' },
    { title: '公司名称', key: 'company', align: 'center',
      render: (hh: any, { row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        // console.log(row.company.name)
        const name = row.company
        return name == null ? <span v-html='-'></span> : <span v-html={name.name}></span>
        
        /* tslint:enable */
      }
    },
    { title: '申请人', key: 'applyUserName', align: 'center' ,
      render: (hh: any, { row: { applyUserName , applyUserEmail } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span>{applyUserEmail}【{applyUserName}】</span>
        /* tslint:enable */
      }
    },
    {
      title: '申请时间',
      key: 'applyTime',
      align: 'center',
      render: (hh: any, { row: { applyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(applyTime).format(timeFormat)
        return applyTime == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '状态',
      key: 'statusText',
      width: 100,
      align: 'center',
      render: (hh: any, { row: { approveStatus, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (approveStatus == 0){
          return <span class={`status-${0}`}>-</span>
        } else if (approveStatus == 1) {
          return <span class={`status-${1}`}>待审核</span>
        } else if (approveStatus == 2) {
          return <span class={`status-${2}`}>通过</span>
        } else if (approveStatus == 3) {
          return <span class={`status-${3}`}>拒绝</span>
        }
        
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (hh: any, { row: { approveStatus, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        // const sta = approveStatus == 1 ? '审核' : '详情'
        const sta = approveStatus
        if (sta == 1 ) {
            return <div class='row-acts'>
          <router-link v-auth={'customer.workorders:change-status'} to={{ name: 'client-order-detail', params: { id , approveStatus } }}>审核</router-link>
        </div>
        } else if (sta != 1) {
          return <div class='row-acts'>
          <router-link v-auth={'customer.workorders:info'} to={{ name: 'client-order-detail', params: { id , approveStatus } }}>详情</router-link>
        </div>
        }
        // return <div class='row-acts'>
        //   <router-link to={{ name: 'client-order-detail', params: { id , approveStatus } }}>{sta}</router-link>
        // </div>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
      approveStatus: this.approveStatusList,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        statusText: it.approveStatus,
      }
    })
    return list
  }

  mounted() {
    this.updateQueryByParam()

    !!this.query.applyStartTime ? this.showTime[0] =
    moment(this.query.applyStartTime).format(timeFormat) : this.showTime[0] = ''
    !!this.query.applyEndTime ? this.showTime[1] =
    moment(this.query.applyEndTime).format(timeFormat) : this.showTime[1] = ''
  }

  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.query.applyStartTime = new Date(data[0]).getTime() - 28800000) : this.query.applyStartTime = 0
     !!data[1] ? (this.query.applyEndTime = new Date(data[1]).getTime() + 57600000) : this.query.applyEndTime = 0
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
    // const query = clean({ ...this.query })
    const query: any = {}
    for (const [key, value] of Object.entries(this.oldQuery)) {
      if (key != 'applyStartTime' && value != 0) {
        query[key] = value
      }
      if (key != 'applyEndTime' && value != 0) {
        query[key] = value
      }
    }
    try {
      // 获取列表页
      const { data: {
        items: list,
        totalCount: total,
        approveStatusList: approveStatusList,
        // company: company
      } } = await queryList(query)
      this.list = list
      this.total = total
      // this.company = list.company
      this.approveStatusList = approveStatusList
      // console.log(list)
      // 获取公司列表
      // const { data: {
      //   items: companyList,
      // } } = await companysList(query)
      // this.company = company
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

   // 新增
  // edit(id: number, row: any) {
  //   this.addOrUpdateVisible = true
  //   this.$nextTick(() => {
  //     const myThis: any = this
  //     myThis.$refs.addOrUpdate.init(id)
  //   })
  // }
  // 修改状态
  // async change(id: number, row: any) {
  //   try {
  //     await confirm('您确定' + (row.statusText == '启用' ? '停用' : '启用') + '当前状态信息吗？')
  //     await setList ({
  //       id,
  //       status: row.status == 1 ? 2 : 1
  //     })
  //     this.$Message.success({
  //       content: `更改成功`,
  //     })
  //     this.reloadSearch()
  //   } catch (ex) {
  //   }
  // }

  // dlgEditDone() {
  //   this.doSearch()
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
    color: #19be6b;
  }
  /deep/ .aptitude-status-2 {
    color: #000;
  }
  /deep/ .aptitude-status-4 {
    color: #ed4014;
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
