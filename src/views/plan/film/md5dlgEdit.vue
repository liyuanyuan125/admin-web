<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'获取md5值'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="包名" prop="name">
        <Input v-model="dataForm.name"/>
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
import { dataFrom , getmd5 } from '@/api/planfilm'
import { warning , success, toast } from '@/ui/modal'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
const dataForm = {
  name: null
}

@Component
export default class ComponentMain extends ViewBase {
  // @Prop({ type: Object }) cinemaOnes: any

  loading = false
  showDlg = false
  id = 0

  ruleValidate = {
    name: [
      { required: true, message: '请输入包名', trigger: 'blur' }
    ]
  }

  dataForm: any = { ...dataForm }

  init() {
    this.showDlg = true
    ; (this.$refs.dataForm as any).resetFields()
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
    const query = {
      id: this.$route.params.id,
      ...this.dataForm,
    }
    try {
      const res =  await getmd5 (query)
      toast('操作成功')
      this.showDlg = false
      this.$emit('done')
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

}
</script>

<style lang="less" scoped>
</style>
