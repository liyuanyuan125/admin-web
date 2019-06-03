<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='660'
    :title="'审核监播'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="80">
      <FormItem label="审核意见" prop="closeReason">
        <RadioGroup v-model="statusform.status" >
          <Radio v-for="it in appList" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem v-if='statusform.status == 2' label="拒绝原因" prop="closeReason">
        <Input v-model='dataForm.closeReason' />
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" style='margin-left: 20px;' @click="change('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { number } from '@/api/orderSys'
import { warning , success, toast } from '@/ui/modal'
import {
  queryList,
  itemlist,
  okpasslist,
  refuselist
} from '@/api/supervision'
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
  dataForm = {
    closeReason: '',
    orderIds: []
  }


  statusform =  {
    status: 1,
  }

  appList: any = [
    {
      key: 1,
      text: '通过'
    },
    {
      key: 2,
      text: '拒绝'
    }
  ]



  showDlg = false
  id: any = 0
  idslist: any = []

  init(ids: any) {
    this.showDlg = true
    this.idslist = ids
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
  async change(dataForms: any) {

    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    if (valid) {
        if (this.statusform.status == 1) {
          try {
            const res =  await okpasslist ({ids : this.idslist})
            toast('操作成功')
            this.showDlg = false
            this.$emit('done', this.id)
            ; (this.$refs.dataForm as any).resetFields()
          } catch (ex) {
            this.handleError(ex)
            this.showDlg = false
          }
        } else if (this.statusform.status == 2) {
          try {
            const res =  await refuselist ({ids : this.idslist , closeReason : this.dataForm.closeReason})
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
  }

}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 20px;
}
</style>
