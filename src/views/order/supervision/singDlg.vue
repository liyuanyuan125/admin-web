<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='660'
    :title="'审核监播'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="80">
      <FormItem label="审核意见" prop="closeReason">
        <RadioGroup v-model="dataForm.closeReason" >
          <Radio v-for="it in []" v-if="it.key!=3" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="" prop="closeReason">
        <inputTextarea v-model="dataForm.closeReason" :maxLength="140" type="area" />
      </FormItem>
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
import { number } from '@/api/orderSys'
import { warning , success, toast } from '@/ui/modal'
import { cinemaCancel } from '@/api/orderSys'
import inputTextarea from '@/components/inputTextarea.vue'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    inputTextarea
  }
})
export default class ComponentMain extends ViewBase {

  loading = false
  showDlg = false
  id: any = 0
  title = ''
  dataForm = {
    closeReason: '',
  }

  ruleValidate = {
    closeReason: [
      { required: true, message: '请输入取消原因', trigger: 'change' }
    ],
  }

  init(id: number, shortName: any) {
    this.showDlg = true
    this.title = shortName
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
        // console.log(this.id)
    }
  }

  inits(id: any) {
    this.showDlg = true
    this.title = id.length + '条'
    this.id = id || []
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
        // console.log(this.id)
    }
  }

  cancel() {
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
      const res = await cinemaCancel (this.$route.params.id ,
      {cinemaId: this.id, closeReason: this.dataForm.closeReason})
      toast('操作成功')
      this.showDlg = false
      this.$emit('done', this.id)
      ; (this.$refs.dataForm as any).resetFields()
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 20px;
}
</style>
