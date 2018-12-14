<template>
  <div class="page">
    <div class="detail-box">
      <div class="detail-header">
          <Row>
            <Col span="2"><div>公司名称</div></Col>
            <Col span="8"><span></span></Col>
          </Row>
          <Row>
            <Col span="2"><div>简称</div></Col>
            <Col span="8"><span></span></Col>
          </Row>
          <Row>
            <Col span="2"><div>公司地址</div></Col>
            <Col span="8"><span></span></Col>
          </Row>
          <Row>
            <Col span="2"><div>联系人</div></Col>
            <Col span="4"><span></span></Col>
            <Col span="2"><div>联系电话</div></Col>
            <Col span="4"><span></span></Col>
            <Col span="2"><div>邮箱</div></Col>
            <Col span="4"><span></span></Col>
          </Row>
          <Row>
            <Col span="2"><div>公司地址</div></Col>
            <Col span="8"><span></span></Col>
          </Row>
      </div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>审核意见</div></Col>
          <Col span="4"><span></span></Col>
          <Col span="2"><div>有效期至</div></Col>
          <Col span="4"><span></span></Col>
        </Row>
        <Row>
          <Col span="2"><div>审核人</div></Col>
          <Col span="4"><span></span></Col>
          <Col span="2"><div>审核时间</div></Col>
          <Col span="4"><span></span></Col>
        </Row>
      </Row>
      <Row class="detail-footer">
        <Row>
            <Col span="2"><div>客户等级</div></Col>
            <Col span="4"><span></span></Col>
            <Col span="2"><div>负责商务</div></Col>
            <Col span="4"><span></span></Col>
        </Row>
        <Row>
          <Col span="2"><div>客户类型</div></Col>
          <Col span="4"><span></span></Col>
          <Col span="4"><span></span></Col>
        </Row>
        <Row>
          <Col span="2"><div>关联影院</div></Col>
          <Col span="4"><span></span></Col>
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
  async load() {
    const query: any = { id: this.$route.params.id || 0 }
    try {
      await quertItems(query)
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
  /deep/ .ivu-row {
    /deep/ div {
      line-height: 50px;
      width: 88px;
    }
  }
}
</style>
