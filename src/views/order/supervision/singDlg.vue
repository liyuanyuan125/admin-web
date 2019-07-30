<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='660'
    :title="'审核监播'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="80">
      <video :src="url" width='100%' height='50%' controls="controls"></video>
      <FormItem label="审核意见" prop="closeReason">
        <RadioGroup v-model="statusform.status" >
          <Radio v-for="it in appList" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <Row v-if='statusform.status == 1' style='margin-left: 80px;'>请勾选在监播中已出现的广告，如有未出现广告，请及时与资源方联系！(审核通过后，未勾选的广告片将不参与到结算中，请谨慎操作)<br><Checkbox  :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll">全选</Checkbox></Row>
      <FormItem v-if='statusform.status == 1' label="" prop="closeReason">
        <CheckboxGroup  v-model="dataForm.orderIds" >
          <Checkbox  v-for="(it,index) in itemvideos" :key="it.index" :value="it.orderId" :label="it.orderId">{{it.videoName}} ({{it.videoLength}})s</Checkbox >
        </CheckboxGroup >
      </FormItem>
      <FormItem v-if='statusform.status == 2' label="拒绝原因" prop="closeReason">
        <Input v-model='dataForm.closeReason' />
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" style='margin-left: 20px;' @click="change('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { number } from '@/api/orderSys'
import { warning , success, toast , info } from '@/ui/modal'
import {
  queryList,
  itemlist,
  okpass,
  refuse
} from '@/api/supervision'
import inputTextarea from '@/components/inputTextarea.vue'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    inputTextarea
  }
})
export default class ComponentMain extends ViewBase {
  dataForm = {
    closeReason: '',
    orderIds: []
  }


  statusform =  {
    status: 1,
  }

  appList: any = [
    {
      key: 1,
      text: '通过'
    },
    {
      key: 2,
      text: '拒绝'
    }
  ]

  checkAll: any = false
  indeterminate: any = true


  showDlg = false
  id: any = 0
  itemvideos: any = []
  url: any = null

  init(id: number, row: any) {
    this.showDlg = true
    this.itemvideos = row.videoDetails
    this.url = row.fileUrl
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
        // console.log(this.id)
    }
  }


  cancel() {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  async change(dataForms: any) {

    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    if (valid) {
        if (this.statusform.status == 1) {
          if (this.dataForm.orderIds.length == 0) {
            info('请选择广告片')
            return
          }
          try {
            const res =  await okpass (this.id , {orderIds : this.dataForm.orderIds})
            toast('操作成功')
            this.showDlg = false
            this.$emit('done', this.id)
            ; (this.$refs.dataForm as any).resetFields()
            this.dataForm = {
              closeReason: '',
              orderIds: []
            }
          } catch (ex) {
            this.handleError(ex)
            this.showDlg = false
          }
        } else if (this.statusform.status == 2) {
          try {
            const res =  await refuse (this.id , {closeReason : this.dataForm.closeReason})
            toast('操作成功')
            this.showDlg = false
            this.$emit('done', this.id)
            ; (this.$refs.dataForm as any).resetFields()
            this.dataForm = {
              closeReason: '',
              orderIds: []
            }
          } catch (ex) {
            this.handleError(ex)
            this.showDlg = false
          }
        }
      }
  }

  handleCheckAll() {
    if (this.indeterminate) {
        this.checkAll = false
    } else {
        this.checkAll = !this.checkAll
    }
    this.indeterminate = false

    if (this.checkAll) {
        this.dataForm.orderIds = (this.itemvideos || []).map((it: any ) => {
          return it.orderId
        })
    } else {
        this.dataForm.orderIds = []
    }
  }

}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 20px;
}
</style>
