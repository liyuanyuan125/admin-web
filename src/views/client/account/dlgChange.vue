<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'变更主账号'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="新主账户" prop="companyId">
        <Select style="width:240px" v-model="dataForm.newId">
          <Option v-for="it in list" :key="it.id" :value="it.id">{{it.email}}</Option>
        </Select>
      </FormItem>
    </Form>
    <p class="tip">提示：主账户变更后，原主账户将修改为不具备任何操作权限的子账户，如需删除，请使用新主账户在前台用户管理中进行操作</p>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { queryItem , queryList , dataFrom , addList , companysList , setchangeList} from '@/api/account'
import { warning , success, toast } from '@/ui/modal'
import { slice, clean } from '@/fn/object'

import ViewBase from '@/util/ViewBase'
const defQuery = {
  // categoryId: 0,
}
const dataForm = {
  // oldId: '',
  newId: '',
}

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Array }) prelist: any
  // @Prop({ type: String }) mainid: any
  query = { ...defQuery }
  // oldQuery: any = {}
  list: any = []
  showDlg = false
  oldQuery: any = {}

  id = 0
  ruleValidate = {
  }
  dataForm = { ...dataForm }
  init(id: any , list1: any, list2: any) {
    this.list = []
    this.showDlg = true
    this.id = id.id
    list1.forEach((it: any) => {
      this.list.push(it)
    })
    list2.forEach((it: any) => {
      this.list.push(it)
    })
    ; (this.$refs.dataForm as any).resetFields()
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
        const query = {
          oldId: this.id,
          ...this.dataForm
        }
        try {
           const res = await setchangeList (query)
           toast('操作成功')
           this.showDlg = false
           this.$emit('done')
           this.$router.push({ name: 'client-account' })
        } catch (ex) {
           this.handleError(ex)
           this.showDlg = false
        }
      }
    })
  }
  mounted() {
    // const { id } = this.$route.params
    // this.query.categoryId = this.id
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
    return list
  }

  async doSearch() {

    this.oldQuery = { ...this.query }


    const query = clean({ ...this.query })
    // try {
    //   const { data: {
    //     data: list,
    //     // parentAccount: prelist,
    //   } } = await queryItem(query)
    //   this.list = list
    //   // this.prelist = prelist
    // } catch (ex) {
    //   this.handleError(ex)
    // } finally {
    // }
  }
}
</script>

<style lang="less" scoped>
.tip {
  color: red;
}
</style>
