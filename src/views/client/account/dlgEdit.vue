<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新建字典分类' : '编辑字典分类'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="用户账号" prop="name">
        <Input v-model="dataForm.name"></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="dataForm.password"></Input>
      </FormItem>
      <FormItem label="重复密码" prop="passwords">
        <Input v-model="dataForm.passwords"></Input>
      </FormItem>
      <FormItem label="邮箱" prop="email">
        <Input v-model="dataForm.email" type="email"></Input>
      </FormItem>
      <FormItem label="所属公司" prop="company">
        <Select style="width:200px">
          <!-- <Option v-for="item in cityList" :value="item.value">{{ item.label }}</Option> -->
          <Option>456465465</Option>
          <Option>131323313</Option>
          <Option>789789798</Option>
        </Select>
      </FormItem>
      <FormItem label="角色" prop="juese">
        <RadioGroup v-model="dataForm.juese" >
          <!-- <Radio v-for="it in list" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio> -->
          <Radio label="超级管理员"></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="启用状态" prop="enableStatus">
        <RadioGroup v-model="dataForm.enableStatus" >
          <!-- <Radio v-for="it in list" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio> -->
          <Radio label="启用"></Radio>
          <Radio label="停用"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { dataFrom , add , set} from '@/api/dict'
import { warning , success, toast } from '@/ui/modal'
import View from '@/util/View'
const defQuery = {
  categoryId: 0,
}
const dataForm = {
  name: '',
  code: '',
  enableStatus: 1
}

@Component
export default class ComponentMain extends View {
  // @Prop({ type: Object }) cinemaOnes: any
  query = { ...defQuery }
  // oldQuery: any = null

  showDlg = false
  id = 0
  ruleValidate = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码' }
    ],
    passwords: [
        { required: true, message: '请重新输入密码' }
    ],
    email: [
        { required: true, message: '请输入邮箱账号' }
    ],
    company: [
        { required: true, message: '请选择所属公司' }
    ],
    juese: [
        { required: true, message: '必选' }
    ],
    enableStatus: [
        { required: true }
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
        // const {data: {
        //   items: list
        // }} = await dataFrom({ id })
        // this.dataForm.name = this.cinemaOnes.name
        // this.dataForm.code = this.cinemaOnes.code
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
