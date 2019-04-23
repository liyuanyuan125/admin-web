<template>
  <Form  :model='dataForm' :label-width='88' :rules='rules' label-position="left" class='form page' ref='dataForm'>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>{{title}}</em>
      </div>
    </header>
    <div class="edit-box">
      <div class='titop'>合同主体信息</div>
      <Row class="cinema-header">
        <FormItem label="合同名称" prop="contractName">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.contractName" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="甲方公司" prop="companyACode">
          <Row>
            <Col span="8">
              <Select v-model="dataForm.companyACode">
                <Option v-for="it in companyAList" v-if='it.controlStatus==1' :key="it.key" :value="it.key">{{it.text}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="合同编号" prop="contractNo">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.contractNo" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="合同有效期" prop="validityStartDate">
          <Row>
            <Col span="16">
              <Date-picker type="date" v-model="dataForm.validityStartDate"
          on-change="selectTime" placeholder="选择日期" style="width: 200px"></Date-picker>&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;
              <Date-picker type="date" v-model="dataForm.validityEndDate"
          on-change="selectTime" placeholder="选择日期" style="width: 200px"></Date-picker>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <div class='titop'>乙方信息</div>
      <Row class="cinema-header">
        <FormItem label="公司名称" prop="companyBId">
          <Row>
            <Col span="8">
            <!-- v-if='it.types[0].typeCode=="resource"' -->
              <Select   v-model="dataForm.companyBId" filterable>
                <Option v-for="it in companys" :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="联系人" prop="companyBContact">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.companyBContact"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="联系电话" prop="companyBPhone">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.companyBPhone" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <div class='titop'>结算账户信息</div>
      <Row class="cinema-header">
        <FormItem label="开户行" prop="accountBank">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.accountBank" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="开户名" prop="accountName">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.accountName"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="银行账号" prop="accountNumber">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.accountNumber" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="结算账期" prop="settlementPeriod">
          <Row>
            <Col span="8">
              <InputNumber v-model="dataForm.settlementPeriod" :min="7" type='Number' placeholder=""/><span class='red'>注：最小数值必须为7</span>
            </Col>
          </Row>
        </FormItem>
      </Row>
       <div class='titop'>分成比例  <span class='red'>注：资源方在平台进行销售时，平台抽成使用；如不设置分成规则，则该公司关联的所有影院分成比例为【20%】</span></div>
      <Row class="cinema-footer"  >
        <!-- <FormItem v-if='showrule'
        v-if="item.status"
        :label-width='0'
        :key="index"
        :prop="'perms.' + index + '.code'"
        :rules="{required: true, message: '权限编码不能为空', trigger: 'blur'}"
         label="关联影院" prop="cinemasList">
          以下影院，分成比例为<Input style='width:5%;' placeholder=""/>%
          <PartBindCinema :unitList="profitUnitList"
               class="part-bind-cinema"/>
        </FormItem> -->
        
        <FormItem
          :label-width='0'
          :key="index"
          label="" prop="cinemas" v-for='(it,index) in dataForm.rule'>
          <!-- {{index}} -->
          以下影院，分成比例为<Input style='width:5%;margin-bottom: 5px;' v-model="it.proportion" placeholder="默认20%"/>%
          <Button style='position: absolute; left: 55%;margin-bottom: 5px;' type="dashed" @click="handleRemove(index)">删除</Button>
            <!-- <col span='16'> -->
            <PartBindCinema style='width: 60%;' v-model="it.cinemas" :id="dataForm.companyBId" :unitList="profitUnitList"
                class="part-bind-cinema"/>
            <!-- </col> -->
        </FormItem>
        
        <!-- <a href='javascript:;' id='addrule' @click='addrules()'>+添加规则</a> -->
        <Button type="dashed" style='margin-bottom:17px;'  @click="handleAdd" icon="md-add">添加规则</Button>
      </Row>
      <div class='titop'>附件信息</div>
      <Row class="cinema-content" style='padding-right:18px;padding-bottom:18px;'>
        <UploadButton style='margin-bottom:17px;' v-model="dataForm.attachments" multiple @success="onUploadSuccess">上传附件</UploadButton>
        <span class='red'>注：支持pdf、doc、docx、rar、7z、zip等格式的文件</span>
        <Table :columns="columns" :data="tableData"
          border stripe disabled-hover size="small" class="table"></Table>
      </Row>
      <div class='titop'>责任人</div>
      <Row class="cinema-content">
        <FormItem label="签订人" prop="signingUser">
          <Row>
            <Col span="8">
              <Select v-model="dataForm.signingUser" placeholder="签订人" filterable clearable>
                <Option v-for="it in businessDirector" :key="it.id" :value="it.id"
                  :label="it.email+'  ['+it.userName+']'">{{ it.email}}<b style="margin-left:5px">[{{it.userName}}]</b></Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="跟进人" prop="followUser">
          <Row>
            <Col span="8">
              <Select v-model="dataForm.followUser" placeholder="跟进人" filterable clearable>
                <Option v-for="it in businessDirector" :key="it.id" :value="it.id"
                  :label="it.email+'  ['+it.userName+']'">{{ it.email}}<b style="margin-left:5px">[{{it.userName}}]</b></Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <div class='titop'>备注</div>
      <div class='beizhu'>
        <!-- <FormItem  prop="remark"> -->
          <!-- <Row> -->
            <Col span="26">
              <Input v-model="dataForm.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入备注信息..."></Input>
              <!-- <Input v-model="dataForm.remark" placeholder="输入备注信息"/> -->
            </Col>
          <!-- </Row> -->
        <!-- </FormItem> -->
      </div>
        <div style='margin-top:20px;' class="edit-button">
          <Button type="info" size="large" @click="edit('dataForm')">确定</Button>
          <Button type="default" size="large" @click="cancel('dataForm')">重置</Button>
        </div>
    </div>

  </Form>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
// import { queryId, addSeach, addQuery, setQuery, directorList } from '@/api/corpReal'
import { queryId , jiacompanysList , companysList , dataFrom , addlist , setlist  } from '@/api/list'
import { directorList } from '@/api/corpReal'
import AreaSelect from '@/components/areaSelect'
import UploadButton, { SuccessEvent } from '@/components/UploadButton.vue'
import PartBindCinema from './partBindCinema.vue'
import jsxReactToVue from '@/util/jsxReactToVue'
// import jquery from '@types/jquery'

import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import moment from 'moment'

const timeFormat = 'YYYY/MM/DD'
const timeFormats = 'YYYY/MM/DD HH:mm:ss'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const defQuery = {
  typeCode : 'resource'
}

const dataForm = {
  contractName: '',
  contractNo: '',
  companyACode: null,
  validityStartDate: null,
  validityEndDate: null,
  companyBId: null,
  companyBContact: '',
  companyBPhone: '',
  accountBank: '',
  accountName: '',
  accountNumber: '',
  settlementPeriod: null,
  // rule: {
  //   proportion: '',
  //   cinemas: []
  // },
  rule: [],
  // attachments: {
  //   name: 11,
  //   uploadUser: 11,
  //   uploadTime: 11
  // },
  attachments: [],
  signingUser: null,
  followUser: null,
  remark: '',
  // formDynamic : {
  //   items: [
  //     {
  //         value: '',
  //         index: 1,
  //         status: 1
  //     }
  //   ]
  // }
}

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
    UploadButton
  }
})

