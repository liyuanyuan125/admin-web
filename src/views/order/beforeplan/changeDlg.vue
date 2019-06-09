<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='440'
    :title="'变更资源方'"
    @on-cancel="cancel" >
    <p class="title">【{{cName}}】的资源方公司由 【{{name}}】变更为</p>
    <Form ref="dataForm" :model="dataForm" label-position="left" :label-width="0">
      <!-- <compangList v-model='dataForm.resourceId' @done="dlgEditDone"/> -->
      <Select v-model='dataForm.resourceId' placeholder="资源方公司" filterable
        clearable class="component">
        <Option v-for="it in list" :key="it.id" :value="it.id"
          :label="it.name" class="flex-box">
          <span>{{it.name}}</span>
        </Option>
      </Select>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { number } from '@/api/orderSys'
import { warning , success, toast } from '@/ui/modal'
import { aresids } from '@/api/beforeplan'
import { queryList } from '@/api/corpReal'
import inputTextarea from '@/components/inputTextarea.vue'
import compangList from '../supervision/companyList.vue'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { clean } from '@/fn/object'
const timeFormat = 'YYYY-MM-DD'

@Component({
  components: {
    inputTextarea,
    compangList
  }
})
export default class ComponentMain extends ViewBase {

  loading = false
  showDlg = false
  id: any = 0
  title = ''
  dataForm: any = {
    cinemaId: null,
    resourceId: null,
  }
  cName: any = ''
  name: any = ''
  list: any = []

  async mounted() {
    try {
      const { data } =  await queryList(clean({
        pageSize: 888888,
        status: 1,
        typeCode: 'resource'
      }))
      this.list = data.items
    } catch (ex) {
      this.handleError(ex)
    }
  }


  init(id: any, cName: any , name: any , idres: any) {
    this.showDlg = true
    this.dataForm.cinemaId = id
    this.dataForm.resourceId = idres
    this.cName = cName
    this.name = name
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
  async dataFormSubmit(dataForms: any) {
    // const valid = await (this.$refs.dataForm as any).validate()
    // if (!valid) {
    //   return
    // }
    try {
      const res = await aresids (this.$route.params.id , this.dataForm)
      toast('操作成功')
      this.showDlg = false
      this.$emit('done', this.id)
      ; (this.$refs.dataForm as any).resetFields()
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 20px;
}
</style>
