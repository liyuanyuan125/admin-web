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
    <div v-if='$route.params.status == 2' class='title'>退款信息</div>
    <Table v-if='$route.params.status == 2' :columns="outcolumns" :data='outlist' border stripe disabled-hover size="small" class="table">
    </Table>

    <!-- 退款 -->
    <div v-if='$route.params.status == 1' class='title'>退款操作</div>
    <div v-if='$route.params.status == 1' style="border: 1px solid #ccc; padding: 15px;">
      <Row class='row-li'>
        <Col :span='4'>已支付金额：￥{{moneyList.orderTotalFee}}</Col>
        <Col :span='4'>已退款金额 ￥{{moneyList.refundedTotalFee}}</Col>
        <Col :span='4'>待退款金额 ￥{{moneyList.toRefundTotalFee}}</Col>
      </Row>
      <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100" style='margin-top: 7px;'>
        <FormItem  label="本次退款金额" prop="reason">
        <InputNumber style="width:240px"  :min="1" v-model="dataForm.refundFee"></InputNumber>
      </FormItem>
      <FormItem  label="备注" prop="reason">
        <Input style="width:240px" v-model="dataForm.refundRemark"></Input>
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
import { queryList , delorder , itemlist , finance , gethismoney } from '@/api/refund'
import EditDialog, { Field } from '@/components/editDialog'
import {confirm , warning , success, toast , info } from '@/ui/modal'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'

const dataForm = {
  refundFee: null,
  refundRemark: ''
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
  // 退款
  outlist: any = []

  list: any = []
  total: any = 0
  moneyList: any = []

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
    { title: '退款单申请时间',  key: 'applyTime', align: 'center' ,
      render: (hh: any, { row: { applyTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(applyTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '退款单申请人', key: 'applyName', align: 'center' },
    { title: '退款金额', key: 'refundFee', align: 'center' },
    { title: '备注',  key: 'refundRemark', align: 'center' },
    { title: '退款时间',  key: 'refundTime', align: 'center',
      render: (hh: any, { row: { refundTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(refundTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '退款操作人',  key: 'refundName', align: 'center' }
  ]


  dataForm: any = { ...dataForm }

  mounted() {
    // console.log(this.$route.name)
    this.seach()
  }

  // 返回上一页 && 接单取消按钮
  back() {
    this.$router.go(-1)
  }

  async seach() {
    this.outlist = []
    try {
      const { data: {
        item: list,
        totalCount: total,
      } } = await itemlist(this.$route.params.id)
      this.outlist.push(list)
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }

    if (this.$route.params.status == '1') {
      try {
        const { data } = await gethismoney(this.$route.params.order)
        this.moneyList = data.item
      } catch (ex) {
        this.handleError(ex)
      } finally {
      }
    }
  }

  async change() {
    try {
      await finance(this.$route.params.order , this.dataForm)
      this.$router.go(-1)
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('dataForm' , {deep: true})

  watchdataForm(val: any) {
    if (val.refundFee > this.moneyList.toRefundTotalFee) {
      this.dataForm.refundFee = null
      info('退款金额超出，请重新输入')
      return
    }
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
