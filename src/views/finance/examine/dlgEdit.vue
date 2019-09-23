<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'确认汇款'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="启用状态" prop="agree">
        <RadioGroup v-model="dataForm.agree" >
          <Radio v-for="it in statuslist" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注" prop="rejectReason">
        <Input type='textarea' style="width:240px" v-model="dataForm.rejectReason"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { setList } from '@/api/examine'
import { slice, clean } from '@/fn/object'
import { warning , success, toast , info } from '@/ui/modal'
import ViewBase from '@/util/ViewBase'
const dataForm = {
  rejectReason: '',
  agree: 1
}

@Component
export default class ComponentMain extends ViewBase {

  showDlg = false
  id = 0

  get ruleValidate() {
    const rules = {
      // rejectReason: [
      //     { required: true, message: '请输入备注', trigger: 'blur' }
      // ],
      // status: [
      //     { required: true }
      // ]
    }
    return rules
  }


  dataForm = { ...dataForm }

  statuslist: any = [
    {
      key: 1,
      text: '通过',
      iftrue: true
    },
    {
      key: 2,
      text: '拒绝',
      iftrue: false
    }
  ]

  init(id: number) {
    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
  }

  cancel(dataForms: string) {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
   if (this.dataForm.agree == 2 && this.dataForm.rejectReason == '') {
     info('请输入备注信息')
     return
   }
   const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query: any = {
          id: this.id,
          agree: this.dataForm.agree == 1 ? true : false,
          rejectReason: this.dataForm.rejectReason
        }
        try {
           const res =  await setList (query)
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
</style>
