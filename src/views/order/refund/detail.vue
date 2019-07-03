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
      <template slot="channelCode" slot-scope="{ row: { channelCode } }">
        <div class="row-acts">
          <span v-for='(it,index) in channelCodeList' :key='index' v-if='it.key == channelCode'>{{it.text}}</span>
        </div>
      </template>
     </Table>

    <!-- 订单金额信息 -->
    <div class='title'>订单金额信息</div>
    <Table :columns="okcolumns" :data='oklist' border stripe disabled-hover size="small" class="table">
      <template slot="channelCode" slot-scope="{ row: { channelCode } }">
        <div class="row-acts">
          <span v-for='(it,index) in channelCodeList' :key='index' v-if='it.key == channelCode'>{{it.text}}</span>
        </div>
      </template>
    </Table>

    <!-- 订单支付信息 -->
    <div class='title'>订单支付信息</div>
    <Table :columns="ordercolumns" :data='orderlist' border stripe disabled-hover size="small" class="table">
    </Table>

    <!-- 退款信息 -->
    <div v-if='$route.params.id != 0' class='title'>退款信息</div>
    <Table  v-if='$route.params.id != 0' :columns="outcolumns" :data='outlist' border stripe disabled-hover size="small" class="table">
    </Table>

    <!-- 退款 -->
    <div v-if='$route.params.id == 0' class='title'>退款操作</div>
    <div v-if='$route.params.id == 0' style="border: 1px solid #ccc; padding: 15px;">
      <Row class='row-li'>
        <Col :span='4'>已支付金额：￥{{ms.orderTotalFee}}</Col>
        <Col :span='4'>已退款金额 ￥{{ms.refundedTotalFee}}</Col>
        <Col :span='4'>待退款金额 ￥{{ms.toRefundTotalFee}}</Col>
      </Row>
      <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100" style='margin-top: 7px;'>
        <FormItem  label="本次退款金额" prop="reason">
        <InputNumber style="width:240px"  :min="0" v-model="dataForm.refundFee"></InputNumber>
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
import { queryList , delorder , itemlist , finance , item } from '@/api/refund'
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
  ms: any = {}

  list: any = []
  total: any = 0
  moneyList: any = []
  channelCodeList: any = []

  // 订单基本信息
  columns = [
    { title: '订单编号', width: 70, key: 'orderNo', align: 'center' },
    { title: '项目名称', key: 'projectName', align: 'center' },
    { title: '客户id', width: 70, key: 'companyId', align: 'center' },
    { title: '客户名称', key: 'companyName', align: 'center' },
    { title: '平台', width: 70, slot: 'channelCode', align: 'center' },
    { title: '推广品牌', width: 70, key: 'brandName', align: 'center' },
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
    { title: '下单金额', width: 70,  key: 'totalFee', align: 'center' },
    { title: '商务确认金额', width: 90,  key: 'confirmFee', align: 'center' },
    {
      title: '订单状态',
      width: 70,
      key: 'orderStatus',
      align: 'center',
      render: (hh: any, { row: { orderStatus } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (orderStatus == 1) {
          return <span class={`status-${status}`}>草稿</span>
        } else if (orderStatus == 2) {
          return <span class={`status-${status}`}>待商务确认</span>
        } else if (orderStatus == 3) {
          return <span class={`status-${status}`}>待财务审核</span>
        } else if (orderStatus == 4) {
          return <span class={`status-${status}`}>待支付首款</span>
        } else if (orderStatus == 5) {
          return <span class={`status-${status}`}>派单中</span>
        } else if (orderStatus == 6) {
          return <span class={`status-${status}`}>待执行</span>
        } else if (orderStatus == 7) {
          return <span class={`status-${status}`}>执行中</span>
        } else if (orderStatus == 8) {
          return <span class={`status-${status}`}>待支付尾款</span>
        } else if (orderStatus == 9) {
          return <span class={`status-${status}`}>已完成</span>
        } else if (orderStatus == 10) {
          return <span class={`status-${status}`}>已取消</span>
        }
        /* tslint:enable */
      }
    }
  ]
  // 商务确认订单
  okcolumns = [
    { title: 'kol平台账号',  key: 'kolId', align: 'center' },
    { title: 'kol平台账号名称', key: 'kolName', align: 'center' },
    { title: '平台', width: 70, slot: 'channelCode', align: 'center' },
    { title: '任务类型', key: 'publishCategoryName', align: 'center' },
    { title: '下单金额',  key: 'salePrice', align: 'center' },
    { title: '商务修改金额',  key: 'confirmPrice', align: 'center' },
    { title: '备注',  key: 'confirmRemark', align: 'center' },
  ]

  // 订单支付信息
  ordercolumns = [
    { title: '类型',  key: 'name', align: 'center' },
    { title: '支付金额', key: 'paymoney', align: 'center' },
    { title: '支付时间', key: 'paydate', align: 'center' },
    { title: '支付操作人',  key: 'payper', align: 'center' },
    { title: '备注',  key: 'beizhu', align: 'center' }
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
    this.seach()
  }

  // 返回上一页 && 接单取消按钮
  back() {
    this.$router.go(-1)
  }

  async seach() {
    this.outlist = []
    this.itemlist = []
    this.orderlist = []
    this.moneyList = []
    try {
      const datalist = await queryList({})
      this.channelCodeList = datalist.data.channelCodeList
      if (this.$route.params.id == '0') {
        const { data } = await item(this.$route.params.order)
        this.ms = data.item
      this.itemlist.push(data.item.order)
      this.oklist = data.item.orderItems == null ? [] : data.item.orderItems
      this.orderlist = [
        {
          name: '首款',
          paymoney: data.item.order.advanceFee,
          paydate: moment(data.item.order.advancePayTime).format(timeFormat),
          payper: data.item.order.advancePayName,
          beizhu: data.item.order.advanceRemark
        },
        {
          name: '尾款',
          paymoney: data.item.order.restFee,
          paydate: moment(data.item.order.restPayTime).format(timeFormat),
          payper: data.item.order.restPayName,
          beizhu: data.item.order.restRemark
        }
      ]
      this.outlist.push(data.item.refundBill)
      } else {
        const { data } = await itemlist(this.$route.params.id)
        this.ms = data.item
      this.itemlist.push(data.item.order)
      this.oklist = data.item.orderItems == null ? [] : data.item.orderItems
      this.orderlist = [
        {
          name: '首款',
          paymoney: data.item.order.advanceFee,
          paydate: moment(data.item.order.advancePayTime).format(timeFormat),
          payper: data.item.order.advancePayName,
          beizhu: data.item.order.advanceRemark
        },
        {
          name: '尾款',
          paymoney: data.item.order.restFee,
          paydate: moment(data.item.order.restPayTime).format(timeFormat),
          payper: data.item.order.restPayName,
          beizhu: data.item.order.restRemark
        }
      ]
      this.outlist.push(data.item.refundBill)
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
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

  watchDataForm(val: any) {
    if (this.dataForm.refundFee > ((this.ms.orderTotalFee - this.ms.refundedTotalFee) - this.ms.toRefundTotalFee)) {
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
.table {
  margin-top: 16px;
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
