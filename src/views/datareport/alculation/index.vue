<template>
  <div class="page">
    <div class="Inp-Group-res">
      <div class="n-main">输入项</div>
      <div class="Inps-res">
        <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
            <FormItem label="售卖类型" prop="agree">
                <RadioGroup v-model="dataForm.agree" >
                <Radio v-for="it in statuslist" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="开始日期" prop="beginDate">
                <Date-picker type="date" v-model="dataForm.beginDate"
                on-change="selectTime" placeholder="选择上刊日期" style="width: 200px"></Date-picker>
            </FormItem>
            <FormItem label="结束日期" prop="endDate">
                <Date-picker type="date" :options="{ disabledDate }" v-model="dataForm.endDate"
                on-change="selectTime" placeholder="选择下刊日期" style="width: 200px"></Date-picker>
            </FormItem>
            <FormItem label="上刊影院" prop="cinema" class='ivu-form-item-required'>
                <a href="//aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bnmv7qg6p4fg00a11u8g.xls" :download='"//aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bnmv7qg6p4fg00a11u8g.xls"'>下载影院模版列表.xls</a>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button type='primary' @click='upload'>上传</Button>&nbsp;&nbsp;(请按照影院模板列表格式上传)
            </FormItem>
            <FormItem label=" " prop="">
              <Select
                class='sels'
                v-model='dataForm.cinemaId'
                clearable
                filterable
                placeholder="请输入影院名称或专资编码查询"
                style='width: 200px;'
                :loading = loadings
                remote
                :remote-method="cinemaremoteMethod"
                @on-clear="addcinemalist = []"
                  >
                  <Option
                    v-for="(item) in addcinemalist"
                    :key="item.id"
                    :value="item.id"
                  >【{{item.code}}】{{item.shortName}}</Option>
                </Select>
                &nbsp;&nbsp;&nbsp;<Button type='primary' @click='addcinema'>添加影院</Button>
              <Row>
                <Button style='margin-left: 100px;margin-top: 10px;' type='primary' v-if='ids.length > 0' @click='alldels'>批量删除</Button>
              </Row>
              <Table 
                style='margin-top: 10px;margin-left: 100px;' 
                ref='selection' 
                :columns="chgcinemacolumns" 
                selectable
                @on-selection-change="onselect"
                :data="pagechgcinema" border stripe disabled-hover size="small" class="table">
                <template slot="action" slot-scope="{row}" >
                  <a href="JavaScript:;" @click='dels(row.id)'>删除</a>
                </template>
            </Table>
            <div class="page-wrap" v-if="cinematotal > 0">
              <Page :total="cinematotal" :current="query.pageIndex" :page-size="query.pageSize"
                show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
                @on-change="page => query.pageIndex = page"
                @on-page-size-change="pageSize => query.pageSize = pageSize"/>
            </div>
            </FormItem>
            <FormItem label="销售折扣" prop="discount">
              <InputNumber style="width: 200px" :min='0' :max="1" placeholder="输入0-1之间的折扣" v-model="dataForm.discount"></InputNumber>
            </FormItem>
             <FormItem label="贴片影片" prop="" class='ivu-form-item-required'>
                <RadioGroup v-model="dataForm.filmstatus" >
                <Radio v-for="it in filmstatuslist" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
                </RadioGroup>
                <Select
                  class='sels'
                  v-model='dataForm.filmId'
                  v-if='dataForm.filmstatus == 2'
                  clearable
                  filterable
                  placeholder="请输入影片名称查询"
                  style='width: 200px;'
                  :loading = loadings
                  remote
                  :remote-method="filmremoteMethod"
                  @on-clear="addfilmlist = []"
                    >
                    <Option
                      v-for="(item) in addfilmlist"
                      :key="item.id"
                      :value="item.id"
                    >{{item.name}}</Option>
                </Select>
            </FormItem>
        </Form>
        <Button type='primary' @click='search'>开始测算</Button>
      </div>
      <div class="n-main">输出项</div>
      <div class="Inps-res">
        <Row class='title'>
          整体影院数据输出:
        </Row>
         <Table ref='table' :columns="cinemacolumns" :data="cinemalist"
        border stripe disabled-hover size="small" class="table">
          <template slot="planId" slot-scope="{row}" >
            <span v-if='row.planId== null'>-</span>
            <span v-else >{{formatNumber(row.planId)}}</span>
          </template>
          <template slot="planName" slot-scope="{row}" >
            <span v-if='row.planName== null'>-</span>
            <span v-else >{{formatNumber(row.planName)}}</span>
          </template>
          <template slot="todayFinishRate" slot-scope="{row}" >
            <span v-if='row.todayFinishRate== null'>-</span>
            <span v-else >{{formatNumber(row.todayFinishRate)}}</span>
          </template>
          <template slot="tomorrowFinishRate" slot-scope="{row}" >
            <span v-if='row.tomorrowFinishRate== null'>-</span>
            <span v-else >{{formatNumber(row.tomorrowFinishRate , 2)}}</span>
          </template>
          <template slot="budgetFinishDate" slot-scope="{row}" >
            <span v-if='row.budgetFinishDate== null'>-</span>
            <span v-else >{{formatNumber(row.budgetFinishDate , 2)}}</span>
          </template>
        </Table>
        <Row class='title1'>
          <span>上刊影院数据输出:</span>
          <Button style='float: right;margin-top: 10px;' type='primary' @click='exports'>导出</Button>
        </Row>
         <Table ref='table' :columns="columns" :data="list" :loading="loading"
        border stripe disabled-hover size="small" class="table">
          <template slot="personCount" slot-scope="{row}" >
            <span v-if='row.personCount== null'>-</span>
            <span v-else >{{formatNumber(row.personCount)}}</span>
          </template>
          <template slot="budgetShowCount" slot-scope="{row}" >
            <span v-if='row.budgetShowCount== null'>-</span>
            <span v-else >{{formatNumber(row.budgetShowCount)}}</span>
          </template>
          <template slot="showCount" slot-scope="{row}" >
            <span v-if='row.showCount== null'>-</span>
            <span v-else >{{formatNumber(row.showCount , 2)}}</span>
          </template>
          <template slot="cost" slot-scope="{row}" >
            <span v-if='row.cost== null'>-</span>
            <span v-else >{{formatNumber(row.cost , 2)}}</span>
          </template>
        </Table>
        <div class="page-wrap" v-if="total > 0">
          <Page :total="total" :current="dataForm.pageIndex" :page-size="dataForm.pageSize"
            show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
            @on-change="page => dataForm.pageIndex = page"
            @on-page-size-change="pageSize => dataForm.pageSize = pageSize"/>
        </div>
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
import {confirm , warning , success, toast , info } from '@/ui/modal'
import { queryList , queryItem } from '@/api/cinema'
import { filmqueryList } from '@/api/alculation'
import { formatNumber } from '@/util/validateRules'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
  }
})
export default class Main extends Mixins(ViewBase, UrlManager)  {

