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
                <a href="https://aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bm6t7aionakg00bh1m80.xlsx" :download='"https://aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bm6t7aionakg00bh1m80.xlsx"'>下载影院模版列表.xls</a>
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
                <Button style='margin-left: 100px;margin-top: 10px;' type='primary'>批量删除</Button>
              </Row>
              <Table 
                style='margin-top: 10px;margin-left: 100px;' 
                ref='selection' 
                :columns="chgcinemacolumns" 
                selectable
                @on-selection-change="onselect"
                :data="chgcinema" border stripe disabled-hover size="small" class="table">
            </Table>
            </FormItem>
            <FormItem label="销售折扣" prop="discount">
              <InputNumber style="width: 200px" :min='0' :max="1" placeholder="输入0-1之间的折扣" v-model="dataForm.discount"></InputNumber>
              <!-- <InputNumber :max="10" :min="1" v-model="dataForm.discount"></InputNumber> -->
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
        </Table>
        <Row class='title1'>
          <span>上刊影院数据输出:</span>
          <Button style='float: right;margin-top: 10px;' type='primary'>导出</Button>
        </Row>
         <Table ref='table' :columns="columns" :data="list" :loading="loading"
        border stripe disabled-hover size="small" class="table">
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
    { title: '操作' , key: 'tomorrowFinishRate', align: 'center' },
  ]

  cinemacolumns = [
    { title: '整体影院平均单场价格', key: 'planId', align: 'center'},
    { title: '整体影院平均单厅单周价格', key: 'planName', align: 'center' },
    { title: '整体影院同期价格', key: 'todayFinishRate', align: 'center' },
    { title: '整体影院同期人次' , key: 'tomorrowFinishRate', align: 'center' },
    { title: '整体影院同期总场次' , key: 'budgetFinishDate', align: 'center' },
  ]

  columns = [
    { title: '专资编码', key: 'planId', align: 'center', width: 100 },
    { title: '影院名称', key: 'planName', align: 'center' },
    { title: '省份', key: 'todayFinishRate', align: 'center' },
    { title: '城市' , key: 'tomorrowFinishRate', align: 'center' },
    { title: '地址' , key: 'budgetFinishDate', align: 'center' },
    { title: '开业时间' , key: 'budgetPersonCount', align: 'center' },
    { title: '平均单场价格(元)' , key: 'personCount', align: 'center' },
    { title: '总价(元)' , key: 'budgetShowCount', align: 'center' },
    { title: '总场次' , key: 'showCount', align: 'center' },
    { title: '总人次' , key: 'cost', align: 'center' }
  ]

  disabledDate(date: any) {
    // console.log(Date.now())
    return date && date.valueOf() < this.begin
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
    // console.log(123
    // console.log(this.dataForm)
  }

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
    if (this.cinemalistArray.indexOf(this.dataForm.cinemaId) != -1) {
      info('请勿重复添加影院')
      return
    }
    this.cinemalistArray.push(this.dataForm.cinemaId)
    // console.log(this.dataForm.cinemaId)
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
  }

  @Watch('dataForm', { deep: true })
  watchQuery() {
    this.begin = new Date(this.dataForm.beginDate).getTime()
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
