<template>
    <div class="pages" style='position: relative;'>
        <div class='title'>
            <span v-if='$route.params.status == "3" '>投放影院({{total}}家)</span>
        </div>
        <span v-if='$route.params.status == "3" ' class='pos' style='top: 0px;' @click="exportData">导出影院列表</span>
        <span v-if='$route.params.status != "3" ' class='pos' style='top: -50px;' @click="exportData">导出影院列表</span>
        <div class='bos'>
            <Row class="shouDlg-header">
                <Col style='margin-left: 1%;' span="5">
                  <AreaSelect v-model="area" />
                </Col>
                <Col style='margin-left: 1%;' span="3" >
                  <Input v-model="dataForm.query" placeholder="【专资编码】或 影院名称" />
                </Col>
                <Col style='margin-left: 1%;' span='3' >
                  <compangList v-model='dataForm.resourceId' @done="dlgEditDone" />
                </Col>
                <Col style='margin-left: 1%;' v-if='$route.params.status == "3" || $route.params.ifs == "0"' span='3' >
                  <Select v-model="dataForm.tmsStatus" placeholder="TMS接入状态" clearable>
                    <Option v-for="it in statusTmsList" :key="it.key" :value="it.key" v-if='it.key != 0'
                      :label="it.text">{{it.text}}</Option>
                  </Select>
                </Col>
                <Col style='margin-left: 1%;' v-if='$route.params.status == "3" || $route.params.ifs == "0"' span='3' >
                  <Select v-model="dataForm.tmsCode" placeholder="TMS品牌" clearable>
                    <Option v-for="it in tmsCodeList" :key="it.key" :value="it.key"
                      :label="it.text">{{it.text}}</Option>
                  </Select>
                </Col>
                <Col style='margin-left: 1%;' v-if='$route.params.status != 3' span='3' >
                  <Select v-model="dataForm.acceptStatus" placeholder="接单状态" filterable>
                    <Option v-for="it in acceptStatusList" :key="it.key" :value="it.key" :label="it.text">{{it.text}}</Option>
                  </Select>
                </Col>
                <Col style='margin-left: 1%;' span="2" >
                <Button type="primary" @click="searchall">搜索</Button>
                </Col>
            </Row>
            <Button type="primary" @click="changeAll" v-if='$route.params.ifs == 1 && ($route.params.status == 3 || $route.params.status == 10)'>批量删除</Button>
            <Table ref="table" :columns="columns" @on-selection-change="onselect" :data="list" :loading="loading" border stripe disabled-hover size="small" class="table">
                <template slot="resourceId" slot-scope="{row}">
                    <div v-for='(it, index) in reslist'>
                        <span v-if='row.resourceId == it.id'>{{it.name}}&nbsp;&nbsp;&nbsp;
                            <a v-if='($route.params.ifs == 1 && ($route.params.status == 3)) || $route.params.ifs == 1 && row.ifchgRes == true' @click="change( row.cinemaId , row.cinemaName ,  it.name , it.id)">变更</a>
                        </span>
                    </div>
                    <div v-if='reasd.indexOf(row.resourceId) == -1'>暂无资源方公司</div>
                    <!-- <a @click="delcinema( row.id )">变更</a> -->
                </template>
                <template slot="action" slot-scope="{row}">
                    <a @click="delcinema( row.cinemaId )">删除</a>
                </template>
            </Table>
            <div class="page-wrap" v-if="total > 0">
                <Page class="page" :total="total" :current="dataForm.pageIndex" :page-size="dataForm.pageSize" show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]" @on-change="sizeChangeHandle" @on-page-size-change="currentChangeHandle" />
            </div>
            <div class="act-bar" style='margin-top: 15px;'>
                <a style='float: left; margin-right: 15px;' @click="onAdd" v-if="!type && $route.params.status == 3 || $route.params.status == 10 || $route.params.status == 6 || $route.params.status == 7" @done="dlgEditDone">添加影院</a>&nbsp;&nbsp;&nbsp;
                <Form v-if='$route.params.ifs == 1 && ($route.params.status == 3 || $route.params.status == 6 || $route.params.status == 7)' class="create-form form-item" enctype="multipart/form-data" ref="form" :label-width="120">批量导入
                    <input ref='input' type="file" class='adds' @change="onChange" />
                </Form>
                <span class='viewhtml'>{{inputhtml}}</span>
            </div>
            <changeDlg ref="change" v-if='changeVisible' @done="dlgEditDone" />
            <AddCinemaModel v-if="type != 'detail'" ref="addCinemaModel" :cinemaend="incinematype" :addData="inValue" @done="dlgEditDone" />
        </div>
        <Modal 
            v-model='showCodeList'
            :transfer='true'
            :width='600'
            :title="'导入影院'"
            @on-cancel="cancel('dataForm')" >
                <p>导入成功{{successCodes.length}}家，失败{{failCodes.length}}家</p>
                <div v-bind:class="{ modelactive: failCodes.length > 330 }" v-if='failCodes.length != 0'>
                  失败影院：<span style='display: inline-block;' v-for='it in failCodes' :key='it'>{{it}},&nbsp;&nbsp;</span>
                </div>
               <!--  <div v-if='failCodes.length != 0'>
                  失败影院：<span class='codeTypes' style='display: inline-block;' v-for='it in failCodes' :key='it'>{{it}},&nbsp;&nbsp;</span>
                </div> -->
            <div slot="footer" class="dialog-footer">,
              <Button type="primary" @click="cancel()">确定</Button>
            </div>
          </Modal>
    </div>
    </div>
