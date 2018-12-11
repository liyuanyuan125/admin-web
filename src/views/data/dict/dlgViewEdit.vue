<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新建词条' : '编辑词条'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100" :data="tableData">
      <FormItem label="词条名称" prop="name">
        <Input v-model="dataForm.name"></Input>
      </FormItem>
      <FormItem label="唯一识别符" prop="code">
        <Input v-model="dataForm.code"></Input>
      </FormItem>
      <FormItem label="排序" prop="sortValue">
        <Input v-model="dataForm.sortValue"></Input>
      </FormItem>
      <FormItem label="启用状态" prop="enableStatus">
        <RadioGroup v-model="dataForm.enableStatus" >
        <!-- {{list}} -->
          <Radio v-for="it in list" v-if="it.key!=0" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <!-- <FormItem label="启用状态" prop="enableStatus">
        <RadioGroup v-model="dataForm.enableStatus" >
          <Radio label="1">启用</Radio>
          <Radio label="2">停用</Radio>
        </RadioGroup>
      </FormItem> -->
    </Form>
    <!-- {{dataForm}} -->
    <div  slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop , Watch } from 'vue-property-decorator'
import { queryList } from '@/api/dict'
import { dataFrom , add , set , dictqueryList } from '@/api/dictCitiao'
import { clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import View from '@/util/View'

const defQuery = {
}
const dataForm = {
  name: '',
  code: '',
  category: {
    id: ''
  },
  sortValue: 0,
  enableStatus: ''
}

@Component
export default class ComponentMain extends View {
  query = { ...defQuery }
  oldQuery: any = {}

  @Prop({ type: Object }) cinemaOnes: any
  @Prop({ type: Array }) status: any

  showDlg = false
  id = 0
  a = 0
  lists: any[] = []
  list: any[] = []
  names = []
  grop = []
  ruleValidate = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入识别符', trigger: 'blur' }
    ],
    sortValue: [
        { required: true, message: '请输入排序序号' }
    ]
  }
  dataForm = { ...dataForm }
  async init(id: number, lists: any) {
    this.lists = lists
    this.showDlg = true
    this.id = id || 0
    this.$nextTick(async () => {
      const dataForms: string = 'dataForm'
      const myThis: any = this
      myThis.$refs[dataForms].resetFields()
      if (this.id != 0) {
        this.dataForm.name = this.cinemaOnes.name
        this.dataForm.code = this.cinemaOnes.code
        this.dataForm.sortValue = this.cinemaOnes.sortValue
        this.dataForm.enableStatus = this.cinemaOnes.enableStatus
      }
      if (this.id == 0) {
        this.dataForm.enableStatus = this.lists[1].key
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
   this.dataForm.sortValue = Number(this.dataForm.sortValue)
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
        // const res = !this.id ? await add (query) : await set (query)
        // if ( res && res.code === 0 ) {
        //   this.$Message.success({
        //       content: `${title}成功`,
        //       onClose: () => {
        //         this.showDlg = false
        //         this.$emit('refreshDataList')
        //       }
        //   })
        // } else {
        //   this.$Message.success({
        //     content: `${title}失败`
        //   })
        // }
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
    this.dataForm.category.id = id
    this.doSearch()
  }

  async doSearch() {
    this.oldQuery = { ...this.query }
    const query = clean({ ...this.query })
    try {
      const { data: {
        enableStatusList: list,
      } } = await queryList(query)
      this.list = list
      // console.log(this.list)
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
