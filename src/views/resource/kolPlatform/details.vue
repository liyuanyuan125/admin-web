<template>
  <div>
      <div class="base-mess">
            <h2 class="title">基础信息</h2>
            <Row>
            <Col :span="6"><p><label>平台账号</label><em>{{items.channelDataId || '-'}}</em></p></Col>
            <Col :span="6"><p><label>账号名称</label><em>{{items.name|| '-'}}</em></p></Col>
            <Col :span="6"><p><label>账号分类</label>
            <em v-for="it in accountCategoryList" :key="it.key" v-if="it.key == items.accountCategoryCode">{{it.text}}</em>
            </p></Col>
            <Col :span="6"><p><label>所在地区</label><em>{{items.provinceName}} {{items.cityName}}</em></p></Col>
            </Row>
            <Row>
            <Col :span="6"><p><label>账号类型</label><em>{{items.type == 1 ? '个人' : '公司'}}</em></p></Col>
            <Col :span="6"><p><label>是否认证</label><em>{{items.auth ? '是' : '否'}}</em></p></Col>
            </Row>
            <Row>
            <Col :span="22"><p><label>功能介绍</label><em class="information">{{items.introduction}}</em></p></Col> 
            </Row>
      </div>

      <div class="base-mess">
          <h2 class="title">KOL平台账号结算信息</h2>
          <Table :columns="settlementCol" :data="settlmentDate" border stripe></Table>
          <p class="isVoice">是否提供发票： {{items.provideInvoice ? '是' : '否'}}</p>
      </div>
       <div class="base-mess">
          <h2 class="title">KOL平台账号定价信息</h2>
          <Table :columns="priceCol" :data="priceDate" border stripe></Table>
      </div>
      <div class="base-mess logs">
          <h2 class="title">操作日志</h2>
           <p v-for="(item, index) in logList" :key="index">
            <span>{{item.createUserName}}</span>
            <span>{{item.createTime}}</span>
            <span>{{item.descption}}</span>
           </p>
          <!-- <Table :columns="operationLogCol" :data="logList" border stripe></Table> -->
          <div class="text-align">
              <Button :to="{name: 'resource-kolplatform-list'}">返回</Button>
          </div>
      </div>
      
      <div class="base-mess" v-if="type">
          <h2 class="title"> 审核意见</h2>
           <RadioGroup v-model="auditOpinion"> <Radio :label="1">审核通过</Radio> <Radio :label="2">审核不通过</Radio> </RadioGroup>
           <!-- v-if="auditOpinion == 2" -->
           <p class="flex-box text-desc"  >
            <label class="label-dese">备注：</label>
            <Input v-model="desc" type="textarea" style="width: 80%" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
          </p>
         <div class="batch-btn">
            <Button type="primary" class="btn" @click="submitAudit"> 提交</Button>
            <Button :to="{name: 'resource-kolplatform-list'}"> 返回</Button>
         </div>
      </div>
      
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { intDate } from '@/util/dealData.ts'
import { details, approve } from './data'
@Component
export default class Main extends ViewBase {
    @Prop({ type: Number, default: 0}) id!: number
    @Prop({ type: String, default: ''}) code!: string
    @Prop({ type: Number, default: 0}) type!: number

    items: any = {}
    accountCategoryList: any[] = []

    accountType = 1
    accountItem = '1'
    isAuth = '1'
    accountTypeList = [
        {key: 1, text: '母婴育儿'},
        {key: 2, text: '美容美妆'},
        {key: 3, text: '时尚穿搭'},
    ]

    // 审核意见
    auditOpinion = 1
    desc = ''

    // kol平台账号结算信息
    settlementCol = [
        {title: '分类', key: 'categoryName', align: 'center'},
        {title: '结算价', key: 'settlementPrice', align: 'center'},
        {title: '结算价有效期', key: 'effectiveDate', align: 'center'}
    ]
    settlmentDate = []

    // kol 平台定价信息
    priceCol = [
        { title: '价格类型', key: 'categoryName', align: 'center'},
        { title: '成本价', key: 'costPrice', align: 'center'},
        { title: '定价方式', key: 'priceType', align: 'center'},
        { title: '数值', key: 'value', align: 'center'},
        { title: '售价', key: 'salePrice', align: 'center'},
    ]
    priceDate = []

    // 操作日志
    operationLogCol = [
        {title: '操作类型', key: 'type', align: 'center'},
        {title: '操作时间', key: 'type', align: 'center'},
        {title: '操作人', key: 'type', align: 'center'},
        {title: '字段', key: 'type', align: 'center'},
        {title: '原值', key: 'type', align: 'center'},
        {title: '新值', key: 'type', align: 'center'},
    ]
    logList = []

    mounted() {
        this.details()
    }

    async details() {
        try {
            const { data: {item, accountCategoryList, logList} } = await details(this.code, this.id)
            this.items = item
            this.accountCategoryList = accountCategoryList
            this.settlmentDate = (item.settlementPrices || []).map((it: any) => {
                return {
                   ...it,
                   effectiveDate: intDate(it.effectiveDate)
                }
            }) // 结算价
            this.priceDate = (item.prices || []).map((it: any) => {
                return {
                    ...it,
                    priceType: it.priceType == 1 ? '固定价格' : '固定价格*系数'
                }
            }) // 定价/销售价
            this.logList = logList || [] // 日志
        } catch (ex) {
            this.handleError(ex)
        }
    }

    async submitAudit() {
        try {
            const { data } = await approve({
               channelCode: this.code,
               ids: [this.id],
               agree: this.auditOpinion == 1 ? true : false,
               remark: this.desc
            })
            this.$router.push({name: 'resource-kolplatform-list'})
        } catch (ex) {
            this.handleError(ex)
        }
    }
}

</script>
<style lang='less' scoped>
@import '~@/views/data/person/less/common.less';
.information {
  width: 95%;
}
.isVoice {
  padding-top: 10px;
}
.text-desc {
  padding-top: 20px;
}
.text-align {
  padding-top: 20px;
  text-align: center;
}
.batch-btn {
  text-align: center;
  margin: 20px 0 20px;
  .btn {
    margin-right: 20px;
  }
}
.logs {
  p {
    padding-bottom: 10px;
    span {
      padding-right: 10px;
    }
  }
}


</style>