<template>
  <div class='page'>
    <header>
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <Button v-if='$route.params.ifs == 1 && $route.params.status != 12 && $route.params.status != 9' class="bth" style='float: right' @click="close($route.params.id)">关闭订单</Button><br>
    </header>

    <div class='title'>广告信息</div>
    <div class='bos'>
      <Row>
        <Col :span='12'>计划名称&nbsp;：&nbsp;{{listitem.name == null ? '暂无' : listitem.name}}</Col>
        <Col :span='12'>广告片&nbsp;：&nbsp;{{listitem.videoName == null ? '-' : listitem.videoName}}({{listitem.specification == null ? '-' : listitem.specification}}s)【{{listitem.customerName == null ? '-' : listitem.customerName}}】</Col>
      </Row>
      <Row>
        <Col :span='12'>广告主公司名称&nbsp;：&nbsp;{{listitem.name == null ? '暂无' : listitem.name}}</Col>
        <Col :span='12'>广告类型&nbsp;：&nbsp;
          <span v-if='listitem.advertTypeCode == null'>暂无广告类型</span>
          <span v-else v-for='(item , index) in advertTypeList' :key='index' v-if='item.key == listitem.advertTypeCode'>
            {{item.text}}
          </span>
        </Col>
      </Row>
      <Row>
        <Col :span='12'>投放排期&nbsp;：&nbsp;{{listitem.beginDate == null ? '暂无' : start}} ~ {{listitem.endDate == null ? '暂无' : end}}</Col>
        <Col :span='12'>推广预算&nbsp;：&nbsp;{{formatNumber(listitem.budgetAmount)}}元</Col>
      </Row>
      <Row>
        <Col :span='12'>覆盖城市&nbsp;：&nbsp;
        <span v-if='listitem.deliveryCityTypes == null'>暂无城市类型</span>
        <span v-if='listitem.deliveryCityTypes != null' v-for='(item , index) in deliveryCityTypeList' :key='index'>
          <em v-for='(it,index) in listitem.deliveryCityTypes' :key='index' v-if='item.key == it'>{{item.text +' '}}</em>
        </span>&nbsp; | &nbsp;  <router-link 
            :to="{ name: 'order-beforeplan-detail-viewcity', params: { id : this.$route.params.id } }"
          >查看城市列表</router-link><span></span></Col>
        <!-- <Col :span='12'>覆盖城市&nbsp;：&nbsp;票仓城市Top20 | 一线城市 / <span v-if='listitem.cityCustom == 0'>查看城市列表</span></Col> -->
        <!-- <Col :span='12'>影院星级&nbsp;：&nbsp;<span v-if='listitem.cinemaGradeCodes != null' v-for='(item , index) in cinemaGradeList' :key='index'><em v-for='(it,index) in listitem.cinemaGradeCodes' :key='index' v-if='item.key == it'>{{item.text +' '}}</em></span><span v-if='listitem.cinemaGradeCodes == null'>暂无</span></Col> -->
        <Col :span='12' v-if='view'>影片类型&nbsp;：&nbsp;<span v-if='listitem.deliveryGroups != null' v-for='(item , index) in tags[0].values' :key='index'><em v-for='(it,index) in listitem.deliveryGroups' :key='index' v-if='item.key == it.text'>{{item.text +' '}}</em></span><span v-if='ifmovie'>暂无</span></Col>
      </Row>
      <Row>
        <Col :span='12' v-if='view'>受众性别(比例较多)&nbsp;：&nbsp;<span v-if='listitem.deliveryGroups != null' v-for='(item , index) in tags[2].values' :key='index'><em v-for='(it,index) in listitem.deliveryGroups' :key='index' v-if='item.key == it.text'>{{item.text +' '}}</em></span><span v-if='ifsex'>暂无</span></Col>
        <Col :span='12' v-if='view'>受众年龄&nbsp;：&nbsp;<span v-if='listitem.deliveryGroups != null' v-for='(item , index) in tags[1].values' :key='index'><em v-for='(it,index) in listitem.deliveryGroups' :key='index' v-if='item.key == it.text'>{{item.text +' '}}</em></span><span v-if='ifage'>暂无</span></Col>
      </Row>
    </div>

    <div class='title'>基础信息</div>
    <div class='bos'>
      <Row>
        <Col :span='12'>计划ID&nbsp;：&nbsp;{{listitem.id == null ? '暂无' : listitem.id}}</Col>
        <Col :span='12'>渠道&nbsp;：&nbsp;{{listitem.videoName == null ? '-' : listitem.videoName}}({{listitem.specification == null ? '-' : listitem.specification}}s)【{{listitem.customerName == null ? '-' : listitem.customerName}}】</Col>
      </Row>
      <Row>
        <Col :span='12'>计划状态&nbsp;：&nbsp;
          <span v-for='(item , index) in statusList' :key='index' v-if='item.key == listitem.status'>
            {{item.text}}
          </span>
        </Col>
        <Col :span='12'>支付成功时间&nbsp;：&nbsp;{{listitem.videoName == null ? '-' : listitem.videoName}}({{listitem.specification == null ? '-' : listitem.specification}}s)【{{listitem.customerName == null ? '-' : listitem.customerName}}】</Col>
      </Row>
      <Row>
        <Col :span='12'>创建时间&nbsp;：&nbsp;{{listitem.applyTime == null ? '暂无' : applyTime}}</Col>
        <Col :span='12'>支付方式&nbsp;：&nbsp;{{formatNumber(listitem.budgetAmount)}}元</Col>
      </Row>
      <Row>
        <Col :span='12'>创建人&nbsp;：&nbsp;{{listitem.applyName == null ? '暂无创建人' : listitem.applyName}}</Col>
        <Col :span='12'>审批状态&nbsp;：&nbsp;{{listitem.applyName == null ? '暂无创建人' : listitem.applyName}}</Col>
      </Row>
    </div>

    <div class='title'>投放影片(系统推荐 / 用户自选)</div>
    <div class='bos'>
      <Table :columns="itemcolumns" :data='films' border stripe disabled-hover size="small" class="table">
        <template v-if='$route.params.status == 2 || $route.params.status == 3 || $route.params.status == 4 || $route.params.status == 10' slot="action" slot-scope="{row}" >
          <a  @click="deletefilm(row.movieId)">删除</a>
        </template>
     </Table>
      <div style='cursor: pointer;' 
        v-if='$route.params.ifs == 1 && ($route.params.status == 2 || $route.params.status == 3 || $route.params.status == 4 || $route.params.status == 10)' 
        @click='addfilm(listitem.beginDate , listitem.endDate)'>
        添加影片
      </div>
    </div>

    <!-- 投放影院 -->
    <Cinema  @getcine="getcinemas" />

    <div class='title'>备注</div>
    <div class='bos' >
      <Row v-if='(listitem.remarks == null)'>暂无备注</Row>
      <Row v-if='listitem.remarks != null' v-for='(it,index) in remarks' :key='index'>
          {{it.operationTime}} 
          {{it.operationEmail}}【{{it.operationName}}】 
          {{it.remarks}}
    </Row>
      <Form v-if='$route.params.ifs == 1' ref="databeizhu" :model="databeizhu" label-position="left"  :label-width="50">
        <FormItem label="备注" prop="closeReason">
          <Input type='textarea' v-model="databeizhu.remarks"></Input>
        </FormItem>
        <Button style='margin-left: 49%;' type="primary" @click="dataFormSubmit">提交备注</Button>
    </Form>
    </div>

    <div class='title'>操作记录</div>
    <div class='bos'>
      <Row v-if='logList.length == 0'>暂无操作日志</Row>
      <Row  v-if='logList.length > 0' v-for='(it,index) in logList' :key='index'>
        <Row>{{it.createTime}}  {{it.createUserEmail}}【{{it.createUserName}}】 {{it.eventName}}{{it.description}}</Row>
      </Row>
    </div>

    <div class='title'>应收款项</div>
    <Row class='bos'>
      <Row>
        <Col :span='2'>设置折扣</Col>
        <Col :span='4'>
            <Input style="width:100px" 
              disabled 
              v-model="dataplan.discount">
            </Input>
        </Col>
      </Row>
      <Row>
        <Col :span='2'>定金</Col>
        <Col :span='4'>
            <Input style="width:100px" 
              disabled 
              v-model="dataplan.depositAmount">
            </Input>
        </Col>
      </Row>
      <Row v-if='$route.params.ifs == 0'>
        <Col :span='2'>应结金额</Col>
        <Col :span='3'>
            <Input style="width:100px" 
              :disabled='this.$route.params.ifs != 1 || (listitem.status != 9 && listitem.status != 10)' 
              v-model="dataplan.needPayAmount">
            </Input>
        </Col>
        <Col :span='10' v-if='listitem.totalCost && listitem.totalCost != null'>实际投放花费 ￥ ({{formatNumber(listitem.totalCost)}})</Col>
      </Row>
      <Row v-else-if='$route.params.status != 6 && $route.params.status != 7'>
        <Col :span='2'>应结金额</Col>
        <Col :span='3'>
            <Input style="width:100px" 
              :disabled='this.$route.params.ifs != 1 || (listitem.status != 9 && listitem.status != 10)' 
              v-model="dataplan.needPayAmount">
            </Input>
        </Col>
        <Col :span='10' v-if='listitem.totalCost && listitem.totalCost != null'>实际投放花费 ￥ ({{formatNumber(listitem.totalCost)}})</Col>
      </Row>
      <Row v-if='$route.params.ifs == 1 && $route.params.status != 6 && $route.params.status != 7 && $route.params.status != 4'>
        <Col :span='2'>确认应结金额</Col>
        <Col :span='3'>
            <Input style="width:100px" 
              :disabled='this.$route.params.ifs != 1 || (listitem.status != 9 && listitem.status != 10)' 
              v-model="dataplan.needPayAmount">
            </Input>
        </Col>
        <Col :span='10' v-if='listitem.totalCost && listitem.totalCost != null'>实际投放花费 ￥ ({{formatNumber(listitem.totalCost)}})</Col>
      </Row>
    </Row>

    <div style='padding: 20px 0 30px 0'>
      <Form ref="dataplan" :model="dataplan"  :rules="ruleValidate" label-position="left" :label-width="100">
        <Col :span='15'>
          预估曝光人次【{{formatNumber(listitem.estimatePersonCount , 2)}}】
          预估曝光场次【{{formatNumber(listitem.estimateShowCount , 2)}}】
          预估花费【{{formatNumber(listitem.estimateCostAmount)}}】 
          <span>, 折扣后总价【{{formatNumber(listitem.estimateShowCount , 2)}}】</span>
          <Button v-if='this.$route.params.ifs == 1' type="primary" :loading="loading2" @click="shuaxin()">刷新</Button>
      </Col>
        
        <!-- <Col :span='4'>
          <FormItem label="应收金额" prop="money">
            <Input style="width:100px" v-model="dataplan.money"></Input>
          </FormItem>
        </Col> -->
        </Form>
        <!-- 详情操作 -->
        <Col :span='6' v-if='this.$route.params.ifs == 0'>
            <Button type="primary" @click="back()">返回</Button>
        </Col>
        <!-- 补单操作 -->
        <Col :span='6' v-if='this.$route.params.ifs == 1 && (this.$route.params.status == 6 || this.$route.params.status == 7)'>
          <Button type="primary" @click='addlist'>确认补单</Button>
          <Button style='margin-left: 30px;' @click="back">取消</Button>
        </Col>
        <Col :span='6' v-if='this.$route.params.ifs == 1 && (this.$route.params.status != 6 && this.$route.params.status != 7)'>
            <Button 
              v-if='(viewfilm == true || viewcinema == true) || (listitem.status != 9 && listitem.status != 10) ' 
              type="primary" 
              disabled>
            保存并发送方案至广告主</Button>
            <Button 
            v-if='(viewfilm == false && viewcinema == false) && (listitem.status == 9 || listitem.status == 10) ' 
            type="primary"
            @click="save('dataplan')">
            保存并发送至广告主</Button>
          <Button style='margin-left: 30px;' @click="back">取消</Button>
        </Col>
    </div>
    
    <close  ref="over"   v-if="overVisible" @done="dlgEditDone"/>
    <addfilm  ref="adds" v-if='addVisible' @done="dlgEditDones"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { itemlist , delfilm , beizhu  , closeid , save , revuew , needamount , addList } from '@/api/beforeplan'
