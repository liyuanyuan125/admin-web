<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='400'
    :title="'财务付款信息'"
    @on-cancel="cancel('dataForm')" >
    
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="申请付款金额">
        <span><span v-if='defaultfee != null'>￥</span>{{defaultfee == null ? '-' : formatNumber(defaultfee)}}</span>
      </FormItem>
      <FormItem label="实际付款金额" prop="fee">
        <InputNumber style="width:240px" :min='0' :max='defaultfee' v-model="dataForm.fee"></InputNumber>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input type='textarea' style="width:240px" v-model="dataForm.remark"></Input>
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
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryItem , bills } from './data'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import { formatNumber } from '@/util/validateRules'


const dataForm: any = {
  fee: null,
  remark: null,
}

@Component
export default class ComponentMain extends ViewBase {


  showDlg = false
  id = 0
  defaultfee: any = 0

  get ruleValidate() {
    const rules = {
      fee: [
          { required: true, message: '请输入金额(≥0且不得大于申请付款金额)' }
      ],
    }
    return rules
  }

  get formatNumber() {
    return formatNumber
  }


  dataForm = { ...dataForm }

  async init(id: any , applyAmount: any) {
    this.showDlg = true
    this.id = id || 0
    this.defaultfee = applyAmount
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
      this.dataForm.fee = applyAmount == null ? null : applyAmount
    }
  }


  cancel(dataForms: string) {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
   const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query = !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        try {
           const res =  await bills (query)
           toast('操作成功')
           this.showDlg = false
           this.$emit('done')
        } catch (ex) {
           this.handleError(ex)
           this.showDlg = false
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
/deep/ th {
  text-align: center;
}
/deep/ textarea {
  min-height: 140px;
  max-height: 140px;
}
</style>
