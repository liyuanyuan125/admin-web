<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='420'
    title='新建影片'
    @on-cancel="cancel"
    >
    <p class="title">系统将自动根据您提供的ID号从第三方平台同步影片信息</p>
    <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="80">
        <FormItem label="MtimeID">
            <Input v-model="dataForm.mtimeId" placeholder="请输入"/>
        </FormItem>
    </Form>
    <div  slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
    <Refresh  v-if="rolads" />
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { syncData } from '@/api/film'
@Component
export default class ComponentMain extends ViewBase {
  showDlg = false
  rolads = false
  dataForm = {
    mtimeId: ''
  }
  init() {
    this.showDlg = true
  }

  cancel() {
    this.showDlg = false
    this.dataForm.mtimeId = ''
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    if ( !this.dataForm.mtimeId ) {
      this.showDlg = false
      return
    }
    try {
      (this.$Spin as any).show()
      const res = await syncData (this.dataForm.mtimeId, 0)
      this.$Message.success({
        content: `同步成功`,
        onClose: () => {
          this.showDlg = false
        }
      })
      ; (this.$Spin as any).hide()
      this.dataForm.mtimeId = ''
      this.$emit('refreshDataList')
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 15px;
}
</style>