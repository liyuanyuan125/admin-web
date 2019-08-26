<template>
  <div class="pages" >
    <div class='title'><!-- 投放影院({{total}}家) --> 接单影院 / 派单影院 : 3 / 5
      <span style='float: right;cursor: pointer;' @click="exportData">导出影院列表</span>
    </div>
    <div class='bos'>
      <Row class="shouDlg-header">
        <Col span="5">
          <AreaSelect v-model="area"/>
        </Col>
        <Col span="4" offset="1">
          <Input v-model="dataForm.cinemaName" placeholder="【专资编码】或 影院名称" />
        </Col>
        <Col span='4' offset="1">
          <!-- <Select v-model="dataForm.resourceId" placeholder="资源方公司名称" style='width: 200px;'  filterable>
            <Option v-for="it in []" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select> -->
          <compangList v-model='dataForm.resourceId' @done="dlgEditDone"/>
        </Col>
        <Col span='4' offset="1">
          <Select v-model="dataForm.resourceId" placeholder="接单状态" style='width: 200px;'  filterable>
            <Option v-for="it in []" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Button type="primary" @click="searchrrr">搜索</Button>
        </Col>
      </Row>
      <Button type="primary" @click="changeAll" v-if='$route.params.ifs == 1 && ($route.params.status == 2 || $route.params.status == 3 || $route.params.status == 4 || $route.params.status == 10)'>批量删除</Button>
      <Table ref="table" :columns="columns" @on-selection-change="onselect" :data="list" :loading="loading"
        border stripe disabled-hover size="small" class="table">
        <template slot="resourceId" slot-scope="{row}" >
          <div v-for='(it, index) in reslist'>
            <span v-if='row.resourceId == it.id'>{{it.name}}&nbsp;&nbsp;&nbsp;
              <a v-if='$route.params.ifs == 1 && ($route.params.status == 2 || $route.params.status == 3 || $route.params.status == 4 || $route.params.status == 10)' 
                @click="change( row.cinemaId , row.cinemaName ,  it.name , it.id)">变更</a>
            </span>
          </div>
          <div v-if='reasd.indexOf(row.resourceId) == -1'>暂无资源方公司</div>
          <!-- <a @click="delcinema( row.id )">变更</a> -->
        </template>
        <template  slot="action" slot-scope="{row}" >
          <a @click="delcinema( row.cinemaId )">删除</a>
        </template>
      </Table>
      <div class="page-wrap" v-if="total > 0">
         <Page class="page" :total="total" :current="dataForm.pageIndex" :page-size="dataForm.pageSize"
            show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
            @on-change="sizeChangeHandle"
            @on-page-size-change="currentChangeHandle"/>
      </div>
      <div class="act-bar">
        <a @click="onAdd" v-if="!type && $route.params.status == 2 || $route.params.status == 3 || $route.params.status == 4 || $route.params.status == 10 || $route.params.status == 6 || $route.params.status == 7" @done="dlgEditDone">添加影院</a>&nbsp;&nbsp;&nbsp;
        <Button v-if='$route.params.ifs == 1 && ($route.params.status == 4 || $route.params.status == 6 || $route.params.status == 7)' type="primary" @click='cinemaImport'>批量导入</Button>
        <Form class="create-form form-item"   enctype="multipart/form-data" ref="form"
          :label-width="120">上传文件
          <input type="file" class='adds' @change="onChange" />
        </Form>
        <span class='viewhtml'>{{inputhtml}}</span>
      </div>
      <changeDlg ref="change" v-if='changeVisible' @done="dlgEditDone" />
      <AddCinemaModel v-if="type != 'detail'" ref="addCinemaModel" :cinemaend = "incinematype" :addData="inValue" @done="dlgEditDone" />
    </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { cinemaList , delcin , aresids , importCinema } from '@/api/beforeplan'
import { queryList } from '@/api/corpReal'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import {confirm , warning , success, toast , info } from '@/ui/modal'
import AreaSelect from '@/components/areaSelect'
import changeDlg from '../changeDlg.vue'
import AddCinemaModel from './addCinemaModel.vue'
import compangList from '../../supervision/companyList.vue'
import Uploader from '@/util/Uploader'
const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD HH:mm:ss'

import { findIndex } from 'lodash'
// 导出影院公司名称
const getName = (id: number, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return id === it.id
  })
  const res: string = (!list[i].name || list[i].name == '') ? '-' : list[i].name
  return res
}

const uploader: any = new Uploader({
  // filePostUrl: `/xadvert/plans/` + ((this.$route.params.id) as any) + `/import-cinema`,
  fileFieldName: 'file',
})


const dataForm = {
  status: 1
}

