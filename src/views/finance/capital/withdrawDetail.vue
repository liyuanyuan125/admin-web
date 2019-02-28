<template>
  <div class="page">
    <div class="detail-box">
      <div class="detail-header">
        <Row>
          <Col span="3"><div>公司名称</div></Col>
          <Col span="16"><span>{{detail.companyName}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>开户行</div></Col>
          <Col span="8">
            <span id="success_form_input" style="margin-right: 8px">{{detail.accountBank}}</span>
            <a ref="copy" v-show="detail.accountBank" data-clipboard-action="copy" data-clipboard-target="#success_form_input" @click="copyLink">复制</a>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>开户名</div></Col>
          <Col span="4"><span id="success_form_input2" style="margin-right: 8px">{{detail.accountName}}</span>
            <a ref="copy3" v-show="detail.accountName" data-clipboard-action="copy" data-clipboard-target="#success_form_input2" @click="copyLink">复制</a>
          </Col>
          <Col span="3"><div>账户号</div></Col>
          <Col span="4"><span id="success_form_input3" style="margin-right: 8px">{{detail.accountNumber}}</span>
            <a ref="copy2" v-show="detail.accountName" data-clipboard-action="copy" data-clipboard-target="#success_form_input3" @click="copyLink">复制</a>
          </Col>
        </Row>
      </div>
      <Row class="detail-content">
        <Row>
          <Col span="3"><div>项目</div></Col>
          <Col span="16"><span>{{detail.typeName}}</span></Col>
        </Row>
        <Row>
          <Col span="3"><div>提现前可用余额</div></Col>
          <Col span="16"><span>{{format.beforeWithdrawalAmount}}</span></Col>
        </Row>
        <Row>
          <Col span="3"><div>本次提现金额</div></Col>
          <Col span="16"><span>{{format.amount}}</span></Col>
        </Row>
        <Row>
          <Col span="3"><div>提现后可用余额</div></Col>
          <Col span="16"><span>{{format.afterWithdrawalAmount}}</span></Col>
        </Row>
        <Row class="upload">
          <Col span="3"><div>凭证</div></Col>
          <Col span="8">
            <div class="upload-wrap">
              <div v-if="showimg" class="show-img">
                <img src="~@/assets/imgerror.png"/>
              </div>
              <imgModel v-else :uploadList = "img" :type = 2 />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="3"><div>备注</div></Col>
          <Col span="8"><span>{{detail.remark}}</span></Col>
        </Row>
      </Row>
      <Row class="detail-check" v-if="detail.logs && detail.logs.length > 0">
        <Row  class="detail-log" v-for="(item, i) in logList" :key="i">
          <Col span="3"><div>操作时间</div></Col>
          <Col span="21"><span>{{item.createTime}}</span></Col>
          <Col span="3"><div>操作员</div></Col>
          <Col span="21"> <span>{{item.email}}<b style="margin: 0 5px">[{{item.userName}}]</b></span></Col>
        </Row>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { resIdDetail } from '@/api/advertiser'
import { toMap } from '@/fn/array'
import { formatCurrency } from '@/fn/string'
import imgModel from '../../data/film/imgModel.vue'
import clipboard from 'clipboard'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const typeMap = (list: any[]) => toMap(list, 'typeCode', 'controlStatus')
const conMap = (list: any[]) => toMap(list, 'key', 'controlStatus')

const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

@Component({
  components: {
    imgModel
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

  get format() {
    const afterWithdrawalAmount = this.detail.afterWithdrawalAmount || 0
    const beforeWithdrawalAmount = this.detail.beforeWithdrawalAmount || 0
    return {
      amount: formatCurrency(this.detail.amount),
      afterWithdrawalAmount: formatCurrency(afterWithdrawalAmount),
      beforeWithdrawalAmount: formatCurrency(beforeWithdrawalAmount),
    }
  }

  init() {
    this.copyBtn = new clipboard(this.$refs.copy)
    this.copyBtn = new clipboard(this.$refs.copy2)
    this.copyBtn = new clipboard(this.$refs.copy3)
  }

  mounted() {
    this.init()
  }

  activated() {
    this.init()
  }

  async load() {
    (this.$Spin as any).show()
    try {
      const res = await resIdDetail({id: this.id})
      this.detail = res.data
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

  @Watch('id', {immediate: true})
  watchid(val: any, oldVal: any) {
    this.id = this.$route.params.id
    if (val) {
      this.load()
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
</style>
