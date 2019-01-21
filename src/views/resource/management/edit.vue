<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1" style="margin-left: 8px" >
        <em>平台刊例价 - 新建刊例价</em>
      </div>
    </header>

    <Form ref="dataForm" :model="dataForm" :rules="rule" :label-width="0">
      <div class="detail-box">

        <Row class='titop'>
          <Col :span="2">刊例价</Col>
          <Col span="18" class="red">
            注：结算时根据广告计划的规格时长进行计算，规格时长只能是15的整倍数
          </Col>
        </Row>
        <Row class="detail-content">
          <Col>
            <Col :span="24">
              <Col span="2"><div>每30秒</div></Col>
              <Col span="8">
                <FormItem prop="cpm" class="mt8">
                  <InputNumber style="width: 80px" :min="0" v-model="dataForm.cpm" placeholder=""/>  元/千人次
                </FormItem>
              </Col>
            </Col>
            <Col :span="24">
              <Col span="2"><div>15秒折扣</div></Col>
              <Col span="8">
                <FormItem prop="discount" class="mt8">
                  <InputNumber style="width: 80px" :max="100" :min="0" v-model="dataForm.discount" placeholder=""/>  %
                </FormItem>
              </Col>
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
          <Row>
            <Col :span="2">
              <FormItem class="mt10">
                <RadioGroup v-model="dateStaus" vertical>
                  <Radio label="1">
                    <Icon type="social-android"></Icon>
                    <span>指定日期</span>
                  </Radio>
                  <Radio class="mt30" label="2">
                    <Icon type="social-windows"></Icon>
                    <span>指定档期</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <FormItem v-if="dateStaus == 1" class="begin-left" prop="cpm">
              <DatePicker type="daterange" @on-change="dateChange" v-model="dataForm.showTime" placement="bottom-start" placeholder="指定日期"  style="width: 200px"></DatePicker>
            </FormItem>
            <div v-else class="begin-right" @click="diaresShow">
              <FormItem prop="cpm">
                <Input v-model="dataForm.name" placeholder="请选择档期" style="width: 200px" />
              </FormItem>
            </div>
          </Row>
        </Row>

        <Row class='titop'>
          <Col :span="2">有效范围</Col>
          <Col span="18" class="red">
            注：部分影院有刊例价时，有效报价为部分影院刊例价
          </Col>
        </Row>
        <Row class="detail-content">
          <Row>
            <Col :span="4">
              <FormItem prop="cpm" class="mt10">
                <RadioGroup v-model="cinemaStatus" vertical>
                  <Radio label="1">
                    <span>按平台定价等级</span>
                  </Radio>
                  <Radio class="mt30" label="2">
                    <span>按公司设置影院</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <FormItem v-if="cinemaStatus == 1" class="cinema-left" prop="cpm">
                <Input v-model="dataForm.platform.gradeCode" placeholder="请选择等级" style="width: 200px" />
            </FormItem>
            <div v-else class="cinema-right">
              <FormItem prop="cpm">
                <Input v-model="dataForm.company.companyId" placeholder="请选择公司" style="width: 200px" />
              </FormItem>
            </div>
          </Row>
        </Row>
      </div>
    </form>
    <div class="edit-button">
      <Button style="padding: 6px 40px" type="info" size="large" @click="edit('dataForm')">保存</Button>
    </div>
    <DlgEdit ref="diaries" v-if="diariesShow" v-model="diaries" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import DlgEdit from './dlgEdit.vue'

@Component({
  components: {
    DlgEdit
  }
})
export default class Main extends ViewBase {
  dataForm: any = {
    cpm: 0,
    discount: 0,
    showTime: null,
    name: '',
    platform: {
      gradeCode: '',
      hallTypeList: []
    },
    company: {
      companyId: null,
      cinemaList: []
    }
  }

  diaries: any = {
    id: '',
    name: ''
  }

  diariesShow = false
  dateStaus = '1'
  cinemaStatus = '1'
  get rule() {
    return {
      cpm: [
        { required: true, message: '不能为空', trigger: 'blur', type: 'number' }
      ],
      discount: [
        { required: true, message: '不能为空', trigger: 'blur', type: 'number' }
      ],
    }
  }

  dateChange() {

  }

  diaresShow() {
    this.diariesShow = true
    this.$nextTick(() => {
      (this.$refs.diaries as any).init()
    })
  }

  async edit(dataForm: any) {
    const volid = await (this.$refs[dataForm] as any).validate()
    if (volid) {
      return
    }
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
  padding-top: 6px;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
      width: 88px;
    }
  }
  .begin-left {
    position: absolute;
    left: calc(100% / 24 * 2);
    top: 8px;
  }
  .begin-right {
    position: absolute;
    left: calc(100% / 24 * 2);
  }
  .cinema-left {
    position: absolute;
    left: calc(100% / 24 * 3);
    top: 8px;
  }
  .cinema-right {
    position: absolute;
    left: calc(100% / 24 * 3);
  }
  .mt8 {
    margin-top: 8px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .mt20 {
    margin-top: 20px;
  }
  .mt30 {
    margin-top: 30px;
  }
}
.edit-button {
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: center;
}
</style>
