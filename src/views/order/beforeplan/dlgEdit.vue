<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='450'
    :title="'定金和折扣设置'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="折扣" prop="rejectReason">
        <InputNumber style="width:240px" :min='0' :max='1' v-model="dataForm.discount"></InputNumber><br>
        请输入0-1的小数 (您的可享折扣为{{discount}})
      </FormItem>
      <FormItem label="定金" prop="rejectReason">
        <InputNumber style="width:240px" :min='0' v-model="dataForm.depositAmount"></InputNumber><br>
        如您设置的折扣值小于可享折扣值，需要下一级主管审批<br>
        设置折扣和定金后，不可在修改方案信息 (影片 / 影院)
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" v-if='dataForm.discount < discount' @click="dataFormSubmit('dataForm')">保存并提交下一级审批</Button>
      <Button type="primary" v-else @click="dataFormSubmit('dataForm')">保存并发送方案至广告主</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { business } from '@/api/beforeplan'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import ViewBase from '@/util/ViewBase'
const dataForm: any = {
  discount: null,
  depositAmount: null
}

@Component
export default class ComponentMain extends ViewBase {

  showDlg = false
  id = 0
  discount: any = 0

  get ruleValidate() {
    const rules = {
      name: [
          { required: true, message: '请输入备注', trigger: 'blur' }
      ],
      status: [
          { required: true }
      ]
    }
    return rules
  }


  dataForm = { ...dataForm }

  init(id: number , discount: any , depositAmount: any) {
    this.showDlg = true
    this.id = id || 0
    this.discount = discount
    this.dataForm.discount = discount,
    this.dataForm.depositAmount = depositAmount
    ; (this.$refs.dataForm as any).resetFields()
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
        const query: any = {
          discount: this.dataForm.discount,
          depositAmount: this.dataForm.depositAmount
        }
        try {
           const res =  await business (this.id, query)
           toast('操作成功')
           this.$emit('done')
           this.showDlg = false
        } catch (ex) {
           this.handleError(ex)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
</style>
