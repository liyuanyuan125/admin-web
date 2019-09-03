<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="id == 0 ? '录入下载链接' : '编辑下载链接'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="名称" prop="url">
        <Input v-model="dataForm.url"></Input>
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
import { dataFrom , addvideo , editvideo } from '@/api/planfilm'
import { warning , success, toast } from '@/ui/modal'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
const dataForm = {
  name: null,
  fileId: null,
  typeCode: null,
  url: null
}

@Component
export default class ComponentMain extends ViewBase {
  // @Prop({ type: Object }) cinemaOnes: any

  loading = false
  showDlg = false
  id = 0

  ruleValidate = {
    url: [
      { required: true, message: '请输入下载链接', trigger: 'blur' }
    ]
  }
  rowlist: any = {}

  dataForm: any = { ...dataForm }

  init(id: number ,  row: any) {
    // this.dataForm.typeCode = key
    this.showDlg = true
    this.id = id || 0
    this.rowlist = row
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
      this.dataForm.url = row.fileUrl
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
    const query = !this.id ? {
      ...this.dataForm,
    } : {
      id: this.id,
      ...this.dataForm,
    }
    const title = !this.id ? '添加' : '编辑'
    try {
      const res = !this.id ? await addvideo (this.$route.params.id , {typeCode: '-1' , url: query.url})
      : await editvideo (this.$route.params.id , this.rowlist.id , {url: query.url} )
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
