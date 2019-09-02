<template>
  <Form  :model='dataForm' :label-width='88' :rules='ruleValidate' label-position="left" class='form page' ref='dataForm'>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>充值</em>
      </div>
    </header>
    <div class="edit-box">
      <!-- header -->
      <Row class="cinema-header">
        <FormItem label="公司名称" prop="companyId">
          <Row>
            <Col span="10">
              
            </Col>
          </Row>
        </FormItem>
        <FormItem label="公司id" prop="companyId">
          <Row>
            <Col span="10">
              {{$route.params.companyId}}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="充值金额" prop="amount">
          <Row>
            <Col span="8">
              <InputNumber style="width: 300px"  :min="1" type='Number' v-model="dataForm.amount"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="汇款方式" prop="remittanceType" >
          <Select style="width: 300px" v-model="dataForm.remittanceType">
            <Option v-for="it in remittanceTypeList" :key="it.key" :value="it.key">{{it.text}}</Option>
          </Select>
        </FormItem>
        <FormItem label="汇款时间" prop="remittanceDate" >
          <DatePicker v-model='dataForm.remittanceDate' type="date" placeholder="请选择汇款时间" style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem label="汇款账户名" prop="accountName" >
          <Input v-model="dataForm.accountName" placeholder="请输入" style="width: 300px" />
        </FormItem>
        <FormItem label="汇款交易流水" prop="remittanceNo" >
          <Input v-model="dataForm.remittanceNo" placeholder="请输入" style="width: 300px" />
        </FormItem>
        <FormItem label="汇款底单" prop="receipt">
          <Row class="upload">
            <Col span="12">
                <Upload v-model="dataForm.receipt" multiple :maxCount="1" accept="image/*"/>
            </Col>
          </Row>
        </FormItem>
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
import { companylist, before, add } from '@/api/balance'
import Upload from '@/components/Upload.vue'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import moment from 'moment'

const timeFormat = 'YYYY-MM-DD'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const defQuery = {
}
const dataForm = {
  amount : null,
  accountType : 1,
  accountName : '',
  remittanceType : '',
  remittanceNo : '',
  receipt : [],
  remittanceDate : '',
}

@Component({
  components: {
    Upload
  }
})

export default class Main extends ViewBase {
  query = { ...defQuery }
  remittanceTypeList: any = []

  get ruleValidate() {
    const rules = {
      amount: [
          { required: true, message: '请输入不小于0的充值金额'},
          // { type: 'string', min: 1, message: '金额不能为0或负数', trigger: 'blur' }
      ],
      remittanceType: [
          { required: true, message: '请选择汇款方式' }
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
      remittanceNo: [
          { required: true, message: '请输入汇款交易流水' }
      ],
      receipt: [
          { required: true, message: '请选择凭证' }
      ]
    }
    return rules
  }

  dataForm: any = { ...dataForm }


  get cachedMap() {
    return {
    }
  }

  mounted() {
    this.doSearch()
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
   const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        try {
           const res =  await add({
             ...this.dataForm,
             companyId: this.$route.params.companyId,
             receipt: this.dataForm.receipt.length > 0 ? this.dataForm.receipt[0].fileId : [],
             remittanceDate: moment(this.dataForm.remittanceDate).format('YYYYMMDD')
           })
           this.$router.go(-1)
        } catch (ex) {
           this.handleError(ex)
        }
      }
    })
  }

  async doSearch() {
    try {
      // 公司信息列表
      const { data: {
        remittanceTypeList
      } } = await before()
      this.remittanceTypeList = remittanceTypeList.filter((it: any) => it.key != 0)
      const { data: {
        // statusList: list,
        items: companys,
        customerTypeList: customerTypeList
      } } = await companylist( this.$route.params.companyId )
    } catch (ex) {
      // this.handleError(ex)
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
