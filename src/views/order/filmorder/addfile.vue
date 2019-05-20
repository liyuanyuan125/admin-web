<template>
  <div>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
    </header>
    <Row>
      <Col :span='2' style='text-align:center;line-height: 30px;font-size: 14px;'>*选择影片</Col>
      <Col :span='5'>
        <Select v-model="query.comid" placeholder="请选择资源关联的影片" filterable
          class="component" ref="ui">
          <Option v-for="it in []" :key="it.id" :value="it.movieId"
            :label="it.movieName" class="flex-box">
            <span>{{it.movieName}}</span>
          </Option>
        </Select>
      </Col>
    </Row>
    <!-- 图片/视频类物料 -->
     <div style="padding: 15px;margin-top: 20px;">
      <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100">
       <div class='title'>图片/视频类物料</div>
        <div style='border: 1px solid #ccc;padding: 10px;'>
          <FormItem  label="物料下载地址" prop="reason">
            <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
          </FormItem>
          <FormItem  label="资源使用说明" prop="reason">
            <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
          </FormItem>
        </div>
        <div class='title'>电子券资源</div>
        <div style='border: 1px solid #ccc;padding: 10px;'>
          <FormItem  label="导入电子券" prop="reason">
            <UploadButton   @success="onUploadSuccess($event, 123)">上传</UploadButton>
          </FormItem>
          <FormItem  label="资源使用说明" prop="reason">
            <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
          </FormItem>
        </div>
      </Form>
      <Button style='margin-left:20px;margin-top: 20px;' type="primary"  @click="change('dataForm')">提交</Button>
      <Button style='margin-left:20px;margin-top: 20px;' @click="back">取消</Button>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import moment from 'moment'

import {
  queryList
} from '@/api/orderkol'
import EditDialog, { Field } from '@/components/editDialog'
import UploadButton, { SuccessEvent } from '@/components/UploadButton.vue'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'



const dataForm = {
  refuseReason: '',
  approveStatus: 2
}

@Component({
  components: {
    UploadButton,
  }
})
export default class Main extends ViewBase {
  query: any = {
    comid: 0,
  }

  dataForm: any = { ...dataForm }

  async onUploadSuccess({ files }: SuccessEvent, key: number) {
  }

  back() {
    this.$router.go(-1)
  }

}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  padding-left: 12px;
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}
.title {
  font-size: 16px;
  color: @c-base;
  line-height: 40px;
}
.row-li {
  line-height: 40px;
  font-size: 14px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
</style>
