<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回列表</Button>
      <div class="flex-1">
        <em>公司详情</em>
      </div>
      <Button type="success" icon="md-add-circle" class="btn-new"
        @click="goSet()">编辑公司</Button>
    </header>
    <div class="detail-box">
      <div class="detail-header">
          <Row>
            <Col span="2"><div>公司名称</div></Col>
            <Col span="16"><span>{{detail.name}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>简称</div></Col>
            <Col span="8"><span>{{detail.shortName}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>公司地址</div></Col>
            <Col span="8"><span>{{detail.finishAddress}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>联系人</div></Col>
            <Col span="4"><span>{{detail.contact}}</span></Col>
            <Col span="2"><div>联系电话</div></Col>
            <Col span="4"><span>{{detail.contactTel}}</span></Col>
            <Col span="2"><div>邮箱</div></Col>
            <Col span="4"><span>{{detail.email}}</span></Col>
          </Row>
          <Row class="upload">
            <Col span="2"><div>资质</div></Col>
            <Col span="8">
            <Upload v-if='loading' types='1' :uploadListArray='format.imgList'>
              <div class="uplaod-slot">{{detail.qualificationType}} {{detail.qualificationCode}}</div>
            </Upload>
            </Col>
          </Row>
      </div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>审核意见</div></Col>
          <Col span="4"><span>{{format.approveText}}</span></Col>
          <Col span="2"><div>有效期至</div></Col>
          <Col span="4"><span>{{format.validityPeriodDate}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>审核人</div></Col>
          <Col span="4"><span>{{detail.approveUser}}</span></Col>
          <Col span="2"><div>审核时间</div></Col>
          <Col span="4"><span>{{format.approveTime}}</span></Col>
        </Row>
      </Row>
      <Row class="detail-footer">
        <Row>
            <Col span="2"><div>客户等级</div></Col>
            <Col span="4"><span>{{format.levelText}}级</span></Col>
            <Col span="2"><div>负责商务</div></Col>
            <Col span="4"><span>{{detail.businessDirector}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>客户类型</div></Col>
          <div v-for="item in format.typeFormat" :key="item.oneText">
            <Col span="4" style="margin-right: 20px">
              <div class="typeBox">
                {{item.oneText}}
                <div class="right">{{item.twoText}}</div>
              </div>
            </Col>
          </div>
        </Row>
        <Row class="cinema-button">
          <Col span="2"><div>关联影院</div></Col>
          <Col span="12">
              <PartBindCinema type="1" :value="detail.cinemaList" /> 
          </Col>
        </Row>
      </Row>
      <Row class="detail-number">
        <Row>
          <Col span="2"><div>主账号</div></Col>
          <Col span="4">
          <span>{{detail.mainAccountName}}</span>
          <a v-if="!detail.mainAccountName" @click="edit" class="btn-add">[创建主账号]</a>
          </Col>
        </Row>
        <Row>
          <Col span="2"><div>子账号</div></Col>
          <Col span="4"><span v-for="index in detail.accountList" :key="index" style="margin-right:">{{index}}</span></Col>
        </Row>
      </Row>
      <Row class="detail-check">
        <Row>
          <div v-for="item in logList" :key="item.createTime">
            <span>{{item.createTime}}</span>
            <span>由{{item.userName}}{{item.description}}</span>
          </div>
        </Row>
      </Row>
    </div>
    <DlgEdit ref="addOrUpdate" @refreshDataList="search" v-if="addOrUpdateVisible" @done="dlgEditDone"/>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component } from 'vue-property-decorator'
import moment from 'moment'
import View from '@/util/View'
import { queryId } from '@/api/corpReal'
import AreaSelect from '@/components/AreaSelect.vue'
import PartBindCinema from './partBindCinema.vue'
import DlgEdit from '../account/dlgEdit.vue'
import Upload from './upload.vue'
import { toMap } from '@/fn/array'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
    Upload,
    DlgEdit
  }
})
export default class Main extends View {
  detail: any = {}
  loading = false
  addOrUpdateVisible = false
  approveStatusList: any = []
  customerTypeList: any = []
  logList: any = []
  levelList: any = []
  statusList: any = []
  created() {
    this.load()
  }
  get cachedMap() {
    return {
      approveList: makeMap(this.approveStatusList),
      statusList: makeMap(this.statusList),
      levelList: makeMap(this.levelList)
    }
  }

  get format() {
    const cachedMap = this.cachedMap
    return {
      approveText: cachedMap.approveList[this.detail.approveStatus],
      statusText: cachedMap.statusList[this.detail.status],
      levelText: cachedMap.levelList[this.detail.levelCode],
      typeFormat: this.typeListFormt(this.detail.types),
      approveTime: moment(this.detail.approveTime).format(timeFormatDate),
      validityPeriodDate: moment(this.detail.validityPeriodDate).format(timeFormat),
      imgList: this.imgFormat(this.detail.images),
    }
  }

  imgFormat(val: any) {
    const imgList: any = []
    if (!!val) {
      if ( typeof val == 'string') {
        imgList.push({
          imageUrl: val
        })
      } else {
        val.forEach((value: any) => {
          imgList.push({
            imageUrl: value
          })
        })
      }
    }
    return imgList
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
    const query: any = { id: this.$route.params.id || 0 }
    try {
      const res = await queryId(query)
      this.detail = res.data
      this.approveStatusList = res.data.approveStatusList
      this.customerTypeList = res.data.customerTypeList
      this.levelList = res.data.levelList
      this.statusList = res.data.statusList.slice(1)
      this.logList = res.data.logList.map((item: any) => {
        return {
          ...item,
          createTime: moment(item.createTime).format(timeFormatDate)
        }
      })
      this.approveStatusList = res.data.approveStatusList.slice(1)
      this.loading = true
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }
    // 新增
  edit() {
    this.addOrUpdateVisible = true
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init()
    })
  }

  back() {
    this.$router.go(-1)
  }

  goSet() {
    const id = this.$route.params.id
    this.$router.replace({ name: 'client-corp-edit', params: { id }} )
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
    /deep/ div {
      line-height: 50px;
      width: 88px;
    }
  }
  span {
    display: inline-block;
    line-height: 50px;
    color: #19be6b;
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
  color: #19be6b;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    width: 80px;
    color: #19be6b;
    padding-left: 5px;
    line-height: 20px;
    background: #dcdee2;
  }
}
</style>
