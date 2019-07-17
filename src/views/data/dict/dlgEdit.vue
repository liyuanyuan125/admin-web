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
      <FormItem v-if='id != 0' label="唯一识别符" prop="code">
        <Input v-model="dataForm.code" disabled></Input>
      </FormItem>
      <FormItem v-if='id == 0' label="唯一识别符" prop="code">
        <Input v-model="dataForm.code"></Input>
      </FormItem>
      <FormItem label="启用状态" prop="enableStatus">
        <RadioGroup v-model="dataForm.enableStatus" >
          <Radio v-for="it in list"  v-if="it.key!=0" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
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
import { queryList } from '@/api/dict'
import { clean } from '@/fn/object'
import { dataFrom , add , set} from '@/api/dict'
import { warning , success, toast } from '@/ui/modal'
import ViewBase from '@/util/ViewBase'
const defQuery = {
  categoryId: 0,
}
const dataForm = {
  name: '',
  code: '',
  enableStatus: 1
}

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Object }) cinemaOnes: any
  query = { ...defQuery }
  oldQuery: any = {}
  list = []

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
  async init(id: number , qStatus: any) {
    // console.log(id)
    this.showDlg = true
    this.id = id || 0
    this.$nextTick(async () => {
      const dataForms: string = 'dataForm'
      const myThis: any = this
      myThis.$refs[dataForms].resetFields()
      if (this.id) {
        // 启用状态列表
        this.list = qStatus
        this.dataForm.name = this.cinemaOnes.name
        this.dataForm.code = this.cinemaOnes.code
        this.dataForm.enableStatus = this.cinemaOnes.enableStatus
      }
      if (this.id == 0) {
        this.list = qStatus
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
        try {
           const res = !this.id ? await add (query) : await set (query)
           toast('操作成功')
           this.showDlg = false
           this.$emit('done')
        } catch (ex) {
           this.handleError(ex)
           this.showDlg = false
        }
      }
    })
  }
  mounted() {
    const { id } = this.$route.params
    this.query.categoryId = this.id
  }
}
</script>

<style lang="less" scoped>
</style>
