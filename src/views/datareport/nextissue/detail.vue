<template>
  <div class="page">
    <div class="Inp-Group-res">
      <Button class="bth" icon="md-return-left" @click="goback">返回列表</Button>
      <div class="n-main">订单信息</div>
      <div class="Inps-res">
        <Row class='row-list'>
            <Col span='3' class='hui'>广告计划ID</Col>
            <Col span='9'>663</Col>
            <Col span='3' class='hui'>广告计划状态</Col>
            <!-- <Col span='9'><span v-for='it in statusList' :key='it.key' v-if='it.key == item.status'>{{it.text}}</span></Col> -->
        </Row>
        <Row class='row-list'>
            <Col span='3' class='hui'>广告主名称</Col>
            <Col span='9'>北京京西文化旅游股份有限公司</Col>
            <Col span='3' class='hui'>广告计划名称</Col>
            <Col span='9'>跳舞吧大象</Col>
        </Row>
        <Row class='row-list'>
            <Col span='3' class='hui'>投放时间</Col>
            <Col span='9'>{{begin}} ~ {{end}} 【{{item.cycle}}天】</Col>
        </Row>
      </div>
      <div class="n-main">影院列表</div>
      <div class="Inps-res">
        <Row class='row-list pb20'>
            <Col span='24'>
              <singleCinema  @dlgEditDone="dlgEditDone"/>
            </Col>
        </Row>
      </div>
    </div>
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
import singleCinema from './singleCinema.vue'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'
const timeFormats = 'YYYY-MM-DD'



const defQuery = {
    pageIndex: 1,
    pageSize: 10
}

@Component({
  components: {
    singleCinema
  }
})
export default class Main extends ViewBase {
  // change = false

  query = { ...defQuery }
  oldQuery: any = {}

  loading = false
  addOrUpdateVisible = false

  cinemasList: any = []
  item: any = []
  logList: any = []
  statusList: any = []
  advertTypeCodeList: any = []
  planDirectionList: any = []

  begin: any = ''
  end: any = ''
  createTime: any = ''
  settlementTime: any = ''
  settlementAmount: any = ''
  movieList: any = []

  // 广告片投放位置
  deliveryPositionList: any = []

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
          statusList,
          advertTypeCodeList,
          planDirectionList,
          deliveryPositionCodeList
      } } = await queryItem(this.$route.params.id)
      this.item = item
      const a = String(this.item.beginDate)
      const b = String(this.item.endDate)
      this.begin = a.slice(0, 4) + '-' + a.slice(4, 6) + '-' + a.slice(6, 8)
      this.end = b.slice(0, 4) + '-' + b.slice(4, 6) + '-' + b.slice(6, 8)
      this.createTime = this.item.receiveTime == 0 ? '暂无接单时间' :
      moment(this.item.receiveTime).format(timeFormat)
      this.settlementTime = moment(this.item.settlementTime).format(timeFormat)
      this.settlementAmount = this.addNumber(String(this.item.settlementAmount))
      this.deliveryPositionList = deliveryPositionCodeList
      this.movieList = this.item.targetMovies
      this.logList = (item.logList || []).map((it: any) => {
          return {
              ...it,
              createTime: moment(it.createTime).format(timeFormat)
          }
      })
      this.cinemasList = item.cinemas || []
      this.statusList = statusList
      this.advertTypeCodeList = advertTypeCodeList
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
