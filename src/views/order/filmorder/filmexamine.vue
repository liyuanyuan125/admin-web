<template>
  <div class='page'>
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
    </header>
    <div style="padding: 15px;">
        <div class='title'>订单基本信息</div>
        <div class='bos'>
          <Row>
            <Col :span='8'>申请单编号：{{list.id}}</Col>
            <Col :span='8'>公司id：{{list.companyId}}</Col>
            <Col :span='8'>公司名称：{{list.companyName}}</Col>
          </Row>
          <Row>
            <Col :span='12'>项目名称：{{list.projectName}}</Col>
            <Col :span='12'>推广品牌：{{list.brandName}}</Col>
          </Row>
          <Row>
            <Col>推广内容：{{list.message}}</Col>
          </Row>
          <Row>
            <Col :span='3'>影片资源要求:</Col>
            <Col :span='9' v-if='list.movieResource && list.movieResource.material.need == true'>授权海报</Col>
            <Col :span='2' v-if='list.movieResource && list.movieResource.coupon.need == true'>电子券</Col>
            <Col :span='9' v-if='list.movieResource && list.movieResource.coupon.need == true'>数量：{{list.movieResource.coupon.count}}</Col>
          </Row>
          <Row>
            <Col :span='3'>品牌方线上资源:</Col>
            <Col :span='5'><span v-for='(it , index) in list.channelCodeList' :key='index' v-if='it.key == list.brandResource.onlines[0].channelCode'>{{it.text}}</span></Col>
          </Row>
          <Row>
            <Col :span='3'>品牌方线下资源:</Col>
            <Col :span='5'><span v-for='(it , index) in list.offlineResourceTypeList' :key='index' v-if='it.key == list.brandResource.offlines[0].channelCode'>{{it.text}}</span></Col>
          </Row>
        </div>
        <div v-if='$route.params.status == 1' class='title'>审核意见</div>
        <div v-if='$route.params.status == 1' style="border: 1px solid #ccc; padding: 15px;">
          <Form ref="dataForm" :model="dataForm"  label-position="left" :label-width="100">
            <FormItem label="审核意见" prop="status">
              <RadioGroup v-model='dataForm.status'>
                <Radio v-for="it in approveStatusList"   :key="it.key" :value="it.key" :label="it.key">{{it.text}}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem  label="备注" prop="reason">
              <Input style="width:240px" v-model="dataForm.refuseReason"></Input>
            </FormItem>
          </Form>
          <Button style='margin-left:20px;' type="primary"  @click="change()">提交</Button>
          <Button style='margin-left:20px;' @click="back">取消</Button>
        </div>
        <div v-if='$route.params.status == 0' class='title'>图片视频类物料</div>
        <div v-if='$route.params.status == 0' class='bos'>
          <Row>物料下载地址： <span>{{detailList.material.url}}</span></Row>
          <Row>资源使用说明：<span>{{detailList.material.description}}</span></Row>
        </div>
        <!-- 电子券资源 -->
        <div v-if='$route.params.status == 0' class='title'>电子券资源</div>
        <div v-if='$route.params.status == 0' class='bos'>
          <div style='display: flex'>
            <span>电子券列表：</span>
            <Table style='width: 430px' :columns="ticketcolumns" :data='ticketlist' border stripe disabled-hover size="small" class="table">
            </Table>
          </div>
          <Row>资源使用说明: <span>{{description}}</span></Row>
        </div>
        <div v-if='$route.params.status == 0' class='title'>效果图</div>
        <div v-if='$route.params.status == 0' class='bos imgs'>
          <img :src="list.reportImages" alt="">
        </div>
        <!-- 操作日志 -->
        <div v-if='$route.params.status == 0' class='title'>操作日志</div>
        <Table v-if='$route.params.status == 0' :columns="logcolumns" :data='loglist' border stripe disabled-hover size="small" class="table">
        </Table>
    </div>

  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import moment from 'moment'

import {
  itemlist, changestatus, movielist
} from '@/api/filmorder'
import { moviedetail } from '@/api/resourceFilm'
import EditDialog, { Field } from '@/components/editDialog'
import UploadButton, { SuccessEvent } from '@/components/UploadButton.vue'

const timeFormat = 'YYYY-MM-DD HH:mm:ss'



const dataForm = {
  status: 1
}

@Component({
  components: {
    UploadButton,
  }
})
export default class Main extends ViewBase {
  query: any = {
    fruit: [],
  }

  list: any = {}
  detailList: any = {}
  // 操作日志
  loglist: any = []
  ticketlist: any = []
  description: string = ''
  approveStatusList: any = [
    {
      key: 2,
      text: '审核通过'
    },
    {
      key: 5,
      text: '审核不通过'
    }
  ]

    // 操作日志
  logcolumns = [
    { title: '序号',  key: 'id', align: 'center' },
    { title: '操作类型', key: 'email', align: 'center' },
    { title: '操作时间', width: 70, key: 'companyName', align: 'center' },
    { title: '操作人', key: 'companyName', align: 'center' },
    { title: '字段',  key: 'companyName', align: 'center' },
    { title: '原值',  key: 'companyName', align: 'center' },
    { title: '新值',  key: 'companyName', align: 'center' },
  ]

  ticketcolumns = [
    { title: '序号',  key: 'code', align: 'center' },
    { title: '票券名称',  key: 'name', align: 'center' },
    { title: '票券编码',  key: 'cooperationId', align: 'center' },
  ]

  dataForm: any = { ...dataForm }

  mounted() {
    this.doSearch()
  }

  async doSearch() {
    try {
        // 订单列表
      const { data } = await itemlist(this.$route.params.id)
      this.list = data
      if (this.$route.params.status == '1') {
        return
      }
      const datas = await movielist(data.movieId)
      this.detailList = datas.data
      if (datas.data.coupon) {
        this.ticketlist = (datas.data.coupon.batches || []).length > 0 ? datas.data.coupon.batches[0].items : []
      }
      if (datas.data.coupon && datas.data.coupon.description) {
        this.description = datas.data.coupon.description
      }
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  async change() {
    try {
      const datas = await changestatus(this.$route.params.id , this.dataForm)
      this.$router.go(-1)
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }


  back() {
    this.$router.go(-1)
  }

}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.page {
  font-size: 14px;
  line-height: 40px;
}
.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  padding-left: 12px;
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}
.title {
  font-size: 16px;
  color: @c-base;
  line-height: 40px;
}
.bos {
  border: 1px solid #ccc;
  padding: 15px;
}
.imgs {
  img {
    width: 150px;
    height: 200px;
    display: inline-block;
    margin-left: 10px;
  }
}
.row-li {
  line-height: 40px;
  font-size: 14px;
}
/deep/ .ivu-form .ivu-form-item-label {
  font-size: 14px;
}
</style>
