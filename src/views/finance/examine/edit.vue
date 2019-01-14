<template>
  <Form  :model='dataForm' :label-width='88' :rules='ruleValidate' label-position="left" class='form page' ref='dataForm'>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>{{title}}</em>
      </div>
    </header>
    <div class="edit-box">
      <!-- header -->
      <Row class="cinema-header">
        <FormItem label="公司名称" prop="companyId">
          <Row>
            <Col span="10">
              <Select style="width:240px" v-model="dataForm.companyId" filterable>
                <Option v-for="it in companys" :key="it.id" :value="it.id">{{it.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="充值金额" prop="amount">
          <Row>
            <Col span="8">
              <Input @blur="chg()" v-model="dataForm.amount"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="操作人">
          <Row>
            <Col span="10">
              <Input disabled v-model='useremail' placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="充值账户" prop="accountType">
          <Row>
            <Col span="10">
              <Select placeholder="客户类型" clearable>
                <Option v-for="it in customerTypeList" :key="it.typeCode" :value="it.typeCode"
                    :label="it.typeName">{{it.typeName}}</Option>
                </Select>
            </Col>
          </Row>
        </FormItem>
      </Row>
      <Row class="cinema-header">
        <FormItem label="汇款人姓名" prop="accountName">
          <Row>
            <Col span="10">
              <Input v-model="dataForm.accountName" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="银行账号" prop="accountNumber">
          <Row>
            <Col span="8">
              <Input v-model="dataForm.accountNumber"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="联系电话" prop="contactPhone">
          <Row>
            <Col span="10">
              <Input v-model="dataForm.contactPhone" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="汇款日期" prop="remittanceDate">
          <Row>
            <Col span="10">
              <Date-picker type="date" v-model="dataForm.remittanceDate"
          on-change="selectTime" placeholder="选择日期" style="width: 200px"></Date-picker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="凭证" prop="receipt">
          <Row class="upload">
            <Col span="12">
                <Upload v-model="dataForm.receipts" multiple :maxCount="1" accept="image/*"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="充值标签" prop="tagCode">
          <Row>
            <Col span="10">
              <Select style="width:240px" v-model="dataForm.tagCode">
                <Option v-for="it in tagCodeList" :key="it.tagCode" :value="it.tagCode">{{it.tagName}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Row>
            <Col span="10">
              <Input v-model="dataForm.remark" placeholder=""/>
            </Col>
          </Row>
        </FormItem>
        </Row>
      </Row>
    </div>
    <div style="text-align: center">
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Form>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList , companysList , dataFrom , addList , types , authinfos , userqueryItem} from '@/api/examine'
import AreaSelect from '@/components/AreaSelect.vue'
import Upload from '@/components/Upload.vue'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const defQuery = {
}
const dataForm = {
  companyId : null,
  companyName : '',
  amount : null,
  accountType : 1,
  accountName : '',
  accountNumber : '',
  contactPhone : '',
  remittanceDate : null,
  receipts : [],
  receipt: '',
  tagCode : '',
  remark : '',
}

@Component({
  components: {
    AreaSelect,
    Upload
  }
})

export default class Main extends ViewBase {
  title = ''
  loading = false
  loadingShow = false
  query = { ...defQuery }
  oldQuery: any = {}
  shows = true
  id = 0
  // 标签列表
  tagCodeList: any = []
  // 公司列表
  companys: any = []
  // 客户类型
  customerTypeList: any = []
    // 当前登录用户id
  itemid: any = ''
  // 当前登录用户邮箱账号
  useremail: any = ''

  get ruleValidate() {
    const rules = {
      companyId: [
          { required: true, message: '请选择公司 ' }
      ],
      amount: [
          { required: true, message: '请输入充值金额', trigger: 'blur' }
      ],
      accountType: [
          { required: true, message: '请选择充值账号类型' }
      ],
      accountName: [
          { required: true, message: '请输入汇款人姓名', trigger: 'blur' }
      ],
      accountNumber: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
      ],
      remittanceDate: [
          { required: true, message: '请选择汇款日期' }
      ],
      receipt: [
          // { required: true, message: '请选择凭证' }
      ],
      tagCode: [
          { required: true, message: '请选择充值标签'}
      ],
      remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
      ],
      contactPhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入正确的手机号码', trigger: 'blur'
          }
      ],
      status: [
          { required: true }
      ]
    }
    return rules
  }

  dataForm: any = { ...dataForm }


  get cachedMap() {
    return {
    }
  }

  get formatArr() {
    const cachedMap = this.cachedMap
    return {
    }
  }

  // chg () {
  //   console.log(this.dataForm.amount)
  // }

  mounted() {
    this.doSearch()
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    for ( const i in this.companys) {
      if (this.dataForm.companyId == this.companys[i].id) {
        this.dataForm.companyName = this.companys[i].name
      }
    }

    this.dataForm.remittanceDate = new Date(this.dataForm.remittanceDate).getTime()
    this.dataForm.receipt = this.dataForm.receipts.length > 0 ? this.dataForm.receipts[0].fileId : []

   const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query = !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        const title = '添加'
        try {
           const res =  await addList (query)
           this.$router.push({ name : 'Finance-examine' })
        } catch (ex) {
           this.handleError(ex)
        }
      }
    })
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true

    const query = clean({ ...this.query })
    try {
      // 公司信息列表
      const { data: {
        // statusList: list,
        items: companys,
        customerTypeList: customerTypeList
      } } = await companysList(query)
      this.customerTypeList = customerTypeList
      this.companys = companys
      // 充值类型列表
      const { data : {
          tagCodeList: tagCodeList
      } } = await types(query)
      this.tagCodeList = tagCodeList
      // 当前登录用户邮箱信息
      const { data } = await authinfos(query)
      this.itemid = data.userId
      const { data: {
        item: item,
      } } = await userqueryItem(this.itemid)
      this.useremail = item.email
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

  @Watch('dataForms', { deep: true })
  watchdataForms(val: any[]) {
    this.dataForm.receipts = val.map(it => it.fileId)
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
