<template>
  <div>
     <Tabs v-model="tab" type="card">
        <TabPane v-for="item in tabList" :key="item.key" :label="item.text" ></TabPane>
    </Tabs>
    <!-- 基础数据 -->
    <div v-if="tab == 0">
      <div class="base-mess">
        <h2 class="title">基础信息</h2>
        <Row>
          <Col :span="6"><p><label>中文名称</label><em>xxxx</em></p></Col>
          <Col :span="6"><p><label>英文名称</label><em>xxxx</em></p></Col>
          <Col :span="6"><p><label>产地</label><em>xxxx</em></p></Col>
          <Col :span="6"><p><label>上映时间</label><em>xxxx</em></p></Col>
        </Row>
        <Row>
          <Col :span="6"><p><label>类型</label><em>xxxx</em></p></Col>
          <Col :span="12"><p><label>剧情介绍</label><em>xxxx</em></p></Col>
        </Row>
      </div>
      <div class="base-mess">
        <h2 class="title">扩展信息</h2>
        <Row>
          <Col :span="6"><p><label>搜索关键字</label><em>xxxx</em></p></Col>
          <Col :span="6"><p><label>预估票房</label><em>xxxx</em></p></Col>
          <Col :span="6"><p><label>影片类型</label><em>xxxx</em></p></Col>
          <Col :span="6"><p><label>演员</label><em>xxxx</em></p></Col>
        </Row>
        <Row>
          <Col :span="10">
            <div class="hot-word flex-box">
              <div style="width: 100px">影片评论热词</div>
              <div><Table ref="selection" :columns="columns" :data="tableList" border stripe disabled-hover></Table></div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 演员表 -->
    <div v-if="tab == 1">
      <Table :columns="actorColumns" :data="actorList" border stripe disabled-hover></Table>
    </div>
    <!-- 相关视频 -->
    <div v-if="tab == 2">
      <Table :columns="videoColumns" :data="videoList" border stripe disabled-hover></Table>
    </div>
    <!-- 相关图片 -->
    <div v-if="tab == 3">
      <Select v-model="selectImg" style="width: 100px">
        <Option value="1">剧照</option>
        <Option value="2">海报</option>
        <Option value="3">工作照</option>
      </Select>
      <Table :columns="imgColumns" :data="imgList" border stripe disabled-hover></Table>
    </div>
    <!-- 电影公司 -->
    <div v-if="tab == 4">
      <Table :columns="companyFilmColumns" :data="companyFilmList" border stripe disabled-hover></Table>
    </div>
    <!-- 操作日志 -->
    <div v-if="tab == 5">
      <Table :columns="operateColumns" :data="oprateList" border stripe disabled-hover></Table>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
  tab = 0
  tabList = [
    {key: 1, text: '基本信息'},
    {key: 2, text: '演员表'},
    {key: 3, text: '相关视频'},
    {key: 4, text: '相关图片'},
    {key: 5, text: '电影公司'},
    {key: 6, text: '操作日志'},
  ]

  // 基础信息 - 评论热词
  columns = [
    { type: 'index', title: '排序',  align: 'center'},
    { key: 'hotWord', title: '评论热词', align: 'center'}
  ]
  tableList = []

  // 演员表
  actorColumns = [
    { type: 'index', title: '排序',  align: 'center'},
    { key: 'name', title: '中文名', align: 'center'},
    { key: 'englistName', title: '英文名', align: 'center'},
    { key: 'actor', title: '角色', align: 'center'},
    { key: 'type', title: '类型', align: 'center'},
  ]
  actorList = []

  // 相关视频
  videoColumns = [
    { type: 'index', title: '排序',  align: 'center'},
    { key: 'videoName', title: '视频', align: 'center'},
    { key: 'videoType', title: '视频分类', align: 'center'},
    { key: 'updateTime', title: '更新时间', align: 'center'},
  ]
  videoList = []

  // 相关图片
  imgColumns = [
    {key: 'imgUrl', title: '图片地址', align: 'center'},
    {key: 'type', title: '分类', align: 'center'},
  ]
  imgList = []
  selectImg = ''

  // 电影公司
  companyFilmColumns = [
    { type: 'index', align: 'center'},
    { key: 'type', title: '公司类型', align: 'center'},
    { key: 'name', title: '公司中文名', align: 'center'},
    { key: 'englistName', title: '公司外文名', align: 'center'},
  ]
  companyFilmList = []

  // 操作日志
  operateColumns = [
    { type: 'index', align: 'center'},
    { key: 'type', title: '操作类型', align: 'center'},
    { key: 'times', title: '操作时间', align: 'center'},
    { key: 'personal', title: '操作人', align: 'center'},
    { key: 'field', title: '字段', align: 'center'},
    { key: 'originalVal', title: '原值', align: 'center'},
    { key: 'newVal', title: '新值', align: 'center'},
  ]
  oprateList = []
}

</script>
<style lang='less' scoped>
em {
  font-style: normal;
}
.base-mess {
  font-size: 14px;
  border: solid 1px #ededed;
  padding: 10px 15px;
  margin-bottom: 15px;
  .title {
    font-size: 14px;
    padding-bottom: 20px;
  }
  .ivu-col {
    p {
      padding-bottom: 15px;
      display: flex;
      label {
        display: block;
        width: 90px;
      }
    }
  }
  .hot-word {
    display: -webkit-box;
  }
}
</style>