<template>
  <div class="page">
    <div class="detail-box" style="margin-top: 10px">
      <div class="detail-header">
        <Row>
          <Col span="3"><div>公司名称</div></Col>
          <Col span="16"><span>{{detail.companyName}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>开户行</div></Col>
          <Col span="8"><span id="success_form_input" style="margin-right: 8px">{{detail.accountBank}}</span>
            <a ref="copy" v-show="detail.accountBank" data-clipboard-action="copy" data-clipboard-target="#success_form_input" @click="copyLink">复制</a>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>开户名</div></Col>
          <Col span="4"><span id="success_form_input2" style="margin-right: 8px">{{detail.accountName}}</span>
            <a ref="copy3" v-show="detail.accountBank" data-clipboard-action="copy" data-clipboard-target="#success_form_input2" @click="copyLink">复制</a>
          </Col>
          <Col span="3"><div>账户号</div></Col>
          <Col span="4"><span id="success_form_input3" style="margin-right: 8px">{{detail.accountNumber}}</span>
            <a ref="copy2" v-show="detail.accountBank" data-clipboard-action="copy" data-clipboard-target="#success_form_input3" @click="copyLink">复制</a>
          </Col>
        </Row>
      </div>
      <Row class="detail-content">
        <Form ref="dataFrom" :model="dataFrom" :rules="ruleInline">
        <Row>
          <Col span="3"><div>项目</div></Col>
          <Col span="16">
          <FormItem prop='type'>
            <Select style="width: 200px;margin-top: 8px;" v-model="dataFrom.type" placeholder="请选择项目" clearable>
              <Option v-if="it.fileId!=0" v-for="it in detail.typeList" :key="it.fileId" :value="it.fileId"
                :label="it.url">{{it.url}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>提现前可用余额</div></Col>
          <Col span="16"><span>{{format.beforeWithdrawalAmount}}</span></Col>
        </Row>
        <Row>
          <Col span="3"><div>本次提现金额</div></Col>
          <Col span="2"><InputNumber enter-button="MAX" :max="detail.balance || 0" :min="0" v-model="dataFrom.amount" style="margin-top:5px"></InputNumber></Col>
        </Row>
        <Row>
          <Col span="3"><div>提现后可用余额</div></Col>
          <Col span="16"><span>{{afterWithdrawalAmount}}</span></Col>
        </Row>
        <Row class="upload">
          <Col span="3"><div><span style="red">*</span>凭证</div></Col>
          <Col span="8">
            <FormItem class="upload-wrap" prop='receipt' :show-message = 'dataFrom.receipt.length == 0'>
              <Upload v-model="dataFrom.receipt" :multiple="true" :maxCount="3"/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>备注</div></Col>
          <Col span="8" class="remark">
            <FormItem label="" prop ='remark'>
              <inputTextarea v-model="dataFrom.remark" />
            </FormItem>
          </Col>
        </Row>
        </Form>
      </Row>
      <div style="text-align: center">
        <Button type="primary" size='large' @click="submitWithdraw">提交</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { withdrawalsId, withdrawals } from '@/api/advertiser'
import { toMap } from '@/fn/array'
import { formatCurrency } from '@/fn/string'
import clipboard from 'clipboard'
import Upload from '@/components/Upload.vue'
import inputTextarea from '@/components/inputTextarea.vue'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'

@Component({
  components: {
    Upload,
    inputTextarea
  }
})
export default class Main extends ViewBase {
  httplist = ''
  remark = '11'
  link = '2222'
  copyBtn = null
  detail: any = {}
  loading = false
  imageList = []
  id: any = ''
  dataFrom = {
    remark: '',
    receipt: [],
    beforeWithdrawalAmount: 0,
    afterWithdrawalAmount: 0,
    amount: 0,
    companyId: '',
    accountBank: '',
    accountName: '',
    accountNumber: '',
    companyName: '',
    withdrawalTime: 0,
    type: 1
  }
  typeList: any = []
  get format() {
    const beforeWithdrawalAmount = this.detail.balance || 0
    const afterWithdrawalAmount = this.detail.afterWithdrawalAmount || 0
    return {
      amount: formatCurrency(this.detail.amount),
      afterWithdrawalAmount: formatCurrency(afterWithdrawalAmount),
      beforeWithdrawalAmount: formatCurrency(beforeWithdrawalAmount),
    }
  }

  get afterWithdrawalAmount() {
    return formatCurrency(this.dataFrom.beforeWithdrawalAmount - this.dataFrom.amount)
  }

  get ruleInline() {
    return {
      receipt: [
         { required: true, message: '请上传凭证', type: 'array', trigger: 'change'}
      ],
      remark: [
        { max: 30, message: '请上传凭证', trigger: 'change'}
      ],
      type: [
        { required: true, message: '请选择项目', type: 'number', trigger: 'change'}
      ]
    }
  }

  mounted() {
    this.copyBtn = new clipboard(this.$refs.copy)
    this.copyBtn = new clipboard(this.$refs.copy2)
    this.copyBtn = new clipboard(this.$refs.copy3)
  }

  async load() {
    (this.$Spin as any).show()
    try {
      const res = await withdrawalsId(this.id)
      this.detail = res.data
      this.dataFrom.beforeWithdrawalAmount = this.detail.balance || 0
      this.dataFrom.accountBank = this.detail.accountBank || ''
      this.dataFrom.accountName = this.detail.accountName || ''
      this.dataFrom.accountNumber = this.detail.accountNumber || ''
      this.dataFrom.companyName = this.detail.companyName || ''
      this.loading = true
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 100)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.$route.params.show = 'hide'
      this.handleError(ex.data.html.msg)
    } finally {
      this.$router.push({ name: 'resource' })
    }
  }

  copyLink() {
  }

  submitWithdraw() {
    (this.$refs.dataFrom as any).validate(async ( valid: any ) => {
      if (valid) {
        this.dataFrom.afterWithdrawalAmount = this.dataFrom.beforeWithdrawalAmount - this.dataFrom.amount
        this.dataFrom.companyId = this.id
        this.dataFrom.withdrawalTime = new Date().getTime()
        const query = {
          ...this.dataFrom,
          receipt: this.dataFrom.receipt.map((item: any) => {
            return item.fileId
          }).join(',')
        }
        try {
          await withdrawals(query)
          this.$route.params.show = 'hide'
          this.$router.push({ name: 'resource' })
          ; (this.$refs.dataFrom as any).resetFields()
        } catch (ex) {
          this.handleError(ex)
        }
      }
    })
  }

  @Watch('$route', {immediate: true, deep: true})
  watch$route(val: any, oldVal: any) {
    if (val.name == 'withdrawalBill') {
      this.id = this.$route.params.id || 0
      this.dataFrom.amount = 0
      this.dataFrom.receipt = []
      if (val.params.show == 'show') {
        this.load()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.detail-number {
  /deep/ .btn-add {
    margin-left: 8px;
    line-height: 50px;
  }
}

.btn-back {
  margin-right: 10px;
}

.detail-header, .detail-check, .detail-content, .detail-footer, .detail-number {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
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
.remark {
  padding-top: 8px;
  padding-bottom: 30px;
}
</style>
