<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新建档期' : '编辑档期'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="dataForm.name"></Input>
      </FormItem>
      <FormItem label="年份" prop="year">
        <Input v-model="dataForm.year"></Input>
      </FormItem>
      <FormItem label="开始日期" prop="beginDate">
        <!-- <Input v-model="dataForm.beginDate" placeholder="日期格式为xx-xx-xx"></Input> -->
        <Date-picker type="date" @on-change="handleChange" v-model="dataForm.beginDate" on-change="selectTime" placeholder="选择日期" style="width: 200px"></Date-picker>
      </FormItem>
      <FormItem label="结束日期" prop="endDate">
        <!-- <Input v-model="dataForm.endDate" placeholder="日期格式为xx-xx-xx"></Input> -->
        <Date-picker type="date" @on-change="handleChange2" v-model="dataForm.endDate" on-change="selectTime" placeholder="选择日期" style="width: 200px"></Date-picker>
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
import { dataFrom , add , set , dels } from '@/api/calendar'
import { warning , success, toast } from '@/ui/modal'
import moment from 'moment'
import View from '@/util/View'
const timeFormat = 'YYYY-MM-DD'
const dataForm = {
  name: '',
  year: 0,
  // beginDate: new Date().getTime(),
  // endDate: new Date().getTime(),
  beginDate: 0,
  endDate: 0,
}

@Component
export default class ComponentMain extends View {
  @Prop({ type: Object }) cinemaOnes: any
  loading = false
  showDlg = false
  id = 0
  date1 = 0
  date2 = 0
  ruleValidate = {
    name: [
        { required: true, message: '请输入档期名称', trigger: 'blur' }
    ],
    year: [
        { required: true, message: '请输入年份' }
    ],
    beginDate: [
        { required: true, message: '请输入开始日期' }
    ],
    endDate: [
        { required: true, message: '请输入结束日期' }
    ],
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
        this.dataForm.name = this.cinemaOnes.name
        this.dataForm.year = this.cinemaOnes.year
        this.dataForm.beginDate = this.cinemaOnes.beginDates
        this.dataForm.endDate = this.cinemaOnes.endDates
      }
    })
  }

  cancel(dataForms: string) {
    this.dataForm.beginDate
    this.showDlg = false
    const myThis: any = this
    myThis.$refs[dataForms].resetFields()
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
    const a = moment(this.dataForm.beginDate).format(timeFormat).split('-')
    const b = moment(this.dataForm.endDate).format(timeFormat).split('-')

    this.dataForm.beginDate = Number(a[0] + a[1] + a[2])
    this.dataForm.endDate = Number(b[0] + b[1] + b[2])
    this.dataForm.year = Number(this.dataForm.year)

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

  handleChange(date: any) {
    const ch1 = moment(date).format(timeFormat).split('-')
    this.date1 = Number(ch1[0] + ch1[1] + ch1[2])
  }

  handleChange2(date: any) {
    const ch2 = moment(date).format(timeFormat).split('-')
    this.date2 = Number(ch2[0] + ch2[2] + ch2[2])
    if (this.date2 < this.date1) {
      alert('结束日期不能低于开始日期')
      this.dataForm.endDate = 0
      return
    }
  }
}
</script>

<style lang="less" scoped>
</style>
