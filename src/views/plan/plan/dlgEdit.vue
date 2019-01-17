<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='420'
    title='计划状态修改'
    @on-cancel="cancel"
    >
    <p class="title">确认将状态修改为<span class="red"></span></p>
    <Form ref="dataForm" :model="dataForm" :rules="rule" label-position="left" :label-width="80">
        <FormItem label="原因" prop="person">
            <Input v-model="dataForm.person" placeholder="请输入"/>
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
    person: ''
  }

  rule = {
    person: [
      { required: true, message: '原因不能为空', trigger: 'blur' }
    ]
  }

  init(id: any, type: string) {
    this.showDlg = true
  }

  cancel() {
    (this.$refs.dataForm as any).resetFields()
    this.showDlg = false
    this.dataForm.person = ''
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    const voild = await (this.$refs.dataForm as any).validate()
    if (!voild) { return }
    try {
      (this.$Spin as any).show()
      const res = await syncData (this.dataForm.person, 0)
      this.$Message.success({
        content: `同步成功`,
        onClose: () => {
          this.showDlg = false
        }
      })
      ; (this.$Spin as any).hide()
      this.dataForm.person = ''
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
.red {
  color: red;
}
</style>