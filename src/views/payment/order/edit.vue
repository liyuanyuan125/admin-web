<template>
  <div>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1" style='margin-left:20px;'>
        <em>KOL付款单管理</em>
      </div>
    </header>

    <div class="content-box">
      <div class='title'>子订单金额信息</div>
      <Table :columns="columns" :data='itemlist' border stripe disabled-hover size="small" class="table">
      </Table>
    </div>

    <div class="content-box">
      <div class='title'>子订单金额信息</div>
      <Table :columns="okcolumns" :data='oklist' border stripe disabled-hover size="small" class="table">
      </Table>
    </div>

    <div class="content-box">
      <div class='title'>付款信息</div>
      <Table :columns="editokcolumns" :data="editoklist">

        <template slot-scope="{ row, index }" slot="editmoney">
          <Input type="text" v-model="editAddress" v-if="editIndex === index" @on-blur="handleSave(index)" />
          <span v-else @click="handleEdit(row, index)">{{ row.address }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="beizhu">
          <Input type="text" v-model="beizhu" v-if="editIndex === index" @on-blur="handleSave(index)" />
          <span v-else @click="handleEdit(row, index)">{{ row.address }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="action">
          删除
        </template>
      </Table>
    </div>

    <div v-if="$route.params.edit != 'detail'" class="content-box">
      <div class='title'>订单付款信息</div>
      <div style="border: 1px solid #ccc; padding: 15px;">
        <Row class='row-li'>支付类型：首款/尾款</Row>
        <Row class='row-li'>
          <Col :span='8'>剩余待支付金额：￥100.100</Col>
          <Col :span='8'>订单总金额 ￥20000 <span style='color: #ccc;'>(显示商务确认的金额)</span></Col>
          <Col :span='8'>已付金额：￥100.000</Col>
        </Row>
        <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100" style='margin-top: 7px;'>
          <FormItem  label="支付金额" prop="reason">
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

    <div class="content-box">
      <div class='title'>订单支付信息</div>
      <Table :columns="ordercolumns" :data='orderlist' border stripe disabled-hover size="small" class="table">
      </Table>
    </div>

    <div class="content-box">
      <div class='title'>操作日志</div>
      <Table :columns="logcolumns" :data='loglist' border stripe disabled-hover size="small" class="table">
      </Table>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { columns, okcolumns, editokcolumns, ordercolumns, logcolumns } from './tableCoulms'
import { queryList } from '@/api/orderkol'
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
  // 商务审核 && 订单金额
  oklist: any = []
  // 商务确认
  editoklist: any = []
  // 订单支付信息
  orderlist: any = []
  // 操作日志
  loglist: any = []

  // 订单基本信息
  columns = [...columns]

  // 子订单编号
  okcolumns = [...okcolumns]

  // 子订单支付信息
  editokcolumns = [...editokcolumns]

  // KOL平台账号结算信息
  ordercolumns = [...ordercolumns]

  // 操作日志
  logcolumns = [...logcolumns]


  // 财务信息
  moneyList: any = [
    {
      key: 1,
      text: '是'
    },
    {
      key: 2,
      text: '否'
    }
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

  // 商务修改金额
  handleEdit(row: any, index: any) {
    this.editmoney = row.address
    this.editIndex = index
  }
  handleSave(index: any) {
    this.editoklist[index].address = this.editmoney
    this.editIndex = -1
  }

  // 商务修改备注
  beiEdit(row: any, index: any) {
    this.beizhu = row.address
    this.editIndex = index
  }
  beiSave(index: any) {
    this.editoklist[index].address = this.beizhu
    this.editIndex = -1
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
.content-box {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  background: #fff;
  padding: 14px;
  padding-bottom: 20px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
</style>
