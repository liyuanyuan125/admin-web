<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'关闭订单'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="" prop="closeReason">
        <Input type='textarea' v-model="dataForm.closeReason"></Input>
      </FormItem>
      <p><span v-if='this.dataForm.closeReason.length > 150' style='color: red'>{{dataForm.closeReason.length}}</span><span v-if='this.dataForm.closeReason.length <= 150'>{{dataForm.closeReason.length}}</span>/150</p>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { set } from '@/api/orderSys'
import { warning , success, toast , info } from '@/ui/modal'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
const dataForm = {
  closeReason: '',
}

@Component
export default class ComponentMain extends ViewBase {
//   @Prop({ type: Object }) cinemaOnes: any

  loading = false
  showDlg = false
  id = 0

  ruleValidate = {
    closeReason: [
      { required: true,  message: '请输入拒绝理由' },
      { type: 'string', max: 150, message: '最多输入150个字符', trigger: 'change' }
    ],
  }

  dataForm: any = { ...dataForm }

  init(id: number) {
    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
        // console.log(this.id)
    }
  }

  cancel() {
    // this.dataForm.beginDate
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {

    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    try {
      const res = await set (this.$route.params.id, this.dataForm)
      toast('成功')
      this.showDlg = false
      this.$emit('done')
      this.$router.push({ name: 'order-list'})
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

}
</script>

<style lang="less" scoped>
</style>
