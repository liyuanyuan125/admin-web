<template>
  <div v-auth="'advert.executeOrder:cinemas'">
    <Row>已接单影院: {{total}}</Row>
    <div  class="pages" >
      
    <Row class="shouDlg-header">
      <Col span="4">
        <AreaSelect v-model="area"/>
      </Col>
      <Col span="4" offset="1">
         <Select v-model="dataForm.tmsStatus" placeholder="TMS接入状态" clearable>
            <Option v-for="it in statusTmsList" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
      </Col>
      <Col span="4" offset="1">
         <Select v-model="dataForm.tmsCode" placeholder="TMS品牌" clearable>
            <Option v-for="it in tmsCodeList" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
      </Col>
      <Col span="4" offset="1">
        <Input v-model="dataForm.query" placeholder="【专资编码】或 影院名称" />
      </Col>
      <Col span="4" offset="1">
        <Button type="primary" @click="search">搜索</Button>
      </Col>
    </Row>
    <div>
      <Button type="primary" @click="changeAll">批量取消执行</Button>
    </div>
    <Table ref="selection" :columns="columns" @on-selection-change="check" :data="list" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot="action" slot-scope="{row}" >
        <a v-auth="'advert.executeOrder:cancelCinema'" @click="change( row.id, row.shortName )">取消执行</a>
      </template>
    </Table>
    <div class="page-wrap" v-if="total > 0">
       <Page class="page" :total="total" :current="dataForm.pageIndex" :page-size="dataForm.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
    </div>
    <singDlg ref="addOrUpdate" @dlgEditDone="dlgEditDone" />
    </div>

  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { cinemaCancel , cinemaList , set } from '@/api/orderSys'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import {confirm , warning , success, toast , info } from '@/ui/modal'
import AreaSelect from '@/components/areaSelect'
import singDlg from './singDlg.vue'
import imgModel from './imgDlg.vue'
const makeMap = (list: any[]) => toMap(list, 'id', 'name')
import { findIndex } from 'lodash'
const timeFormat = 'YYYY-MM-DD HH:mm:ss'


const dataForm = {
  status: 1
}

const getstatus = (key: number, list: any[]) => {
    const i: number = findIndex(list, (it: any) => {
        return key === it.key
    })
    const res: string = (!list[i].text || list[i].text == '') ? '-' : list[i].text
    return res
}

