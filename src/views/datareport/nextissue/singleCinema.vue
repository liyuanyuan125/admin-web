<template>
  <div >
    <div  class="pages" >
      
    <Row class="shouDlg-header">
      <Col span="4">
        <AreaSelect v-model="area"/>
      </Col>
      <Col style='margin-left: 15px;' span="4">
        <Input v-model="dataForm.query" placeholder="影城名称" />
      </Col>
      <Col style='margin-left: 15px;' span="4">
        <Select v-model="dataForm.status" placeholder="影城级别" clearable>
            <Option v-for="it in []" :key="it.key" :value="it.key"
              :label="it.text">{{it.text}}</Option>
          </Select>
      </Col>
      <Col style='margin-left: 15px;' span="6">
        <Button type="primary" @click="search">搜索</Button>
        <Button style='margin-left: 15px;' type="primary" @click="changeAll">批量下刊</Button>
      </Col>
    </Row>
    <Table ref="selection" :columns="columns" @on-selection-change="check" :data="list" :loading="loading"
      border stripe disabled-hover size="small" class="table">
      <template slot="action" slot-scope="{row}" >
        <a  @click="change( row.id, row.shortName )">取消执行</a>
      </template>
    </Table>
    <div class="page-wrap" v-if="total > 0">
       <Page class="page" :total="total" :current="dataForm.pageIndex" :page-size="dataForm.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
    </div>
    <!-- <singDlg ref="addOrUpdate" @dlgEditDone="dlgEditDone" /> -->
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
const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  status: 1
}

@Component({
  components: {
    AreaSelect,
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
    status: null,
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
      {
        type: 'selection',
        title: '全选',
        width: 60,
        align: 'center'
      },
      { title: '预计今日完成率', key: 'shortName', width: 100, align: 'center' },
      { title: '预计明日完成率', width: 100, key: 'hallCount', align: 'center' },
      { title: '预计完成日期', width: 110, key: 'code', align: 'center' },
      { title: '影城名称', width: 120, key: 'code', align: 'center' },
      { title: '专资编码', width: 70, key: 'code', align: 'center' },
      { title: '当日人次', width: 110, key: 'code', align: 'center' },
      { title: '当日场次', width: 110, key: 'code', align: 'center' },
      { title: '明日人次', width: 110, key: 'code', align: 'center' },
      { title: '明日场次', width: 110, key: 'code', align: 'center' },
      { title: '实际累计人次', width: 110, key: 'code', align: 'center' },
      { title: '预计总人次', width: 110, key: 'code', align: 'center' },
      { title: '实际累计场次', width: 110, key: 'code', align: 'center' },
      { title: '预计总场次', width: 110, key: 'code', align: 'center' },
    ]
    const opernation = [
       {
        title: '操作',
        key: 'status',
        align: 'center',
        width: 70,
        slot: 'action'
      }
    ]
    return [...data, ...opernation]
  }

  check(row: any , selection: any) {
    this.checkId = row.map((it: any) => {
      return it.id
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
    // this.addOrUpdateVisible = true
    // this.$nextTick(() => {
    //   (this.$refs.addOrUpdate as any).init(id, shortName)
    // })
  }

  changeAll() {
    // if (this.checkId.length == 0) {
    //   info('请先选择需要审核的信息')
    //   return
    // }
    // this.addOrUpdateVisible = true
    // this.$nextTick(() => {
    //   (this.$refs.addOrUpdate as any).inits(this.checkId , this.total)
    // })
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
  padding: 20px 10px 2px 10px;
}
</style>
