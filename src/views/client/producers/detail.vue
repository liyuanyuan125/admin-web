<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>广告主详情</em>
      </div>
    </header>
    <div class="detail-box">
      <div class="detail-header">
          <Row>
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
          </Row>
          <div>
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
            <Row v-if='detail.types.length == 2'>
              <Col span="2"><div>所属行业</div></Col>
              <Col span="8" v-if='detail.businessParentCode'>
                <Industry :disabled='true' v-model='detail.businessParentCode' :businessParentTypeList='businessParentTypeList' />
              </Col>
            </Row>
          </div>
          <Row>
            <Col span="2"><div>联系人</div></Col>
            <Col span="4"><span>{{detail.contact}}</span></Col>
            <Col span="2"><div>联系电话</div></Col>
            <Col span="4"><span>{{detail.contactTel}}</span></Col>
            <Col span="2"><div>邮箱</div></Col>
            <Col span="4"><span>{{detail.email}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>推荐人</div></Col>
            <Col span="4"><span>{{detail.recommendUserName}}</span></Col>
            <Col span="2"><div>推荐人电话</div></Col>
            <Col span="4"><span>{{detail.recommendMobile}}</span></Col>
          </Row>
          <Row class="upload">
            <Col span="2"><div>资质</div></Col>
            <Col span="8">
              <div class="upload-wrap">
                <div class="upload-info">
                  {{qualifica}} {{detail.qualificationCode}}
                </div>
                <div v-if="showimg" class="show-img">
                  <img src="~@/assets/imgerror.png"/>
                </div>
                <Upload v-model='detail.imageList' readonly v-if='loading'/>
              </div>
            </Col>
          </Row>
      </div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>审核意见</div></Col>
          <Col span="4"><span>{{format.approveText}}</span></Col>
          <Col span="2" v-if="detail.approveStatus !=3"><div>有效期至</div></Col>
          <Col span="2" v-if="detail.approveStatus ==3"><div>拒绝理由</div></Col>
          <Col span="4" v-if="detail.approveStatus !=3"><span >{{format.validityPeriodDate}}</span></Col>
          <Col span="4" v-if="detail.approveStatus ==3"><span >{{detail.refusedReason}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>审核人</div></Col>
          <Col span="4"><span>{{detail.approveUserName}}</span></Col>
          <Col span="2"><div>审核时间</div></Col>
          <Col span="4"><span>{{format.approveTime}}</span></Col>
        </Row>
      </Row>
      <Row class="detail-footer">
        <Row>
            <Col span="2"><div>客户等级</div></Col>
            <Col span="4">
              <tooltip v-if="format.levelStaus == 2" content="已下架" placement="top">
                <span :class="format.levelStaus == 2 ? 'red' : ''"><span v-if="format.levelText">{{format.levelText}}级</span></span>
              </tooltip>
              <span v-else><span v-if="format.levelText">{{format.levelText}}级</span></span>
            </Col>
            <Col span="2"><div>负责商务</div></Col>
            <Col span="6"><span>{{detail.businessDirectorEmail}}<b v-if="detail.businessDirectorName" style="margin-left:5px">[{{detail.businessDirectorName}}]</b></span></Col>
        </Row>
        <Row class="cinema-button" v-if='detail.companyType == 1'>
          <Col span="2"><div>关联影院</div></Col>
          <Col span="12">
              <PartBindCinema type="1" :value="detail.cinemaList" />
          </Col>
        </Row>
        <Row class="cinema-button">
          <Col span="2"><div>品牌列表</div></Col>
          <Col span="12">
              <Table
                :columns="columns"
                :data="list"
                size="small"
                stripe
                border
              >
              <div slot="status" slot-scope="{ row: { hasBind } }">
                {{hasBind ? '已绑定' : '-'}}
              </div>
              </Table>
          </Col>
       </Row>
      </Row>
      <Row class="detail-number">
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
          <Col span="8"><span v-for="index in detail.accountList" :key="index" style="margin-right: 6px">{{index}}</span></Col>
        </Row>
      </Row>
      <Row class="detail-check">
        <Row>
          <div v-for="(item, i) in logList" :key="i">
            <span>{{item.createTime}}</span>
            <span>由{{item.email}}<b style="margin: 0 5px">[{{item.userName}}]</b>{{item.description}}</span>
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
import ViewBase from '@/util/ViewBase'
import { queryId } from '@/api/corpReal'
import AreaSelect from '@/components/areaSelect'
import PartBindCinema from './partBindCinema.vue'
import DlgEdit from '../account/dlgEdit.vue'
import Upload from '@/components/Upload.vue'
import { toMap } from '@/fn/array'
import { flattenDeep } from 'lodash'
import Industry from './industry.vue'

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
    DlgEdit,
    Industry
  }
})
export default class Main extends ViewBase {
  detail: any = {}
  loading = false
  addOrUpdateVisible = false
  businessParentTypeList: any = []
  approveStatusList: any = []
  customerTypeList: any = []
  logList: any = []
  levelList: any = []
  statusList: any = []
  showimg = true
  list: any = []
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

  get columns() {
    return [
      { type: 'index', title: '序号', width: 60, align: 'center' },
      { title: '品牌ID', key: 'id', width: 80, align: 'center' },
      { title: '品牌中文名称', key: 'brandName', align: 'center' },
      { title: '状态', slot: 'status', align: 'center' },
    ]
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
      userType: this.formatCinema((this.detail.customerTypeList || []).slice(2))
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
    const cinemChildren = data && flattenDeep(data.map((item: any) => {
      return item.typeCategoryList
    }))
    return typeMap(cinemChildren)
  }
  get qualifica() {
    if (this.detail.qualificationTypeList) {
       return (this.detail.qualificationTypeList[0] as any).text
    }
  }
  dlgEditDone(email: any, id: any) {
    this.detail.mainAccountName = email
    this.detail.mainAccountId = id
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
    const query: any = { id: this.$route.params.id || 0 }
    ; (this.$Spin as any).show()
    try {
      const res = await queryId(query)
      this.detail = res.data
      this.detail.companyTypeName = res.data.companyType == 1 ? '企业' : '个人'
      this.detail.businessParentCode = [
          res.data.businessParentCode,
          (res.data.businessChildCode || '0')
      ]
      this.businessParentTypeList = res.data.businessParentTypeList.map((it: any) => {
        return {
          value: it.key,
          label: it.text,
          children: [],
          loading: false
        }
      })
      this.list = res.data.brandList || []
      this.detail.cinemaList = res.data.cinemaList || []
      this.approveStatusList = res.data.approveStatusList
      this.customerTypeList = res.data.customerTypeList.slice(2)
      this.levelList = res.data.levelList
      this.statusList = res.data.statusList.slice(1)
      const logList = res.data.logList.map((item: any) => {
        return {
          ...item,
          createTime: moment(item.createTime).format(timeFormatDate)
        }
      })
      this.logList = logList.slice(0, 20)
      this.approveStatusList = res.data.approveStatusList.slice(1)
      this.detail.imageList = res.data.imageList || []
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
    this.$router.replace({ name: 'client-corp-edit', params: { id }} )
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.page {
  margin-right: 14px;
}

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
  background: #fff;
  padding-left: 14px;
}

.detail-header, .detail-content, .detail-footer, .detail-number {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  background: #fff;
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