@Component({
  components: {
    AreaSelect,
    singDlg,
    imgModel
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  // @Prop({ type: Array, default: () => [] }) cinemas!: any[]

  dataForm: any = {
    pageIndex: 1,
    pageSize: 20,
    query: '',
    provinceId: 0,
    cityId: 0,
    countyId: 0,
    tmsStatus: null,
    tmsCode: null,
  }
  cinemaArray: any = []
  showDlg = false
  addOrUpdateVisible = false
  changeVisible = false
  area: any = []
  totalPage = 0
  loading = false
  list = []
  total = 0
  typeList = []
  showTime: any = []
  checkId: any = []

  statusTmsList: any = [
    {
      key: '1',
      text: '已接入'
    },
    {
      key: '2',
      text: '未接入'
    }
  ]
  tmsCodeList: any = [
    {
      key: '1',
      text: '品牌1'
    },
    {
      key: '2',
      text: '品牌2'
    },
    {
      key: '3',
      text: '品牌3'
    }
  ]

  get columns() {
    const data: any = [
      {
        type: 'selection',
        title: '全选',
        width: 60,
        align: 'center'
      },
      { title: '影院名称', key: 'shortName', width: 130, align: 'center' },
      { title: '影厅数量', width: 60, key: 'hallCount', align: 'center' },
      { title: '专资编码', width: 120, key: 'code', align: 'center' },
      {
        title: '所在地',
        key: 'status',
        align: 'center',
        render: (hh: any, { row: { areaName, provinceName, cityName } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const area = areaName ? areaName + ' , ' : ''
          const province = provinceName ? provinceName + ' , ' : ''
          const city = cityName ? cityName : ''
          return <span>{area}{province}{city}</span>
          /* tslint:enable */
        }
      },
      { title: '是否接入TMS', width: 120, key: 'tmsStatusText', align: 'center' },
      { title: 'TMS品牌', width: 120, key: 'tmsCodeText', align: 'center' },
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
    // return this.$route.params.status == '2' ? [...check, ...data, ...opernation] : data
    return [...data, ...opernation]
  }

  check(row: any , selection: any) {
    this.checkId = row.map((it: any) => {
      return it.id
    })
  }

  async dlgEditDone(id: any) {
    this.search()
    if ((this.total - 1) == 0) {
      const res = await set ({id: this.$route.params.id, reasond: '无有效影院'})
    }
    this.$emit('dlgEditDone')
  }


  // 每页数
  sizeChangeHandle(val: any) {
    this.dataForm.pageIndex = val
    this.search()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.dataForm.pageSize = val
    this.search()
  }

  mounted() {
    this.search()
  }

  async search() {
    if (this.loading) {
      return
    }
    this.loading = true
    const query = clean({ ...this.dataForm})
    try {
        // 订单列表
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
        planTypeList: planTypeList,
        statusTmsList: statusTmsList,
        tmsCodeList: tmsCodeList
      } } = await cinemaList(this.$route.params.id, query)
      this.list = (list || []).map((it: any) => {
        return {
          ...it,
          tmsStatusText: it.tmsStatus == null ? '-' : getstatus(it.tmsStatus , statusTmsList),
          tmsCodeText: it.tmsCode == null ? '-' : getstatus(it.tmsCode , tmsCodeList),
        }
      })
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  @Watch('area', {immediate : true})

  watchArea(val: number[]) {
    this.dataForm.provinceId = !!val[0] ? val[0] : ''
    this.dataForm.cityId = !!val[1] ? val[1] : ''
    this.dataForm.countyId = !!val[2] ? val[2] : ''
  }

  change(id: number, shortName: any) {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).init(id, shortName)
    })
  }

  changeAll() {
    if (this.checkId.length == 0) {
      info('请先选择需要审核的信息')
      return
    }
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).inits(this.checkId , this.total)
    })
  }

  // @Watch('cinemaArray', {deep: true})

  // watchcinemaArray(val: number[]) {
  //   if (val.length > 0) {
  //     this.search()
  //   }
  // }

  // @Watch('cinemas', {deep: true})

  // watchcinemas(val: number[]) {
  //   this.cinemaArray = val
  // }
}
</script>

<style lang="less" scoped>
.form {
  .input,
  /deep/ .ivu-select {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }
  .input-corp-id {
    width: 80px;
  }
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Add-Inp {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 15px;
}
.Add-Inp span {
  display: inline-block;
  width: 7%;
  text-align: right;
  margin-right: 4%;
}
.Add-Inp input {
  display: inline-block;
}
.button2 {
  width: 6%;
  height: 40px;
  margin-left: 5%;
}
.page-f {
  margin-top: 10px;
  font-size: 15px;
}
.bge {
  background: #fff;
  padding: 5px;
}
.info {
  width: 35%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 20%;
  font-size: 14px;
  z-index: 10;
}
.info-ver {
  width: 100%;
  height: 43px;
  line-height: 43px;
  padding-left: 3%;
  border-bottom: 1px solid #ccc;
}
.info-ver .info-Icon {
  float: right;
  margin-right: 3%;
  font-weight: bold;
  margin-top: 10px;
}
.info-type {
  padding: 17px;
}
.info-type-t {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.info-type-t div {
  display: inline-block;
  width: 50%;
}
.info-type-t div span {
  margin-left: 10%;
}
.info-type-t .ivu-radio-group {
  margin-left: 5%;
}
.info-inp {
  margin-left: 5%;
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
.pages {
  background: #e4e4e4;
  padding: 20px 10px 2px 10px;
}
</style>
