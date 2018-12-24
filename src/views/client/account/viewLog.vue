<template>
  <div class="page"  :data="tableData">
    <div class="inps">
      <Button class="bth" icon="md-return-left" @click="goback">返回列表详情</Button>
      <div class="n-main">{{nus}}详情</div>
      <div class="Inps-res" v-if='nus'>
        <div class="res-num">
          <p>注册账号</p>
          <div class="res-num-item">
            <span>{{email}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【{{nus}}】</span>
          </div>
        </div>
        <div class="res-num">
          <p>所属公司</p>
          <span class="coms">{{companyName}}</span>
          <div class="res-num-item" v-for="it in list" v-if="it.id==companyId">
            <div class="item-lis" v-for="ity in it.types">
              <span v-for="its in customerTypeList" v-if="its.typeCode==ity.typeCode">
                <em v-for="itname in its.typeCategoryList" v-if="itname.typeCode==ity.typeCategoryCode">【{{its.typeName}}：{{itname.typeName}}】</em>
              </span>
            </div>
          </div>
        </div>
        <div class="res-num">
          <p>注册时间</p>
          <div class="res-num-item">
            <span>{{createTime}}</span>
            <span style="margin-left:8%;" class="res-date">最后登陆时间</span>
            <span style="margin-left:2%;">{{lastLoginTime}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="log">
      <div class="n-main">{{nus}}操作日志</div>
      <div class="logs">
        <div class="logs-item" v-for="(it,index) in datalog">

          <span>{{it.createTime}}   </span>由
          <span>{{it.operatorName}}   </span>
          {{it.operateDesc}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import View from '@/util/View'
import { get } from '@/fn/ajax'
import { queryList , queryItem , companysList , loglist } from '@/api/account'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice , clean } from '@/fn/object'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const defQuery = {
  id: '',
}

@Component
export default class Main extends View {
  showDlg = false
  createTime: any = ''
  lastLoginTime: any = ''
  companyName: any = ''
  email: any = ''
  nus: any = ''
  ids: any = ''
  companyId: any = ''
  query = { ...defQuery }
  oldQuery: any = {}
  prelist: any = []
  list: any = []
  customerTypeList: any = []
  maincreateTime: any = ''
  mainlastLoginTime: any = ''

  datalog: any = []
  datalogcreatetime: any = []

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
    const {nus , id , createTime , lastLoginTime , companyName , email , companyId } = this.$route.query
    this.createTime = moment(createTime).format(timeFormat)
    this.lastLoginTime = moment(lastLoginTime).format(timeFormat)
    this.companyName = companyName
    this.email = email
    this.nus = nus == '主账号' ? '主账号' : '子账号'
    this.ids = id
    this.companyId = companyId

    this.doSearch()

  }

  goback() {
    this.$router.go(-1)
  }

  async doSearch() {
    this.oldQuery = { ...this.query }

    const query = clean({ ...this.query })
    try {
      // 获取公司信息
      const { data: {
        items: list,
        customerTypeList: customerTypeList
      } } = await companysList(query)
      this.list = list
      this.customerTypeList = customerTypeList

      // 查看日志
      // console.log(this.$route.params.id)
      const { data } = await loglist(this.$route.params.id)
       this.datalog = data.map((item: any) => {
        return {
          ...item,
          createTime: moment(item.createTime).format(timeFormat)
        }
      })
    } catch (ex) {
      // this.handleError(ex)
    } finally {
    }
  }

}
</script>

<style lang="less" scoped>
.inps {
  // background: #ecf0f4;
  padding: 10px;
  padding-top: 19px;
  margin: -10px -10px 0 -10px;
}
.Inps-res {
  width: 100%;
  height: 100%;
  background: #fff;
  font-size: 13px;
  margin-top: -5px;
  border: 1px solid #dcdee2;
}
.res-num {
  width: 100%;
  line-height: 60px;
}
.res-num p {
  display: block;
  float: left;
  width: 4%;
  max-height: 60px;
  overflow: hidden;
  text-align: left;
  margin-left: 0.5%;
}
.res-num-item {
  width: 80%;
  height: 100%;
  display: inline-block;
}
.coms {
  margin-left: 3%;
}
.res-num-item .item-lis {
  display: inline-block;
  width: 11%;
}
.res-num-item span {
  display: inline-block;
  margin-left: 4%;
}
.res-num-item .item-lis span {
  display: block;
  width: 100%;
  text-align: center;
}
.res-num-item .item-lis span em {
  font-style: normal;
}
.log {
  // background: #ecf0f4;
  padding: 10px;
  padding-top: 19px;
  margin: -14px -10px 0 -10px;
}
.logs {
  margin-top: -4px;
  padding: 16px;
  background: #fff;
  border: 1px solid #dcdee2;
}
.logs-item {
  line-height: 30px;
}
.n-main {
  display: inline-block;
  margin: -5px 0 8px 5px;
  line-height: 38px;
  font-size: 16px;
  color: #2d8cf0;
  // border-bottom: 2px solid #ecf0f4;
}
</style>
