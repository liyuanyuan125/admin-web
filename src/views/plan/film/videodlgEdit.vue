<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'广告片小样'"
    @on-cancel="cancel" >
    <!-- <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="名称" prop="url">
        <Input v-model="dataForm.url"></Input>
      </FormItem>
    </Form> -->
    <video ref='videoplay' :src='src' width='93%' height='60%' autobuffer controls="controls" type="video/mp4" ></video>
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
// const dataForm = {
//   name: null,
//   fileId: null,
//   typeCode: null,
//   url: null
// }

@Component
export default class ComponentMain extends ViewBase {
  // @Prop({ type: Object }) cinemaOnes: any

  loading = false
  showDlg = false
  id = 0


  src: any = ''


  init(src: any) {
    this.showDlg = true
    this.src = src
  }

  cancel() {
    this.showDlg = false
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    this.showDlg = false
  }

}
</script>

<style lang="less" scoped>
</style>