@Component({
  components: {
    AreaSelect,
    changeDlg,
    AddCinemaModel,
    compangList,
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
    cinemaName: '',
    resourceId: null,
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
  list: any = []
  total = 0
  typeList = []
  showTime: any = []
  checkId: any = []
  ids: any = []
  reslist: any = []
  reasd: any = []
  aaa = false
  viewcinema = false
  dataList: any = []


  // 批量导入影院
  file: File | any = null
  inputhtml: any = ''


  get columns() {
    const data: any = [
      { title: '影院名称', key: 'cinemaName', align: 'center' },
      { title: '专资编码', key: 'code', align: 'center' , width: 80 },
      { title: '所在省', key: 'provinceName', align: 'center', width: 80 },
      { title: '所在市', key: 'cityName', align: 'center', width: 80 },
      { title: '所在区', key: 'countyName', align: 'center', width: 80 },
      { title: '所属资源方', slot: 'resourceId', align: 'center' },
      { title: '联系人', width: 120, key: 'contract', align: 'center' },
      { title: '联系电话', width: 120, key: 'contractTel', align: 'center' },
      { title: '接单状态', width: 120, key: 'acceptStatus', align: 'center' },
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
    return this.$route.params.ifs == '1' && (this.$route.params.status == '2' || this.$route.params.status == '3' ||
    this.$route.params.status == '4' || this.$route.params.status == '10') ? [...check, ...data, ...opernation] : data
  }

  get columnsData() {
    const data: any = [
      { title: '影院名称', key: 'cinemaName', align: 'center' },
      { title: '专资编码', key: 'code', align: 'center' , width: 80 },
      { title: '所在省', key: 'provinceName', align: 'center', width: 80 },
      { title: '所在市', key: 'cityName', align: 'center', width: 80 },
      { title: '所在区', key: 'countyName', align: 'center', width: 80 },
      { title: '所属资源方', key: 'resourceName', align: 'center' },
      { title: '联系人', width: 120, key: 'contract', align: 'center' },
      { title: '联系电话', width: 120, key: 'contractTel', align: 'center' },
    ]
    return data
  }

  dlgEditDone(id: any) {
    this.viewcinema = true
    this.$emit('getcine', this.viewcinema)
    this.search()
  }

  onselect(row: any , selection: any) {
    this.ids = row.map((it: any) => {
      return it.cinemaId
    })
  }

  // 下载
  exportData() {
    const res: any = (this.list || []).map((it: any) => {
      return {
        ...it,
        resourceName: getName(it.resourceId, this.reslist)
      }
    })

    ~(this.$refs.table as any).exportCsv({
      filename: '投放影院列表',
      columns: this.columnsData,
      data: res
    })
  }

  // 批量导入影院
  async onChange(ev: Event) {
    const input = ev.target as HTMLInputElement
    this.file = input.files && input.files[0]
    this.inputhtml = this.file.name

    const  a = await uploader.upload(this.file)
  }

  // 删除影院
  async delcinema(id: any) {
    try {
      await confirm('您确定删除当前影院信息吗？')
      await delcin(this.$route.params.id , { cinemaIds : [id]})
      this.$Message.success({
        content: `删除成功`,
      })
      this.search()
      this.viewcinema = true
      this.$emit('getcine', this.viewcinema)
    } catch (ex) {
      this.handleError(ex)
    }
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
      (this.$refs.addCinemaModel as any).init(this.list)
    })
  }



  mounted() {
    this.search()
  }

  searchrrr() {
    this.dataForm.pageIndex = 1
    this.search()
  }

  async search() {
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

      const { data } =  await queryList(clean({
        pageSize: 888888,
        status: 1,
        typeCode: 'resource'
      }))
      this.reslist = data.items
      this.reasd = (this.reslist || []).map((it: any) => {
        return it.id
      })

    } catch (ex) {
      // this.handleError(ex)
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

  change(id: any, cName: any , name: any , idres: any) {
    this.changeVisible = true
    this.$nextTick(() => {
      (this.$refs.change as any).init(id, cName , name , idres)
    })
  }

  async changeAll() {
    // this.addOrUpdateVisible = true
    // this.$nextTick(() => {
    //   (this.$refs.addOrUpdate as any).init(this.ids)
    // })
    if (this.ids.length == 0) {
      info('请选择要删除的影院')
      return
    }
    try {
      await confirm('您确定删除这些影院信息吗？')
      await delcin(this.$route.params.id , { cinemaIds : this.ids})
      this.$Message.success({
        content: `删除成功`,
      })
      this.search()
      this.viewcinema = true
      this.$emit('getcine', this.viewcinema)
    } catch (ex) {
      this.handleError(ex)
    }
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

  @Watch('dataForm', {deep: true})

  watchDataForm(val: number[]) {
    this.search()
  }
}
</script>

<style lang="less" scoped>
@import '../../../../site/lib.less';
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
.title {
  font-size: 16px;
  color: @c-base;
  line-height: 50px;
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
.bos {
  border: 1px solid #ccc;
  padding: 15px;
}
</style>
