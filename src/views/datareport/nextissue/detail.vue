<template>
  <div class="page">
    <div class="Inp-Group-res">
      <Button class="bth" icon="md-return-left" @click="goback">返回列表</Button>
      <div class="n-main">订单信息</div>
      <div class="Inps-res">
        <Row class='row-list'>
            <Col span='3' class='hui'>广告计划ID</Col>
            <Col span='9'>{{item.planId == null ? '暂无' : item.planId}}</Col>
            <Col span='3' class='hui'>广告计划状态</Col>
            <Col span='9'>
              <span v-if='item.planStatus == null'>-</span>
              <span v-else v-for='it in planStatusList' :key='it.key' v-if='it.key == item.planStatus'>{{it.text}}</span>
            </Col>
        </Row>
        <Row class='row-list'>
            <Col span='3' class='hui'>广告主名称</Col>
            <Col span='9'>{{item.companyName == null ? '暂无' : item.companyName}}</Col>
            <Col span='3' class='hui'>广告计划名称</Col>
            <Col span='9'>{{item.planName == null ? '暂无' : item.planName}}</Col>
        </Row>
        <Row class='row-list'>
            <Col span='3' class='hui'>投放时间</Col>
            <Col span='9'>{{beginDate}} ~ {{endDate}} 【{{item.cycle}}天】</Col>
        </Row>
      </div>
      <div class="n-main">
        <span style='display: inline-block;'>影院列表</span>
        <span style='display: inline-block;float: right'>数据更新时间：&nbsp;&nbsp; {{updateTime}}</span>
      </div>
      <div class="Inps-res">
        <Row class='row-list pb20'>
            <Col span='24'>
              <singleCinema v-if='showCinema' :pricingLevelList='pricingLevelList' :planId='item.planId' @dlgEditDone="dlgEditDone"/>
            </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import {nextItem } from '@/api/dataReport'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice , clean } from '@/fn/object'
import { buildUrl, prettyQuery, urlParam } from '@/fn/url'
import singleCinema from './singleCinema.vue'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
    singleCinema
  }
})
export default class Main extends Mixins(ViewBase, UrlManager)  {

  item: any = {}

  planStatusList: any = []
  pricingLevelList: any = []
  // 默认影城
  defaultCinema: any = []

  beginDate: any = null
  endDate: any = null
  updateTime: any = null
  showCinema: any = false

  // 默认总计数量
  numberList: any = []


  mounted() {
    this.doSearch()
  }

  goback() {
    this.$router.push({ name: 'datareport-nextissue' })
  }

  async doSearch() {
    try {
      const { data: {
          item: item,
          cinemas: cinemas,
          planStatusList,
          pricingLevelList,
          sumBudgetPersonCount : sumBudgetPersonCount,
          sumBudgetShowCount : sumBudgetShowCount,
          sumPersonCount : sumPersonCount,
          sumShowCount : sumShowCount,
          sumTodayPersonCount : sumTodayPersonCount,
          sumTodayShowCount : sumTodayShowCount,
          sumTomorrowPersonCount : sumTomorrowPersonCount,
          sumTomorrowShowCount : sumTomorrowShowCount,
      } } = await nextItem(this.$route.params.id)
      this.item = item
      this.updateTime = item.updateTime == null ? '暂无' : moment(item.updateTime).format(timeFormat)
      this.beginDate = item.beginDate == null ? '暂无' : String(item.beginDate).slice(0, 4) +
      '-' + String(item.beginDate).slice(4, 6) + '-' + String(item.beginDate).slice(6, 8)
      this.endDate = item.endDate == null ? '暂无' : String(item.endDate).slice(0, 4) +
      '-' + String(item.endDate).slice(4, 6) + '-' + String(item.endDate).slice(6, 8)
      this.defaultCinema = cinemas == null ? [] : cinemas
      this.numberList = [{
              planId: this.item.planId,
              sumBudgetPersonCount,
              sumBudgetShowCount,
              sumPersonCount,
              sumShowCount,
              sumTodayPersonCount,
              sumTodayShowCount,
              sumTomorrowPersonCount,
              sumTomorrowShowCount,
            }]
      this.showCinema = true
      this.planStatusList = planStatusList
      this.pricingLevelList = pricingLevelList
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  dlgEditDone() {
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
  // display: inline-block;
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
.pb20 {
  padding-bottom: 20px;
}
/deep/ .ivu-form-item-content {
  margin-left: 0 !important;
}
.hui {
  color: #949494;
}
</style>
