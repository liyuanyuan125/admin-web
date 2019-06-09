<template>
  <div class='page'>
    <header>
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <Button v-if='$route.params.status != 12' class="bth" style='float: right' @click="close($route.params.id)">关闭订单</Button><br>
    </header>
    <div class='title'>基础信息</div>
    <div class='bos'>
      <Row>
        <Col :span='12'>计划名称&nbsp;：&nbsp;{{listitem.name}}</Col>
        <Col :span='12'>广告片&nbsp;：&nbsp;{{listitem.videoName == null ? '-' : listitem.videoName}}({{listitem.specification == null ? '-' : listitem.specification}}s)【{{listitem.customerName == null ? '-' : listitem.customerName}}】</Col>
      </Row>
      <Row>
        <Col :span='12'>投放排期&nbsp;：&nbsp;{{start}} ~ {{end}}</Col>
        <Col :span='12'>推广预算&nbsp;：&nbsp;{{listitem.budgetAmount}}元</Col>
      </Row>
      <Row>
        <Col :span='12'>覆盖城市&nbsp;：&nbsp;票仓城市Top20 | 一线城市 / <span v-if='listitem.cityCustom == 0'>查看城市列表</span></Col>
        <Col :span='12'>影院星级&nbsp;：&nbsp;5星</Col>
      </Row>
      <Row>
        <Col :span='12'>受众性别&nbsp;：&nbsp;男性为主</Col>
        <Col v-for='(item , index) in listitem.deliveryGroups' :key='index' :span='12'>受众年龄&nbsp;：&nbsp;<span v-for='(it) in tags[1].values' :key='item.key' v-if='item.text == it.key'>{{it.text}}</span></Col>
      </Row>
      <Row>
        <Col :span='12'>影片类型&nbsp;：&nbsp;悬疑 | 爱情 | 科幻</Col>
        <Col :span='12'></Col>
      </Row>
      <Row>
        <Col :span='12'>创建时间&nbsp;：&nbsp;{{applyTime}}</Col>
        <Col :span='12'>创建人&nbsp;：&nbsp;{{listitem.applyName}}</Col>
      </Row>
    </div>
    <div class='title'>投放影片(系统推荐 / 用户自选)</div>
    <div class='bos'>
      <Table :columns="itemcolumns" :data='films' border stripe disabled-hover size="small" class="table">
        <template v-if='$route.params.status == 0 || $route.params.status == 1 || $route.params.status == 2 ' slot="action" slot-scope="{row}" >
          <a  @click="deletefilm(row.movieId)">删除</a>
        </template>
     </Table>
     <div v-if='$route.params.status == 0 || $route.params.status == 1 || $route.params.status == 2 ' @click='addfilm()'>添加影片</div>
    </div>
    <!-- <div class='title'>投放影院(532家)
      <span style='float: right' @click='chgRes'>导出影院列表</span>
    </div> -->
    <!-- <div class='bos'> -->
      <!-- <Cinema :value="it.cinemaList"/> -->
      <Cinema  />
    <!-- </div> -->
    <div class='title'>备注</div>
    <div class='bos' >
      <Row v-if='(listitem.remarks == null)'>暂无备注</Row>
      <Row v-for='(it,index) in listitem.remarks' :key='index'>
          {{it.operationTime.split('T')[0] + ' ' + it.operationTime.split('T')[1].split('.')[0]}} 
          {{it.operationEmail}}【{{it.operationName}}】 
          {{it.remarks}}
    </Row>
      <Form ref="databeizhu" :model="databeizhu" label-position="left"  :label-width="50">
        <FormItem label="备注" prop="closeReason">
          <Input type='textarea' v-model="databeizhu.remarks"></Input>
        </FormItem>
        <Button style='margin-left: 49%;' type="primary" @click="dataFormSubmit">提交备注</Button>
    </Form>
    </div>
    <div class='title'>操作记录</div>
    <div class='bos'>
      <Row v-if='logList.length == 0'>暂无操作日志</Row>
      <!-- <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row>
      <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row>
      <Row>2019/02/11 12:21:22  zhiping.zhao@aiads.com【老麦】 已联系资源方，天街物业暂时不接单，需要更换资源方</Row> -->
    </div>
    <div style='padding: 20px 0 30px 0'>
        <Form ref="dataplan" :model="dataplan" label-position="left" :label-width="100">
          <Col :span='11'>预估曝光人次【{{listitem.estimatePersonCount}}】预估曝光场次【{{listitem.estimateShowCount}}】预估花费【{{listitem.estimateCostAmount}}】</Col>
          <Col :span='5'>
            <FormItem label="应收金额" prop="closeReason">
              <Input style="width:100px" v-model="dataplan.money"></Input>
            </FormItem>
          </Col>
          <Col :span='7'>
              <Button type="primary" @click="save()">保存并发送方案至广告主</Button>
            <Button style='margin-left: 30px;' @click="back">取消</Button>
          </Col>
      </Form>
    </div>
    <close  ref="over"   v-if="overVisible" @done="dlgEditDone"/>
    <addfilm  ref="adds" v-if='addVisible' @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { itemlist , delfilm , beizhu  , closeid , save  } from '@/api/beforeplan'
import { toMap } from '@/fn/array'
import moment from 'moment'
import close from './closeorder.vue'
import AreaSelect from '@/components/areaSelect'
import { warning , success, toast , info } from '@/ui/modal'
import { slice , clean } from '@/fn/object'
import Cinema from './cinema.vue'
import addfilm from './addfilm.vue'
import { confirm } from '@/ui/modal'


import {
  queryList
} from '@/api/orderkol'
import EditDialog, { Field } from '@/components/editDialog'

const timeFormat = 'YYYY-MM-DD'



