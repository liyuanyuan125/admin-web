<template>
  <div class="page">
    <div class="Inp-Group-res">
      <div class="n-main">输入项</div>
      <div class="Inps-res">
        <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
            <FormItem label="售卖类型" prop="salesType">
                <RadioGroup v-model="dataForm.salesType" >
                <Radio v-for="it in statuslist" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="开始日期" prop="upperDate">
                <Date-picker type="date" v-model="dataForm.upperDate"
                on-change="selectTime" placeholder="选择上刊日期" style="width: 200px"></Date-picker>
            </FormItem>
            <FormItem label="结束日期" prop="downDate">
                <Date-picker type="date" :options="{ disabledDate }" v-model="dataForm.downDate"
                on-change="selectTime" placeholder="选择下刊日期" style="width: 200px"></Date-picker>
            </FormItem>
            <FormItem label="上刊影院" prop="cinema" class='ivu-form-item-required'>
                <a href="//aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bnu3r9ldgttg008001m0.xls" :download='"//aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bnu3r9ldgttg008001m0.xls"'>下载影院模版列表.xls</a>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                
                <Form class="create-form form-item"   enctype="multipart/form-data" ref="form"
                   :label-width="120">
                   上传文件
                   <!-- <Button type='primary' @click='upload'>上传</Button> -->
                <input ref='input' type="file" class='adds' @change="onChange" />
                </Form>
                <span class='viewhtml'>{{inputhtml}}&nbsp;</span>
                &nbsp;&nbsp;(请按照影院模板列表格式上传)
                <span class='ivu-form-item-error-tip' v-if='showcinemaerr == true'>请上传或添加影院</span>
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
            <FormItem label="广告类型" prop="advertType">
                <Select v-model="dataForm.advertType" placeholder="广告类型" clearable style="width: 200px">
                  <Option v-for="it in advertTypeCodeList" :key="it.key" :value="it.key"
                    :label="it.text">{{it.text}}</Option>
                </Select>
            </FormItem>
            <FormItem label="广告时长" prop="advertLen">
                <Select v-model="dataForm.advertLen" placeholder="广告时长" clearable style="width: 200px">
                  <Option v-for="it in advertLenList" :key="it.key" :value="it.key"
                    :label="it.text">{{it.text}}</Option>
                </Select>
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
          <template slot="onceAvgPrice" slot-scope="{row}" >
            <span v-if='(row.onceAvgPrice) == null '>-</span>
            <span v-else >{{formatNumber(row.onceAvgPrice)}}</span>
          </template>
          <template slot="hallWeekPrice" slot-scope="{row}" >
            <span v-if='(row.hallWeekPrice) == null '>-</span>
            <span v-else >{{formatNumber(row.hallWeekPrice)}}</span>
          </template>
          <template slot="avgCpmTotalPrice" slot-scope="{row}" >
            <span v-if='(row.avgCpmTotalPrice) == null '>-</span>
            <span v-else >{{formatNumber(row.avgCpmTotalPrice)}}</span>
          </template>
          <template slot="sameTimeTotalPrice" slot-scope="{row}" >
            <span v-if='(row.sameTimeTotalPrice) == null '>-</span>
            <span v-else >{{formatNumber(row.sameTimeTotalPrice)}}</span>
          </template>
          <template slot="sameTimeShowViewCount" slot-scope="{row}" >
            <span v-if='(row.sameTimeShowViewCount) == null '>-</span>
            <span v-else >{{formatNumber(row.sameTimeShowViewCount , 2)}}</span>
          </template>
          <template slot="sameTimeShowTimeCount" slot-scope="{row}" >
            <span v-if='(row.sameTimeShowTimeCount) == null '>-</span>
            <span v-else >{{formatNumber(row.sameTimeShowTimeCount , 2)}}</span>
          </template>
        </Table>
        <Row class='title1'>
          <span>上刊影院数据输出:</span>
          <Button style='float: right;margin-top: 10px;' type='primary' @click='exports'>导出</Button>
        </Row>
         <Table ref='table' :columns="columns" :data="list" :loading="loading"
        border stripe disabled-hover size="small" class="table">
          <template slot="onceAvgPrice" slot-scope="{row}" >
            <span v-if='row.onceAvgPrice== null'>-</span>
            <span v-else >{{formatNumber(row.onceAvgPrice)}}</span>
          </template>
          <template slot="cinemaCpmCost" slot-scope="{row}" >
            <span v-if='row.cinemaCpmCost == null'>-</span>
            <span v-else >{{formatNumber(row.cinemaCpmCost)}}</span>
          </template>
          <template slot="totalShowViews" slot-scope="{row}" >
            <span v-if='row.totalShowViews== null'>-</span>
            <span v-else >{{formatNumber(row.totalShowViews , 2)}}</span>
          </template>
          <template slot="totalShowTimes" slot-scope="{row}" >
            <span v-if='row.totalShowTimes== null'>-</span>
            <span v-else >{{formatNumber(row.totalShowTimes , 2)}}</span>
          </template>
        </Table>
        <div class="page-wrap" v-if="total > 0">
          <Page :total="total" :current="cinemapage.pageIndex" :page-size="cinemapage.pageSize"
            show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
            @on-change="page => cinemapage.pageIndex = page"
            @on-page-size-change="pageSize => cinemapage.pageSize = pageSize"/>
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
import {confirm , warning , success, toast , info , error } from '@/ui/modal'
import { queryList , queryItem } from '@/api/cinema'
import { filmqueryList , getExceljson , pricecalc , cinemas } from '@/api/alculation'
import { formatNumber } from '@/util/validateRules'
import Uploader from '@/util/Uploader'
import { number } from '../../../api/orderSys'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

