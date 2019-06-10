<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'信息修改'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left"  :label-width="100">
      <FormItem label="修改金额" prop="closeReason">
        <Input style="width:100px" v-model="dataForm.confirmPrice"></Input>
      </FormItem>
      <FormItem label="修改备注" prop="closeReason">
        <Input style="width:100px" v-model="dataForm.confirmRemark"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit()">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { set } from '@/api/orderSys'
import { warning , success, toast , info } from '@/ui/modal'
import moment from 'moment'
import { queryList , edit  } from '@/api/kollist'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
const dataForm = {
  orderItemId: 0,
  confirmPrice: '',
  confirmRemark: '',
}

@Component
export default class ComponentMain extends ViewBase {
//   @Prop({ type: Object }) cinemaOnes: any

  loading = false
  showDlg = false
  id = 0

  relist: any = []

  dataForm: any = { ...dataForm }

  init(id: number , price: any , mark: any) {
    this.showDlg = true
    this.dataForm.orderItemId = id
    this.dataForm.confirmPrice = price
    this.dataForm.confirmRemark = mark
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
  async dataFormSubmit() {
    try {
      const res =  await edit (this.dataForm)
      toast('操作成功')
      this.showDlg = false
      this.$emit('done' )
      ; (this.$refs.dataForm as any).resetFields()
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

  // async mounted() {
  //   try {
  //     const relist = await queryList({orderStatus : 9})
  //     this.relist = relist.data.items
  //   } catch (ex) {
  //     this.handleError(ex)
  //   }
  // }

}
</script>

<style lang="less" scoped>
</style>
