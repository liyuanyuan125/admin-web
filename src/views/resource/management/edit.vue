<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1" style="margin-left: 8px" >
        <em>平台刊例价 - 新建刊例价</em>
      </div>
    </header>
    <div class="detail-box">

      <Row class='titop'>
        <Col :span="2">刊例价</Col>
        <Col span="18" class="red">
          注：结算时根据广告计划的规格时长进行计算，规格时长只能是15的整倍数
        </Col>
      </Row>
      <Row class="detail-content">
        <Col>
          <Col :span="20">
            <Col span="2"><div>每30秒</div></Col>
            <Col span="8" class="red">
            </Col>
          </Col>
          <Col :span="20">
            <Col span="2"><div>15秒折扣</div></Col>
          </Col>
        </Col>
      </Row>

      <Row class='titop'>
        <Col :span="2">有效期</Col>
        <Col span="18" class="red">
          注：指定日期与档期重合时，重合日期的有效报价为档期刊例价
        </Col>
      </Row>
      <Row class="detail-content">
        <Col>
          <Col :span="20">
            <Col span="2"><div>每30秒</div></Col>
            <Col span="8" class="red">
            </Col>
          </Col>
          <Col :span="20">
            <Col span="2"><div>15秒折扣</div></Col>
          </Col>
        </Col>
      </Row>

      <Row class='titop'>
        <Col :span="2">有效范围</Col>
        <Col span="18" class="red">
          注：部分影院有刊例价时，有效报价为部分影院刊例价
        </Col>
      </Row>
      <Row class="detail-content">
        <Col>
          <Col :span="20">
            <Col span="2"><div>每30秒</div></Col>
            <Col span="8" class="red">
            </Col>
          </Col>
          <Col :span="20">
            <Col span="2"><div>15秒折扣</div></Col>
          </Col>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Main extends ViewBase {
  dataForm: any = {
    cpm: '',
    discount: '',
    calendarId: '',
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
.red {
  color: red;
}
.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
.detail-content {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
      width: 88px;
    }
  }
}
</style>