@Component({
  components: {
  }
})
export default class Main extends Mixins(ViewBase, UrlManager)  {

  dataForm = {
    salesType: 0, // 售卖类型
    upperDate: '',
    downDate: '',
    cinemaId: null,
    advertType: null,
    advertLen: null,
    discount: null,
    filmstatus: 1,
    filmId: null,
    pageIndex: 1,
    pageSize: 20,
  }
  // 选择影院分页
  query: any = {
    pageIndex: 1,
    pageSize: 10,
  }

  cinemapage: any = {
    pageNo: 1,
    pageSize: 10,
  }

  showcinemaerr: any = false

  loading = false
  // 添加影院
  loadings = false
  // 去重之后的选择影院数组列表
  cinemalistArray: any = []

  // 销售类型
  statuslist: any = [
    {
      key: 0,
      text: '场次'
    },
    {
      key: 1,
      text: '单厅单调'
    },
    {
      key: 2,
      text: 'cpm'
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

  // 广告类型
  advertTypeCodeList: any = [
    {
      key: 'BRAND',
      text: '商业广告'
    },
    {
      key: 'TRAILER',
      text: '预告片广告'
    }
  ]
  // 广告时长
  advertLenList: any = [
    {
      key: '15',
      text: '15s'
    },
    {
      key: '30',
      text: '30s'
    },
    {
      key: '45',
      text: '45s'
    },
    {
      key: '60',
      text: '60s'
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

  file: File | any = null
  inputhtml: any = ''

  uuid: any = '' // 影院标识

  one: any = []
  two: any = []
  cpm: any = []

  upone: any = []
  uptwo: any = []
  upcpm: any = []

  exportupone: any = []
  exportuptwo: any = []
  exportupcpm: any = []

  chgcinemacolumns = [
    {
      type: 'selection',
      title: '全选',
      width: 60,
      align: 'center'
    },
    { title: '序号', key: 'id', align: 'center'},
    { title: '影院名称', key: 'name', align: 'center' },
    { title: '专资编码', key: 'code', align: 'center' },
    { title: '操作' , slot: 'action', align: 'center' },
  ]

  get cinemacolumns() {
    if (this.dataForm.salesType == 0) {
      this.one = [
        { title: '整体影院平均单场价格', slot: 'onceAvgPrice', align: 'center'},
      ]
    } else {
      this.one = []
    }
    if (this.dataForm.salesType == 1) {
      this.two = [
        { title: '整体影院平均单厅单周价格', slot: 'hallWeekPrice', align: 'center' },
      ]
    } else {
      this.two = []
    }
    if (this.dataForm.salesType == 2) {
      this.cpm = [
        { title: '整体影院cpm报价', slot: 'avgCpmTotalPrice', align: 'center' },
      ]
    } else {
      this.cpm = []
    }
    const over = [
      { title: '整体影院同期价格', slot: 'sameTimeTotalPrice', align: 'center' },
      { title: '整体影院同期人次' , slot: 'sameTimeShowViewCount', align: 'center' },
      { title: '整体影院同期总场次' , slot: 'sameTimeShowTimeCount', align: 'center' },
    ]
    return [...this.one, ...this.two , ...this.cpm , ...over]
  }

  get columns() {
    const one = [
      { title: '专资编码', key: 'code', align: 'center', width: 100 },
      { title: '影院名称', key: 'cinemaName', align: 'center' },
      { title: '省份', key: 'provinceName', align: 'center' },
      { title: '城市' , key: 'cityName', align: 'center' },
      { title: '地址' , key: 'address', align: 'center' },
    ]
    if (this.dataForm.salesType == 0) {
      this.upone = [
        { title: '平均单场价格(元)' , slot: 'onceAvgPrice', align: 'center' },
      ]
    } else {
      this.upone = []
    }
    if (this.dataForm.salesType == 1) {
      this.uptwo = [
        { title: '平均单厅单周价格', slot: 'hallWeekPrice', align: 'center' },
      ]
    } else {
      this.uptwo = []
    }
    if (this.dataForm.salesType == 2) {
      this.upcpm = [
        { title: 'cpm报价', slot: 'cinemaCpmCost', align: 'center' },
      ]
    } else {
      this.upcpm = []
    }
    const over = [
      { title: '总场次' , slot: 'totalShowTimes', align: 'center' },
      { title: '总人次' , slot: 'totalShowViews', align: 'center' }
    ]
    return [...one , ...this.upone, ...this.uptwo , ...this.upcpm , ...over]
  }

  get exportcolumns() {
    const one = [
      { title: '专资编码', key: 'code', align: 'center', width: 100 },
      { title: '影院名称', key: 'cinemaName', align: 'center' },
      { title: '省份', key: 'provinceName', align: 'center' },
      { title: '城市' , key: 'cityName', align: 'center' },
      { title: '地址' , key: 'address', align: 'center' },
    ]
    if (this.dataForm.salesType == 0) {
      this.exportupone = [
        { title: '平均单场价格(元)' , key: 'onceAvgPrice', align: 'center' },
      ]
    } else {
      this.exportupone = []
    }
    if (this.dataForm.salesType == 1) {
      this.exportuptwo = [
        { title: '平均单厅单周价格', key: 'hallWeekPrice', align: 'center' },
      ]
    } else {
      this.exportuptwo = []
    }
    if (this.dataForm.salesType == 2) {
      this.exportupcpm = [
        { title: 'cpm报价', key: 'cinemaCpmCost', align: 'center' },
      ]
    } else {
      this.exportupcpm = []
    }
    const over = [
      { title: '总场次' , key: 'totalShowTimes', align: 'center' },
      { title: '总人次' , key: 'totalShowViews', align: 'center' }
    ]
    return [...one , ...this.exportupone, ...this.exportuptwo , ...this.exportupcpm , ...over]
  }

  disabledDate(date: any) {
    return date && date.valueOf() < this.begin
  }

  get formatNumber() {
    return formatNumber
  }

  get ruleValidate() {
    const rules = {
      salesType: [
        { required: true, message: '请选择售卖类型' }
      ],
      upperDate: [
        { required: true, message: '请选择上刊日期' }
      ],
      downDate: [
        { required: true, message: '请选择下刊日期' }
      ],
      discount: [
        { required: true, message: '请填写销售折扣' }
      ],
      film: [
        { required: true, message: '请选择售卖类型' }
      ],
      advertType: [
        { required: true, message: '请选择广告类型' }
      ],
      advertLen: [
        { required: true, message: '请选择广告时长' }
      ],
    }
    return rules
  }

  async onChange(ev: Event) {
    (this.$Spin as any).show()
    const uploader = new Uploader({
        filePostUrl: `/bi/cinema/excel2json`,
        fileFieldName: 'file',
    })
    uploader.on('fail', (ex: any) => {
      error(ex.msg)
      return
    })
    const input = ev.target as HTMLInputElement
    this.file = input.files && input.files[0]
    this.inputhtml = this.file.name
    const a = await uploader.upload(this.file)
    const list = (this.chgcinema || []).map((it: any) => {
      return it.id
    })
    const b = (a || []).map((it: any) => {
      if (list.indexOf(it.id) == -1) {
        this.chgcinema.push(it)
      }
    })
    input.value = ''
    setTimeout(() => {
      (this.$Spin as any).hide()
    }, 1)
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

  // 批量选择影院
  onselect(row: any , selection: any) {
    this.ids = row.map((it: any) => {
      return it.id
    })
  }
  // 开始测算
  async search() {
    this.cinemalist = []
    this.showcinemaerr = false
    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      if (this.chgcinema.length == 0) {
        this.showcinemaerr = true
      }
      return
    }
    if (this.chgcinema.length == 0) {
        this.showcinemaerr = true
        return
    }
    if (this.dataForm.salesType == 1 && String((new Date(this.dataForm.downDate).getTime() -
    new Date(this.dataForm.upperDate).getTime()) / 7).indexOf('.') != -1 ) {
      info('上刊日期和下刊日期选择时必须是周（7天）的倍数')
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
    (this.$Spin as any).show()
    const start = new Date(this.dataForm.upperDate)
    const startdatetime = Number(String(start.getFullYear()) +
    String((start.getMonth() + 1) < 10 ? '0' + (start.getMonth() + 1) : (start.getMonth() + 1)) +
    String(start.getDate() < 10 ? '0' + start.getDate() : start.getDate()))
    const end = new Date(this.dataForm.downDate)
    const enddatetime = Number(String(end.getFullYear()) +
    String((end.getMonth() + 1) < 10 ? '0' + (end.getMonth() + 1) : (end.getMonth() + 1)) +
    String(end.getDate() < 10 ? '0' + end.getDate() : end.getDate()))
    const query = {
      salesType: this.dataForm.salesType,
      upperDate: startdatetime,
      downDate: enddatetime,
      cinemas: (this.chgcinema || []).map((it: any) => {
        return String(it.id)
      }),
      // cinemas: ['12325', '13235', '18631', '21108'],
      discount: this.dataForm.discount,
      // movies: this.dataForm.filmstatus == 1 ? [] : ['56439'],
      movies: this.dataForm.filmstatus == 1 ? [] : [String(this.dataForm.filmId)],
      type: this.dataForm.advertType,
      SPEC: this.dataForm.advertLen,
    }
    try {
      const list = await pricecalc(query)
      this.cinemalist.push({
        avgCpmTotalPrice: isNaN(list.data.avgCpmTotalPrice) ? null : list.data.avgCpmTotalPrice,
        onceAvgPrice: isNaN(list.data.onceAvgPrice) ? null : list.data.onceAvgPrice,
        hallWeekPrice: isNaN(list.data.hallWeekPrice) ? null : list.data.hallWeekPrice,
        sameTimeTotalPrice: isNaN(list.data.sameTimeTotalPrice) ? null : list.data.sameTimeTotalPrice,
        sameTimeShowViewCount: isNaN(list.data.sameTimeShowViewCount) ? null : list.data.sameTimeShowViewCount,
        sameTimeShowTimeCount: isNaN(list.data.sameTimeShowTimeCount) ? null : list.data.sameTimeShowTimeCount,
      })
      this.uuid = list.data.uuid
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.getmore()
    }
  }

  // 上刊影院数据输出
  async getmore() {
    this.loading = true
    try {
      const list = await cinemas(this.uuid, this.cinemapage)
      this.list = (list.data.items || []).map((it: any) => {
        return {
          ...it,
          onceAvgPrice: isNaN(it.onceAvgPrice) ? null : it.onceAvgPrice,
          hallWeekPrice: isNaN(it.hallWeekPrice) ? null : it.hallWeekPrice,
          cinemaCpmCost: isNaN(it.cinemaCpmCost) ? null : it.cinemaCpmCost,
          totalShowViews: isNaN(it.totalShowViews) ? null : it.totalShowViews,
          totalShowTimes: isNaN(it.totalShowTimes) ? null : it.totalShowTimes,
        }
      })
      this.total = list.data.totalCount
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 500)
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
      this.chgcinema = []
      this.dataForm = {
        salesType: 0, // 售卖类型
        upperDate: '',
        downDate: '',
        cinemaId: null,
        advertType: null,
        advertLen: null,
        discount: null,
        filmstatus: 1,
        filmId: null,
        pageIndex: 1,
        pageSize: 20,
      }
    }
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
      name: list.data.item.shortName,
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
    try {
      const list = await cinemas(this.uuid, {
        pageNo: 1,
        pageSize: 0,
      })
      ~(this.$refs.table as any).exportCsv({
          filename: '上刊影院数据输出列表',
          columns: this.exportcolumns,
          data: list.data.items
      })
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }
  // 设置下刊不可选时间
  @Watch('dataForm', { deep: true })
  watchDataForm() {
    this.begin = new Date(this.dataForm.upperDate).getTime()
  }
  // 添加影院分页
  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == 1) {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10), 10)
    } else {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10),
      this.query.pageIndex * this.query.pageSize)
    }
  }

  @Watch('chgcinema', { deep: true })
  watchChgcinema() {
    if (this.query.pageIndex == 1) {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10), 10)
    } else {
      this.pagechgcinema = this.chgcinema.slice(((this.query.pageIndex - 1) * 10),
      this.query.pageIndex * this.query.pageSize)
    }
    this.cinematotal = this.chgcinema.length
    if (this.cinematotal > 0) {
      this.showcinemaerr = false
    }
  }

  @Watch('cinemapage', { deep: true })
  watchCinemapage() {
    this.getmore()
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
.create-form {
  position: relative;
  display: inline-block;
  // float: left;
  // width: 83px;
  background: #2d8cf0;
  border: 1px solid #2d8cf0;
  border-radius: 4px;
  padding: 4px 12px;
  // overflow: hidden;
  color: #fff;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.adds {
  width: 200px;
  position: absolute;
  font-size: 100px;
  left: 0;
  top: 0;
  opacity: 0;
}
.viewhtml {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-left: 20px;
}
/deep/ .ivu-form-item-error-tip {
  display: inline-block !important;
  position: static;
  // top: 100%;
  // left: 0;
  line-height: 1;
  // padding-top: 6px;
  color: #ed4014;
}
</style>
