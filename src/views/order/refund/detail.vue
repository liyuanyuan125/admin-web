<template>
  <div>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1" style='margin-left:20px;'>
        <em>订单基本信息</em>
      </div>
    </header>

    <!-- 订单基本信息 -->
    <Table :columns="columns" :data='itemlist' border stripe disabled-hover size="small" class="table">
     </Table>

    <!-- 订单金额信息 -->
    <div class='title'>订单金额信息</div>
    <Table :columns="okcolumns" :data='oklist' border stripe disabled-hover size="small" class="table">
    </Table>

    <!-- 订单支付信息 -->
    <div class='title'>订单支付信息</div>
    <Table :columns="ordercolumns" :data='orderlist' border stripe disabled-hover size="small" class="table">
    </Table>

    <!-- 退款信息 -->
    <div class='title'>退款信息</div>
    <Table :columns="outcolumns" :data='outlist' border stripe disabled-hover size="small" class="table">
    </Table>

    <!-- 退款 -->
    <div class='title'>退款操作</div>
    <div style="border: 1px solid #ccc; padding: 15px;">
      <Row class='row-li'>
        <Col :span='4'>已支付金额：￥100.100</Col>
        <Col :span='4'>已退款金额 ￥20000</Col>
        <Col :span='4'>待退款金额 ￥20000</Col>
      </Row>
      <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100" style='margin-top: 7px;'>
        <FormItem  label="本次退款金额" prop="reason">
        <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
      </FormItem>
      <FormItem  label="备注" prop="reason">
        <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
      </FormItem>
      </Form>
      <Button style='margin-left:20px;' type="primary"  @click="change('dataForm')">提交</Button>
      <Button style='margin-left:20px;' @click="back">取消</Button>
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

const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  refuseReason: '',
  approveStatus: 2
}

const moneydataForm = {
  refuseReason: '',
  approveStatus: 2
}

@Component({
  components: {
  }
})
export default class Main extends ViewBase {
  editIndex = -1  // 当前聚焦的输入框的行数
  editmoney = '' // 修改金额
  beizhu = '' // 修改备注
  // 订单基本信息
  itemlist: any = []
  // 订单金额
  oklist: any = []
  // 订单支付信息
  orderlist: any = []

  // 订单基本信息
  columns = [
    { title: '订单编号', width: 70, key: 'id', align: 'center' },
    { title: '订单名称', key: 'email', align: 'center' },
    { title: '公司id', width: 70, key: 'companyName', align: 'center' },
    { title: '公司名称', key: 'companyName', align: 'center' },
    { title: '平台', width: 70, key: 'companyName', align: 'center' },
    { title: '推广平台', width: 70, key: 'companyName', align: 'center' },
    {
      title: '下单时间',
      width: 120,
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '下单金额', width: 70,  key: 'companyName', align: 'center' },
    { title: '商务确认金额', width: 90,  key: 'companyName', align: 'center' },
    {
      title: '订单状态',
      width: 70,
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1) {
          return <span class={`status-${status}`}>启用</span>
        } else if (status == 2) {
          return <span class={`status-${status}`}>停用</span>
        } else if (status == 3) {
          return <span class={`status-${status}`}>待激活</span>
        }
        /* tslint:enable */
      }
    },
    {
      title: '支付状态',
      width: 70,
      key: 'statusText',
      align: 'center',
      render: (hh: any, { row: { status, statusText } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (status == 1) {
          return <span class={`status-${status}`}>启用</span>
        } else if (status == 2) {
          return <span class={`status-${status}`}>停用</span>
        } else if (status == 3) {
          return <span class={`status-${status}`}>待激活</span>
        }
        /* tslint:enable */
      }
    },
  ]
  // 商务确认订单
  okcolumns = [
    { title: 'kol平台账号',  key: 'id', align: 'center' },
    { title: 'kol平台账号名称', key: 'email', align: 'center' },
    { title: '平台', width: 70, key: 'companyName', align: 'center' },
    { title: '任务类型', key: 'companyName', align: 'center' },
    { title: '下单金额',  key: 'companyName', align: 'center' },
    { title: '商务修改金额',  key: 'companyName', align: 'center' },
    { title: '备注',  key: 'companyName', align: 'center' },
  ]

  // 订单支付信息
  ordercolumns = [
    { title: '类型',  key: 'id', align: 'center' },
    { title: '支付金额', key: 'email', align: 'center' },
    { title: '支付时间', key: 'companyName', align: 'center' },
    { title: '支付操作人',  key: 'companyName', align: 'center' },
    { title: '备注',  key: 'companyName', align: 'center' }
  ]

  // 退款信息
  outcolumns = [
    { title: '退款单申请时间',  key: 'id', align: 'center' },
    { title: '退款单申请人', key: 'email', align: 'center' },
    { title: '退款金额', key: 'companyName', align: 'center' },
    { title: '备注',  key: 'companyName', align: 'center' },
    { title: '退款时间',  key: 'companyName', align: 'center' },
    { title: '退款操作人',  key: 'companyName', align: 'center' }
  ]


  dataForm: any = { ...dataForm }
  moneydataForm: any = { ...moneydataForm }

  mounted() {
    // console.log(this.$route.name)
  }

  // 返回上一页 && 接单取消按钮
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
