<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新建字典分类' : '编辑字典分类'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
        <FormItem label="分类名称" prop="name">
            <Input v-model="dataForm.name"></Input>
        </FormItem>
        <FormItem label="唯一识别符" prop="code">
            <Input v-model="dataForm.code"></Input>
        </FormItem>
    </Form>
    <div  slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { dataFrom , add , set} from '@/api/dict'
import { warning , success } from '@/ui/modal'
import View from '@/util/View'
const defQuery = {
  id: null,
}
const dataForm = {
  id: '',
  name: '',
  code: '',
  enableStatus: 1
}

@Component
export default class ComponentMain extends View {
  query = { ...defQuery }
  oldQuery: any = null

  showDlg = false
  id = 0
  ruleValidate = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入识别符', trigger: 'blur' }
    ]
  }
  dataForm = { ...dataForm }
  init(id: number) {
    this.showDlg = true
    this.id = id || 0
    this.$nextTick(async () => {
      const dataForms: string = 'dataForm'
      const myThis: any = this
      myThis.$refs[dataForms].resetFields()
      if (this.id) {
        const {data: {
          items: list
        }} = await dataFrom({ id })
      }
    })
  }

  cancel(dataForms: string) {
    this.showDlg = false
    const myThis: any = this
    myThis.$refs[dataForms].resetFields()
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
   const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query = !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        const title = !this.id ? '添加' : '编辑'
        const res = !this.id ? await add (query) : await set (query)
        if ( res && res.code === 0 ) {
          this.$Message.success({
              content: `${title}成功`,
              onClose: () => {
                this.showDlg = false
                this.$emit('refreshDataList')
              }
          })
        } else {
          this.$Message.success({
            content: `${title}失败`
          })
        }
      }
    })
  }
  mounted() {
    const { id } = this.$route.params
    this.query.id = id
  }
}
</script>

<style lang="less" scoped>
</style>
