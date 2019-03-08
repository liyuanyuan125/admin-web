<template>
  <div class="page">
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <!-- <LazyInput v-model="query.id" placeholder="账号ID" class="input input-corp-id"
            @on-enter="ev => query.id = ev.target.value" @on-blur="ev => query.id = ev.target.value"/>
          <LazyInput type="email" v-model="query.email" placeholder="账号" class="input input-corp-id"
            @on-enter="ev => query.email = ev.target.value" @on-blur="ev => query.email = ev.target.value"/> -->
          <LazyInput v-model="query.contractNo" placeholder="合同编号/合同名称" class="input"/>
          <LazyInput v-model="query.companyBName" placeholder="乙方公司名称" class="input"/>
          <DatePicker type="daterange" @on-change="dateChange" v-model="showTime" placement="bottom-end" placeholder="到期日期" class="input" style="width: 200px"></DatePicker>
          <!-- <Date-picker type="date" v-model="query.createTime" placeholder="注册时间" on-change="selectTime" class="input" style="width: 200px"></Date-picker> -->
          <!-- <Date-picker type="date" v-model="query.UpdateTime" placeholder="更新时间" on-change="selectTime"  class="input" style="width: 200px"></Date-picker>           -->
          <Select v-model="query.approveStatus" placeholder="状态" clearable>
            <Option v-for="it in statusList" :key="it.key" :value="it.key" v-if='it.key!=0'
              :label="it.text">{{it.text}}</Option>
          </Select>
          <Button type="default" @click="reset" class="btn-reset">清空</Button>
        </form>
        <div class="acts">
          <Button v-auth="'customer.contracts:add'" type="success" icon="md-add-circle" @click="edit(0)">新建合同</Button>
        </div>
      </div>
      <Table :columns="columns" :data="tableData" :loading="loading"
        border stripe disabled-hover size="small" class="table"></Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
    </div>
    <DlgEdit  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
    <!-- <dlgVerify  ref="change"   @refreshDataList="search" v-if="changeVisible" @done="dlgEditDone"/> -->
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { queryList , zuofei } from '@/api/list'
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
const timeFormats = 'YYYY-MM-DD'

const dataForm = {
  status: 1
}


