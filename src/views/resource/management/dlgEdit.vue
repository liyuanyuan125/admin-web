<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='420'
    title='选择档期'
    @on-cancel="cancel"
    >
    <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="0">
        <FormItem>
          <Icon size="28" type="ios-arrow-back" @click="dataForm.years -= 1" />
            <InputNumber ref="input" style="width:80px" v-model="dataForm.years" placeholder="请输入"/>
          <Icon size="28" @click="dataForm.years += 1" type="ios-arrow-forward" />
        </FormItem>
    </Form>

    <div>

    </div>

    <div class="page-wrap" v-if="total2 > 0">
    <Page :total="total2" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
    <div  slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { syncData } from '@/api/film'
@Component
export default class ComponentMain extends ViewBase {
  showDlg = true
  rolads = false
  dataForm = {
    years: new Date().getFullYear(),
    pageIndex: 1,
    pageSize: 20,
  }

  init() {
    this.showDlg = true
  }

  cancel() {
    this.showDlg = false
  }

  async doSeach() {
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
     this.dataForm.years = this.dataForm.years + 1
  }

  @Watch('dataForm', {deep: true})
  watchdataForm(val: any) {
    this.doSeach()
  }

}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 15px;
}
</style>