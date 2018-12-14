<template>
  <Modal 
    v-model='showDlg'
    :transfer='false'
    :width='420'
    :title="!editMes ? '新建地区信息' : '编辑地区信息'"
    @on-cancel="cancel('dataForm')"
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
      <FormItem v-if="!parentsName" label="所属区域" prop="areaCode">
        <Select v-model="dataForm.areaCode" placeholder="请选择" class="input" style="width: 200px" clearable>
          <Option v-for="it in areaList" :key="it.key"
            :value="it.code">{{it.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="排序" prop="sort">
        <Input style="width:150px" v-model="dataForm.sort" placeholder="请输入"/><span class="hiht">数值越小，排序越靠前</span>
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
import { clean } from '@/fn/object'
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
    areaCode: '',
    sort: ''
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
    areaCode: [
        { required: true, message: '请选择所属区域', trigger: 'change', type: 'string' }
    ],
    sort: []
  }
  @Prop({ type: Array }) areaSelect: any
  @Prop() areaObject: any
  init(id: any, name: string, areaCode: any, editMes: any, parentsareaCode: string) {
    this.setId = id
    this.editMes = editMes
    this.parentsName = name
    this.showDlg = true
    this.id = parentsareaCode
    if ( !!this.parentsName ) {
      this.dataForm.areaCode = areaCode
    } else {
      this.dataForm.areaCode = ''
    }
    this.areaList = this.areaSelect
    if (this.areaObject) {
       this.dataForm.nameCn = this.areaObject.nameCn
       this.dataForm.pinyinShort = this.areaObject.pinyinShort
       this.dataForm.pinyin = this.areaObject.pinyin
       this.dataForm.areaCode = this.areaObject.areaCode
       this.dataForm.sort = this.areaObject.sort
    }
  }

  cancel(dataForms: string) {
    (this.$refs[dataForms] as any).resetFields()
    this.showDlg = false
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
    (this.$refs[dataForms] as any).validate(async ( valid: any ) => {
      if (valid) {
        const sort = Number(this.dataForm.sort)
        const setData: any = {
          parentId: this.id,
          ...this.dataForm,
          sort
        }
        let setQuery: any = {}
        const delarea: any = {}
        for ( const key in setData ) {
          if (setData.hasOwnProperty(key)) {
            if (key != 'areaCode') {
              delarea[key] = setData[key]
            }
          }
        }
        if (!!this.parentsName) {
          setQuery = delarea
        } else {
          setQuery = setData
        }

        const addDate = this.dataForm
        const query = this.id != '0' ? {
          ...delarea,
          sort
        } : {
          ...addDate,
          sort
        }
        const title = !this.editMes ? '新增' : '编辑'
        try {
          const res = !this.editMes ? await areaAdd (query) : await areaSet ( this.setId , setQuery)
          this.$Message.success({
              content: `${title}成功`,
              onClose: () => {
                this.showDlg = false
                ; (this.$refs[dataForms] as any).resetFields()
                this.$emit('refreshDataList')
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