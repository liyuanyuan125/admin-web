<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新建档期' : '编辑档期'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="名称" prop="name">
        <Input v-model="dataForm.name"></Input>
      </FormItem>
      <FormItem label="年份" prop="year">
        <Input v-model="dataForm.year"></Input>
      </FormItem>
      <FormItem label="开始日期" prop="beginDate">
        <!-- <Input v-model="dataForm.beginDate" placeholder="日期格式为xx-xx-xx"></Input> -->
        <Date-picker type="date" @on-change="handleChange" v-model="dataForm.beginDate"
          on-change="selectTime" placeholder="选择日期" style="width: 200px" v-if="showDlg"></Date-picker>
      </FormItem>
      <FormItem label="结束日期" prop="endDate">
        <!-- <Input v-model="dataForm.endDate" placeholder="日期格式为xx-xx-xx"></Input> -->
        <Date-picker type="date" @on-change="handleChange2" v-model="dataForm.endDate"
          on-change="selectTime" placeholder="选择日期" style="width: 200px" v-if="showDlg"></Date-picker>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">确定</Button>
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
  year: null,
  // beginDate: new Date().getTime(),
  // endDate: new Date().getTime(),
  beginDate: '',
  endDate: '',
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

  dataForm: any = { ...dataForm }

  init(id: number) {
    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (this.id) {
      // const {data: {
      //   items: list
      // }} = await dataFrom({ id })
      this.dataForm.name = this.cinemaOnes.name
      this.dataForm.year = this.cinemaOnes.year
      this.dataForm.beginDate = this.cinemaOnes.beginDates
      this.dataForm.endDate = this.cinemaOnes.endDates
    }
  }

  cancel() {
    // this.dataForm.beginDate
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  async dataFormSubmit(dataForms: any) {
    const a = moment(this.dataForm.beginDate).format(timeFormat).split('-')
    const b = moment(this.dataForm.endDate).format(timeFormat).split('-')

    const beginDate = Number(a[0] + a[1] + a[2])
    const endDate = Number(b[0] + b[1] + b[2])
    const year = Number(this.dataForm.year)
    // this.dataForm.year = Integer.valueOf(this.dataForm.year)

    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    const query = !this.id ? {
      ...this.dataForm,
      beginDate,
      endDate,
      year
    } : {
      id: this.id,
      ...this.dataForm,
      beginDate,
      endDate,
      year
    }
    const title = !this.id ? '添加' : '编辑'
    try {
      const res = !this.id ? await add (query) : await set (query)
      toast('操作成功')
      this.showDlg = false
      this.dataForm.beginDate = ''
      this.$emit('done')
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

  handleChange(date: any) {
    const ch1 = moment(date).format(timeFormat)
    this.date1 = new Date(ch1).getTime()
  }

  handleChange2(date: any) {
    const ch2 = moment(date).format(timeFormat)
    this.date2 = new Date(ch2).getTime()
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
