<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='420'
    title='新建影城信息'
    >
    <p class="title">系统将自动根据您提供的ID号从第三方平台同步影城信息</p>
    <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="80">
        <FormItem label="MtimeID">
            <Input v-model="dataForm.mtimeId" placeholder="请输入"/>
        </FormItem>
    </Form>
    <div  slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import View from '@/util/View'
import { syncData } from '@/api/film'

@Component
export default class ComponentMain extends View {
  showDlg = false
  dataForm = {
    mtimeId: ''
  }
  init() {
    this.showDlg = true
  }

  cancel(dataForms: string) {
    this.showDlg = false
    const myThis: any = this
    myThis.$refs[dataForms].resetFields()
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    if ( !this.dataForm.mtimeId ) {
      this.showDlg = false
      return
    }
    try {
        const res = await syncData (this.dataForm.mtimeId)
        this.$Message.success({
        content: `同步成功`,
        onClose: () => {
          this.showDlg = false
          this.$emit('refreshDataList')
        }
      })
    } catch (ex) {
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
