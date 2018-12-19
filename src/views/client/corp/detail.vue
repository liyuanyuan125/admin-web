<template>
  <div class="page">
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
            <Upload v-if='loading' types='1' :uploadListArray = 'format.imgList'>
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
            <Col span="4">
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
          <Button type="primary" v-if="!detail.mainAccountName" @click="addMainName" class="btn-add">创建主账号</Button>
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
    <div class="detail-edit">
      <Button type="primary" @click="goSet()" class="btn-set">编辑</Button>
    </div>
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
import Upload from './upload.vue'
import { toMap } from '@/fn/array'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

@Component({
  components: {
    AreaSelect,
    PartBindCinema,
    Upload
  }
})
export default class Main extends View {
  detail: any = {}
  loading = false
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

  typeListFormt(value: any) {
    const typeArray: any = []
    const typeObject: any = {}
    if ( !!value ) {
      value.forEach((i: any) => {
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
  goSet() {
    const id = this.$route.params.id
    this.$router.replace({ name: 'client-corp-edit', params: { id }} )
  }
  addMainName() {

  }
}
</script>

<style lang="less" scoped>
.page {
  margin: -10px -10px;
  background: #ecf0f4;
}
.detail-box {
  padding: 10px 0;
}
.detail-header, .detail-content, .detail-footer, .detail-number, .detail-check {
  background: #fff;
  margin: 10px;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    /deep/ div {
      line-height: 50px;
      width: 88px;
    }
  }
  /deep/ span {
    display: inline-block;
    line-height: 50px;
    color: #999;
  }
  /deep/ span:only-child:empty {
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
    color: #999;
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
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    width: 80px;
    padding-left: 5px;
    line-height: 20px;
    background: #dcdee2;
  }
}
</style>