  dataForm = {
    agree: 1, // 售卖类型
    beginDate: '',
    endDate: '',
    cinemaId: null,
    discount: null,
    filmstatus: 1,
    filmId: null,
    pageIndex: 1,
    pageSize: 20,
  }

  query: any = {
    pageIndex: 1,
    pageSize: 10,
  }

  loading = false
  // 添加影院
  loadings = false
  // 去重之后的选择影院数组列表
  cinemalistArray: any = []

  // 销售类型
  statuslist: any = [
    {
      key: 1,
      text: '场次'
    },
    {
      key: 2,
      text: '单厅单调'
    }
  ]
  // 贴片类型
  filmstatuslist: any = [
    {
      key: 1,
      text: '无贴片'
    },
    {
      key: 2,
      text: '有贴片'
    }
  ]
  // 添加影院列表
  addcinemalist: any = []
  // 添加影片列表
  addfilmlist: any = []

  begin: any = 0

  ids: any = []
  // 影院选择列表
  chgcinema: any = []
  pagechgcinema: any = []
  cinematotal: any = 0

  // 整体影院输出
  cinemalist: any = []
  // 上刊影院输出
  list: any = []
  total: any = 0

  chgcinemacolumns = [
    {
      type: 'selection',
      title: '全选',
      width: 60,
      align: 'center'
    },
    { title: '序号', key: 'id', align: 'center'},
    { title: '影院名称', key: 'shortName', align: 'center' },
    { title: '专资编码', key: 'code', align: 'center' },
    { title: '操作' , slot: 'action', align: 'center' },
  ]

  cinemacolumns = [
    { title: '整体影院平均单场价格', slot: 'planId', align: 'center'},
    { title: '整体影院平均单厅单周价格', slot: 'planName', align: 'center' },
    { title: '整体影院同期价格', slot: 'todayFinishRate', align: 'center' },
    { title: '整体影院同期人次' , slot: 'tomorrowFinishRate', align: 'center' },
    { title: '整体影院同期总场次' , slot: 'budgetFinishDate', align: 'center' },
  ]

  columns = [
    { title: '专资编码', key: 'planId', align: 'center', width: 100 },
    { title: '影院名称', key: 'planName', align: 'center' },
    { title: '省份', key: 'todayFinishRate', align: 'center' },
    { title: '城市' , key: 'tomorrowFinishRate', align: 'center' },
    { title: '地址' , key: 'budgetFinishDate', align: 'center' },
    { title: '开业时间' , key: 'budgetPersonCount', align: 'center' },
    { title: '平均单场价格(元)' , slot: 'personCount', align: 'center' },
    { title: '总价(元)' , slot: 'budgetShowCount', align: 'center' },
    { title: '总场次' , slot: 'showCount', align: 'center' },
    { title: '总人次' , slot: 'cost', align: 'center' }
  ]

