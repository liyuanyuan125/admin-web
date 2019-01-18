<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>计划管理 - 计划详情</em>
      </div>
    </header>

    <div class="detail-box">
      <div class='titop'>基础信息</div>
      <div class="detail-header">
        <Row>
          <Row>
            <Col span="2"><div>计划名称</div></Col>
            <Col span="8"><span>{{detail.name}}</span></Col>
            <Col span="2"><div>计划ID</div></Col>
            <Col span="8"><span>{{detail.calendarId}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>投放排期</div></Col>
            <Col span="8"><span>{{format.time}}</span><span v-if="detail.calendarName" class="bg-red">含：{{detail.calendarName}}</span></Col>
            <Col span="2"><div>投放周期</div></Col>
            <Col span="8"><span>{{format.cycle}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>广告片</div></Col>
            <Col span="8">
              <router-link v-if="detail.videoName" :to="{name: 'ggtising-plan-cinema', params: {id: detail.id}}">
                <span style="color: #2d8cf0" v-if="detail.videoId">{{format.videoId}}</span> <span style="color: #2d8cf0">{{detail.videoName}}</span>
              </router-link>
              <span v-else></span>
            </Col>
            <Col span="2"><div>规格/时长</div></Col>
            <Col span="8"><span>{{format.specification}}</span>/<span>{{format.length}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>投放类型</div></Col>
            <Col span="8"><span>{{format.typeText}}</span></Col>
            <Col span="2"><div>预算/曝光</div></Col>
            <Col span="8"><span>{{format.bfMoney}}</span> / <span>{{format.afMoney}}</span> </Col>
          </Row>
          <Row>
            <Col span="2"><div>定向类型</div></Col>
            <Col span="8"><span>{{format.directext}}</span></Col>
            <Col span="2"><div>投放方案</div></Col>
            <Col span="8"><span>{{format.dirtext}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>客户</div></Col>
            <Col span="8"><span>{{detail.customerName}}</span></Col>
            <Col span="2"><div>创建时间</div></Col>
            <Col span="8"><span>{{format.applyTime}}</span></Col>
          </Row>
        </Row>
      </div>

      <div class='titop'>投放影院</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>分布统计</div></Col>
          <Col span="8">
            <ul>
              <li><span>区域</span><span>{{format.areaCount}}</span>;</li>
              <li><span>省份</span><span>{{format.provinceCount}}</span>;</li>
              <li><span>城市</span><span>{{format.cityCount}}</span>;</li>
              <li><span>影院</span><span>{{format.cinemasCount}}</span>;</li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col span="2"><div>影院列表</div></Col>
          <Col span="20">
            <Row>
              <Table :columns="columns" :data="format.cinemaList"
              border stripe disabled-hover size="small" class="table"></Table>
            </Row>
          </Col>
        </Row>
      </Row>

      <div class='titop'>投放人群</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>观影人群性别</div></Col>
          <Col span="8">
            <span>
              <i v-if="item.tagTypeCode == 'PLAN_GROUP_SEX'" v-for="(item, index) in format.deliveryGroups" :key="index">{{item.text}}</i>
            </span>
          </Col>
          <Col span="2"><div>观影人群年龄</div></Col>
          <Col span="8">
            <span>
              <i v-if="item.tagTypeCode == 'PLAN_GROUP_AGE'" v-for="(item, index) in format.deliveryGroups" :key="index">{{item.text}}</i>
            </span>
          </Col>
        </Row>
        <Row>
          <Col span="2"><div>观影人群偏好</div></Col>
          <Col span="8">
            <span>
             <i v-if="item.tagTypeCode == 'MOVIE_TYPE'" v-for="(item, index) in format.deliveryGroups" :key="index">{{item.text}}</i>
            </span>
          </Col>
        </Row>
      </Row>

      <div class='titop'>投放影片({{format.movieList.length}})</div>
      <Row class="detail-content">
        <Row v-if="format.movieList.length > 0">
          <Col v-for="(item, index) in format.movieList" :span="10" :key="index">
            <span>《{{item.name}}》{{(item.typeCode || []).join(',')}} {{auto(item.openTime + '')}}</span>
          </Col>
        </Row>
        <Row v-else>
          <Col>
            <span></span>
          </Col>
        </Row>
      </Row>
      <Row>
      </Row>

      <div class='titop'>操作记录</div>
      <Row class="detail-content">
        <Row v-if="format.logList > 0">
          <Col v-for="(item, index) in format.logList" :key="index">

          </Col>
        </Row>
        <Row v-else>
          <Col>
            <span></span>
          </Col>
        </Row>
      </Row>
    </div>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch , Mixins  } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryList , queryId , zuofei } from '@/api/list'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice , clean } from '@/fn/object'
import { queryDetail } from '@/api/ggplan'
import { formatCurrency } from '@/fn/string'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const cinemaMap = (list: any[]) => toMap(list, 'tagTypeCode', 'text')

const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

const defQuery = {
}

const dataForm = {
  refuseReason: '',
  approveStatus: 2
}

@Component
export default class Main extends ViewBase {
  detail: any = {}

  mounted() {
    this.doSearch()
  }

  get cachedMap() {
    return {
      typeList: makeMap(this.detail.typeList),
      directext: makeMap(this.detail.deliveryTypeList),
      dirtext: makeMap(this.detail.directionTypeList)
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    // const attachments = (this.detail || []).map((it: any) => {
    //   return {
    //     ...it,
    //   }
    // })
    return []
  }

  get format() {
    const scheme = ['', '方案一', '方案二', '方案三', '方案四']
    const cachedMap = this.cachedMap
    const detail = this.detail
    const start = moment(detail.beginDate).format(timeFormat)
    const end = moment(detail.endDate).format(timeFormat)

    return {
      time: start ? `${start}~${end}` : '',
      cycle: detail.cycle ? detail.cycle + '天' : '',
      specification: detail.specification ? detail.specification + 's' : '',
      length: detail.videoLength ? detail.videoLength + 's' : '',
      typeText: detail.deliveryType ? cachedMap.typeList[detail.deliveryType] : '',
      bfMoney: detail.budgetAmount ? formatCurrency(detail.budgetAmount * 10000) : '',
      afMoney: detail.budgetAmount ? detail.budgetAmount + '万' : '',
      directext: detail.deliveryType ? cachedMap.directext[detail.deliveryType] : '',
      dirtext: detail.directionType ?
      `${scheme[detail.directionType]} [ ${cachedMap.dirtext[detail.directionType]} ]` : '',
      applyTime: detail.applyTime ? moment(detail.applyTime).format(timeFormat) : '',
      areaCount: detail.areaCount ? `[ ${detail.areaCount} ]` : '',
      provinceCount: detail.provinceCount ? `[ ${detail.provinceCount} ]` : '',
      cityCount: detail.cityCount ? `[ ${detail.cityCount} ]` : '',
      cinemasCount: detail.cinemasCount ? `[ ${detail.cinemasCount} ]` : '',
      videoId: detail.videoId ? `[ ${detail.videoId} ]` : '',
      deliveryGroups: detail.deliveryGroups || [],
      movieList: detail.movieList || [],
      logList: (detail.logList || []).slice(0, 20),
      cinemaList: detail.cinemaList || []
    }
  }

  get columns() {
    return [
      { title: '影院名称', key: 'shortName', align: 'center' },
      { title: '专资ID', key: 'code', align: 'center' },
      {
        title: '总座位数',
        key: 'seatCount',
        align: 'center',
      },
      { title: '定价等级', key: 'pricingLevelName', align: 'center' },
      {
        title: '影院等级',
        key: 'gradeCodeName',
        align: 'center',
      },
      { title: '所在区/县', key: 'countyName', align: 'center' },
      { title: '城市', key: 'cityName', align: 'center' },
      { title: '省份', key: 'provinceName', align: 'center' },
      { title: '区域', key: 'areaName', align: 'center' },
    ]
  }

  async doSearch() {
     (this.$Spin as any).show()
    try {
      const { data } = await queryDetail(this.$route.params.id)
      this.detail = data
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 1000)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    } finally {
    }
  }

  auto(num: any) {
    if (!num) {
      return ''
    }
    const year = num.slice(0, 4)
    const month = num.slice(4, 6)
    const day = num.slice(6)
    return `${year}-${month}-${day}`
  }

  // 返回
  back() {
    this.$router.go(-1)
  }

  // 编辑列表页面
  goSet() {
    const id = this.$route.params.id
    this.$router.replace({ name: 'contract-list-edit', params: { id }} )
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}
.detail-number {
  /deep/ .btn-add {
    margin-left: 8px;
    line-height: 50px;
  }
}
.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #19be6b;
  }
  /deep/ .row-hidden {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
.btn-back {
  margin-right: 10px;
}
.detail-check {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding: 10px;
  padding-left: 14px;
}
.detail-header, .detail-content, .detail-footer, .detail-number {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
      width: 88px;
    }
  }
  .red {
    color: red;
  }
  .bg-red {
    display: inline-block;
    margin-left: 10px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    color: #fff;
    background-color: red;
  }
  ul {
    list-style: none;
    li {
      float: left;
      margin-right: 10px;
      span {
        margin-right: 8px;
      }
    }
  }
  span {
    display: inline-block;
    line-height: 50px;
    color: #717975;
  }
  span:empty {
    &::before {
      content: '暂无';
    }
  }
  /deep/ .cinema-button {
    margin-bottom: 20px;
  }
}
.check-select-group {
  display: inline-flex;
  width: 90%;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding-left: 8px;
  overflow: hidden;
  /deep/ .ivu-select {
    .ivu-select-placeholder,
    .ivu-select-selected-value {
      position: relative;
      top: 1px;
    }
    .ivu-select-selection {
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }
}
.upload {
  padding-bottom: 40px;
  /deep/ .uplaod-slot {
    margin-bottom: 10px;
    color: #19be6b;
  }
}
.detail-edit {
  text-align: center;
  padding-bottom: 20px;
  .btn-set {
    width: 100px;
    margin: 0 10px;
  }
}
.typeBox {
  position: relative;
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  background: #ecf0f4;
  color: #717975;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    width: 50px;
    text-align: center;
    color: #717975;
    line-height: 20px;
    background: #dcdee2;
  }
  .red {
    color: red;
  }
}
.upload-wrap {
  background-color: #ecf0f4;
  padding-bottom: 6px;
  margin-top: 6px;
}
.upload-info {
  line-height: 18px;
  padding: 10px 0 0 8px;
  margin-bottom: 6px;
}
.show-img {
  width: 120px;
  height: 80px;
  margin: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
</style>
