<template>
  <Form  :model='dataForm' :label-width='88' :rules='rules' label-position="left" class='form page' ref='dataForm'>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>{{title}}</em>
      </div>
    </header>
    <div class="edit-box">
      <!-- header -->
      合同主体信息
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
                <Option v-for="it in companyAList" :key="it.key" :value="it.key">{{it.text}}</Option>
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
        <FormItem label="合同有效期" prop="name">
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
      </Row>
      乙方信息
      <Row class="cinema-header">
        <FormItem label="公司名称" prop="companyBId">
          <Row>
            <Col span="8">
              <Select   v-model="dataForm.companyBId">
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
      </Row>
      结算账户信息
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
              <Input v-model="dataForm.settlementPeriod" placeholder=""/>注：最小数值必须为7
            </Col>
          </Row>
        </FormItem>
      </Row>
       分成比例  注：资源方在平台进行销售事，平台抽成使用；如不设置分成规则，则该公司关联的所有影院分成比例为【20%】
      <Row class="cinema-content">
        <FormItem prop="cinemasList">
          以下影院，分成比例为<Input style='width:5%;' v-model="dataForm.rule.proportion" placeholder=""/>%
          <PartBindCinema v-model="dataForm.rule" :unitList="profitUnitList"
              :incinematype='cinematype' class="part-bind-cinema"/>
        </FormItem>
        +添加规则
      </Row>
       附件信息
      <Row class="cinema-content">
        + 上传附件   注：支持pdf、doc、docx、rar、7z、zip等格式的文件
        <!-- <Table :columns="columns" :data="tableData" :loading="loading"
        border stripe disabled-hover size="small" class="table"></Table> -->
      </Row>
      责任人
      <Row class="cinema-content">
        <FormItem label="签订人" prop="name">
          <Row>
            <Col span="8">
              <Select v-model="dataForm.signingUser" placeholder="签订人" filterable clearable>
                <Option v-if="it.status!=2" v-for="it in businessDirector" :key="it.id" :value="it.id"
                  :label="it.email+'  ['+it.userName+']'">{{ it.email}}<b style="margin-left:5px">[{{it.userName}}]</b></Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="跟进人" prop="name">
          <Row>
            <Col span="8">
              <Select v-model="dataForm.followUser" placeholder="跟进人" filterable clearable>
                <Option v-if="it.status!=2" v-for="it in businessDirector" :key="it.id" :value="it.id"
                  :label="it.email+'  ['+it.userName+']'">{{ it.email}}<b style="margin-left:5px">[{{it.userName}}]</b></Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
      </Row>
      备注
      <Row class='beizhu'>
        <FormItem  prop="name">
          <Row>
            <Col span="10">
              <Input style='width:262%;height:50px;margin-left:-22%;' v-model="dataForm.remark" placeholder="输入备注信息"/>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <div class="edit-button">
        <Button type="info" size="large" @click="change('dataForm')">确定</Button>
      </div>
    </div>

  </Form>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
// import { queryId, addSeach, addQuery, setQuery, directorList } from '@/api/list'
import { queryId , jiacompanysList , companysList , dataFrom , addlist } from '@/api/list'
import { directorList } from '@/api/corpReal'
import AreaSelect from '@/components/areaSelect'
import Upload from '@/components/Upload.vue'
import PartBindCinema from './partBindCinema.vue'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')


const defQuery = {
}


const dataForm = {
  contractName: '',
  contractNo: '',
  companyACode: '',
  validityStartDate: null,
  validityEndDate: null,
  companyBId: '',
  companyBContact: '',
  companyBPhone: '',
  accountBank: '',
  accountName: '',
  accountNumber: '',
  settlementPeriod: null,
  rule: {
    proportion: '',
    cinemas: []
  },
  attachments: {
    name: 11,
    uploadUser: 11,
    uploadTime: 11
  },
  signingUser: null,
  followUser: null,
  remark: '',
}

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
    Upload
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

  id = 0

  get rules() {
    const rule: any = {
      contractName: [
        { required: true, message: '请填写合同名称', trigger: 'blur' }
      ],
      contractNo: [
        { required: true, message: '请填写合同编号', trigger: 'blur' }
      ],
      companyACode: [
        { required: true, message: '请选择甲方公司名称' }
      ],
      validityStartDate: [
        { required: true, message: '请选择有效开始时间', trigger: 'blur' }
      ],
      validityEndDate: [
        { required: true, message: '请选择有效结束时间', trigger: 'blur' }
      ],
      companyBId: [
        { required: true, message: '请选择乙方公司' }
      ],
      companyBContact: [
        { required: true, message: '请填写乙方公司联系人', trigger: 'blur' }
      ],
      companyBPhone: [
        { required: true, message: '请填写乙方公司联系电话', trigger: 'blur' }
      ],
      accountBank: [
        { required: true, message: '请填写开户银行', trigger: 'blur' }
      ],
      accountName: [
        { required: true, message: '请填写账户名', trigger: 'blur' }
      ],
      accountNumber: [
        { required: true, message: '请填写账号', trigger: 'blur' }
      ],
      settlementPeriod: [
        { required: true, message: '请选择结账周期', trigger: 'blur' }
      ],
      attachments: [
        { required: true, message: '请上传附件'}
      ],
      signingUser: [
        { required: true, message: '请选择签订人' }
      ],
      followUser: [
        { required: true, message: '请选择跟进人', trigger: 'blur' }
      ],
    }
    return rule
  }


  get cachedMap() {
    return {
    }
  }

  get formatArr() {
    const cachedMap = this.cachedMap
    return {
    }
  }
  // 确定
  change(dataForms: any) {
    this.dataForm.validityStartDate = new Date(this.dataForm.validityStartDate).getTime()
    this.dataForm.validityEndDate = new Date(this.dataForm.validityEndDate).getTime()

    const myThis: any = this
    myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query =  !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        try {
          const res =  await addlist (query)
          this.$router.push({ name : 'contract-list' })
        } catch (ex) {
          this.handleError(ex)
        }
      }
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
      } } = await companysList(query)
      this.companys = companys
      // 甲方公司
      const { data : {
          companyAList: companyAList
      } } = await jiacompanysList(query)
      this.companyAList = companyAList
      // 负责人
      const res = await directorList()
      this.businessDirector = res.data.items
    } catch (ex) {
      // this.handleError(ex)
    } finally {
      this.loading = false
    }
  }


  back() {
    this.$router.go(-1)
  }

  edit(dataForms: string) {

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
</style>