</template>
<script lang="tsx">
import { Component, Watch, Mixins, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { get } from '@/fn/ajax'
import { cinemaList, delcin, aresids, importCinema , getCinema } from '@/api/beforeplan'
import { queryList } from '@/api/corpReal'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { confirm, warning, success, toast, info , alert , error } from '@/ui/modal'
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

const getstatus = (key: number, list: any[]) => {
    const i: number = findIndex(list, (it: any) => {
        return key === it.key
    })
    // console.log(i)
    if (i != -1) {
      const res: string = (!list[i].text || list[i].text == '') ? '-' : list[i].text
      return res
    }
}


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
    addShow = false
    @Prop({ type: Array, default: () => [] }) cinemas!: any[]

    dataForm: any = {
        pageIndex: 1,
        pageSize: 20,
        query: '',
        resourceId: null,
        provinceId: 0,
        cityId: 0,
        countyId: 0,
        acceptStatus: null,
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
    list: any = []
    list1: any = []
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
    // 接单转态
    acceptStatusList: any = []

    getCinema: any = false

    showCodeList: any = false
    failCodes: any = []
    successCodes: any = []


    // 批量导入影院
    file: File | any = null
    inputhtml: any = ''

    b: any = []
    tms: any = []
    exporttms: any = []

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

    defaultCinemaLength: any = 0


    get columns() {
        const data: any = [
            { title: '影院名称', key: 'cinemaName', align: 'center' },
            { title: '专资编码', key: 'code', align: 'center', width: 80 },
            { title: '所在省', key: 'provinceName', align: 'center', width: 80 },
            { title: '所在市', key: 'cityName', align: 'center', width: 80 },
            { title: '所在区', key: 'countyName', align: 'center', width: 80 },
            { title: '所属资源方', slot: 'resourceId', align: 'center' },
            { title: '联系人', width: 120, key: 'contract', align: 'center' },
            { title: '联系电话', width: 120, key: 'contractTel', align: 'center' },
        ]
        if (this.$route.params.status == '3' || this.$route.params.ifs == '0') {
          this.tms = [
            { title: '是否接入TMS' , key: 'tmsStatusText', align: 'center' },
            { title: 'TMS品牌' , key: 'tmsCodeText', align: 'center' },
          ]
        } else {
          this.tms = []
        }
        if (this.$route.params.status == '3') {
          this.b = []
        } else {
          this.b = [
            { title: '接单状态', width: 120, key: 'acceptStatus', align: 'center',
              render: (hh: any, { row: { acceptStatus } }: any) => {
                /* tslint:disable */
                const h = jsxReactToVue(hh)
                if (acceptStatus == 0) {
                  return <span class='datetime' v-html={'未知'}></span>
                } else if (acceptStatus == 1) {
                  return <span class='datetime' v-html={'已接单'}></span>
                } else if (acceptStatus == 2) {
                  return <span class='datetime' v-html={'已拒单'}></span>
                } else {
                  return <span class='datetime' v-html={'-'}></span>
                }
                
                /* tslint:enable */
              }
            },
          ]
        }

        const check = [{
            type: 'selection',
            title: '全选',
            width: 60,
            align: 'center'
        }]
        const opernation = [{
            title: '操作',
            key: 'status',
            align: 'center',
            width: 80,
            slot: 'action'
        }]
        return this.$route.params.ifs == '1' && (this.$route.params.status == '2' || this.$route.params.status == '3' ||
                this.$route.params.status == '4' || this.$route.params.status == '10') ?
            [...check, ...data, ...this.tms, ...this.b, ...opernation] : [...data , ...this.tms , ...this.b]
    }

    get columnsData() {
        const data: any = [
            { title: '影院名称', key: 'cinemaName', align: 'center' },
            // { title: '是否接入TMS', width: 120, key: 'tmsStatusText', align: 'center' },
            // { title: 'TMS品牌', width: 120, key: 'tmsCodeText', align: 'center' },
            { title: '专资编码', key: 'code', align: 'center', width: 80 },
            { title: '所在省', key: 'provinceName', align: 'center', width: 80 },
            { title: '所在市', key: 'cityName', align: 'center', width: 80 },
            { title: '所在区', key: 'countyName', align: 'center', width: 80 },
            { title: '所属资源方', key: 'resourceName', align: 'center' },
            { title: '联系人', width: 120, key: 'contract', align: 'center' },
            { title: '联系电话', width: 120, key: 'contractTel', align: 'center' },
        ]
        const b: any =  [
            { title: '接单状态', width: 120, key: 'acceptStatusName', align: 'center' },
        ]
        if (this.$route.params.status == '3' || this.$route.params.ifs == '0') {
          this.exporttms = [
            { title: '是否接入TMS' , key: 'tmsStatusText', align: 'center' },
            { title: 'TMS品牌' , key: 'tmsCodeText', align: 'center' },
          ]
        } else {
          this.exporttms = []
        }
        return this.$route.params.status == '3' ? [...data , ...this.exporttms] : [...data , ...this.exporttms, ...b]
    }

    dlgEditDone(id: any) {
        this.viewcinema = true
        this.$emit('getcine', this.viewcinema)
        this.search()
    }

    onselect(row: any, selection: any) {
        this.ids = row.map((it: any) => {
            return it.cinemaId
        })
    }

    cancel(dataForms: string) {
    this.showCodeList = false
  }

    // 下载
    async exportData() {
        try {
            const a = await getCinema(this.$route.params.id)
            const b = a.data
            const res: any = (b || []).map((it: any) => {
                return {
                    ...it,
                    resourceName: getName(it.resourceId, this.reslist),
                    tmsStatusText: it.tmsStatus == null ? '' : getstatus(it.tmsStatus , this.statusTmsList),
                    tmsCodeText: it.tmsCode == null ? '' : getstatus(it.tmsCode , this.tmsCodeList),
                }
            })

            ~(this.$refs.table as any).exportCsv({
                filename: '投放影院列表',
                columns: this.columnsData,
                data: res
            })
        } catch (ex) {
            this.handleError(ex)
        }
    }

    // 批量导入影院
    async onChange(ev: Event) {
        this.showCodeList = false
        this.defaultCinemaLength = this.list.length
        const uploader = new Uploader({
            filePostUrl: `/xadvert/plans/` + this.$route.params.id + `/import-cinema`,
            fileFieldName: 'file',
        })
        uploader.on('fail', (ex: any) => {
          error(ex.msg)
          return
        })
        const input = ev.target as HTMLInputElement
        this.file = input.files && input.files[0]
        this.inputhtml = this.file.name

        if (this.$route.params.status == '6' || this.$route.params.status == '7' ) {
            const a = await uploader.upload(this.file)
            if (a.failCodes.length > 0) {
                this.showCodeList = true
                this.failCodes = a.failCodes
                this.successCodes = a.successCodes
            } else {
                toast('上传成功')
            }

            this.searchchg()
        } else {
            const a = await uploader.upload(this.file)
            if (a.failCodes.length > 0) {
                this.showCodeList = true
                this.failCodes = a.failCodes
                this.successCodes = a.successCodes
            } else {
                toast('上传成功')
            }
            this.search()
        }
        (this.$refs.input as any).value = null
        this.viewcinema = true
        this.$emit('getcine', this.viewcinema)
    }

    async searchchg() {
        const query = clean({ ...this.dataForm, ids: this.cinemaArray.join(',') })
        try {
            // 订单列表
            const {
                data: {
                    items: list,
                    totalCount: total,
                    statusList: statusList,
                    planTypeList: planTypeList,
                    acceptStatusList: acceptStatusList,
                    statusTmsList: statusTmsList,
                    tmsCodeList: tmsCodeList
                }
            } = await cinemaList(this.$route.params.id, query)
            this.statusTmsList = statusTmsList,
            this.tmsCodeList = tmsCodeList
            const aaalist: any = this.list1.map((it: any) => {
                return it.code
            })
            const bbblist: any = (list || []).map((it: any) => {
                if (aaalist.indexOf(it.code) == -1) {

                }
                return {
                    ...it,
                    ifchgRes: aaalist.indexOf(it.code) == -1 ? true : false
                }
            })
            this.list = (bbblist || []).map((it: any) => {
              return {
                ...it,
                tmsStatusText: it.tmsStatus == null ? '-' : getstatus(it.tmsStatus , statusTmsList),
                tmsCodeText: it.tmsCode == null ? '-' : getstatus(it.tmsCode , tmsCodeList),
              }
            })
            this.total = total
            this.acceptStatusList = acceptStatusList

            const { data } = await queryList(clean({
                pageSize: 888888,
                // status: 1,
                typeCode: 'resource'
            }))
            this.reslist = data.items
            this.reasd = (this.reslist || []).map((it: any) => {
                return it.id
            })

        } catch (ex) {
          this.handleError(ex)
        } finally {
            this.loading = false
        }
    }

    // 删除影院
    async delcinema(id: any) {
        try {
            await confirm('您确定删除当前影院信息吗？')
            await delcin(this.$route.params.id, { cinemaIds: [id] })
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

    // 添加影院
    onAdd() {
        this.addShow = true
        this.$nextTick(() => {
            (this.$refs.addCinemaModel as any).init(this.list)
        })
    }



    mounted() {
        this.search()
    }

    // 搜索
    searchall() {
        this.dataForm.pageIndex = 1
        this.search()
    }

    async search() {
        const query = clean({ ...this.dataForm, ids: this.cinemaArray.join(',') })
        try {
            // 订单列表
            const {
                data: {
                    items: list,
                    totalCount: total,
                    statusList: statusList,
                    planTypeList: planTypeList,
                    acceptStatusList: acceptStatusList,
                    statusTmsList: statusTmsList,
                    tmsCodeList: tmsCodeList
                }
            } = await cinemaList(this.$route.params.id, query)
            this.statusTmsList = statusTmsList,
            this.tmsCodeList = tmsCodeList
            this.list = (list || []).map((it: any) => {
              return {
                ...it,
                tmsStatusText: it.tmsStatus == null ? '-' : getstatus(it.tmsStatus , statusTmsList),
                tmsCodeText: it.tmsCode == null ? '-' : getstatus(it.tmsCode , tmsCodeList),
              }
            })
            this.list1 = (list || []).map((it: any) => {
              return {
                ...it,
                tmsStatusText: it.tmsStatus == null ? '-' : getstatus(it.tmsStatus , statusTmsList),
                tmsCodeText: it.tmsCode == null ? '-' : getstatus(it.tmsCode , tmsCodeList),
              }
            })
            this.total = total
            this.defaultCinemaLength = total
            this.acceptStatusList = acceptStatusList

            // 资源方公司列表
            const { data } = await queryList(clean({
                pageSize: 888888,
                // status: 1,
                typeCode: 'resource'
            }))
            this.reslist = data.items
            this.reasd = (this.reslist || []).map((it: any) => {
                return it.id
            })

        } catch (ex) {
            this.handleError(ex)
        } finally {
            this.loading = false
        }
    }

    @Watch('area', { immediate: true })

    watchArea(val: number[]) {
        this.dataForm.provinceId = !!val[0] ? val[0] : ''
        this.dataForm.cityId = !!val[1] ? val[1] : ''
        this.dataForm.countyId = !!val[2] ? val[2] : ''
    }

    change(id: any, cName: any, name: any, idres: any) {
        this.changeVisible = true
        this.$nextTick(() => {
            (this.$refs.change as any).init(id, cName, name, idres)
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
            await delcin(this.$route.params.id, { cinemaIds: this.ids })
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

    @Watch('cinemaArray', { deep: true })

    watchcinemaArray(val: number[]) {
        if (val.length > 0) {
            this.search()
        }
    }

    @Watch('cinemas', { deep: true })

    watchcinemas(val: number[]) {
        this.cinemaArray = val
    }

    @Watch('dataForm', { deep: true })

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

.pos {
  cursor: pointer;
  position: absolute;
  right: 15px;
  font-size: 16px;
  color: #2d8cf0;
  line-height: 50px;
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
  width: 99%;
  border: 1px solid #ccc;
  padding: 15px;
}

.create-form {
  position: relative;
  display: block;
  float: left;
  width: 83px;
  background: #2d8cf0;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  text-indent: 0;
  line-height: 26px;
}

.adds {
  width: 200px;
  position: absolute;
  font-size: 100px;
  left: 0;
  top: 0;
  opacity: 0;
}
.modelactive {
  height: 450px;
  overflow-y: scroll;
}

/deep/ .component {
  min-width: 0;
}

</style>