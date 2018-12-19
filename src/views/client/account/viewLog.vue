<template>
  <!-- <Modal v-model='showDlg' :transfer='false' :width='420'>
  </Modal> -->
  <div class="page"  :data="tableData">
    <div class="inps">
      <div class="Inps-res" v-if='nus'>
        <div class="res-num">
          <p>注册账号</p>
          <div class="res-num-item">
            <span>{{email}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【{{nus}}】</span>
          </div>
        </div>
        <div class="res-num">
          <p>所属公司</p>
          <div class="res-num-item">
            <span>{{companyName}} 【广告主：直客】【资源方：影院】</span>
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
      <div class="logs">
        <div class="logs-item">
          <span>2018/11/23</span>
          <span>10:22:12</span>由
          <span>老麦 </span>
          将资质审核状态修改为 “已通过”
        </div>
        <div class="logs-item">
          <span>2018/11/23</span>
          <span>10:22:12</span>由
          <span>老麦 </span>
          将资质审核状态修改为 “已通过”
        </div>
        <div class="logs-item">
          <span>2018/11/23</span>
          <span>10:22:12</span>由
          <span>老麦 </span>
          将资质审核状态修改为 “已通过”
        </div>
        <div class="logs-item">
          <span>2018/11/23</span>
          <span>10:22:12</span>由
          <span>老麦 </span>
          将资质审核状态修改为 “已通过”
        </div>
        <div class="logs-item">
          <span>2018/11/23</span>
          <span>10:22:12</span>由
          <span>老麦 </span>
          将资质审核状态修改为 “已通过”
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
import { queryList , queryItem , companysList } from '@/api/account'
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
  query = { ...defQuery }
  oldQuery: any = {}
  prelist: any = []
  list: any = []
  maincreateTime: any = ''
  mainlastLoginTime: any = ''
  // ids: any = ''


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
    const {nus , id , createTime , lastLoginTime , companyName , email } = this.$route.query
    this.createTime = moment(createTime).format(timeFormat)
    this.lastLoginTime = moment(lastLoginTime).format(timeFormat)
    this.companyName = companyName
    this.email = email
    this.nus = nus == '主账号' ? '主账号' : '子账号'
    this.ids = id

    this.doSearch()
  }


  async doSearch() {
    this.oldQuery = { ...this.query }

    const query = clean({ ...this.query })
    try {
      // const { data: {
      //   items: prelist,
      // } } = await queryList(query)
      // this.prelist = prelist
      // 获取公司信息
      const { data: {
        items: list,
      } } = await companysList(query)
      this.list = list
    } catch (ex) {
      // this.handleError(ex)
    } finally {
    }
  }

}
</script>

<style lang="less" scoped>
.inps {
  background: #ecf0f4;
  padding: 14px;
  padding-top: 19px;
  margin: -10px -10px 0 -10px;
}
.Inps-res {
  width: 100%;
  height: 100%;
  padding: 16px;
  background: #fff;
  font-size: 13px;
  margin-top: -5px;
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
.res-num-item span {
  display: inline-block;
  margin-left: 4%;
}
.log {
  background: #ecf0f4;
  padding: 14px;
  padding-top: 19px;
  margin: -14px -10px 0 -10px;
}
.logs {
  margin-top: -4px;
  padding: 16px;
  background: #fff;
}
.logs-item {
  line-height: 30px;
}
</style>
