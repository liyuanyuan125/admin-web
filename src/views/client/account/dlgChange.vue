<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'变更主账号'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="新主账户" prop="newname">
        <Select style="width:240px">
          <!-- <Option v-for="item in cityList" :value="item.value">{{ item.label }}</Option> -->
          <Option>456465465</Option>
          <Option>131323313</Option>
          <Option>789789798</Option>
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
import { dataFrom , add , set} from '@/api/dict'
import { warning , success, toast } from '@/ui/modal'
import { slice, clean } from '@/fn/object'

import View from '@/util/View'
const defQuery = {
  categoryId: 0,
}
const dataForm = {
  newname: '',
}

@Component
export default class ComponentMain extends View {
  // @Prop({ type: Object }) cinemaOnes: any
  query = { ...defQuery }
  // oldQuery: any = null
  list = []
  showDlg = false
  oldQuery: any = {}

  id = 0
  ruleValidate = {
    newname: [
        { required: true, message: '请选择新主账户' }
    ],
  }
  dataForm = { ...dataForm }
  init(id: number) {
    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    // this.$nextTick(async () => {
      // const dataForms: string = 'dataForm'
      // const myThis: any = this
      // myThis.$refs[dataForms].resetFields()
      if (this.id) {
        // const {data: {
        //   items: list
        // }} = await dataFrom({ id })
        // this.dataForm.name = this.cinemaOnes.name
        // this.dataForm.code = this.cinemaOnes.code
      }
    // })
  }

  cancel(dataForms: string) {
    this.showDlg = false
    // const myThis: any = this
    // myThis.$refs[dataForms].resetFields()
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
        const title = !this.id ? '添加' : '编辑'
        try {
           const res = !this.id ? await add (query) : await set (query)
           toast('操作成功')
           this.showDlg = false
           this.$emit('done')
            // if ( res && res.code === 0 ) {
            //   this.$Message.success({
            //       content: `${title}成功`,
            //       onClose: () => {
            //         this.showDlg = false
            //         this.$emit('done')
            //       }
            //   })
            // }
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
