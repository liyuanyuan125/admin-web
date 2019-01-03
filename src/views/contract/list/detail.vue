<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>公司详情</em>
      </div>
      <Button type="success" icon="md-add-circle" class="btn-new"
        @click="goSet()">编辑合同</Button>
    </header>
    <div class="detail-box">
        合同主体信息
      <div class="detail-header">
          <Row>
            <Col span="2"><div>合同名称</div></Col>
            <Col span="8"><span>{{detail.contractName}}</span></Col>
            <Col span="2"><div>甲方公司</div></Col>
            <Col span="8"><span>{{detail.companyACode}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>合同编号</div></Col>
            <Col span="8"><span>{{detail.contractNo}}</span></Col>
            <Col span="2"><div>合同有效期</div></Col>
            <Col span="8"><span>{{format.validityStartDate}}~{{format.validityEndDate}}</span></Col>
          </Row>
      </div>
        乙方信息
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>乙方公司</div></Col>
          <Col span="8"><span>{{detail.companyBName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>联系人</div></Col>
          <Col span="8"><span>{{detail.companyBContact}}</span></Col>
          <Col span="2"><div>联系电话</div></Col>
          <Col span="8"><span>{{detail.companyBPhone}}</span></Col>
        </Row>
      </Row>
      结算账户信息
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>开户行</div></Col>
          <Col span="8"><span>{{detail.accountBank}}</span></Col>
          <Col span="2"><div>开户名</div></Col>
          <Col span="8"><span>{{detail.accountName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>银行账号</div></Col>
          <Col span="8"><span>{{detail.accountNumber}}</span></Col>
          <Col span="2"><div>结算账期</div></Col>
          <Col span="8"><span>{{format.settlementPeriod}}</span></Col>
        </Row>
      </Row>
      <Row class="detail-content">
        <!-- <Row>
            <Col span="2"><div>客户等级</div></Col>
            <Col span="4">
              <tooltip v-if="format.levelStaus == 2" content="已下架" placement="top">
                <span :class="format.levelStaus == 2 ? 'red' : ''">{{format.levelText}}级</span>
              </tooltip>
              <span v-else>{{format.levelText}}级</span>
            </Col>
            <Col span="2"><div>负责商务</div></Col>
            <Col span="6"><span>{{detail.businessDirectorEmail}}<b style="margin-left:5px">[{{detail.businessDirectorName}}]</b></span></Col>
        </Row> -->
        <!-- <Row>
          <Col span="2"><div>客户类型</div></Col>
          <div v-for="item in format.typeFormat" :key="item.oneText">
            <Col span="4" style="margin-right: 20px">
              <div class="typeBox">
                {{item.oneText}}
                <tooltip class="right" v-if="format.userType[item.two] == 2" content="已下架" placement="top">
                  <div :class="format.userType[item.two] == 2 ? 'red' : ''">{{item.twoText}}</div>
                </tooltip>
                <div class="right" v-else>{{item.twoText}}</div>
              </div>
            </Col>
          </div>
        </Row> -->
        <Row class="cinema-button">
          <Col span="2"><div>分成比例</div></Col>
          <Col span="12" v-for='it in detail.cinemaList'>
          以下影院，分成比例为【{{it.proportion}}%】
              <PartBindCinema type="1" :value="it.cinemaList" />
          </Col>
        </Row>
      </Row>
      责任人
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>签订人</div></Col>
          <Col span="8"><span>{{detail.signingUsesName}}</span></Col>
          <Col span="2"><div>跟进人</div></Col>
          <Col span="8"><span>{{detail.followUserName}}</span></Col>
        </Row>
      </Row>
      备注
      <Row class="detail-content">
        <Row>
          <Col span="16"><span>{{detail.remark}}</span></Col>
        </Row>
      </Row>
      <!-- <Row class="detail-number">
        <Row>
          <Col span="2"><div>主账号</div></Col>
          <Col span="8">
          <span v-if="!!detail.mainAccountName">{{detail.mainAccountName}}
            <router-link class="operation" :to="{ name: 'client-account-detail', params: { id: detail.mainAccountId }}">[管理]</router-link>
          </span>
          <a v-if="!detail.mainAccountName" @click="edit" class="btn-add">[创建主账号]</a>
          </Col>
        </Row>
        <Row>
          <Col span="2"><div>子账号</div></Col>
          <Col span="8"><span v-for="index in detail.accountList" :key="index" style="margin-right:">{{index}}</span></Col>
        </Row>
      </Row> -->
      操作记录
      <Row class="detail-check">
        <Row>
          <div v-for="(item, i) in logList" :key="i">
            <span>{{item.createTime}}</span>
            <span>由{{item.email}}<b style="margin: 0 5px">[{{item.userName}}]</b>{{item.description}}</span>
          </div>
        </Row>
      </Row>
    </div>
    <!-- <DlgEdit ref="addOrUpdate" @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/> -->
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryId } from '@/api/list'
import AreaSelect from '@/components/AreaSelect.vue'
import PartBindCinema from './partBindCinema.vue'
// import DlgEdit from '../account/dlgEdit.vue'
import Upload from '@/components/Upload.vue'
import { toMap } from '@/fn/array'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const typeMap = (list: any[]) => toMap(list, 'typeCode', 'controlStatus')
const conMap = (list: any[]) => toMap(list, 'key', 'controlStatus')

const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
    Upload,
    // DlgEdit
  }
})
export default class Main extends ViewBase {
  detail: any = {}
  loading = false
  addOrUpdateVisible = false
  approveStatusList: any = []
  customerTypeList: any = []
  logList: any = []
  levelList: any = []
  statusList: any = []
  showimg = true
  created() {
    this.load()
  }
  get cachedMap() {
    return {
      approveList: makeMap(this.approveStatusList),
      statusList: makeMap(this.statusList),
      levelList: makeMap(this.levelList),
      levelStaus: conMap(this.levelList),
    }
  }

  get format() {
    const cachedMap = this.cachedMap
    return {
      approveText: cachedMap.approveList[this.detail.approveStatus],
      statusText: cachedMap.statusList[this.detail.status],
      levelText: cachedMap.levelList[this.detail.levelCode],
      typeFormat: this.typeListFormt(this.detail.types),
      approveTime: this.detail.approveTime ?
      moment(this.detail.approveTime).format(timeFormatDate) : '',
      validityPeriodDate: this.detail.validityPeriodDate ?
      this.formatValid(this.detail.validityPeriodDate) : '',
      levelStaus: cachedMap.levelStaus[this.detail.levelCode],
      userType: this.formatCinema(this.detail.customerTypeList)
    }
  }

  formatValid(data: any) {
    const datas = (data + '').split(',')
    const a = datas[0].slice(0, 4)
    const b = datas[0].slice(4, 6)
    const c = datas[0].slice(6)
    return `${a}/${b}/${c}`
  }

  formatCinema(data: any) {
    const cinemChildren = data && data.map((item: any) => {
      return item.typeCategoryList
    }).flat()
    return typeMap(cinemChildren)
  }
  get qualifica() {
    if (this.detail.qualificationTypeList) {
       return (this.detail.qualificationTypeList[0] as any).text
    }
  }
  dlgEditDone(email: any) {
    this.detail.mainAccountName = email
  }

  search() {
  }
  typeListFormt(value: any) {
    const typeArray: any = []
    if ( !!value ) {
      value.forEach((i: any) => {
        const typeObject: any = {}
        this.customerTypeList.forEach((val: any) => {
          if (i.typeCode == val.typeCode) {
            typeObject.oneText = val.typeName
          }
          if ( !!i.typeCategoryCode ) {
            val.typeCategoryList.forEach((chlVal: any) => {
              if ( i.typeCategoryCode == chlVal.typeCode ) {
                typeObject.twoText = chlVal.typeName
                typeObject.two = chlVal.typeCode
              }
            })
          }
        })
        typeArray.push(typeObject)
      })
    }
    return typeArray
  }
  async load() {
    // const query: any = { id: this.$route.params.id || 0 }
     (this.$Spin as any).show()
    try {
      const res = await queryId(this.$route.params.id)
      this.detail = res.data
      this.detail.cinemaList = res.data.ruleList || []
      this.approveStatusList = res.data.approveStatusList
      // this.customerTypeList = res.data.customerTypeList
      // this.levelList = res.data.levelList
      // this.statusList = res.data.statusList.slice(1)
      const logList = res.data.logList.map((item: any) => {
        return {
          ...item,
          createTime: moment(item.createTime).format(timeFormatDate)
        }
      })
      this.logList = logList.slice(0, 20)
      this.approveStatusList = res.data.approveStatusList.slice(1)
      if (res.data.imageList != null) {
        this.detail.imageList.length > 0 ? this.showimg = false : ''
      }
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
    // 新增
  edit() {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      let id = ''
      this.detail.status == 2 ? id = '' : id = this.detail.id
      ; (this.$refs.addOrUpdate as any).init(id)
    })
  }

  back() {
    this.$router.go(-1)
  }

  goSet() {
    const id = this.$route.params.id
    this.$router.replace({ name: 'contract-list-edit', params: { id }} )
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

.btn-back {
  margin-right: 10px;
}
.detail-check {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding: 10px;
  padding-left: 14px;
}
.detail-header, .detail-content, .detail-footer, .detail-number {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
      width: 88px;
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
.upload {
  padding-bottom: 40px;
  /deep/ .uplaod-slot {
    margin-bottom: 10px;
    color: #19be6b;
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
.typeBox {
  position: relative;
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  background: #ecf0f4;
  color: #717975;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    width: 50px;
    text-align: center;
    color: #717975;
    line-height: 20px;
    background: #dcdee2;
  }
  .red {
    color: red;
  }
}
.upload-wrap {
  background-color: #ecf0f4;
  padding-bottom: 6px;
  margin-top: 6px;
}
.upload-info {
  line-height: 18px;
  padding: 10px 0 0 8px;
  margin-bottom: 6px;
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
</style>
