<template>
  <div class="page">
    <!-- 添加账号页面 -->
    <!-- <div  v-if="!shows">
      <div class="bge">
        <form class="form flex-1" >
          <div class="Add-Inp">
              <span>用户账号</span><LazyInput  size="large" style="width: 300px" placeholder="输入账号"/><br>
          </div>
          <div class="Add-Inp">
              <span>密码</span><LazyInput  size="large" style="width: 300px" placeholder="输入密码"/><br>
          </div>
          <div class="Add-Inp">
              <span>重复密码</span><LazyInput  size="large" style="width: 300px" placeholder="再次输入密码"/><br>
          </div>
          <div class="Add-Inp">
              <span>邮箱</span><LazyInput  size="large" style="width: 300px" placeholder="输入邮箱"/><br>
          </div>
          <div class="Add-Inp">
              <span>所属公司</span>
              <Select style="width:200px">
                  <OptionGroup label="公司一">
                      <Option v-for="item in company" :value="item.name" :key="item.name">{{ item.name }}</Option>
                  </OptionGroup>
                  <OptionGroup label="公司二">
                      <Option v-for="item in company2" :value="item.name" :key="item.name">{{ item.name }}</Option>
                  </OptionGroup>
              </Select>
          </div>
          <div class="Add-Inp">
              <span>角色</span><Radio label="超级管理员">超级管理员</Radio><br>
          </div>
          <div class="Add-Inp">
              <span>启用状态</span>
              <RadioGroup>
              <Radio label="启用"></Radio>
              <Radio label="停用"></Radio>
              </RadioGroup>
              <br>
          </div>
          <Button class="button2" type="primary" id="btn" @click='toshowtrue'>保存</Button>
        </form>
      </div>
    </div> -->
    <!-- 弹窗审核 -->
    <!-- <div class="info" v-if="examine">
        <div class="info-ver">账户审核<Icon class="info-Icon" type="md-close"   @click="examinefalse" size="22"/></div>
        <div class="info-type">
            <div class="info-type-t">
                <div>注册账号<span>adadadadada</span></div>
                <div>账号类型<span>主账号</span></div>
            </div>
            <div class="info-type-t">审核意见
                <RadioGroup>
                    <Radio label="通过"></Radio>
                    <Radio label="拒绝"></Radio>
                </RadioGroup>
            </div>
            <div class="info-type-t info-type-inp">
                所属公司<Input class="info-inp" size="large" style="width: 230px"/><Icon type="ios-alert" color="#FF9900" size="24"/><span>保存为新公司</span>
            </div>
             <Button type="primary">确认</Button>
             <Button @click="examinefalse">取消</Button>
        </div>
    </div> -->
    <!-- <router-link  :to="{ name: 'client-account-detail', params: { id: 1 } }">详情</router-link> -->
  <!-- </div> -->
  <!-- <div class="page"> -->
    <div  v-if="shows">
      <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.id" placeholder="账号ID" class="input input-corp-id"
            @on-enter="ev => query.id = ev.target.value" @on-blur="ev => query.id = ev.target.value"/>
            <LazyInput v-model="query.emailNum" placeholder="账号" class="input input-corp-id"
            @on-enter="ev => query.emailNum = ev.target.value" @on-blur="ev => query.emailNum = ev.target.value"/>
          <LazyInput v-model="query.companyName" placeholder="公司名称" class="input"/>
          <DatePicker type="daterange" v-model="query.createTime" placement="bottom-end" placeholder="注册时间" class="input" style="width: 200px"></DatePicker>
          <Select v-model="query.type" placeholder="审核状态" clearable>
            <Option v-for="it in typeList" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
          <Select v-model="query.status" placeholder="启用状态" clearable>
            <Option v-for="it in statusList" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
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
    <DlgEdit  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryList } from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { clean } from '@/fn/object'
import DlgEdit from './dlgEdit.vue'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD<br>HH:mm:ss'

const defQuery = {
  id: null,
  emailnum: null,
  companyName: '',
  userAccount: '',
  type: null,
  status: null,
  pageIndex: 1,
  pageSize: 20,
}


@Component({
  components: {
    DlgEdit
  }
})
export default class Main extends View {
  shows = true
  showDlg = false
  addOrUpdateVisible = false


  examine = false
  query = { ...defQuery }

  loading = false
  list = []
  total = 0
  oldQuery: any = null
  typeList = []


  statusList = []

  company = []

  company2 = []


  columns = [
    { title: '账号ID', key: 'id', align: 'center' },
    { title: '邮箱账号', key: 'emailNum', align: 'center' },
    { title: '公司名称', key: 'companyName', align: 'center' },
    {
      title: '注册时间',
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '更新时间',
      key: 'updateTime',
      align: 'center',
      render: (hh: any, { row: { updateTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(updateTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '审核状态',
      key: 'typeName',
      align: 'center',
      render: (hh: any, { row: { type, typeName } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`aptitude-status-${type}`}>{typeName}</span>
        /* tslint:enable */
      }
    },
    {
      title: '启用状态',
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <span class={`status-${status}`}>{statusText}</span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { status, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <a href ="javascript:;">启用</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a on-click={this.edit.bind(this, row.id, row)}>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <router-link to={{ name: 'client-account-detail', params: { id } }}>详情</router-link>
        </div>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
      type: makeMap(this.typeList),
      status: makeMap(this.statusList),
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        typeName: cachedMap.type[it.type],
        statusText: cachedMap.status[it.status],
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
        company,
        company2,
        statusList,
      } } = await queryList(query)
      this.list = list
      this.total = total
      this.typeList = typeList
      this.company = company
      this.company2 = company2
      this.statusList = statusList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

   // 新增 / 修改
  edit(id: number, row: any) {
    this.addOrUpdateVisible = true
    // !!id ? this.editOne = row : this.editOne
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
    })
  }

  dlgEditDone() {
    this.doSearch()
  }
  toshowtrue() {
    alert('保存成功')
    this.shows = true
  }
  @Watch('query', { deep: true })
  onQueryChange() {
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

.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
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
