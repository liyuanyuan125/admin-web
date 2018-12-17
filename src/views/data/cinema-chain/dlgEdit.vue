<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="!id ? '新增院线信息' : '编辑院线信息'"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="名称" prop="name">
          <Input v-model="dataForm.name"></Input>
      </FormItem>
      <FormItem label="简称" prop="shortName">
          <Input v-model="dataForm.shortName"></Input>
      </FormItem>
      <FormItem label="拼音" prop="pinyin">
          <Input v-model="dataForm.pinyin"></Input>
      </FormItem>
      <FormItem label="状态" prop="chainStatus">
          <RadioGroup v-model="dataForm.chainStatus">
                <Radio v-if="index.key!=0" v-for="index in dlgStatus" :label="index.key" :key="index.key">{{index.text}}</Radio>
          </RadioGroup>
      </FormItem>
      <FormItem label="控制状态" prop="controlStatus">
          <RadioGroup v-model="dataForm.controlStatus">
              <Radio v-if="index.key!=0" v-for="index in controlStatus" :label="index.key" :key="index.key">{{index.text}}</Radio>
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
import { dataFrom , add , set} from '@/api/cinemaChain'
import { warning , success } from '@/ui/modal'
import View from '@/util/View'

const dataForm = {
  name: '',
  shortName: '',
  pinyin: '',
  chainStatus: 1,
  controlStatus: 1
}

@Component
export default class ComponentMain extends View {
  @Prop({ type: Object }) cinemaOnes: any
  @Prop({ type: Array }) dlgStatus: any
  @Prop({ type: Array }) delControlStatus: any
  showDlg = false
  id = 0

  get controlStatus() {
      return this.delControlStatus
  }

  ruleValidate = {
    name: [
        { required: true, message: '请输入院线名称', trigger: 'blur' }
    ],
    shortName: [
        { required: true, message: '请输入院线简称', trigger: 'blur' }
    ],
    pinyin: [
        { required: true, message: '请输入院线拼音', trigger: 'blur' }
    ],
    chainStatus: [
        { required: true, message: '请选择院线状态', trigger: 'change', type: 'number' }
    ],
    controlStatus: [
        { required: true, message: '请选择院线控制状态', trigger: 'change', type: 'number' }
    ]
  }
  dataForm = { ...dataForm }
  init(id: number) {
    this.showDlg = true
    this.id = id || 0
    if (this.id) {
      this.dataForm.name = this.cinemaOnes.name
      this.dataForm.shortName = this.cinemaOnes.shortName
      this.dataForm.pinyin = this.cinemaOnes.pinyin
      this.dataForm.chainStatus = this.cinemaOnes.chainStatus
      this.dataForm.controlStatus = this.cinemaOnes.controlStatus
    }
  }

  cancel(dataForms: string) {
    this.showDlg = false
    ; (this.$refs[dataForms] as any).resetFields()
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
   (this.$refs[dataForms] as any).validate(async ( valid: any ) => {
      if (valid) {
        const query = !this.id ? this.dataForm : {
          id: this.id,
          ...this.dataForm
        }
        const title = !this.id ? '添加' : '编辑'
        try {
          !this.id ? await add (query) : await set (query)
          this.$Message.success({
              content: `${title}成功`,
              onClose: () => {
                this.showDlg = false
                this.$emit('refreshDataList')
                ; (this.$refs[dataForms] as any).resetFields()
                }
          })
        } catch (ex) {
            this.handleError(ex)
        }
      }
    })
  }

}
</script>

<style lang="less" scoped>
</style>