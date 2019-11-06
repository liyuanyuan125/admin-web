<template>
  <Modal 
    v-model='showDlg'
    :transfer='true'
    :width='600'
    :title="title"
    @on-cancel="cancel('dataForm')" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
      <FormItem label="行业名称" prop="tradeName">
        <Input style="width:240px" :disabled='viewDetail' :maxLength='50' v-model="dataForm.tradeName"></Input>
      </FormItem>
      <FormItem label="行业ID" prop="tradeId">
        <InputNumber style="width:240px" :disabled='viewDetail' :min='0' v-model="dataForm.tradeId"></InputNumber>
      </FormItem>
      <FormItem v-if='id == 0 || chgimg == true '  label="icon图片(80*80px)" prop="receipt" class='vie'>
        <Row class="upload">
          <Col span="12">
              <Upload v-model="dataForm.receipts" multiple :maxCount="1" accept="image/*"/>
          </Col>
        </Row>
      </FormItem>
      <Row v-if='id != 0 && chgimg == false'>
        <Col :span='4'>icon图片(80*80px)</Col>
        <Col :span='5' v-if='dataForm.iconUrl == null'>暂无icon图片</Col>
        <Col :span='5' v-if='dataForm.iconUrl != null'>
          <div class='imgs' @click='onView(dataForm.iconUrl)'>
            <img :src="dataForm.iconUrl" alt="">
          </div>
        </Col>
        <Col class='chg' :span='2' v-if='id == 1 && dataForm.iconUrl != null' @click.prevent.native='change'><span>(更换)</span></Col>
      </Row>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel('dataForm')">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确认</Button>
    </div>
     <!-- 查看图片 -->
    <Modal v-model="viewerShow" title="查看" width="500" height="500">
      <img style="width: 100%;" :src="viewerImage" alt sizes srcset>
    </Modal>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
// import { business } from '@/api/beforeplan'
import { slice, clean } from '@/fn/object'
import { warning , success, toast , info } from '@/ui/modal'
import { formatNumber } from '@/util/validateRules'
import ViewBase from '@/util/ViewBase'
import { addList , setList , itemList } from '@/api/industry'
import Upload from '@/components/Upload.vue'
const dataForm: any = {
  tradeName: '',
  tradeId: null,
  receipts: [],
  fileID: '',
  iconUrl: '',
  iconId: ''
}

@Component({
  components: {
    Upload
  }
})
export default class ComponentMain extends ViewBase {

  showDlg = false
  id = 0
  viewId: any = 0

  itemlist: any = {}
  viewDetail: any = false

  title: any = ''

  chgimg: any = false

  // 查看图片
  viewerShow = false
  viewerImage = ''

  fileId: any = ''

  get formatNumber() {
    return formatNumber
  }

  get ruleValidate() {
    const rules = {
      tradeName: [
          { required: true, message: '请输入行业名称', trigger: 'blur' },
          { type: 'string', max: 50, message: '最多输入50个字符', trigger: 'blur' }
      ],
      // receipt: [
      //     { required: true }
      // ]
    }
    return rules
  }

  dataForm = { ...dataForm }

  async init(id: number , viewid: number) {
    this.showDlg = true
    this.id = id || 0
    this.viewId = viewid || 0
    ; (this.$refs.dataForm as any).resetFields()
    if (id == 0) {
      this.title = '新建'
      this.viewDetail = false
    }
    if (id != 0) {
      try {
        const data = await itemList(viewid)
        this.dataForm.tradeName = data.data.item.tradeName
        this.dataForm.tradeId = data.data.item.tradeId
        this.dataForm.iconUrl = data.data.item.iconUrl
        this.dataForm.iconId = data.data.item.fileId
      } catch (ex) {
        this.handleError(ex)
      }
      if (id == -1) {
        this.title = '查看'
        this.viewDetail = true
      }
      if (id == 1) {
        this.title = '编辑'
        this.viewDetail = false
      }
    }
  }

  change() {
    this.chgimg = true
  }

  // 查看图片
  onView(url: string) {
    this.viewerImage = url
    this.viewerShow = true
  }

  cancel(dataForms: string) {
    this.dataForm.iconUrl = ''
    this.chgimg = false
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }

  // 表单提交
  dataFormSubmit(dataForms: any) {
    if (this.id == -1) {
      this.cancel(dataForms)
    }
    if (this.id == 0 && this.dataForm.receipts.length == 0) {
      info('请上传icon图片')
      return
    }
    if (this.id == 1 ) {
      this.fileId = this.dataForm.iconId
      if (this.chgimg == true && this.dataForm.receipts.length == 0) {
        info('请上传icon图片')
        return
      }
    }
   const myThis: any = this
   myThis.$refs[dataForms].validate(async ( valid: any ) => {
      if (valid) {
        const query: any = {
          tradeName: this.dataForm.tradeName,
          tradeId: this.dataForm.tradeId,
          fileId: this.dataForm.receipts.length > 0 ? this.dataForm.receipts[0].fileId : ''
        }
        try {
          if (this.id == 0) {
            const res =  await addList (query)
          }
          if (this.id == 1) {
            if (this.chgimg == false) {
              const querys: any = {
                tradeName: this.dataForm.tradeName,
                tradeId: this.dataForm.tradeId,
                fileId: this.fileId
              }
              const res =  await setList (this.viewId , querys)
            } else if  (this.chgimg == true) {
              const querys: any = {
                tradeName: this.dataForm.tradeName,
                tradeId: this.dataForm.tradeId,
                fileId: this.dataForm.receipts.length > 0 ? this.dataForm.receipts[0].fileId : ''
              }
              const res =  await setList (this.viewId , querys)
            }
          }
           toast('操作成功')
           this.$emit('done')
           this.dataForm.receipts = []
           this.dataForm.iconUrl = ''
           this.chgimg = false
           this.showDlg = false
        } catch (ex) {
           this.handleError(ex)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
.imgs {
  width: 100px;
  height: 103px;
  border: 1px solid #ccc;
  img {
    width: 100%;
    max-width: 100px;
    min-height: 100px;
    object-fit: contain;
    background-color: #fff;
  }
}
/deep/ .ivu-col-span-4 {
  width: 100px;
}
/deep/ .ivu-col-span-4::before, .vie /deep/ .ivu-form-item-label::before {
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: '微软雅黑', serif;
  font-size: 12px;
  color: #ed4014;
}
/deep/ .ivu-form-item-required .ivu-form-item-label::before {
  content: '*';
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: '微软雅黑', serif;
  font-size: 12px;
  color: #ed4014;
}
.chg {
  color: red;
  margin-top: 85px;
  cursor: pointer;
}
</style>
