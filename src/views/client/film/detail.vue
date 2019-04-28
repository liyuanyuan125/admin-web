<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>新建影片关联</em>
      </div>
    </header>
    <Form  :model='query' :label-width='88' :rules='rules' label-position="left" class='form page detail-box' ref='dataForms'>
      <div class='titop'>申请主体</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>公司名称</div></Col>
          <Col span="8">
            <CompanyList v-model="query.companyId" @row="rowName" />
          </Col>
        </Row>
         <Row>
          <Col span="2"><div>联系人</div></Col>
          <Col span="8"><span>{{contact}}</span></Col>
        </Row>
         <Row>
          <Col span="2"><div>申请人</div></Col>
          <Col span="8"><span>{{proposer}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>凭证</div></Col>
          <Col span="8">
            <div>
              <Upload v-model="query.certificate" multiple :maxCount="5" accept="image/*"/>
            </div>
          </Col>
        </Row>
      </Row>

      <div class='titop'>关联主体</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>影片名称</div></Col>
          <Col span="8"><span></span></Col>
          <Col span="2"><div>上映日期</div></Col>
          <Col span="8"><span></span></Col>
        </Row>
        <Row>
          <Col span="2"><div>影片主图</div></Col>
          <Col span="8"><span></span></Col>
          <Col span="2"><div>影片类型</div></Col>
          <Col span="8"><span></span></Col>
        </Row>
      </Row>

      <div class='titop'>备注</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>备注</div></Col>
          <Col span="8"><span></span></Col>
        </Row>
      </Row>

      <Row>
      </Row>
    </Form>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryId } from '@/api/corpReal'
import Upload from '@/components/Upload.vue'
import { toMap } from '@/fn/array'
import CompanyList from '@/components/companyList.vue'
import { getUser } from '@/store'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')


const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

@Component({
  components: {
    Upload,
    CompanyList
  }
})
export default class Main extends ViewBase {

  contact: string = ''
  query: any = {
    companyId: null,
    movieId: null,
    certificate: [],
  }

  rules: any = [
  ]

  get proposer() {
    const name = getUser()!.name
    return name
  }

  back() {
    this.$router.go(-1)
  }

  rowName(data: any) {
    this.contact = data[0].contact || ''
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
  /deep/ .ivu-col-span-8 > div {
    padding-top: 8px;
  }
}

.upload {
  padding-bottom: 40px;
  /deep/ .uplaod-slot {
    margin-bottom: 10px;
    color: #19be6b;
  }
}

.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}

</style>