import { toMap } from '@/fn/array'
import moment from 'moment'
import close from './closeorder.vue'
import AreaSelect from '@/components/areaSelect'
import { warning , success, toast , info } from '@/ui/modal'
import { slice , clean } from '@/fn/object'
import Cinema from './cinema/cinema.vue'
import addfilm from './addfilm.vue'
import { confirm } from '@/ui/modal'
import Number from '@/components/number.vue'
import { formatNumber } from '@/util/validateRules'


import {
  queryList
} from '@/api/orderkol'
import EditDialog, { Field } from '@/components/editDialog'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'



@Component({
  components: {
    close,
    AreaSelect,
    Cinema,
    addfilm,
    Number
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
    discount: '',
    depositAmount : '',
    needPayAmount: ''
  }
  loading = false
  area: any = []
  list = []
  total = 0
  cinemaArray: any = []


  listitem: any = {}
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
  // 广告类型
  advertTypeList: any = []
  // 状态编码列表
  statusList: any = []

  deliveryGroups: any = []
  ifmovie = false
  ifage = false
  ifsex = false
  view = false

  viewfilm = false
  loading2 = false
  viewcinema = false

  // 申请人
  applyTime: any = ''
  // 备注
  remarks: any = []

  overload: any = {}

  // 投放影片
  itemlist: any = []
  get itemcolumns() {
    const data: any = [
      { title: '影片名称', key: 'movieName', align: 'center' },
      {
        title: '上映日期',
        key: 'publishStartDate',
        align: 'center',
        render: (hh: any, { row: { publishStartDate } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const html = publishStartDate == 0 ? '-' : String(publishStartDate).slice(0, 4) + '-' + String(publishStartDate).slice(4, 6) + '-' + String(publishStartDate).slice(6, 8)
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
          const html = beginDate == 0 ? '' : String(beginDate).slice(0, 4) + '-' + String(beginDate).slice(4, 6) + '-' + String(beginDate).slice(6, 8)
          const html2 = endDate == 0 ? '' : String(endDate).slice(0, 4) + '-' + String(endDate).slice(4, 6) + '-' + String(endDate).slice(6, 8)
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
    return this.$route.params.ifs == '1' && (this.$route.params.status == '2' || this.$route.params.status == '3' ||
      this.$route.params.status == '4' || this.$route.params.status == '10') ? [...data, ...opernation] : data
  }

  get ruleValidate() {
    const rules = {
      money: [
          { required: true, message: '请输入金额', trigger: 'blur' }
      ],
    }
    return rules
  }

  get formatNumber() {
    return formatNumber
  }

  mounted() {
    this.search()
  }

  async getcinemas(asd: any) {
    this.viewcinema = true
  }

  async overloading() {
    const { data } = await itemlist(this.$route.params.id)
    this.overload = data.item
    const _this = this
    if (this.overload.recommend == false) {
      setTimeout(() => {
        _this.overloading()
      }, 800)
    }
    if (this.overload.recommend == true) {
      this.search()
      this.$Message.success({
        content: `刷新成功`,
      })
      this.loading2 = false
      this.viewfilm = false
      this.viewcinema = false
    }
  }

  async shuaxin() {
    this.loading2 = true
    try {
      await revuew(this.$route.params.id)
      this.overloading()
      // const _this = this
      // setInterval(() => {
      //   _this.overloading()
      // }, 800)
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  dlgEditDone() {
    this.search()
  }

  dlgEditDones() {
    this.viewfilm = true
    this.search()
  }

  // 返回上一页 && 接单取消按钮
  back() {
    this.$router.go(-1)
  }


  addfilm(start: any , end: any) {
    this.addVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.adds.init(start, end)
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
    this.listitem = []
    try {
        // 订单列表
      const { data } = await itemlist(this.$route.params.id)
      this.listitem = data.item
      const a = String(data.item.beginDate)
      const b = String(data.item.endDate)
      this.start = a.slice(0, 4) + '-' + a.slice(4, 6) + '-' + a.slice(6, 8)
      this.end =  b.slice(0, 4) + '-' + b.slice(4, 6) + '-' + b.slice(6, 8)
      this.applyTime = data.item.applyTime.split('T')[0]
      + ' ' + data.item.applyTime.split('T')[1].split('.')[0]
      // 备注
      this.remarks = (this.listitem.remarks || []).map((it: any) => {
        return {
          ...it,
          operationTime: moment(it.operationTime).format(timeFormat)
        }
      })
      this.logList = (data.logList || []).map((it: any) => {
        return {
          ...it,
          createTime : moment(it.createTime).format(timeFormat)
        }
      })
      // 影片
      this.films = data.planMovies == null ? [] : data.planMovies
      // 星级
      this.cinemaGradeList = data.cinemaGradeList == null ? [] : data.cinemaGradeList
      // 城市
      this.deliveryCityTypeList = data.deliveryCityTypeList == null ? [] : data.deliveryCityTypeList
      // 电影标签列表(影片类型/年龄/性别)
      this.tags = data.tags
      this.view = true
      this.deliveryGroups = data.item.deliveryGroups
      this.advertTypeList = data.advertTypeList
      this.statusList = data.statusList
      // 判断电影标签的展示
      if (this.deliveryGroups == null) {
        this.ifmovie = true
        this.ifage = true
        this.ifsex = true
      } else if (this.deliveryGroups != null) {
        const aaa = (this.deliveryGroups || []).map((it: any) => {
          return it.tagTypeCode
        })
        if (aaa.indexOf('MOVIE_TYPE') == -1) {
          this.ifmovie = true
        }
        if (aaa.indexOf('PLAN_GROUP_AGE') == -1) {
          this.ifage = true
        }
        if (aaa.indexOf('PLAN_GROUP_SEX') == -1) {
          this.ifsex = true
        }
      }
      this.dataplan.discount = data.item.discount
      this.dataplan.depositAmount = data.item.depositAmount
      this.dataplan.needPayAmount = data.item.needPayAmount
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
      this.viewfilm = true
      this.search()
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
      this.search()
      this.databeizhu.remarks = ''
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 保存方案
  async save(dataplan: any) {
    // 保存定金
    if (this.listitem.status == 2 || this.listitem.status == 3) {
      if (this.dataplan.depositAmount == '') {
        info('请输入定金金额')
        return
      }
      const res = await save (this.$route.params.id , {depositAmount : this.dataplan.depositAmount})
    } else if (this.listitem.status == 9) { // 核对应结金额
      if (this.dataplan.needPayAmount == '') {
        info('请输入应结金额')
        return
      }
      const rescheck = await needamount (this.$route.params.id ,
        {needPayAmount : this.dataplan.needPayAmount , confirm: true})
    } else if (this.listitem.status == 10) { // 修改应结金额
      if (this.dataplan.needPayAmount == '') {
        info('请输入应结金额')
        return
      }
      const resneed = await needamount (this.$route.params.id ,
        {needPayAmount : this.dataplan.needPayAmount , confirm: false})
    }
    this.$router.go(-1)
  }

  async addlist() {
    const addlist = await addList (this.$route.params.id)
    this.$router.go(-1)
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

  @Watch('dataplan', { deep: true })
  watchDataplan() {

  }


}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.page {
  line-height: 40px;
  font-size: 14px;
  em {
    font-style: normal;
  }
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
span:only-child:empty {
  &::before {
    content: '暂无';
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
