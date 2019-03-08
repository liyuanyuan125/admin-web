<template>
  <div class="page"  :data="tableData">
    <div class="inps">
      <Button class="bth" icon="md-return-left" @click="goback">返回上一页</Button>
      <div class="n-main">{{nus}}详情</div>
      <div class="Inps-res" v-if='nus'>
        <div class="res-num">
          <p>注册账号</p>
          <div class="res-num-item">
            <span>{{email}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【{{nus}}】</span>
          </div>
        </div>
        <div class="res-num">
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名</p>
          <div class="res-num-item">
            <span>{{name}}</span>
            <span v-if='!name'>暂无</span>
            <span style="margin-left:8%;" class="res-date">手机号</span>
            <span style="margin-left:2%;">{{mobile}}</span>
            <span v-if='!mobile'>暂无</span>
          </div>
        </div>
        <div class="res-num">
          <p>所属公司</p>
          <!-- <span class="coms">{{companyName}}</span> -->
          <div class="res-num-item">
            <tooltip style="margin-left: 3%;height:60px;margin-right: 2%;" :content="companyName" placement="top">
              <span class="company-name">{{companyName}}</span>
            </tooltip>
            <div class="res-num" v-for="it in list" v-if="it.id==companyId" :key="it.id">
              <div class="item-lis" v-for="ity in it.types" :key="ity.typeCode">
                <span v-for="its in customerTypeList" v-if="its.typeCode==ity.typeCode" :key='its.typeCode'>
                  <em v-for="itname in its.typeCategoryList" v-if="itname.typeCode==ity.typeCategoryCode" :key='itname.typeCode'>【{{its.typeName}}：{{itname.typeName}}】</em>
                </span>
              </div>
            </div>
          </div>
          <!-- <tooltip style="margin-left: 3%;height:60px;" :content="companyName" placement="top">
            <span class="company-name">{{companyName}}</span>
          </tooltip>
          <div  class="res-num" v-for="it in list" v-if="it.id==companyId" :key="it.id">
            <div class="item-lis" v-for="ity in it.types" :key="ity.typeCode">
              <span v-for="its in customerTypeList" v-if="its.typeCode==ity.typeCode" :key='its.typeCode'>
                <em v-for="itname in its.typeCategoryList" v-if="itname.typeCode==ity.typeCategoryCode" :key='itname.typeCode'>【{{its.typeName}}：{{itname.typeName}}】</em>
              </span>
            </div>
          </div> -->
        </div>
        <div class="res-num">
          <p>注册时间</p>
          <div class="res-num-item">
            <span>{{createTime}}</span>
            <span style="margin-left:8%;" class="res-date">最后登录时间</span>
            <span style="margin-left:2%;">{{lastLoginTime}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="log">
      <div class="n-main">{{nus}}操作日志</div>
      <div class="logs">
        <div class="logs-item" v-for="(it,index) in datalog">

          <span>{{it.createTime}}   </span>
          <span>{{it.operatorName}}   </span>
          {{it.operateDesc}}
        </div>
        <div v-if='datalog.length == 0' class="logs">暂无操作日志</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
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
export default class Main extends ViewBase {
  showDlg = false
  createTime: any = ''
  lastLoginTime: any = ''
  companyName: any = ''
  email: any = ''
  nus: any = ''
  ids: any = ''
  companyId: any = ''
  name: any = ''
  mobile: any = ''
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
    const {nus , id , createTime , lastLoginTime , companyName , email , companyId , name , mobile } = this.$route.query
    this.createTime = moment(createTime).format(timeFormat)
    this.lastLoginTime = moment(lastLoginTime).format(timeFormat)
    this.companyName = companyName
    this.email = email
    this.nus = nus == '主账号' ? '主账号' : '子账号'
    this.ids = id
    this.companyId = companyId
    this.name = name
    this.mobile = mobile

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
  display: flex;
  width: 100%;
  line-height: 60px;
}
.res-num p {
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  display: block;
  float: left;
  max-height: 60px;
  text-align: left;
  margin-left: 0.5%;
  // white-space: nowrap;
  // text-overflow: ellipsis;
}
.res-num-item {
  display: flex;
  width: 80%;
  height: 100%;
  // display: inline-block;
}
.company-name {
  // flex-direction: column-reverse;
  // flex-wrap: nowrap;
  // justify-content: flex-start;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.res-num-item .item-lis {
  flex-direction: column-reverse;
  flex-wrap: nowrap;
  justify-content: flex-start;
  display: inline-block;
  // width: 11%;
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
