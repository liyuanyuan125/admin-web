<template>
  <div class='page'>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
    </header>
    <div style="padding: 15px;">
        <div class='title'>订单基本信息</div>
        <div class='bos'>
          <Row>
            <Col :span='6'>申请单编号：1111</Col>
            <Col :span='6'>公司id：11123132</Col>
            <Col :span='6'>公司名称：13213132</Col>
          </Row>
          <Row>
            <Col :span='8'>项目名称：456465</Col>
            <Col :span='8'>推广品牌：11123132</Col>
          </Row>
          <Row>
            <Col>推广内容：56465123561234562</Col>
          </Row>
          <Row>
            <Col :span='3'>影片资源要求:</Col>
            <Col :span='5'>
              <CheckboxGroup v-model="query.fruit">
                  <Checkbox label="授权海报"></Checkbox>
                  <Checkbox label="电影票券"></Checkbox>
              </CheckboxGroup>
            </Col>
            <Col>数量：100</Col>
          </Row>
          <Row>
            <Col :span='3'>品牌方线上资源:</Col>
            <Col :span='5'>
              <CheckboxGroup v-model="query.fruit">
                  <Checkbox label="微信"></Checkbox>
                  <Checkbox label="微博"></Checkbox>
              </CheckboxGroup>
            </Col>
          </Row>
          <Row>
            <Col :span='3'>影片资源要求:</Col>
            <Col :span='5'>
              <CheckboxGroup v-model="query.fruit">
                  <Checkbox label="易拉宝"></Checkbox>
                  <Checkbox label="线下大屏"></Checkbox>
              </CheckboxGroup>
            </Col>
          </Row>
        </div>
        <div class='title'>审核意见</div>
        <div style="border: 1px solid #ccc; padding: 15px;">
          <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100">
            <FormItem label="审核意见" prop="status">
              <RadioGroup v-model='dataForm.approveStatus'>
                <Radio v-for="it in approveStatusList" v-if="it.key!=0" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem  label="备注" prop="reason">
            <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
          </FormItem>
          </Form>
          <Button style='margin-left:20px;' type="primary"  @click="change('dataForm')">提交</Button>
          <Button style='margin-left:20px;' @click="back">取消</Button>
        </div>
        <div class='title'>图片视频类物料</div>
        <div class='bos'>
          <Row>物料下载地址： http://www.baidu.com</Row>
          <Row>资源使用说明：滴入酚酞遇古巴和你几门课烫染头发v共一百年后你们家门口日方提供v抱回家呢</Row>
        </div>
        <!-- 电子券资源 -->
        <div class='title'>电子券资源</div>
        <div class='bos'>
          <Table :columns="ticketcolumns" :data='ticketlist' border stripe disabled-hover size="small" class="table">
          </Table>
          <Row>资源使用说明：滴入酚酞遇古巴和你几门课烫染头发v共一百年后你们家门口日方提供v抱回家呢</Row>
        </div>
        <div class='title'>效果图</div>
        <div class='bos imgs'>
          <img src="//fanyi.bdstatic.com/static/translation/img/header/logo_40c4f13.svg" alt="">
          <img src="//fanyi.bdstatic.com/static/translation/img/header/logo_40c4f13.svg" alt="">
        </div>
        <!-- 操作日志 -->
        <div class='title'>操作日志</div>
        <Table :columns="logcolumns" :data='loglist' border stripe disabled-hover size="small" class="table">
        </Table>
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
    fruit: [],
  }

   // 操作日志
  loglist: any = []
  ticketlist: any = []
  approveStatusList: any = [
    {
      key: 1,
      text: '审核通过'
    },
    {
      key: 2,
      text: '审核不通过'
    }
  ]

    // 操作日志
  logcolumns = [
    { title: '序号',  key: 'id', align: 'center' },
    { title: '操作类型', key: 'email', align: 'center' },
    { title: '操作时间', width: 70, key: 'companyName', align: 'center' },
    { title: '操作人', key: 'companyName', align: 'center' },
    { title: '字段',  key: 'companyName', align: 'center' },
    { title: '原值',  key: 'companyName', align: 'center' },
    { title: '新值',  key: 'companyName', align: 'center' },
  ]

  ticketcolumns = [
    { title: '序号',  key: 'id', align: 'center' },
    { title: '票券名称',  key: 'companyName', align: 'center' },
    { title: '票券编码',  key: 'companyName', align: 'center' },
  ]

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
.page {
  font-size: 14px;
  line-height: 40px;
}
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
.bos {
  border: 1px solid #ccc;
  padding: 15px;
}
.imgs {
  img {
    width: 150px;
    height: 200px;
    display: inline-block;
    margin-left: 10px;
  }
}
.row-li {
  line-height: 40px;
  font-size: 14px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
</style>