export default class Main extends ViewBase {

  title = ''
  loading = false

  query = { ...defQuery }
  oldQuery: any = {}

  loadingShow = false
  shows = true
  profitUnitList = []
  // 公司
  companys: any = []
  // 甲方公司
  companyAList: any = []
  // 负责人
  businessDirector: any = []

  dataForm: any = { ...dataForm }

  index: any = 1
  // formDynamic: any = {
  //     items: [
  //         {
  //             value: '',
  //             index: 1,
  //             status: 1
  //         }
  //     ]
  // }

  attachmentslist = []

  id = 0
  // 编辑
  detail: any = {}

  showrule = true

  get rules() {
    const rule: any = {
      contractName: [
        { required: true, message: '请填写合同名称', trigger: 'blur' },
        { type: 'string', min: 1, max: 30, message: '字数限制在1-30之间', trigger: 'blur' }
      ],
      contractNo: [
        { required: true, message: '请填写合同编号', trigger: 'blur' },
        { type: 'string', min: 1, max: 30, message: '字数限制在1-30之间', trigger: 'blur' }
      ],
      companyACode: [
        { required: true, message: '请选择甲方公司名称' }
      ],
      validityStartDate: [
        { required: true, message: '请选择有效开始时间' }
      ],
      validityEndDate: [
        { required: true, message: '请选择有效结束时间' }
      ],
      companyBId: [
        { required: true, message: '请选择乙方公司' }
      ],
      companyBContact: [
        { required: true, message: '请填写乙方公司联系人', trigger: 'blur' }
      ],
      companyBPhone: [
        { required: true, message: '请填写乙方公司联系电话', trigger: 'blur' },
        { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
          message: '请输入正确的联系电话', trigger: 'blur'
        }
      ],
      accountBank: [
        { required: true, message: '请填写开户银行', trigger: 'blur' },
        { type: 'string', min: 1, max: 30, message: '字数限制在1-30之间', trigger: 'blur' }
      ],
      accountName: [
        { required: true, message: '请填写账户名', trigger: 'blur' },
        { type: 'string', min: 1, max: 30, message: '字数限制在1-30之间', trigger: 'blur' }
      ],
      accountNumber: [
        { required: true, message: '请填写账号', trigger: 'blur' },
        { type: 'string', min: 1, max: 20, message: '字数限制在1-20之间', trigger: 'blur' }
      ],
      settlementPeriod: [
        { required: true, message: '请选择结账周期', }
      ],
      attachments: [
        { required: true, message: '请上传附件'}
      ],
      signingUser: [
        { required: true, message: '请选择签订人' }
      ],
      followUser: [
        { required: true, message: '请选择跟进人' }
      ],
    }
    return rule
  }

