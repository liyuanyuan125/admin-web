<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='440'
    :title="'取消执行单'"
    @on-cancel="cancel" >
    <p class="title">即将取消{{title}}的执行单，不影响其他影院的执行</p>
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="0">
      <FormItem prop="closeReason">
        <Input v-model="dataForm.closeReason" :maxlength="140" show-word-limit type="textarea" />
        <span style='color: #ccc;'>{{dataForm.closeReason.length}} / 140</span>
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
import { warning , success, toast , info} from '@/ui/modal'
import { cinemaCancel , set } from '@/api/orderSys'
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
  ids: any = []
  title = ''
  dataForm = {
    closeReason: '',
  }
  length: any = 0

  ruleValidate = {
    closeReason: [
      { required: true,  message: '请输入取消原因', trigger: 'change' }
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

  inits(id: any, length: any) {
    this.showDlg = true
    this.title = id.length + '条'
    this.ids = id || []
    this.length = length
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
      if (this.dataForm.closeReason.length > 140) {
        info('请确认字数长度')
        return
      }
      if (this.ids.length == 0) {
        const res = await cinemaCancel (
          { id: this.$route.params.id ,
            cinemas : [{id: this.id, reasond: this.dataForm.closeReason}]
          }
        )
      } else {
        const itemlist = (this.ids || []).map((it: any) => {
          return {
            id: it,
            reasond: this.dataForm.closeReason
          }
        })
        const res = await cinemaCancel (
          { id: this.$route.params.id ,
            cinemas : itemlist
          }
        )
        // // 若全部取消则关闭改订单
        // if (this.ids.length == this.length) {
        //   const data = await set ({id: this.$route.params.id, reasond: '无有效影院'})
        // }
      }

      toast('操作成功')
      this.showDlg = false
      this.$emit('dlgEditDone', this.id)
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
