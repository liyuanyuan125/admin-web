<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    title="添加"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="城市" prop="id">
        <Xselect 
        v-model="dataForm.id" 
        @selectedCity="selectedCityHandler" 
        :selectedCityName="dataForm.name"></Xselect>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { dataFrom , add , set , dels } from '@/api/calendar'
import { warning , success, toast } from '@/ui/modal'
import ViewBase from '@/util/ViewBase'
import { queryList, removeItem, addItem, queryCities } from './data'
import Xselect from './x-select.vue'

const dataForm = {
  id: null,
  name: ''
}

@Component({
  components: {
    Xselect
  }
})
export default class ComponentMain extends ViewBase {
  @Prop({ type: Object }) cinemaOnes: any

  showDlg: boolean = false

  ruleValidate = {
    id: [
      { required: true, message: '请选择城市', trigger: 'change', type: 'number' }
    ]
  }

  dataForm: any = { ...dataForm }

  init(id: number = 0) {
    this.showDlg = true
    ; (this.$refs.dataForm as any).resetFields()
  }

  cancel() {
    // this.dataForm.beginDate
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    const query = {
      cityId: this.dataForm.id,
      cityName: this.dataForm.name
    }
    try {
      const res = await addItem (query)
      const code = res.code
      const msg = res.msg || null
      if ( code === 0 ) {
        toast('操作成功')
        this.showDlg = false
        this.$emit('done')
      } else {
        if ( msg ) {
          toast(msg)
        }
      }
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    } finally {
      (this.$refs.dataForm as any).resetFields()
    }
  }

  selectedCityHandler( val: string ) {
    this.dataForm.name = val
  }

}
</script>

<style lang="less" scoped>
</style>
