<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='520'
    title="申请提现"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <Row>
        <Col span='12'>
          <FormItem label="公司ID" prop="mobile">
            {{row.companyId}}
          </FormItem>
        </Col>
        <Col span='12'>
          <FormItem label="公司名称">
            {{row.companyName}}
          </FormItem>
        </Col>
      </Row>
       <FormItem label="账户余额：" prop="email">
        {{row.balance}}
      </FormItem>
      <FormItem label="提现金额" prop="amount" >
        <InputNumber style="width: 240px" :max='row.balance'  :min="1" type='Number' v-model="dataForm.amount"/>
      </FormItem>
      <FormItem label="提现方式" prop="withdrawalType" >
        <Select style="width:240px" v-model="dataForm.withdrawalType">
          <Option v-for="it in remittanceTypeList" :key="it.key" :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem>
      <div v-if="dataForm.withdrawalType == 2">
        <FormItem label="支付宝账户名称" prop="alipayName" >
          <Input style="width:240px" v-model="dataForm.alipayName"></Input>
        </FormItem>
        <FormItem label="支付宝账户" prop="alipayNumber" >
          <Input style="width:240px"  v-model="dataForm.alipayNumber" ></Input>
        </FormItem>
      </div>
      <div v-else>
        <Row>
          <FormItem label="银行卡账户名" prop="accountName" >
            <Input style="width:240px" v-model="dataForm.accountName"></Input>
          </FormItem>
          <FormItem label="银行卡开户行" prop="accountBank" >
            <Input style="width:240px"  v-model="dataForm.accountBank" ></Input>
          </FormItem>
          <FormItem label="银行卡账号：" prop="accountNumber">
            <Input style="width:240px"  v-model="dataForm.accountNumber" ></Input>
          </FormItem>
        </Row>
      </div>
      <FormItem label="备注" prop="remark">
        <Input style="width:240px"  v-model="dataForm.remark" ></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { before, save } from '@/api/balance'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import ViewBase from '@/util/ViewBase'
import { info } from '@/ui/modal'

const defQuery = {
  categoryId: 0,
}
const dataForm = {
  amount: null,
  withdrawalType: 1,
  accountBank: '',
  accountName: '',
  accountNumber: '',
  alipayName: '',
  alipayNumber: '',
  remark: ''
}

@Component
export default class ComponentMain extends ViewBase {
  // @Prop({ type: Object }) cinemaOnes: any
  query = { ...defQuery }
  oldQuery: any = {}

  row: any = {}
  showDlg = false

  remittanceTypeList: any = []

  get ruleValidate() {
    const rules = {
      amount: [
        { required: true, message: '请输入提现金额' }
      ],
      withdrawalType: [
        { required: true, message: '请选择提现方式' }
      ],
      accountBank: [
        { required: true, message: '请输入开户银行', trigger: 'blur' }
      ],
      accountName: [
        { required: true, message: '请输入开户名', trigger: 'blur' }
      ],
      accountNumber: [
        { required: true, message: '请输入开户账号', trigger: 'blur' }
      ],
      alipayName: [
        { required: true, message: '请输入支付宝账户名', trigger: 'blur' }
      ],
      alipayNumber: [
        { required: true, message: '请输入支付宝账户名', trigger: 'blur' }
      ],
      remark: [
        { required: true, message: '请输入备注', trigger: 'blur' }
      ]
    }
    return rules
  }


  dataForm: any = { ...dataForm }

  init(row: any) {
    this.showDlg = true
    this.row = row
    ; (this.$refs.dataForm as any).resetFields()
    this.seach()
  }


  cancel() {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  async seach() {
    try {
      const {
        data: {
          remittanceTypeList
        }
      } = await before()
      this.remittanceTypeList = (remittanceTypeList || []).filter((it: any) => it.key != 0)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
   (this.$refs[dataForms] as any).validate(async ( valid: any ) => {
      if (valid) {
        if (this.dataForm.amount > this.row.balance) {
          info('提现金额大于账户余额')
          return
        }
        await save({
          ...this.dataForm,
          companyId: this.row.companyId
        })
        this.cancel()
        this.$emit('done')
      }
    })
  }

}
</script>

<style lang="less" scoped>
/deep/ .ivu-modal {
  top: 10px;
}
</style>
