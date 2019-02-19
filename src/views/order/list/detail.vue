<template>
  <div class="page">
    <div class="Inp-Group-res">
      <Button class="bth" icon="md-return-left" @click="goback">返回列表</Button>
      <Button v-if='$route.params.status != 4' class="bth" style='float: right' @click="edit($route.params.id)">关闭订单</Button><br>
      <div v-if='$route.params.status == 5' class="n-main">结算信息</div>
      <div v-if='$route.params.status == 5' class="Inps-res">
        <Row class='row-list'>
            <Col span='3' class='hui'>结算金额</Col>
            <Col span='9'>{{settlementAmount}} 元</Col>
            <Col span='3' class='hui'>操作时间/人</Col>
            <Col span='9'>{{settlementTime}} / {{item.settlementUserName}}</Col>
        </Row>
      </div>
      <div class="n-main">广告主信息</div>
      <div class="Inps-res">
        <Row class='row-list'>
            <Col span='3' class='hui'>订单编号</Col>
            <Col span='9'>{{item.id}}</Col>
            <Col span='3' class='hui'>订单状态</Col>
            <Col span='9'><span v-for='it in statusList' :key='it.key' v-if='it.key == item.status'>{{it.text}}</span></Col>
        </Row>
        <Row class='row-list'>
            <Col span='3' class='hui'>广告主</Col>
            <Col span='9'>【{{item.advertiserId}}】{{item.advertiserName}}</Col>
            <Col span='3' class='hui'>订单类型</Col>
            <Col span='9'><span v-for='it in planTypeList' :key='it.key' v-if='it.key == item.planType'>{{it.text}}单</span></Col>
        </Row>
        <Row class='row-list'>
            <Col span='3' class='hui'>广告计划</Col>
            <Col span='9'>【{{item.planId}}】{{item.planName}}</Col>
            <Col span='3' class='hui'>广告片</Col>
            <Col span='9'>【{{item.videoId}}】{{item.videoName}}</Col>
        </Row>
        <Row class='row-list'>
            <Col span='3' class='hui'>投放时间</Col>
            <Col span='9'>{{begin}} ~ {{end}} 【{{item.cycle}}天】</Col>
            <Col span='3' class='hui'>广告片规格/时长</Col>
            <Col span='9'>{{item.specification}}s/{{item.videoLength}}s</Col>
        </Row>
        <Row class='row-list'>
            <Col span='3' class='hui'>影片列表</Col>
            <Col span='20'><span v-for='(it,index) in item.movieList'>《{{it.name}}》</span><span v-if='this.movieList.length == 0'>暂无</span></Col>
        </Row>
      </div>
      <div class="n-main">资源方信息</div>
      <div class="Inps-res">
        <Row class='row-list'>
            <Col span='3' class='hui'>资源方</Col>
            <Col span='9'>【{{item.resourceId}}】{{item.resourceName}}</Col>
            <Col span='3' class='hui'>接单时间</Col>
            <Col span='9'>{{createTime}}</Col>
        </Row>
      </div>
      <div class="n-main">操作记录</div>
      <div class="Inps-res">
        <Row class='row-list' v-for='(it,index) in logList' :key='index'>
          <span>{{it.createTime}}   </span>
          <span>{{it.email}}   </span>
          {{it.description}}
        </Row>
        <Row v-if='this.logList.length == 0'  class='row-list'>
          暂无操作记录
        </Row>
      </div>
    </div>
    <close  ref="addOrUpdate"   @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { get } from '@/fn/ajax'
import {queryList , queryItem } from '@/api/orderSys'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice , clean } from '@/fn/object'
import close from './closeorder.vue'


const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
const timeFormats = 'YYYY-MM-DD'



const defQuery = {
    pageIndex: 1,
    pageSize: 10
}

@Component({
  components: {
    close
  }
})
export default class Main extends ViewBase {
  // change = false

  query = { ...defQuery }
  oldQuery: any = {}

  loading = false
  addOrUpdateVisible = false


  item: any = []
  logList: any = []
  statusList: any = []
  planTypeList: any = []
  planDirectionList: any = []

  begin: any = ''
  end: any = ''
  createTime: any = ''
  settlementTime: any = ''
  settlementAmount: any = ''
  movieList: any = []

  count = 0
  newend: any = ''

  addNumber(number: any) {
    this.newend = ''
    this.count = 0
    if (number.indexOf('.') == -1) {
      for (let i = number.length - 1; i >= 0; i--) {
        if (this.count % 3 == 0 && this.count != 0) {
          this.newend = number.charAt(i) + ',' + this.newend
        } else {
          this.newend = number.charAt(i) + this.newend
        }
        this.count++
      }
      number = this.newend + '.00' // 自动补小数点后两位
      return number
    } else {
      for (let i = number.indexOf('.') - 1; i >= 0; i--) {
        if (this.count % 3 == 0 && this.count != 0) {
          this.newend = number.charAt(i) + ',' + this.newend // 碰到3的倍数则加上“,”号
        } else {
          this.newend = number.charAt(i) + this.newend // 逐个字符相接起来
        }
        this.count++
      }
      number =
        this.newend + (number + '00').substr((number + '00').indexOf('.'), 3)
      return number
    }
  }

  mounted() {
    this.doSearch()
    this.begin = moment(this.item.beginDate).format(timeFormats)
    this.end = moment(this.item.endDate).format(timeFormats)
    this.createTime = moment(this.item.createTime).format(timeFormat)
    this.settlementTime = moment(this.item.settlementTime).format(timeFormat)
    this.settlementAmount = this.addNumber(String(this.item.settlementAmount))
  }



  search() {
    this.query.pageIndex = 1
  }

  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
  }

  goback() {
    this.$router.go(-1)
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
          item: item,
          logList,
          statusList,
          planTypeList,
          planDirectionList

      } } = await queryItem(this.$route.params.id)
      this.item = item
      this.settlementAmount = this.addNumber(String(this.item.settlementAmount))
      this.movieList = this.item.movieList
      this.logList = (logList || []).map((it: any) => {
          return {
              ...it,
              createTime: moment(it.createTime).format(timeFormat)
          }
      })
      this.statusList = statusList
      this.planTypeList = planTypeList
      this.planDirectionList = planDirectionList
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  edit(id: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id)
    })
  }

  dlgEditDone() {
    this.doSearch()
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
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Inp-Group-res {
  padding: 10px;
  padding-top: 15px;
  margin: -10px -10px 0 -10px;
}
.Inps-res {
  width: 100%;
  height: 100%;
  padding-top: 7px;
  font-size: 13px;
  background: #fff;
  border: 1px solid #dcdee2;
}
.n-main {
  display: inline-block;
  margin: 0 0 5px 5px;
  line-height: 35px;
  font-size: 16px;
  color: #2d8cf0;
  margin-top: 5px;
}
.row-list {
  line-height: 40px;
  padding-left: 20px;
}
.table {
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
/deep/ .ivu-form-item-content {
  margin-left: 0 !important;
}
.hui {
  color: #949494;
}
</style>
