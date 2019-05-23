<template>
  <div class='page'>
    <header>
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
    </header>
    <div class='title'>基础信息</div>
    <div class='bos'>
      <Row>
        <Col :span='12'>资源方公司&nbsp;：&nbsp;嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻</Col>        
      </Row>
      <Row>      
        <Col :span='12'>影院名称&nbsp;：&nbsp;【公司id】 公司名称</Col>
      </Row>
      <Row>
        <Col :span='12'>投放周期&nbsp;：&nbsp;2019/02/02 ~ 2019-05-05</Col>
      </Row>
      <Row>
        包含广告片&nbsp;：&nbsp;共计60s 宝马   
      </Row>
    </div>
    <div class='title'>监播文件</div>
    <div class='bos'>
      <video src="" width='100%' height='50%' controls="controls"></video>
    </div>
    <div class='title'>审核</div>
    <div class='bos'>
       <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="80">
      <!-- <video src="" width='100%' height='50%' controls="controls"></video> -->
      <FormItem label="审核意见" prop="closeReason">
        <RadioGroup v-model="dataForm.closeReason" >
          <Radio v-for="it in []" v-if="it.key!=3" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
        </RadioGroup>
      </FormItem>
      <Row>请勾选在监播中已出现的广告，如有未出现广告，请及时与资源方联系！<Checkbox>全选</Checkbox></Row>
      <FormItem label="" prop="closeReason">
        <CheckboxGroup  v-model="dataForm.closeReason" >
          <Checkbox  v-for="it in []" v-if="it.key!=3" :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Checkbox >
        </CheckboxGroup >
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit">确定</Button>
    </div>
    </div>
    <div class='title'>操作记录</div>
    <div class='bos'>
      <Row>2018-10-01 11:22:22 zhiping.zhao@aiads.com【老麦】审核通过</Row>
      <Row>2018-10-01 11:22:22 zhiping.zhao@aiads.com【老麦】审核通过</Row>
      <Row>2018-10-01 11:22:22 zhiping.zhao@aiads.com【老麦】审核通过</Row>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { cinemaCancel , cinemaList } from '@/api/orderSys'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { warning , success, toast , info } from '@/ui/modal'
import { slice , clean } from '@/fn/object'


import {
  queryList
} from '@/api/orderkol'
import EditDialog, { Field } from '@/components/editDialog'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'



@Component({
  components: {

  }
})
export default class Main extends ViewBase {
  dataForm = {
    closeReason: '',
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.page {
  line-height: 40px;
  font-size: 14px;
}
.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
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
  line-height: 50px;
}
.bos {
  border: 1px solid #ccc;
  padding: 15px;
}
.row-li {
  line-height: 40px;
  font-size: 14px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
</style>