  disabledDate(date: any) {
    return date && date.valueOf() < this.begin
  }

  get formatNumber() {
    return formatNumber
  }

  get ruleValidate() {
    const rules = {
      agree: [
        { required: true, message: '请选择售卖类型' }
      ],
      beginDate: [
        { required: true, message: '请选择上刊日期' }
      ],
      endDate: [
        { required: true, message: '请选择下刊日期' }
      ],
      discount: [
        { required: true, message: '请填写销售折扣' }
      ],
      film: [
        { required: true, message: '请选择售卖类型' }
      ],
    }
    return rules
  }

  // 添加影院列表
  async cinemaremoteMethod(querys: any) {
    try {
      if (querys) {
        this.loadings = true
        const {
          data: { items }
        } = await queryList({
          query: querys,
        })
        this.addcinemalist = items || []
      }
      this.loadings = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }
  // 添加影片列表
  async filmremoteMethod(querys: any) {
    try {
      if (querys) {
        this.loadings = true
        const {
          data: { items }
        } = await filmqueryList({
          name: querys,
        })
        this.addfilmlist = items || []
      }
      this.loadings = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }
  // 开始测算
  async search() {
    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    if (this.dataForm.agree == 2 && String((new Date(this.dataForm.endDate).getTime() -
    new Date(this.dataForm.beginDate).getTime()) / 7).indexOf('.') != -1 ) {
      info('上刊日期和下刊日期选择时必须是周（7天）的倍数')
      return
    }
    if (this.chgcinema.length == 0) {
      info('请添加影院')
      return
    }
    if (this.dataForm.filmstatus == 2 && (this.dataForm.filmId == null || this.dataForm.filmId == undefined)) {
      info('请选择影片')
      return
    }
    if ((Number(this.dataForm.discount) < 0 || Number(this.dataForm.discount) > 1)) {
      info('请输入0-1之前的折扣')
      return
    }
    if ((String(this.dataForm.discount).indexOf('.') != -1 &&
    String(this.dataForm.discount).split('.')[1].length > 2)) {
      info('折扣输入限制为两位小数')
      return
    }
    // console.log(123
    // console.log(this.dataForm)
  }

  // 批量选择影院
  onselect(row: any , selection: any) {
    this.ids = row.map((it: any) => {
      return it.id
    })
  }

  // 上传影院操作
  async upload() {
    // console.log('上传')
  }

  // 添加影院操作
  async addcinema() {
    this.query.pageIndex = 1
    if (this.cinemalistArray.indexOf(this.dataForm.cinemaId) != -1) {
      info('请勿重复添加影院')
      this.dataForm.cinemaId = null
      return
    }
    this.cinemalistArray.push(this.dataForm.cinemaId)
    if (this.dataForm.cinemaId == null || this.dataForm.cinemaId == undefined) {
      info('请选择影院')
      return
    }
    // console.log(this.dataForm.cinemaId)
    const list = await queryItem({id : this.dataForm.cinemaId})
    this.chgcinema.push({
      id: list.data.item.id,
      shortName: list.data.item.shortName,
      code: list.data.item.code,
    })
    if (this.query.pageIndex == 1) {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10), 10)
    }
    this.cinematotal = this.chgcinema.length
    this.dataForm.cinemaId = null
  }

  // 删除影院操作
  async dels(id: any) {
    await confirm('确认要删除当前影院吗?')
    const a = this.chgcinema.map((it: any) => {
      return it.id
    }).indexOf(id)
    this.cinemalistArray.splice(a, 1)
    this.chgcinema.splice(a, 1)
  }

  // 批量删除影院操作
  async alldels() {
    await confirm('确认要删除当前影院吗?')
    this.ids.map((it: any) => {
      // console.log(it.id)
      this.chgcinema = this.chgcinema.filter((item: any) => item.id != it)
      this.cinemalistArray = this.cinemalistArray.filter((item: any) => item != it)
    })
  }


  // 导出上刊影院数据输出
  async exports() {
    // console.log('导出')
  }
  // 设置下刊不可选时间
  @Watch('dataForm', { deep: true })
  watchDataForm() {
    this.begin = new Date(this.dataForm.beginDate).getTime()
  }
  // 添加影院分页
  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == 1) {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10), 10)
    } else {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10),
      this.query.pageIndex * this.dataForm.pageSize)
    }
  }

  @Watch('chgcinema', { deep: true })
  watchChgcinema() {
    if (this.query.pageIndex == 1) {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10), 10)
    } else {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10),
      this.query.pageIndex * this.dataForm.pageSize)
    }
    this.cinematotal = this.chgcinema.length
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
  padding: 2%;
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
.title {
  height: 40px;
  line-height: 40px;
}
.title1 {
  height: 50px;
  line-height: 50px;
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
</style>
