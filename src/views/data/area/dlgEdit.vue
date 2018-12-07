<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='420'
    :title="!editMes ? '新建地区信息' : '编辑地区信息'"
    >
    <p v-if="!!parentsName" class="next-city">上级城市：{{parentsName}}</p>
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="80">
        <FormItem label="地区名称" prop="nameCn">
            <Input v-model="dataForm.nameCn" placeholder="请输入"/>
        </FormItem>
        <FormItem label="拼音" prop="pinyin">
            <Input v-model="dataForm.pinyin" placeholder="请输入"/>
        </FormItem>
        <FormItem label="简拼" prop="pinyinShort">
            <Input v-model="dataForm.pinyinShort" placeholder="请输入"/>
        </FormItem>
        <FormItem v-if="!parentsName" label="所属区域" prop="areaId">
          <Select v-model="dataForm.areaId" placeholder="请选择" class="input" style="width: 200px" clearable>
            <Option v-for="it in areaList" :key="it.key"
              :value="it.id">{{it.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="排序" prop="orderNum">
            <Input style="width:150px" v-model="dataForm.orderNum" placeholder="请输入"/><span class="hiht">数值越小，排序越靠前</span>
        </FormItem>
    </Form>
    <div  slot="footer" class="dialog-footer">
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
      <Button @click="cancel('dataForm')">取消</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import View from '@/util/View'
import { areaAdd, areaSet } from '@/api/dateArea'

@Component
export default class ComponentMain extends View {
  showDlg = false
  areaList: any[] = []
  // 父级ID
  id = ''
  parentsName = ''
  // 编辑Id
  editMes = ''
  setId = ''
  dataForm = {
    nameCn: '',
    pinyinShort: '',
    pinyin: '',
    areaId: '',
    orderNum: ''
  }
  ruleValidate = {
    nameCn: [
        { required: true, message: '请输入地区名称', trigger: 'blur' }
    ],
    pinyinShort: [
        { required: true, message: '请输入地区简称', trigger: 'blur' }
    ],
    pinyin: [
        { required: true, message: '请输入地区拼音', trigger: 'blur' }
    ],
    areaId: [
        { required: true, message: '请选择所属区域', trigger: 'change' }
    ],
    orderNum: []
  }
  @Prop({ type: Array }) areaSelect: any
  @Prop({ type: Object }) areaObject: any
  created() {

  }
  init(id: any, name: string, areaId: any, editMes: any, parentsAreaId: string) {
    this.setId = id
    this.editMes = editMes
    this.parentsName = name
    this.showDlg = true
    this.id = parentsAreaId
    this.parentsName ? this.dataForm.areaId = areaId : ''
    this.areaList = this.areaSelect
    if (this.areaObject) {
       this.dataForm.nameCn = this.areaObject.nameCn
       this.dataForm.pinyinShort = this.areaObject.pinyinShort
       this.dataForm.pinyin = this.areaObject.pinyin
       this.dataForm.areaId = this.areaObject.areaId
       this.dataForm.orderNum = this.areaObject.orderNum
    }
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
        const setQuery = {
          parentId: this.id,
          ...this.dataForm
        }
        const query = !this.parentsName ? this.dataForm : setQuery
        const title = !this.editMes ? '新增' : '编辑'
        try {
          const res = !this.editMes ? await areaAdd (query) : await areaSet ( this.setId , setQuery)
          if ( res && res.code === 0 ) {
            this.$Message.success({
                content: `${title}成功`,
                onClose: () => {
                  this.showDlg = false
                  myThis.$refs[dataForms].resetFields()
                  this.$emit('refreshDataList')
                }
            })
          }
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 15px;
}
.next-city {
  position: absolute;
  top: 14px;
  left: 120px;
  font-size: 14px;
  color: #17233d;
  font-weight: 700;
}
.hiht {
  margin-left: 15px;
  color: #6b6b6b;
}
</style>
