<template>
  <div class="page">
    <!-- 菜单 -->
    <!-- <div class="work-Title"><span class="workT">工作台</span> > 客户管理 > 账号管理 > 账号详情</div> -->
    <!-- 注册账号 -->
    <div class="Inp-Group-res">
      <div class="Inps-res">
        <div class="res-num">
          <p>用户账号</p>
          <div class="res-num-item change-item">
            <span>admin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【主账号】</span>
            <span class="blu1 les" @click="viewlog">查看操作日志</span>
            <span class="blu2" @click="change(0)">变更主账号</span>
            <!-- <span>变更主账号</span> -->
          </div>
        </div>
        <div class="res-num">
          <p>注册时间</p>
          <div class="res-num-item">
            <span>2018/11/01 12:22:21</span>
            <span class="res-date les">最后登陆时间</span>
            <span>2018/11/01 12:22:21</span>
          </div>
        </div>
        <div class="res-num">
          <p>所属公司</p>
          <div class="res-num-item">
            <span>北京博纳国际有限公司</span>
            <span class="blu1 les" @click="viewcompanydetail(5)">查看公司详情</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 子账号 -->
    <div class="new-number">
      <div class="new-num">
        <p>子账号</p><br>
        <Table :columns="columns" :data="tableData"
        border stripe disabled-hover size="small" class="table"></Table>
        <div class="page-wrap" v-if="total > 0">
          <Page :total="total" show-total :page-size="query.pageSize" show-sizer
            :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
            @on-change="page => query.pageIndex = page"
            @on-page-size-change="pageSize => query.pageSize = pageSize"/>
        </div>
      </div>
    </div>
    <dlgChange  ref="change"   @refreshDataList="search" v-if="changeVisible" @done="dlgEditDone"/>

  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { queryItem } from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { clean } from '@/fn/object'
import dlgChange from './dlgChange.vue'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const defQuery = {
  id: null,
  parentAccountId: '',
  phoneNmber: null,
  // corpName: '',
  // userAccount: '',
  type: null,
  status: null,
  pageIndex: 1,
  pageSize: 20,
}

@Component({
  components: {
    dlgChange
  }
})
export default class Main extends View {
  // change = false
  changeVisible = false

  query = { ...defQuery }

  loading = false

  list = []
  prelist = []
  total = 0

  oldQuery: any = {}

  columns = [
    { title: '用户账号', key: 'id', align: 'center' },
    { title: '姓名', key: 'name', align: 'center' },
    { title: '手机号', key: 'mobile', align: 'center' },
    {
      title: '创建时间',
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
      title: '最后登陆时间',
      key: 'lastLoginTime',
      align: 'center',
      render: (hh: any, { row: { lastLoginTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(lastLoginTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { id } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <router-link to={{ name: 'client-account-viewLog', params: { id } }}>查看操作日志</router-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return list
  }
  mounted() {
    const { id } = this.$route.params
    this.query.parentAccountId = id
    // this.doSearch()
  }
  dlgEditDone() {
    this.doSearch()
  }

  change() {
    this.changeVisible = true
    const params = this.$route.params
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.change.init(params)
    })
  }

  search() {
    this.query.pageIndex = 1
  }

  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
  }

  viewlog() {
    this.$router.push({ name: 'client-account-viewLog' })
  }

  viewcompanydetail(id: number) {
    const params = this.$route.params
    // this.dataForm.category.id = id
    // const params: any = id > 0 ? { id } : {}
    this.$router.push({ name: 'client-corp-detail', params })
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
        childAccountList: list,
        parentAccount: prelist,
      } } = await queryItem(query)
      this.list = list
      this.prelist = prelist
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
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
.sec {
  width: 254px;
  margin-left: 9%;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Inp-Group-res,
.res-Group {
  background: #ecf0f4;
  padding: 14px;
  padding-top: 15px;
  margin: -10px -10px 0 -10px;
  border-bottom: 1px solid #ccc;
}
.res-Group {
  margin-top: -5px;
}
.Inps-res,
.res-Inps {
  width: 100%;
  height: 100%;
  padding-top: 7px;
  font-size: 13px;
  background: #fff;
}
.res-num {
  width: 100%;
  height: 60px;
  line-height: 60px;
}
.res-num p {
  display: inline-block;
  width: 4%;
  text-align: left;
  margin-left: 0.5%;
}
.res-num-item {
  width: 80%;
  height: 100%;
  display: inline-block;
}
// .les {
//   margin-left: 5%;
// }
.res-num-item span {
  display: inline-block;
  margin-left: 5%;
}
.blu1,
.blu2 {
  color: #53a1f3;
  cursor: pointer;
}
.new-number {
  background: #ecf0f4;
  padding: 14px;
  margin: -14px -10px 0 -10px;
}
.new-num {
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #fff;
  font-size: 13px;
}
.info {
  width: 33%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 20%;
  font-size: 14px;
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
  line-height: 40px;
  font-size: 14px;
}
.info-type-inp span {
  margin-left: 1%;
  color: #53a1f3;
  cursor: pointer;
  text-decoration: underline;
}
.info-type div span {
  margin-left: 10%;
  color: #aaa;
}
.info-type div select {
  margin-left: 10%;
  width: 200px;
  height: 30px;
  line-height: 30px;
  color: #999;
}
.info-type .ivu-radio-group {
  margin-left: 5%;
}
.info-inp {
  margin-left: 5%;
}
.info-type button {
  margin-top: 2%;
  margin-left: 22%;
}
.info-type .info-red {
  width: 255px;
  color: red;
  font-weight: normal;
  font-size: 12px;
  line-height: 13px;
  margin-left: 24%;
  margin-top: 1%;
}
  </style>