  columns = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '附件', key: 'name', align: 'center' },
    {
      title: '上传时间',
      key: 'uploadTime',
      align: 'center',
      render: (hh: any, { row: { uploadTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(uploadTime).format(timeFormats)
        return uploadTime == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '上传人', key: 'uploadUserName', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { approveStatus, statusText, id  }, row  }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
          return <div class='row-acts'>
          <a on-click={this.onDel.bind(this, id)} >删除</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a class="operation" href="" download={row.name}>下载</a>
        </div>

        /* tslint:enable */
      }
    }
  ]
          // <a on-click={this.onDel.bind(this, id)} >删除</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


  created() {
  }

  addrules() {
    // $('.cinema-footer').append(`789`)
    // // var pre = document.getElementById('#addrule')
    // document.onclick = function() {
      // $('#addrule')
    //   const str: any = '78979879898'
    //   this.document.getElementById('#addrule').appendChild(str)
    // }
  }

  async business() {
  }

  // async chg() {
  //   if (this.dataForm.settlementPeriod < 7) {
  //     alert('结算账期输入有误，最小数值为7')
  //     this.dataForm.settlementPeriod = 7
  //   }
  // }
  // 添加规则
  handleAdd() {
    this.index++
    this.dataForm.rule.push({
      proportion: '',
      // index: this.index,
      // status: 1,
      cinemas: []
    })
  }
  // 删除规则
  handleRemove(item: any) {
    // console.log(item)
    // this.dataForm.rule.$remove(item)
    // const index = this.dataForm.rule.findIndex((it: any) => it.item == item)
    // console.log(index)
    this.dataForm.rule.splice(item, 1)
  }

  // 删除文件
  async onDel(id: number) {
    await confirm('确定要删除该项吗？')
    const index = this.dataForm.attachments.findIndex((it: any) => it.id == id)
    this.dataForm.attachments.splice(index, 1)
  }
  // async remove (index) {
  //   this.dataForm.attachments.splice(index, 1);
  // }


  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const attachments = (this.dataForm.attachments || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return attachments
  }

  // 上传文件
  onUploadSuccess({ files }: SuccessEvent) {
    // console.log(files[0].clientName)
    this.dataForm.attachments.push({
      name: files[0].clientName,
      fileId: files[0].fileId
    })
  }

  mounted() {
    this.doSearch()
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true

    const query = clean({ ...this.query })
    try {
      // 公司列表
      const { data: {
        items: companys,
      } } = await companysList({typeCode : 'resource' , status : 1 , pageSize: 1000000})
      this.companys = companys
      // console.log(this.companys)
      // 甲方公司
      const { data : {
          companyAList: companyAList
      } } = await jiacompanysList(query)
      this.companyAList = companyAList
      // console.log(this.companyAList)
      // 负责人
      const res = await directorList()
      this.businessDirector = res.data.items
    } catch (ex) {
      // this.handleError(ex)
    } finally {
      this.loading = false
    }
    // const query = { id: this.$route.params.id || 0 }
    try {
      if ( this.$route.params.id == undefined ) {

        // if (this.dataForm.rule.length == 0) {
        //   this.handleAdd()
        // }
        const { data: {
          items: companys,
        } } = await companysList({typeCode : 'resource' , status : 1 , pageSize: 1000000})
        this.companys = companys
        // 甲方公司
        const { data : {
            companyAList: companyAList
        } } = await jiacompanysList(query)
        this.companyAList = companyAList
        // 负责人
        const res = await directorList()
        this.businessDirector = res.data.items
      } else if ( this.$route.params.id != undefined ) {
        // 编辑
        const res = await queryId(this.$route.params.id)
        this.detail = res.data
        this.detail.cinemaList = res.data.ruleList || []
        this.dataForm.contractName = this.detail.contractName
        this.dataForm.companyACode = this.detail.companyAList[0].key
        this.dataForm.contractNo = this.detail.contractNo
        this.dataForm.validityStartDate = new Date(this.formatValid(this.detail.validityStartDate))
        this.dataForm.validityEndDate = new Date(this.formatValid(this.detail.validityEndDate))
        this.dataForm.companyBId = this.detail.companyBId
        this.dataForm.companyBContact = this.detail.companyBContact
        this.dataForm.companyBPhone = this.detail.companyBPhone
        this.dataForm.accountBank = this.detail.accountBank
        this.dataForm.accountName = this.detail.accountName
        this.dataForm.accountNumber = this.detail.accountNumber
        this.dataForm.settlementPeriod = this.detail.settlementPeriod
        // this.dataForm.rule = this.detail.ruleList
        this.dataForm.rule =  (this.detail.ruleList || []).map((item: any) => {
        return {
          proportion: item.proportion,
          cinemas: item.cinemaList
        }
      })
        this.dataForm.attachments = this.detail.attachmentList || []
        this.dataForm.signingUser = this.detail.signingUser
        this.dataForm.followUser = this.detail.followUser
        this.dataForm.remark = this.detail.remark
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }
  // 日期时间
  formatValid(data: any) {
    const datas = (data + '').split(',')
    const a = datas[0].slice(0, 4)
    const b = datas[0].slice(4, 6)
    const c = datas[0].slice(6)
    return `${a}/${b}/${c}`
  }

  back() {
    // this.showrule = false
    this.$router.go(-1)
    // this.$router.push({ name: 'contract-list'})
  }

  cancel(dataForms: any) {
    // (this.$refs.dataForm as any).resetFields()
    this.dataForm = {}
    return
  }

  edit(dataForms: any) {
    const a = moment(this.dataForm.validityStartDate).format(timeFormat).split('/')
    const b = moment(this.dataForm.validityEndDate).format(timeFormat).split('/')

    // this.dataForm.validityStartDate = Number(a[0] + a[1] + a[2])
    // this.dataForm.validityEndDate = Number(b[0] + b[1] + b[2])

    const validityStartDate = Number(a[0] + a[1] + a[2])
    const validityEndDate = Number(b[0] + b[1] + b[2])
    // console.log(this.dataForm.validityStartDate)
    this.dataForm.settlementPeriod = Number(this.dataForm.settlementPeriod)

    // console.log(this.dataForm.rule)
    // if (this.dataForm.rule.proportion)

    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const rule = this.dataForm.rule.map((it: any) => {
            const id = it.cinemas.map((item: any) => {
                return item.id
            })
            return {
              proportion : it.proportion,
              cinemas: id
            }
            // if (!it.proportion) {
            //   return {
            //     proportion : 20,
            //     cinemas: id
            //   }
            // } else {
            //   return {
            //     proportion : it.proportion,
            //     cinemas: id
            //   }
            // }
        })
        const query =  this.id ? {
          // id: Number(this.$route.params.id),
          ...this.dataForm,
          rule: this.dataForm.rule.length > 0 ? rule : [],
          validityStartDate,
          validityEndDate
        } : {
          // id: Number(this.$route.params.id),
          ...this.dataForm,
          rule: this.dataForm.rule.length > 0 ? rule : [],
          validityStartDate,
          validityEndDate
        }
        try {
          if (this.$route.params.id == undefined || this.$route.params.copy) {
            const res =  await addlist (query)
          } else if (this.$route.params.id != undefined) {
            const res =  await setlist (this.$route.params.id , query)
          }
          this.$router.push({ name : 'contract-list' })
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }
  @Watch('dataForms', { deep: true })
  watchdataForms(val: any[]) {
    this.dataForm.attachments = val.map(it => it.fileId)
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

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

.btn-back {
  margin-right: 10px;
}

.edit-button {
  text-align: center;
  margin-bottom: 20px;
  button {
    margin-right: 20px;
  }
}

.cinema-header, .cinema-content, .cinema-footer {
  border: 1px solid #dcdee2;
  background: #fff;
  padding: 18px 0 0 18px;
  margin-bottom: 14px;
}
.check-select-group {
  display: inline-flex;
  width: 90%;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding-left: 8px;
  overflow: hidden;
  /deep/ .ivu-select {
    .ivu-select-placeholder,
    .ivu-select-selected-value {
      position: relative;
      top: 1px;
    }
    .ivu-select-selection {
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }
}
.upload {
  margin-bottom: 20px;
}
.part-bind-cinema {
  width: 660px;
}
.red {
  color: red;
  margin-left: 12px;
  font-size: 14px;
}
// .beizhu .ivu-form-item .ivu-form-item-content{
//   margin-left: 0px;
// }
.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
