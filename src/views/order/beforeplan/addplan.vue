<template>
  <div class='page'>
    <header>
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
    </header>
    <div class='title'>基础信息</div>
    <div class='bos'>
      <Form ref="info" :model="info" label-position="left" :rules="ruleValidate" :label-width="100">
        <Row>
          <Col :span='6' style='margin-right: 3%;'>
            <FormItem label="计划名称" prop="planName">
              <Input v-model="info.planName" placeholder='广告计划名称'></Input>
            </FormItem>
          </Col>
          <Col :span='6' style='margin-right: 3%;'>
            <FormItem label="广告主公司" prop="xadscompanyId">
              <CompanyList v-model="info.xadscompanyId"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span='6' style='margin-right: 3%;'>
            <FormItem label="广告片" prop="filmid">
              <videoList v-model="info.filmid" />
            </FormItem>
          </Col>
          <Col :span='6' style='margin-right: 3%;'>
            <FormItem label="广告片规格" prop="filmleng">
              <Select v-model="info.filmleng" filterable placeholder="广告片规格" >
                <Option v-for="it in []" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span='6' style='margin-right: 3%;'>
            <FormItem label="客户" prop="custid">
              <Select v-model="info.custid" filterable placeholder="客户">
                <Option v-for="it in []" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span='6' style='margin-right: 3%;'>
            <FormItem label="品牌" prop="brandid">
              <brandList v-model="info.brandid" />
            </FormItem>
          </Col>
          <Col :span='6' style='margin-right: 3%;'>
            <FormItem label="产品" prop="proid">
              <Select v-model="info.proid" filterable placeholder="产品">
                <Option v-for="it in []" v-if='it.status==1' :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span='6' style='margin-right: 3%;'>
            <FormItem label="投放排期" prop="name">
              <DatePicker type="daterange" @on-change="dateChange" style='width: 100%;' v-model="showTime" placement="bottom-start" placeholder="投放排期时间" class="input" ></DatePicker>
            </FormItem>
          </Col>
        </Row>    
      </Form>
    </div>
    <div class='title'>投放影片(系统推荐 / 用户自选)</div>
    <div class='bos'>
      <Table :columns="itemcolumns" :data='films' border stripe disabled-hover size="small" class="table">
        <template v-if='$route.params.status == 0 || $route.params.status == 1 || $route.params.status == 2 ' slot="action" slot-scope="{row}" >
          <a  @click="deletefilm(row.movieId)">删除</a>
        </template>
     </Table>
     <div style='cursor: pointer;' v-if='$route.params.status == 0 || $route.params.status == 1 || $route.params.status == 2 ' @click='addfilm(listitem.beginDate , listitem.endDate)'>添加影片</div>
    </div>
    <div class='title'>投放类型</div>
    <Row class='bos'>
      <RadioGroup v-model="info.status" >
        <Radio v-for="it in toufangtype" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
      </RadioGroup>
    </Row>
     <!-- 影院 -->
    <Cinema  @getcine="getcinemas" />
    <!-- 资源方列表 -->
    <resList  @getcine="getcinemas"  />
    <div class='title'>备注</div>
    <div class='bos' >
      <Row v-if='(listitem.remarks == null)'>暂无备注</Row>
      <Row v-if='listitem.remarks != null' v-for='(it,index) in remarks' :key='index'>
          {{it.operationTime}} 
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
    <div class='title'>应收款项</div>
    <Row class='bos'>
      <Col :span='2'>应收金额</Col>
      <Col :span='4'>
          <Input style="width:100px" v-model="dataplan.money"></Input>
      </Col>
    </Row>
    <div class='title'>操作记录</div>
    <div class='bos'>
      <Row v-if='logList.length == 0'>暂无操作日志</Row>
      <Row  v-if='logList.length > 0' v-for='(it,index) in logList' :key='index'>
        <Row>{{it.createTime}}  {{it.createUserEmail}}【{{it.createUserName}}】 {{it.eventName}}{{it.description}}</Row>
      </Row>
    </div>
    <div style='padding: 20px 0 30px 0'>
        <Form ref="dataplan" :model="dataplan"  :rules="ruleValidate" label-position="left" :label-width="100">
            <Col :span='11'>
              预估曝光人次【{{formatNumber(listitem.estimatePersonCount , 2)}}】预估曝光场次【{{formatNumber(listitem.estimateShowCount , 2)}}】预估花费【{{formatNumber(listitem.estimateCostAmount)}}】
               <Button type="primary" :loading="loading2" @click="shuaxin()">刷新</Button>
            </Col>
          </Form>
          <Col :span='6'>
              <Button v-if='viewfilm == true || viewcinema == true ' type="primary" disabled>保存并发送方案至广告主</Button>
              <Button v-if='viewfilm == false && viewcinema == false ' type="primary" @click="save('dataplan')">保存并发送方案至广告主</Button>
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
import { itemlist , delfilm , beizhu  , closeid , save , revuew  } from '@/api/beforeplan'
import { toMap } from '@/fn/array'
import moment from 'moment'
// 关闭订单
import close from './closeorder.vue'
import AreaSelect from '@/components/areaSelect'
import { warning , success, toast , info } from '@/ui/modal'
import { slice , clean } from '@/fn/object'
// 影院
import Cinema from './cinema/cinema.vue'
// 添加影片
import addfilm from './addfilm.vue'
import { confirm } from '@/ui/modal'
// 数字格式化
import Number from '@/components/number.vue'
import { formatNumber } from '@/util/validateRules'
// 广告主公司名称
import CompanyList from './files/adscompany.vue'
// 广告片列表
import videoList from './files/videoList.vue'
// 品牌列表
import brandList from './files/filebrand.vue'
// 资源方列表
import resList from './resourse/resourselist.vue'


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
    resList,
    addfilm,
    Number,
    CompanyList,
    videoList,
    brandList
  }
})
export default class Main extends ViewBase {
  overVisible = false
  addOrUpdateVisible = false
  addVisible = false
  // 基本信息
  info = {
    planName: null,
    xadscompanyId: null,
    filmid: null,
    filmleng: null,
    custid: null,
    brandid: null,
    proid: null,
    startTime: null,
    endTime: null,
    status: 1,
  }
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
  showTime: any = []


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
  // 投放类型
  toufangtype: any = [
    {
      key: 1,
      text: '按曝光 (以CPM计费,使用刊例价进行结算)'
    },
    {
      key: 2,
      text: '按场次 (执行完成后,手动进行结算;不适用刊例价,按单结算给资)'
    }
  ]
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
          const html = String(publishStartDate).slice(0, 4) + '-' + String(publishStartDate).slice(4, 6) + '-' + String(publishStartDate).slice(6, 8)
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
    return this.$route.params.status == '0' || this.$route.params.status == '1' ||
    this.$route.params.status == '2' ? [...data, ...opernation] : data
  }

  // 时间
  dateChange(data: any) {
     // 获取时间戳
     !!data[0] ? (this.query.startTime = new Date(data[0]).getTime() - 28800000) : this.query.startTime = 0
     !!data[1] ? (this.query.endTime = new Date(data[1]).getTime() + 57600000) : this.query.endTime = 0
  }


  // 输入框规则
  get ruleValidate() {
    const rules = {
      money: [
          { required: true, message: '请输入金额', trigger: 'blur' }
      ],
      planName: [
          { required: true, message: '请输入广告计划金额', trigger: 'blur' }
      ],
    }
    return rules
  }

  get formatNumber() {
    return formatNumber
  }

  mounted() {
    // this.search()
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
      this.films = data.planMovies == null ? [] : data.planMovies
      this.cinemaGradeList = data.cinemaGradeList == null ? [] : data.cinemaGradeList
      this.deliveryCityTypeList = data.deliveryCityTypeList == null ? [] : data.deliveryCityTypeList
      this.tags = data.tags
      this.view = true
      this.deliveryGroups = data.item.deliveryGroups
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
    const myThis: any = this
    myThis.$refs[dataplan].validate(async ( valid: any ) => {
      if (valid) {
        try {
          const res = await save (this.$route.params.id , {needPayAmount : this.dataplan.money})
          this.$router.go(-1)
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
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