@Component({
  components: {
    DlgEdit,
    // dlgVerify
  }
})
// export default class Main extends ViewBase {
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    // id: '',
    contractNo: '',
    companyBName: '',
    status: null,
    approveStatus: null,
    pageIndex: 1,
    pageSize: 20,
    validityStartDate: 0,
    validityEndDate: 0
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


  statusList = []

  // company = []

  company2 = []


  columns = [
    { title: '合同编号', key: 'contractNo', align: 'center' },
    { title: '合同名称', key: 'contractName', align: 'center' },
    { title: '乙方公司名称', key: 'companyBName', align: 'center' },
    {
      title: '有效期',
      key: 'validityStartDate',
      align: 'center',
      render: (hh: any, { row: { validityStartDate , validityEndDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html1 = String(validityStartDate).slice(0,4) + '-' + String(validityStartDate).slice(4,6) + '-' + String(validityStartDate).slice(6,8)
        const html2 = String(validityEndDate).slice(0,4) + '-' + String(validityEndDate).slice(4,6) + '-' + String(validityEndDate).slice(6,8)
        // console.log(String(validityStartDate).length)
        if (String(validityStartDate).length == 4) {
          return <div>
            <span class='datetime' v-html={validityStartDate}></span>~
            <span class='datetime' v-html={validityEndDate}></span>
          </div> 
        } else {
          return <div>
            <span class='datetime' v-html={html1}></span>~
            <span class='datetime' v-html={html2}></span>
          </div>
        }
        
        /* tslint:enable */
      }
    },
    {
      title: '创建时间',
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return createTime == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '签订人', width: 80, key: 'signingUserName', align: 'center' },
    { title: '跟进人', width: 80, key: 'followUserName', align: 'center' },
    {
      title: '状态',
      width: 80,
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { approveStatus, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (approveStatus == 0){
          return <span class={`status-${0}`}>-</span>
        } else if (approveStatus == 1) {
          return <span class={`status-${1}`}>待审核</span>
        } else if (approveStatus == 2) {
          return <span class={`status-${2}`}>已通过</span>
        } else if (approveStatus == 3) {
          return <span class={`status-${3}`}>拒绝</span>
        } else if (approveStatus == 4) {
          return <span class={`status-${4}`}>作废</span>
        }
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      align: 'center',
      render: (hh: any, { row: { approveStatus, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        // const sta = approveStatus == 1 ? '停用' : '启用'
        if (approveStatus == 1) {
          return <div class='row-acts'>
          <router-link v-auth={'customer.contracts:change-status'} to={{ name: 'contract-list-detail', params: { id , approveStatus } }}>审批</router-link>&nbsp;&nbsp;
          <router-link v-auth={'customer.contracts:modify'} to={{ name: 'contract-list-edit', params: { id } }}>编辑</router-link>&nbsp;&nbsp;
          <router-lin v-auth={'customer.contracts:add'} to={{ name: 'contract-list-edit', params: { id ,copy : -1 } }}>复制</router-link>&nbsp;&nbsp;
          <router-link v-auth={'customer.contracts:info'} to={{ name: 'contract-list-detail', params: { id , edi : 1  } }}>详情</router-link>
        </div>
        } else if (approveStatus == 2) {
          return <div class='row-acts'>
          <a on-click={this.zuofei.bind(this, row.id, row)}>作废</a>&nbsp;&nbsp;
          <router-link v-auth={'customer.contracts:add'} to={{ name: 'contract-list-edit', params: { id ,copy : -1} }}>复制</router-link>&nbsp;&nbsp;
          <router-link v-auth={'customer.contracts:info'} to={{ name: 'contract-list-detail', params: { id , edi : 0  } }}>详情</router-link>
        </div>
        } else if (approveStatus == 3) {
          return <div class='row-acts'>
          <router-link v-auth={'customer.contracts:add'} to={{ name: 'contract-list-edit', params: { id,copy : -1 } }}>复制</router-link>&nbsp;&nbsp;
          <router-link v-auth={'customer.contracts:info'} to={{ name: 'contract-list-detail', params: { id , edi : 0  } }}>详情</router-link>
        </div>
        } else if (approveStatus == 4) {
          return <div class='row-acts'>
          <router-link v-auth={'customer.contracts:add'} to={{ name: 'contract-list-edit', params: { id ,copy : -1} }}>复制</router-link>&nbsp;&nbsp;
          <router-link v-auth={'customer.contracts:info'} to={{ name: 'contract-list-detail', params: { id , edi : 0  } }}>详情</router-link>
        </div>
        }
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
      approveStatus: this.statusList,
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        statusText: it.approveStatus == 1 ? '启用' : '停用',
      }
    })
    return list
  }

  mounted() {
    // const urlQuery = slice(urlParam(), Object.keys(defQuery))
    // this.query = numberify({ ...defQuery, ...urlQuery }, numberKeys(defQuery))
    // this.doSearch()
    this.updateQueryByParam()

    !!this.query.validityStartDate ? this.showTime[0] =
    moment(this.query.validityStartDate).format(timeFormat) : this.showTime[0] = ''
    !!this.query.validityEndDate ? this.showTime[1] =
    moment(this.query.validityEndDate).format(timeFormat) : this.showTime[1] = ''
    // console.log(this.query.validityStartDate)
  }

  // updateUrl() {
  //   const query = prettyQuery(this.query, defQuery)
  //   const url = buildUrl(location.pathname, query)
  //   history.replaceState(null, '', url)
  // }
  //   const a = moment(this.dataForm.validityStartDate).format(timeFormat).split('-')
  //   const b = moment(this.dataForm.validityEndDate).format(timeFormat).split('-')

  //   this.dataForm.validityStartDate = Number(a[0] + a[1] + a[2])
  //   this.dataForm.validityEndDate = Number(b[0] + b[1] + b[2])

  dateChange(data: any) {
    const a = data[0].split('-')
    const b = data[1].split('-')
     // 获取时间戳
     !!data[0] ? (this.query.validityStartDate =  Number(a[0] + a[1] + a[2])) :
     this.query.validityStartDate = 0
     !!data[1] ? (this.query.validityEndDate = Number(b[0] + b[1] + b[2])) :
     this.query.validityEndDate = 0
    //  console.log(a)
  }

  search() {
    this.query.pageIndex = 1
  }
  reloadSearch() {
    this.doSearch()
  }
  reset() {
    // const { pageSize } = this.query
    // this.query = { ...defQuery, pageSize }
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
      if (key != 'validityStartDate' && value != 0) {
        query[key] = value
      }
      if (key != 'validityEndDate' && value != 0) {
        query[key] = value
      }
    }
    try {
      const { data: {
        items: list,
        totalCount: total,
        approveStatusList: approveStatusList,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.statusList = approveStatusList
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
  edit(id: number) {
    const params: any = id > 0 ? { id } : {}
    this.$router.push({ name: 'contract-list-edit', params })
  }

  // 作废
  async zuofei(id: number, row: any) {
    try {
      await confirm('您确定作废合同编号为' + row.contractNo + '的合同吗？')
      await zuofei (id , {
        approveStatus: 4
      })
      this.$Message.success({
        content: `更改成功`,
      })
      this.reloadSearch()
    } catch (ex) {
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
    width: 130px;
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
  /deep/ .status-3 {
    color: #ed4014;
  }
  /deep/ .status-4 {
    color: #aaa;
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
