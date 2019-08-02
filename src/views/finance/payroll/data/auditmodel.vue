<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    title="申请付款"
    @on-cancel="cancel('dataForm')"
    >
     <Form ref="formCustom" :model="query" :label-width="80">
      <FormItem label="审批意见：" prop="approvalType">
         <RadioGroup v-model="query.approvalType">
            <Radio :label="1">同意</Radio>
            <Radio :label="2">拒绝</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="备注：" prop="passwdCheck">
        <Input type="textarea" :rows="4" v-model="query.passwdCheck"></Input>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button type="primary" @click="dataFormSubmit">确定</Button>
      <Button @click="cancel">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { clean } from '@/fn/object'
import { billsaudit } from '@/api/payroll'
import { toMap } from '@/fn/array'
import moment from 'moment'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
@Component
export default class ComponentMain extends ViewBase {
  showDlg = false
  id: any = []

  query: any = {
    approvalType: 1,
    approveRemark: ''
  }

  init(id: any) {
    this.showDlg = true
    this.id = id
  }

  cancel() {
    this.showDlg = false
    this.query = {
      approvalType: 1,
      approveRemark: ''
    }
  }

  async dataFormSubmit() {
    try {
      await billsaudit({
        ...this.query,
        approvalType: this.query.approvalType == 1 ? true : false,
        ids: this.id
      })
      this.$emit('done')
      this.cancel()
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
.next-city {
  position: absolute;
  top: 14px;
  left: 120px;
  font-size: 14px;
  color: #17233d;
  font-weight: 700;
}
.hiht {
  margin-left: 15px;
  color: #6b6b6b;
}
/deep/ span:only-child:empty {
  &::before {
    content: '-';
  }
}
</style>