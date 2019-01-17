<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em>计划管理 - 计划详情</em>
      </div>
    </header>

    <div class="detail-box">
      <div class='titop'>基础信息</div>
      <div class="detail-header">
        <Row>
          <Row>
            <Col span="2"><div>计划名称</div></Col>
            <Col span="8"><span>{{detail.name}}</span></Col>
            <Col span="2"><div>计划ID</div></Col>
            <Col span="8"><span>{{detail.calendarId}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>投放排期</div></Col>
            <Col span="8"><span>{{format.time}}</span></Col>
            <Col span="2"><div>投放周期</div></Col>
            <Col span="8"><span>{{detail.cycle}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>广告片</div></Col>
            <Col span="8">
              <router-link v-if="detail.videoName" :to="{name: 'ggtising-plan-cinema', params: {id: $route.params.id}}">
                <span style="color: #2d8cf0">{{detail.videoName}}</span>
              </router-link>
              <span v-else></span>
            </Col>
            <Col span="2"><div>规格/时长</div></Col>
            <Col span="8"><span>{{detail.calendarId}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>投放类型</div></Col>
            <Col span="8"><span>{{detail.contractName}}</span></Col>
            <Col span="2"><div>预算/曝光</div></Col>
            <Col span="8"><span>{{detail.calendarId}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>定向类型</div></Col>
            <Col span="8"><span>{{detail.contractName}}</span></Col>
            <Col span="2"><div>投放方案</div></Col>
            <Col span="8"><span>{{detail.calendarId}}</span></Col>
          </Row>
          <Row>
            <Col span="2"><div>客户</div></Col>
            <Col span="8"><span>{{detail.contractName}}</span></Col>
            <Col span="2"><div>创建时间</div></Col>
            <Col span="8"><span>{{detail.calendarId}}</span></Col>
          </Row>
        </Row>
      </div>

      <div class='titop'>投放影院</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>分布统计</div></Col>
          <Col span="8"><span>{{detail.companyBContact}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>影院列表</div></Col>
          <Col span="20">
            <Row>
              <Table :columns="columns" :data="tableData"
              border stripe disabled-hover size="small" class="table"></Table>
            </Row>
          </Col>
        </Row>
      </Row>

      <div class='titop'>投放人群</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>观影人群性别</div></Col>
          <Col span="8"><span>{{detail.accountBank}}</span></Col>
          <Col span="2"><div>观影人群年龄</div></Col>
          <Col span="8"><span>{{detail.accountName}}</span></Col>
        </Row>
        <Row>
          <Col span="2"><div>观影人群偏好</div></Col>
          <Col span="8"><span>{{detail.accountNumber}}</span></Col>
        </Row>
      </Row>

      <div class='titop'>投放影片</div>
      <Row>
        
      </Row>

      <div class='titop'>操作记录</div>
      <Row class="detail-content">
        <Row>
          <Col span="2"><div>签订人</div></Col>
          <Col span="8"><span>{{detail.signingUserName}}</span></Col>
          <Col span="2"><div>跟进人</div></Col>
          <Col span="8"><span>{{detail.followUserName}}</span></Col>
        </Row>
      </Row>
    </div>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch , Mixins  } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryList , queryId , zuofei } from '@/api/list'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice , clean } from '@/fn/object'
import { queryDetail } from '@/api/ggplan'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormatDate = 'YYYY/MM/DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

const defQuery = {
}

const dataForm = {
  refuseReason: '',
  approveStatus: 2
}

@Component
export default class Main extends ViewBase {
  detail: any = {}

  mounted() {
    this.doSearch()
  }

  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    // const attachments = (this.detail || []).map((it: any) => {
    //   return {
    //     ...it,
    //   }
    // })
    return []
  }

  get format() {
    const start = moment(this.detail.beginDate).format(timeFormat)
    const end = moment(this.detail.endDate).format(timeFormat)
    return {
      time: start ? `${start}~${end}` : '',
    }
  }

  columns = [
    { title: '序号', key: 'id', align: 'center' },
    { title: '附件', key: 'name', align: 'center' },
    {
      title: '上传时间',
      key: 'uploadTime',
      align: 'center',
      render: (hh: any, { row: { uploadTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(uploadTime).format(timeFormatDate)
        // console.log(html)
        return uploadTime == null ? <span class='datetime' v-html='-'></span> : <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '上传人', key: 'uploadUserName', align: 'center' },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { approveStatus, statusText, id }, row }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
          return <div class='row-acts'>
          <a class="operation" href="" download={row.name}>下载</a>
        </div>
        
        /* tslint:enable */
      }
    }
  ]

  async doSearch() {
     (this.$Spin as any).show()
    try {
      const { data } = await queryDetail(this.$route.params.id)
      this.detail = data
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 1000)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    } finally {
    }
  }

  // 返回
  back() {
    this.$router.go(-1)
  }

  // 编辑列表页面
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
.titop {
  line-height: 28px;
  color: rgb(61, 156, 235);
  font-size: 16px;
}
</style>
