<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新建' : '编辑'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="公司ID" prop="mobile">
        <Input style="width:240px" v-model="dataForm.mobile" placeholder=""></Input>
      </FormItem>
      <FormItem label="公司名称" prop="name">
        <Input style="width:240px" v-model="dataForm.name"></Input>
      </FormItem>
       <FormItem label="账户余额：" prop="email">
        <Input style="width:240px" v-model="dataForm.email"></Input>
      </FormItem>
      <FormItem label="提现金额" prop="password" >
        <Input style="width:240px" v-model="dataForm.password"></Input>
      </FormItem>
      <FormItem label="提现方式" prop="passwords" >
        <Input style="width:240px"  v-model="dataForm.passwords" ></Input>
      </FormItem>
      <FormItem label="银行卡账户名" prop="password" >
        <Input style="width:240px" v-model="dataForm.password"></Input>
      </FormItem>
      <FormItem label="银行卡开户行" prop="passwords" >
        <Input style="width:240px"  v-model="dataForm.passwords" ></Input>
      </FormItem>
      <FormItem label="银行卡账号：" prop="companyId">
        <Select style="width:240px" v-model="dataForm.companyId" filterable>
          <Option v-for="it in companys" :key="it.id" :value="it.id">{{it.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="备注" prop="status">
        <Input style="width:240px"  v-model="dataForm.passwords" ></Input>
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
import ViewBase from '@/util/ViewBase'
const defQuery = {
  categoryId: 0,
}
const dataForm = {
  email: '',
  password: '',
  passwords: '',
  name: '',
  mobile: '',
  companyId: null,
  status: 1
}

@Component
export default class ComponentMain extends ViewBase {
  // @Prop({ type: Object }) cinemaOnes: any
  query = { ...defQuery }
  oldQuery: any = {}

  showDlg = false
  id = 0
  list = []
  companys = []

  get ruleValidate() {
    const rules = {
      email: [
        {
          pattern: /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/,
          message: '请输入正确的邮箱格式',
          trigger: 'blur'
        }
      ],
      name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            message: '请输入同时包含数字、字母且长度要在8-16位之间的密码',
            trigger: 'blur'
          }
      ],
    }
    return rules
  }


  dataForm = { ...dataForm }

  init(id: number) {

    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
      (this.dataForm.companyId as any) = id
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
           this.$emit('done', this.dataForm.email, res.data)
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
