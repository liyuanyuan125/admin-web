<template>
  <div class="page">
    <div class="detail-box">
      <header class="header flex-box">
        <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
        <div class="flex-1">
          <em>充值详情</em>
        </div>
      </header>
      <div class="detail-header">
        <div class="n-list">提现单基本信息</div>
        <Row>
          <Col span="3"><div>公司id</div></Col>
          <Col span="4"><span>{{detail.companyId}}</span>
          </Col>
          <Col span="3"><div>公司名称</div></Col>
          <Col span="4"><span>{{detail.companyName}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>提现申请单编号</div></Col>
          <Col span="8">
            <span id="success_form_input" style="margin-right: 8px">{{detail.billNo}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>提现金额：</div></Col>
          <Col span="4"><span id="success_form_input2" style="margin-right: 8px">{{detail.amount}}</span>
          </Col>
          <Col span="3"><div>提现方式：</div></Col>
          <Col span="4"><span id="success_form_input3" style="margin-right: 8px">{{detail.alipayName}}</span>
          </Col>
        </Row>
        <Row v-if="detail.withdrawalType != '2'">
          <Col span="3"><div>银行卡账户名：</div></Col>
          <Col span="4"><span id="success_form_input2" style="margin-right: 8px">{{detail.accountName}}</span>
          </Col>
          <Col span="3"><div>银行卡开户行：</div></Col>
          <Col span="4"><span id="success_form_input3" style="margin-right: 8px">{{detail.accountBank}}</span>
          </Col>
        </Row>
        <Row v-else>
          <Col span="3"><div>支付宝名称	</div></Col>
          <Col span="4"><span id="success_form_input2" style="margin-right: 8px">{{detail.alipayName}}</span>
          </Col>
          <Col span="3"><div>支付宝账户	</div></Col>
          <Col span="4"><span id="success_form_input3" style="margin-right: 8px">{{detail.alipayNumber}}</span>
          </Col>
        </Row>
        <Row>
          <Col v-if="detail.withdrawalType != '2'" span="3"><div>银行卡账号：</div></Col>
          <Col v-if="detail.withdrawalType != '2'" span="4"><span style="margin-right: 8px">{{detail.accountNumber}}</span>
          </Col>
          <Col span="3"><div>备注：</div></Col>
          <Col span="4"><span style="margin-right: 8px">{{detail.remark}}</span>
          </Col>
        </Row>
      </div>
      <Row class="detail-content">
        <div class="n-list">汇款信息：</div>
        <Form ref="formInline" :model="query" :rules="ruleInline">
        <Row>
          <Col span="3"><div>汇款时间：</div></Col>
          <Col span="16">
            <FormItem v-if='detail.status == 3' prop="remittanceTime">
               <DatePicker type="date" v-model='query.remittanceTime' placeholder="汇款时间" style="width: 200px"></DatePicker>
            </FormItem>
            <span v-else>{{detail.typeName}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>上传凭证</div></Col>
          <Col span="8">
            <FormItem v-if='detail.status == 3' prop="receipt">
              <Upload v-model="query.receipt" multiple :maxCount="3" accept="image/*" />
            </FormItem>
            <div v-else class="upload-wrap">
              <div v-if="showimg" class="show-img">
                <img src="~@/assets/imgerror.png"/>
              </div>
              <imgModel v-else :uploadList = "img" :type = 2 />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>备注</div></Col>
          <Col span="8">
            <FormItem v-if='detail.status == 3' prop="remittanceRemark">
               <Input v-model="query.remittanceRemark" placeholder="请输入备注" style="width: 200px" />
            </FormItem>
            <span v-else>{{detail.remark}}</span>
          </Col>
        </Row>
        </Form>
      </Row>
      <Row class="detail-check" v-if="detail.logs && detail.logs.length > 0">
        <div class="n-list">汇款信息：</div>
        <Row  class="detail-log" v-for="(item, i) in logList" :key="i">
          <Col span="3"><div>操作时间</div></Col>
          <Col span="21"><span>{{item.createTime}}</span></Col>
          <Col span="3"><div>操作员</div></Col>
          <Col span="21"> <span>{{item.email}}<b style="margin: 0 5px">[{{item.userName}}]</b></span></Col>
        </Row>
      </Row>
      <Row>
        <Col style='text-align: center'>
          <Button type="info" size="large" @click="edit('formInline')">确定</Button>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { withdrwaldetail } from '@/api/withdrawal'
import { toMap } from '@/fn/array'
import { formatCurrency } from '@/fn/string'
import imgModel from '../../data/film/imgModel.vue'
import Upload from '@/components/Upload.vue'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const typeMap = (list: any[]) => toMap(list, 'typeCode', 'controlStatus')
const conMap = (list: any[]) => toMap(list, 'key', 'controlStatus')

const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

@Component({
  components: {
    imgModel,
    Upload
  }
})
export default class Main extends ViewBase {
  httplist = ''

  link = '2222'
  copyBtn = null
  detail: any = {}
  loading = false
  showimg = true
  img: any = []
  logList: any = []
  id: any = ''
  query: any = {
    remittanceTime: '',
    remittanceRemark: '',
    receipt: []
  }

  get ruleInline() {
    return {
      remittanceTime: [
        { required: true, message: '请设置汇款时间', trigger: 'change' }
      ],
      receipt: [
        { required: true, type: 'array', len: 1, message: '请上传图片', trigger: 'change'}
      ]
    }
  }

  get format() {
    const afterWithdrawalAmount = this.detail.afterWithdrawalAmount || 0
    const beforeWithdrawalAmount = this.detail.beforeWithdrawalAmount || 0
    return {
      amount: formatCurrency(this.detail.amount),
      afterWithdrawalAmount: formatCurrency(afterWithdrawalAmount),
      beforeWithdrawalAmount: formatCurrency(beforeWithdrawalAmount),
    }
  }

  mounted() {
    this.load()
  }

  async load() {
    (this.$Spin as any).show()
    try {
      const res = await withdrwaldetail(this.$route.params.id)
      this.detail = res.data.item
      const logList = res.data.logs ? res.data.logs.map((item: any) => {
        return {
          ...item,
          createTime: moment(item.createTime).format(timeFormatDate)
        }
      }) : []
      if (res.data.imgs && res.data.imgs.length > 0) {
        this.showimg = false
        this.img = res.data.imgs.map((item: any) => {
          return item.url
        })
      } else {
        this.showimg = true
      }
      this.logList = logList.slice(0, 20)
      this.loading = true
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 1000)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    } finally {
    }
  }

  copyLink() {
  }

  async edit(dataForms: any) {
    try {
      const flag = await (this.$refs[dataForms] as any).validate()
      if (flag) {

      }
    } catch (ex) {
      this.handleError(ex)
    }
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
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}

.detail-number {
  /deep/ .btn-add {
    margin-left: 8px;
    line-height: 50px;
  }
}

.n-list {
  margin: 24px 0 8px 5px;
  line-height: 6px;
  font-size: 16px;
  color: #2d8cf0;
  // border-bottom: 2px solid #ecf0f4;
}

.btn-back {
  margin-right: 10px;
}

.detail-header, .detail-check, .detail-content, .detail-footer, .detail-number {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  background: #fff;
  padding-left: 14px;
  /deep/ .ivu-col-span-3 {
    div {
      line-height: 50px;
      width: 110px;
      text-align: right;
    }
  }
  .red {
    color: red;
  }
  span {
    display: inline-block;
    line-height: 50px;
    color: #717975;
  }
  span:first-child:empty {
    &::before {
      content: '暂无';
    }
  }
  span:only-child:empty {
    &::before {
      content: '暂无';
    }
  }
  /deep/ .cinema-button {
    margin-bottom: 20px;
  }
}
.check-select-group {
  display: inline-flex;
  width: 90%;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding-left: 8px;
  overflow: hidden;
  /deep/ .ivu-select {
    .ivu-select-placeholder,
    .ivu-select-selected-value {
      position: relative;
      top: 1px;
    }
    .ivu-select-selection {
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }
}

.detail-edit {
  text-align: center;
  padding-bottom: 20px;
  .btn-set {
    width: 100px;
    margin: 0 10px;
  }
}

.upload-wrap {
  padding-bottom: 6px;
  margin-top: 6px;
}

.show-img {
  width: 120px;
  height: 80px;
  margin: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}

.detail-check {
  padding: 10px;
  .ivu-col-span-3, .ivu-col-span-21 {
    div {
      line-height: 30px;
    }
    span {
      line-height: 30px;
    }
  }
}
</style>
