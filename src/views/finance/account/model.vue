<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    title="申请提现"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="公司ID" prop="mobile">
        {{row.companyId}}
      </FormItem>
      <FormItem label="公司名称" prop="name">
        {{row.companyName}}
      </FormItem>
       <FormItem label="账户余额：" prop="email">
        {{row.balance}}
      </FormItem>
      <FormItem label="提现金额" prop="password" >
        <Input style="width:240px" v-model="dataForm.password"></Input>
      </FormItem>
      <FormItem label="提现方式" prop="passwords" >
        <Select style="width:240px" v-model="dataForm.companyId">
          <Option v-for="it in remittanceTypeList" :key="it.key" :value="it.key">{{it.text}}</Option>
        </Select>
      </FormItem>
      <div v-if="dataForm.companyId == 'zfb'">
        <FormItem label="支付宝账户名称" prop="password" >
          <Input style="width:240px" v-model="dataForm.password"></Input>
        </FormItem>
        <FormItem label="支付宝账户" prop="passwords" >
          <Input style="width:240px"  v-model="dataForm.passwords" ></Input>
        </FormItem>
      </div>
      <div v-else>
        <FormItem label="银行卡账户名" prop="password" >
          <Input style="width:240px" v-model="dataForm.password"></Input>
        </FormItem>
        <FormItem label="银行卡开户行" prop="passwords" >
          <Input style="width:240px"  v-model="dataForm.passwords" ></Input>
        </FormItem>
        <FormItem label="银行卡账号：" prop="companyId">
          <Input style="width:240px"  v-model="dataForm.passwords" ></Input>
        </FormItem>
      </div>
      <FormItem label="备注" prop="status">
        <Input style="width:240px"  v-model="dataForm.passwords" ></Input>
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
import { before } from '@/api/balance'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import ViewBase from '@/util/ViewBase'

const defQuery = {
  categoryId: 0,
}
const dataForm = {
  amount: '',
  accountNumber: '',
  accountName: '',
  remittanceType: '',
  mobile: '',
  companyId: null,
  status: 1
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
      email: [
        {
          pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/,
          message: '请输入正确的邮箱格式',
          trigger: 'blur'
        }
      ],
      name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            message: '请输入同时包含数字、字母且长度要在8-16位之间的密码',
            trigger: 'blur'
          }
      ],
    }
    return rules
  }


  dataForm = { ...dataForm }

  init(row: any) {
    this.showDlg = true
    this.row = row
    ; (this.$refs.dataForm as any).resetFields()
    this.seach()
  }


  cancel(dataForms: string) {
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
      this.remittanceTypeList = remittanceTypeList || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
   (this.$refs[dataForms] as any).validate(async ( valid: any ) => {
      if (valid) {
      }
    })
  }

}
</script>

<style lang="less" scoped>
</style>
