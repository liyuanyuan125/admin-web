<template>
  <div class="pages" v-auth="'advert.executeOrder:cinemas'">
    <Row class="shouDlg-header">
      <Col span="5">
        <AreaSelect v-model="area"/>
      </Col>
      <Col span="5" offset="1">
        <Input v-model="dataForm.name" placeholder="【专资编码】或 影院名称" />
      </Col>
      <Col span='5' offset="1">
        <Select v-model="dataForm.resourceCompanyId" placeholder="资源方公司名称" style='width: 200px;'  filterable>
          <Option v-for="it in []" :key="it.id" :value="it.id"
            :label="it.name">{{it.name}}</Option>
        </Select>
      </Col>
      <Col span="4" offset="1">
        <Button type="primary" @click="search">搜索</Button>
      </Col>
    </Row>
    <div v-if="checkId">
      <Button type="primary" @click="changeAll">批量删除</Button>
    </div>
    <Table :columns="columns" @on-selection-change="check" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template v-if="$route.params.status == '2'" slot="action" slot-scope="{row}" >
        <a v-auth="'advert.executeOrder:cancelCinema'" @click="change( row.id, row.shortName )">取消执行</a>
      </template>
    </Table>
    <div class="page-wrap" v-if="total > 0">
       <Page class="page" :total="total" :current="dataForm.pageIndex" :page-size="dataForm.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
    </div>
    <div class="act-bar">
      <a @click="onAdd" v-if="!type">添加影院</a>
    </div>
    <singDlg ref="addOrUpdate" @done="dlgEditDone" />
    <AddCinemaModel v-if="type != 'detail'" ref="addCinemaModel" :cinemaend = "incinematype" :addData="inValue" @done="columndata" />
  </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { cinemaCancel , cinemaList } from '@/api/orderSys'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import {confirm , warning , success, toast } from '@/ui/modal'
import AreaSelect from '@/components/areaSelect'
import singDlg from './singDlg.vue'
import AddCinemaModel from './addCinemaModel.vue'
const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}

@Component({
  components: {
    AreaSelect,
    singDlg,
    AddCinemaModel
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: any[]

  // 判断新增和添加
  @Prop() type: any

  /**
   * 分润单位列表
   */

  /**
   * 是否为影院
   */
  @Prop() incinematype: any

  inValue: any[] = this.value
  addShow =  false
  @Prop({ type: Array, default: () => [] }) cinemas!: any[]

  dataForm: any = {
    pageIndex: 1,
    pageSize: 20,
    name: '',
    provinceId: 0,
    cityId: 0,
    countyId: 0,
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

  get columns() {
    const data: any = [
      { title: '影院名称', key: 'shortName', align: 'center' },
      { title: '专资编码', key: 'code', align: 'center' },
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
      { title: '所属资源方', width: 120, key: 'code', align: 'center' },
      { title: '联系人', width: 120, key: 'code', align: 'center' },
      { title: '联系电话', width: 120, key: 'code', align: 'center' },
    ]
    const check = [
       {
        type: 'selection',
        title: '全选',
        width: 60,
        align: 'center'
      }
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
    return this.$route.params.status == '2' ? [...check, ...data, ...opernation] : data
  }

  check(data: any) {
    const ids = this.tableData.map((it: any) => it.id)
    const dataId = data.map((it: any) => it.id)
    data.forEach((item: any) => {
      if (!this.checkId.includes(item.id)) {
        this.checkId.push(item.id)
      }
    })
    const filterId = ids.filter((it: any) => !dataId.includes(it))
    this.checkId = this.checkId.filter((it: any) => !filterId.includes(it))
  }

  get cachedMap() {
    return {
    }
  }

  dlgEditDone(id: any) {
    // if (id.length > 0) {
    //   id.map((it: any) => {
    //     this.cinemaArray = this.cinemaArray.filter((its: any) => its != it)
    //     this.checkId = this.checkId.filter((its: any) => its != it)
    //   })
    // } else {
    //   this.cinemaArray = this.cinemaArray.filter((it: any) => it != id)
    // }
    this.search()
  }

  get tableData() {
    if (this.cinemaArray.length == 0) {
      return []
    }
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it
      }
    })
    const list1 = (this.list || []).map((it: any) => {
      if (this.checkId.includes(it.id)) {
        return {
          ...it,
          _checked: true
        }
      } else {
        return {
          ...it,
        }
      }
    })
    return this.$route.params.status == '2' ? list1 : list
  }

  find() {
    this.$nextTick(() => {
      (this.$refs.img as any).init()
    })
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

  onAdd() {
    this.addShow = true
    this.$nextTick(() => {
      (this.$refs.addCinemaModel as any).init(this.tableData)
    })
  }

  columndata(val: any) {
    this.search()
  }


  mounted() {
    this.search()
  }

  async search() {
    if (this.loading) {
      return
    }
    if (this.cinemaArray.length == 0) {
      return
    }
    this.loading = true
    const query = clean({ ...this.dataForm, ids: this.cinemaArray.join(',') })
    try {
        // 订单列表
      const { data: {
        items: list,
        totalCount: total,
        statusList: statusList,
        planTypeList: planTypeList
      } } = await cinemaList(this.$route.params.id, query)
      this.list = list
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
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).inits(this.checkId)
    })
  }

  @Watch('cinemaArray', {deep: true})

  watchcinemaArray(val: number[]) {
    if (val.length > 0) {
      this.search()
    }
  }

  @Watch('cinemas', {deep: true})

  watchcinemas(val: number[]) {
    this.cinemaArray = val
  }
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
