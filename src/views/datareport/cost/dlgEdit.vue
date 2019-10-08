<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='420'
    :title="'上传影城列表'"
    @on-cancel="cancel()" >
    <a style='margin-left: 40%;' href="https://aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bm6t7aionakg00bh1m80.xlsx" :download='"https://aiads-file.oss-cn-beijing.aliyuncs.com/MISC/MISC/bm6t7aionakg00bh1m80.xlsx"'>模板下载.xls</a>
    <Form class="create-form form-item" enctype="multipart/form-data" ref="form" :label-width="120">批量导入
        <input ref='input' type="file" accept=".xls, .xlsx" @change="onChange" class='adds' />
        <span class='viewhtml'>{{inputhtml}}</span>
    </Form>
    

    <div slot="footer" class="dialog-footer">
      <Button @click="cancel()">取消</Button>
      <Button type="primary" @click="dataFormSubmit()">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { queryItem , queryList , dataFrom , addList , companysList } from '@/api/account'
import { validatePassword } from '@/util/validateRules'
import { slice, clean } from '@/fn/object'
import { warning , success, toast , info } from '@/ui/modal'
import ViewBase from '@/util/ViewBase'
import XLSX from 'xlsx'

@Component
export default class ComponentMain extends ViewBase {
  oldQuery: any = {}

  showDlg: any = false
  id = 0
  list = []
  companys = []

  outputs: any = []
  inputhtml: any = ''



  init() {
    (this.$refs.input as any).addEventListener('change' , (e: any) => {
      this.readExcel(e)
    })
     this.showDlg = true
  }

  cancel(dataForms: string) {
    this.showDlg = false
  }

  dataFormSubmit() {
    this.showDlg = false
    this.$emit('done' , this.outputs)
  }

  onChange() {

  }

  readExcel(e: any) {
    // 表格导入
    const that = this
    const { files } = e.target
    // console.log(files)
    // console.log(files[0].name)
    if (files.length <= 0) {
      // 如果没有文件名
      info('请查看文件导入文件是否有文件名')
      return false
    }
    this.inputhtml = files[0].name
    if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
      this.$Message.error('上传格式不正确，请上传xls或者xlsx格式')
      return false
    }
    const fileReader = new FileReader()
    fileReader.onload = (ev: any) => {
      try {
         const data = ev.target.result
         const workbook = XLSX.read(data, {
              type: 'binary',
          })
         const wsname = workbook.SheetNames[0] // 取第一张表
         const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json                 表格内容
         // console.log(ws)
         that.outputs = [] // 清空接收数据
         if (ws.length > 0) {
            // 编辑数据
            ws.map((i: any) => {
                that.outputs.push(i.影城编码)
               // const sheetData = {
               //      address: ws[i].addr,
               //      value: ws[i].value,
               // }
             // that.outputs.push(sheetData)
             return ''
           })
         } else {
           info('您导入的是个空影院列表,请确认')
           return
         }
        // console.log(that.outputs)
       (this.$refs.input as any).value = null
       this.inputhtml = ''
        // this.$Message.success('上传成功')
        // alert(1)
        this.dataFormSubmit()
       } catch (e) {
          return false
       }
     }
     fileReader.readAsBinaryString(files[0])
  }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-modal-body {
  height: 100px;
}
.create-form {
  position: relative;
  display: block;
  float: left;
  margin-left: 39%;
  margin-top: 10px;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #2d8cf0;
  text-decoration: none;
  text-indent: 0;
  line-height: 26px;
}

.viewhtml {
  margin-left: 10px;
  color: #000;
}

.adds {
  width: 200px;
  position: absolute;
  font-size: 100px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