@Component({
  components: {
    close,
    AreaSelect,
    Cinema,
    addfilm
  }
})
export default class Main extends ViewBase {
  overVisible = false
  addOrUpdateVisible = false
  addVisible = false
  query: any = {
    pageIndex: 1,
    pageSize: 10,
    name: '',
    provinceId: 0,
    cityId: 0,
    countyId: 0,
    resourceCompanyId: 0,
  }
  databeizhu: any = {
    remarks : ''
  }
  dataplan: any = {
    money : ''
  }
  loading = false
  area: any = []
  list = []
  total = 0
  cinemaArray: any = []


  listitem: any = []
  start: any = ''
  end: any = ''
  logList: any = []
  // 影片
  films: any = []
  // 星级
  cinemaGradeList: any = []
  // 城市
  deliveryCityTypeList: any = []
  // 电影类型
  tags: any = []

  // 申请人
  applyTime: any = ''
  // 备注
  remarks: any = []

  // 投放影片
  itemlist: any = []
  get itemcolumns() {
    const data: any = [
      { title: '影片名称', key: 'movieName', align: 'center' },
      {
        title: '上映日期',
        key: 'beginDate',
        align: 'center',
        render: (hh: any, { row: { beginDate } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const html = moment(beginDate).format(timeFormat)
          return <span class='datetime' v-html={html}></span>
          /* tslint:enable */
        }
      },
      {
        title: '投放排期',
        key: 'beginDate',
        align: 'center',
        render: (hh: any, { row: { beginDate , endDate } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const html = moment(beginDate).format(timeFormat)
          const html2 = moment(endDate).format(timeFormat)
          return <span class='datetime' >{html} ~ {html2}</span>
          /* tslint:enable */
        }
      },
    ]
    const opernation = [
       {
        title: '操作',
        key: 'status',
        align: 'center',
        width: 80,
        slot: 'action'
      }
    ]
    return this.$route.params.status == '0' || this.$route.params.status == '1' ||
    this.$route.params.status == '2' ? [...data, ...opernation] : data
  }
  // itemcolumns = [
  //   { title: '影片名称', key: 'movieName', align: 'center' },
  //   {
  //     title: '上映日期',
  //     key: 'beginDate',
  //     align: 'center',
  //     render: (hh: any, { row: { beginDate } }: any) => {
  //       /* tslint:disable */
  //       const h = jsxReactToVue(hh)
  //       const html = moment(beginDate).format(timeFormat)
  //       return <span class='datetime' v-html={html}></span>
  //       /* tslint:enable */
  //     }
  //   },
  //   {
  //     title: '投放排期',
  //     key: 'beginDate',
  //     align: 'center',
  //     render: (hh: any, { row: { beginDate , endDate } }: any) => {
  //       /* tslint:disable */
  //       const h = jsxReactToVue(hh)
  //       const html = moment(beginDate).format(timeFormat)
  //       const html2 = moment(endDate).format(timeFormat)
  //       return <span class='datetime' >{html} ~ {html2}</span>
  //       /* tslint:enable */
  //     }
  //   },
  //   {
  //     title: '操作',
  //     slot: 'action',
  //     align: 'center',
  //   }
  // ]
  mounted() {
    this.search()
  }


  dlgEditDone() {
    // this.doSearch()
  }

  // 返回上一页 && 接单取消按钮
  back() {
    this.$router.go(-1)
  }
  // 关闭订单
  // edit(id: any) {
  //   this.overVisible = true
  //   this.$nextTick(() => {
  //     const myThis: any = this
  //     myThis.$refs.over.init(id)
  //   })
  // }

  // 关闭订单
  addfilm() {
    this.addVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.adds.init()
    })
  }

  async close(id: any) {
    try {
      await confirm('您确定关闭当前订单吗？')
      await closeid(this.$route.params.id)
      this.$Message.success({
        content: `关闭成功`,
      })
      this.$router.go(-1)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 修改资源方
  chgRes(id: any) {
  }


  async search() {
    try {
        // 订单列表
      const { data } = await itemlist(this.$route.params.id)
      this.listitem = data.item
      this.start = moment(this.listitem.beginDate).format(timeFormat)
      this.end = moment(this.listitem.endDate).format(timeFormat)
      this.applyTime = this.listitem.applyTime.split('T')[0]
      + ' ' + this.listitem.applyTime.split('T')[1].split('.')[0]
      // this.remarks = this.listitem.remarks || []
      this.logList = data.logList
      this.films = data.item.deliveryMovies
      this.cinemaGradeList = data.cinemaGradeList
      this.deliveryCityTypeList = data.deliveryCityTypeList
      this.tags = data.tags
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  // 删除影片
  async deletefilm(id: any) {
    try {
      await confirm('您确定删除当前影片信息吗？')
      await delfilm(this.$route.params.id , {movieIds : [id]})
      this.$Message.success({
        content: `删除成功`,
      })
      this.$router.go(0)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 备注提交
  async dataFormSubmit(dataForms: any) {
    const valid = await (this.$refs.databeizhu as any).validate()
    if (!valid) {
      return
    }
    try {
      const res = await beizhu (this.$route.params.id, this.databeizhu)
      toast('成功')
      this.$router.go(0)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 保存方案
  async save() {
    try {
      const res = await save (this.$route.params.id)
      this.$router.go(-1)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.query.pageIndex = val
    this.search()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.query.pageSize = val
    this.search()
  }


}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.page {
  line-height: 40px;
  font-size: 14px;
}
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
.title {
  font-size: 16px;
  color: @c-base;
  line-height: 50px;
}
.bos {
  border: 1px solid #ccc;
  padding: 15px;
}
.row-li {
  line-height: 40px;
  font-size: 14px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
.table {
  margin-top: 16px;
  /deep/ .status-2 {
    color: #19be6b;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
