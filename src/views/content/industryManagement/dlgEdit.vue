<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='600'
    :title="title"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="行业名称" prop="tradeName">
        <Input style="width:240px" :disabled='viewDetail' v-model="dataForm.tradeName"></Input>
      </FormItem>
      <FormItem label="行业ID" prop="tradeId">
        <InputNumber style="width:240px" :disabled='viewDetail' :min='0' v-model="dataForm.tradeId"></InputNumber>
      </FormItem>
      <FormItem  label="icon图片" prop="receipt">
          <Row class="upload">
            <Col span="12">
                <Upload v-model="dataForm.receipts" multiple :maxCount="1" accept="image/*"/>
            </Col>
          </Row>
        </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确认</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { business } from '@/api/beforeplan'
import { slice, clean } from '@/fn/object'
import { warning , success, toast , info } from '@/ui/modal'
import { formatNumber } from '@/util/validateRules'
import ViewBase from '@/util/ViewBase'
import { addList , setList , itemList } from '@/api/industry'
import Upload from '@/components/Upload.vue'
const dataForm: any = {
  tradeName: '',
  tradeId: null,
  receipts: [],
  receipt: ''
}

@Component({
  components: {
    Upload
  }
})
export default class ComponentMain extends ViewBase {

  showDlg = false
  id = 0

  itemlist: any = {}
  viewDetail: any = false

  title: any = ''

  get formatNumber() {
    return formatNumber
  }

  get ruleValidate() {
    const rules = {
      name: [
          { required: true, message: '请输入行业名称', trigger: 'blur' }
      ],
      receipt: [
          { required: true }
      ]
    }
    return rules
  }

  dataForm = { ...dataForm }

  async init(id: number) {
    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (id == 0) {
      this.title = '新建'
    }
    if (id == -1) {
      this.title = '查看'
      this.viewDetail = true
    }
    if (id != 0) {
      this.title = '编辑'
      // const data = await itemList(id)
      // this.dataForm.tradeName = data.item.tradeName
      // this.dataForm.tradeId = data.item.tradeId
      // this.dataForm.iconUrl = data.item.iconUrl
    }
  }

  cancel(dataForms: string) {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
   const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query: any = {
          discount: this.dataForm.discount,
          depositAmount: this.dataForm.depositAmount
        }
        try {
           const res =  await business (this.id, query)
           toast('操作成功')
           this.$emit('done')
           this.showDlg = false
        } catch (ex) {
           this.handleError(ex)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
</style>
