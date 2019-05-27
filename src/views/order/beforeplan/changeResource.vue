<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'变更资源方'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <Row style='text-align: center;line-height: 50px;'>【常营沃美影城】的资源方公司由 【天街物业】变更为</Row>
      <FormItem label="" prop="closeReason">
        <Select v-model="dataForm.closeReason" placeholder="资源方公司名称" style='width: 200px;'  filterable>
            <Option v-for="it in []" :key="it.id" :value="it.id"
              :label="it.name">{{it.name}}</Option>
          </Select>
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
      { required: true,  message: '请选择要修改的资源方公司' },
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
