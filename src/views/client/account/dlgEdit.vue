<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新建' : '编辑'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="用户账号" prop="email">
        <Input style="width:240px" v-model="dataForm.email"></Input>
      </FormItem>
      <FormItem label="姓名" prop="name">
        <Input style="width:240px" v-model="dataForm.name"></Input>
      </FormItem>
      <FormItem label="手机号" prop="mobile">
        <Input style="width:240px" v-model="dataForm.mobile"></Input>
      </FormItem>
      <FormItem label="密码" prop="password" type="password">
        <Input style="width:240px" v-model="dataForm.password"></Input>
      </FormItem>
      <FormItem label="重复密码" prop="passwords" type="password">
        <Input style="width:240px" v-model="dataForm.passwords"></Input>
      </FormItem>
      <FormItem label="所属公司" prop="companyId">
        <Select style="width:240px" v-model="dataForm.companyId">
          <Option v-for="it in companys" :key="it.id" :value="it.id">{{it.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="启用状态" prop="status">
        <RadioGroup v-model="dataForm.status" >
          <!-- <Radio label="启用"></Radio>
          <Radio label="停用"></Radio> -->
          <Radio v-for="it in list" v-if="it.key!=0" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
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
import { queryItem , queryList , dataFrom , addList , companysList } from '@/api/account'
import { slice, clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import View from '@/util/View'
const defQuery = {
  categoryId: 0,
}
const dataForm = {
  email: '',
  password: '',
  name: '',
  mobile: '',
  companyId: '',
  status: 1
}

@Component
export default class ComponentMain extends View {
  // @Prop({ type: Object }) cinemaOnes: any
  query = { ...defQuery }
  oldQuery: any = {}

  showDlg = false
  id = 0
  list = []
  companys = []

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
    mobile: [
        { required: true, message: '请输入手机号码' }
    ],
    // companyId: [
    //     { required: true, message: '请选择所属公司' }
    // ],
    status: [
        { required: true }
    ]
  }

  dataForm = { ...dataForm }

  init(id: number) {
    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
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
        const query = !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        const title = '添加'
        try {
           const res =  await addList (query)
           toast('操作成功')
           this.showDlg = false
           this.$emit('done', this.dataForm.email)
        } catch (ex) {
           this.handleError(ex)
           this.showDlg = false
        }
      }
    })
  }

  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
      }
    })
    // console.log(list)
    return list
  }

  mounted() {
    const { id } = this.$route.params
    this.query.categoryId = this.id
    this.doSearch()
  }

  async doSearch() {
    this.oldQuery = { ...this.query }
    const query = clean({ ...this.query })
    try {
      const { data: {
        statusList: list,
        // items: companys
      } } = await queryList(query)
      const { data: {
        // statusList: list,
        items: companys
      } } = await companysList(query)
      this.list = list
      this.companys = companys
      // console.log(this.companys)
    } catch (ex) {
      this.handleError(ex)
    } finally {
      // this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
