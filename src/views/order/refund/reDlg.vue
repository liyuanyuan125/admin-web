<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'创建退款单'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left"  :label-width="100">
      <FormItem label="订单编号" prop="closeReason">
        <Select v-model="dataForm.orderNo" placeholder="退款单编号" filterable
          clearable class="component" ref="ui">
          <Option v-for="it in relist" :key="it.orderNo" :value="it.orderNo"
            :label="it.orderNo" class="flex-box">
            <span>{{it.orderNo}}</span>
          </Option>
        </Select>
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
import { queryList   } from '@/api/kollist'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'
const dataForm = {
  orderNo: '',
}

@Component
export default class ComponentMain extends ViewBase {
//   @Prop({ type: Object }) cinemaOnes: any

  loading = false
  showDlg = false
  id = 0

  relist: any = []

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
  async dataFormSubmit() {
    try {
      this.showDlg = false
      this.$router.push({ name: '/order/refund/detail/0/' + this.dataForm.orderNo})
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

  async mounted() {
    try {
      const relist = await queryList({orderStatus : 9})
      this.relist = relist.data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }

}
</script>

<style lang="less" scoped>
</style>
