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
            <Col span="8"><span>{{detail.address}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>联系人</div></Col>
            <Col span="4"><span>{{detail.contacts}}</span></Col>
            <Col span="2"><div>联系电话</div></Col>
            <Col span="4"><span>{{detail.contactsTel}}</span></Col>
            <Col span="2"><div>邮箱</div></Col>
            <Col span="4"><span>{{detail.email}}</span></Col>
          </Row>
          <Row class="upload">
            <Col span="2"><div>资质</div></Col>
            <Col span="8">

            <Upload v-if='loading' types='1' :uploadList = 'detail.imageList' /> 
            </Col>
          </Row>
      </div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>审核意见</div></Col>
          <Col span="4"><span>{{detail.email}}</span></Col>
          <Col span="2"><div>有效期至</div></Col>
          <Col span="4"><span>{{detail.email}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>审核人</div></Col>
          <Col span="4"><span>{{detail.approveUser}}</span></Col>
          <Col span="2"><div>审核时间</div></Col>
          <Col span="4"><span>{{detail.approveTime}}</span></Col>
        </Row>
      </Row>
      <Row class="detail-footer">
        <Row>
            <Col span="2"><div>客户等级</div></Col>
            <Col span="4"><span>{{detail.customerLevel}}</span></Col>
            <Col span="2"><div>负责商务</div></Col>
            <Col span="4"><span></span></Col>
        </Row>
        <Row>
          <Col span="2"><div>客户类型</div></Col>
          <Col span="4">
            <div class="typeBox">
               广告主
              <div class="right">直播</div>
            </div>
          </Col>
          <Col span="4" offset="2">
            <div class="typeBox">
              广告主
              <div class="right">直播</div>
            </div>
          </Col>
        </Row>
        <Row class="cinema-button">
          <Col span="2"><div>关联影院</div></Col>
          <Col span="12">
              <PartBindCinema type="1" /> 
          </Col>
        </Row>
      </Row>
      <Row class="detail-number">
        <Row>
          <Col span="2"><div>主账号</div></Col>
          <Col span="4"><span></span></Col>
        </Row>
        <Row>
          <Col span="2"><div>子账号</div></Col>
          <Col span="4"><span></span></Col>
        </Row>
      </Row>
      <Row class="detail-check">
        <Row></Row>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component } from 'vue-property-decorator'
import View from '@/util/View'
import { quertItems } from '@/api/corp'
import AreaSelect from '@/components/AreaSelect.vue'
import PartBindCinema from './partBindCinema.vue'
import Upload from './upload.vue'
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
  created() {
    this.load()
  }
  async load() {
    const query: any = { id: this.$route.params.id || 0 }
    try {
      const res = await quertItems(query)
      this.detail = res.data.data
      this.loading = true
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
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
