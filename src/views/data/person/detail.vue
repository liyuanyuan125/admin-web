<template>
  <div>
      <Tabs v-model="tab" type="card">
        <TabPane v-for="item in tabList" :key="item.key" :label="item.text" ></TabPane>
    </Tabs>
    <div v-if="tab == 0">
        <div class="base-mess">
            <h2 class="title">基础信息</h2>
            <Row>
            <Col :span="6"><p><label>中文名称</label><em>{{itemList.name}}</em></p></Col>
            <Col :span="6"><p><label>英文名称</label><em>{{itemList.nameEn}}</em></p></Col>
            <Col :span="6"><p><label>国籍</label><em>{{itemList.nationality}}</em></p></Col>
            <Col :span="6"><p><label>出生地</label><em>{{itemList.provinceName}} {{itemList.cityName}}</em></p></Col>
            </Row>
            <Row>
            <Col :span="6"><p><label>出生日期</label><em>{{itemList.birthday}}</em></p></Col>
            <Col :span="6"><p><label>性别</label><em v-for="it in genders" v-if="it.key == itemList.gender">{{it.text}}</em></p></Col>
            <Col :span="6"><p><label>民族</label><em>{{itemList.nation}}</em></p></Col>
            </Row>
            <Row>
            <Col :span="12"><p><label>简介</label><em>{{itemList.introduction}}</em></p></Col> 
            </Row>
      </div>
      <div class="base-mess">
            <h2 class="title">扩展信息</h2>
            <Row>
            <Col :span="6"><p><label>影人标签</label><em>{{itemList.tip}}</em></p></Col>
            <Col :span="6"><p><label>擅长类型</label><em v-if="itemList.goodMovieTypes" v-for="(it, index) in itemList.goodMovieTypes" :key="index">{{it}}</em></p></Col>
            <Col :span="6">
              <p>
                  <label>主要职业</label>
                  <em v-for="item in primaryPro" :key="item.key">{{item.text}} &nbsp; </em>
              </p>
            </Col>
            <Col :span="6">
                <p>
                    <label>其他职业</label>
                    <em v-for="item in restPro" :key="item.key">{{item.text}} &nbsp; </em>
                </p>
            </Col>
            </Row>
            <Row>
            <Col :span="6"><p><label>系统鲸娱指数</label><em>{{itemList.jyIndex}}</em></p></Col>
            <Col :span="6"><p><label>调整鲸娱指数</label><em >{{itemList.jyIndexWeight}}</em></p></Col>
            <Col :span="6"><p><label>默认调整系数</label><em>{{itemList.jyIndex}}</em></p></Col>
            <Col :span="6"><p><label>评论热词</label><em v-for="(item, index) in (itemList.tags || [])" :key="index">{{item}}</em></p></Col>
            </Row>
            <Row>
                <Col :span="12">
                    <div class="table-label">
                    <div class="label">合作品牌信息</div>
                    <Table :columns="brandColumns" :data="brandData" border stripe disabled-hover></Table>
                    </div>
                </Col> 
            </Row>
      </div>
      <div class="base-mess">
          <h2 class="title">其他电影平台相关id</h2>
            <Row>
            <Col :span="6"><p><label>猫眼影人id</label><em>{{itemList.name}}</em></p></Col>
            <Col :span="6"><p><label>时光影人id</label><em>{{itemList.nameEn}}</em></p></Col>
            <Col :span="6"><p><label>淘票票影人id</label><em>{{itemList.nationality}}</em></p></Col>
            <Col :span="6"><p><label>豆瓣影人id</label><em>{{itemList.provinceName}} {{itemList.cityName}}</em></p></Col>
            </Row>
            <Row>
                <Col :span="6"><p><label>票神影人id</label><em>{{itemList.name}}</em></p></Col>
            </Row>
      </div>
      <div class="base-mess">
          <h2 class="title">社交平台账号</h2>
            <Row>
            <Col :span="6"><p><label>微博</label><em>{{itemList.name}}</em></p></Col>
            <Col :span="6"><p><label>抖音</label><em>{{itemList.nameEn}}</em></p></Col>
            <Col :span="6"><p><label>小红书</label><em>{{itemList.nationality}}</em></p></Col>
            <Col :span="6"><p><label>微信</label><em>{{itemList.provinceName}} {{itemList.cityName}}</em></p></Col>
            </Row>
      </div>
      <div class="base-mess">
          <h2 class="title">粉丝画像信息</h2>
            <Row>
              <Col :span="6"><p><label>粉丝数:</label><em>{{fans.count}}</em></p></Col>
              <Col :span="6"><p><label>粉丝比例:</label><em>男性：{{fans.male}}</em><em>女性：{{fans.female}}</em></p></Col>
            </Row>
            <Row>
                <Col :span="12">
                    <div class="table-label">
                    <div class="label">粉丝年龄区间:</div>
                    <Table :columns="ageColumns" :data="ageData" border stripe disabled-hover></Table>
                    </div>
                </Col> 
            </Row>
            <Row>
                <Col :span="12">
                    <div class="table-label">
                    <div class="label">粉丝省会分布:</div>
                    <Table :columns="proColumns" :data="proData" border stripe disabled-hover></Table>
                    </div>
                </Col> 
            </Row>
            <Row>
                <Col :span="12">
                    <div class="table-label">
                      <div class="label">粉丝城市分布:</div>
                      <Table :columns="ctyColumns" :data="ctyData" border stripe disabled-hover></Table>
                    </div>
                </Col> 
            </Row>
      </div>
      <div class="detail-btn">
          <Button class="btn">浏览</Button>
          <Button class="btn">返回</Button>
      </div>
    </div>
    <!-- 影人相册 -->
    <div v-if="tab == 1">
        <Select v-model="selectImg" style="width: 100px">
            <Option value="1">剧照</option>
            <Option value="2">海报</option>
            <Option value="3">工作照</option>
            <Option value="3">头像</option>
      </Select>
      <Table :columns="imgColumns" :data="imgList" border stripe disabled-hover></Table>
    </div>
    <!-- 相关影片 -->
    <div v-if="tab == 2">
        <personMovies :id ="detaiId" v-if="tab == 2"></personMovies>
    </div>
    <!-- 操作日志 -->
    <div v-if="tab == 3">
        <Table :columns="operateColumns" :data="oprateList" border stripe disabled-hover></Table>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { personDetail } from '@/api/person'
import personMovies from './personMovies.vue'


@Component({
    components: {
        personMovies
    }
})
export default class Main extends ViewBase {
  detaiId = ''

  tab = 0
  tabList = [
    {key: 1, text: '基本信息'},
    {key: 2, text: '影人相册'},
    {key: 3, text: '相关影片'},
    {key: 4, text: '操作日志'},
  ]

  itemList = []
  genders = []
  professions = []

  // 主要职业，其他职业
  primaryPro: any[] = []
  restPro: any[] = []

  // 合作品牌
  brandColumns = [
      {title: '品牌分类', key: 'id', align: 'center'},
      {title: '品牌名称', key: 'name', align: 'center'}
  ]
  brandData = []

  // 评论热词
  hotColumns = [
      {title: '评论热词'}
  ]
  hotData = []

  // 粉丝
  fans: any = {}
  ageColumns = [
      {title: '年龄', key: 'k', align: 'center'},
      {title: '占比', key: 'v', align: 'center'},
  ]
  ageData = []

  proColumns = [
      {title: '省份id', key: 'id', align: 'center'},
      {title: '占比', key: 'rate', align: 'center'},
      {title: '省份名称', key: 'name', align: 'center'},
  ]
  proData = []

  ctyColumns = [
      {title: '城市id', key: 'id', align: 'center'},
      {title: '占比', key: 'rate', align: 'center'},
      {title: '城市名称', key: 'name', align: 'center'},
  ]
  ctyData = []

  // 影人相册
  selectImg = ''
  imgColumns = [
    {key: 'imgUrl', title: '图片地址', align: 'center'},
    {key: 'type', title: '分类', align: 'center'},
  ]
  imgList = []

  // 操作日志
  operateColumns = [
    { type: 'index', align: 'center', renderHeader: (h: any, params: any) => {
        return h('span', '序号')
    }},
    { key: 'type', title: '操作类型', align: 'center'},
    { key: 'times', title: '操作时间', align: 'center'},
    { key: 'personal', title: '操作人', align: 'center'},
    { key: 'field', title: '字段', align: 'center'},
    { key: 'originalVal', title: '原值', align: 'center'},
    { key: 'newVal', title: '新值', align: 'center'},
  ]
  oprateList = []

  mounted() {
      this.detaiId = this.$route.params.id
      this.detailList()
  }

  async detailList() {
      try {
          const { data: {
              item, genders, status, professions, imageTypes
          }} = await personDetail(this.detaiId)
          this.genders = genders || []
          this.professions = professions || []

          // 自定义职业类型(主要职业和其他职业)
          item.professions = [
              {code: 'ACTOR', primary: false},
              {code: 'PRODUCER', primary: false},
              {code: 'DIRECTOR', primary: true},
              {code: 'SCRIPTWRITER', primary: true}
          ]
          const primaryPro: any = [] // 主要职业
          const restPro: any = []; // 其他职业(演员，编辑)
          (item.professions || []).map( (tem: any) => {
              if (tem.primary) { // 主要职业
               const ary = this.professions.filter( (it: any) => it.key == tem.code)
               primaryPro.push(ary)
              } else { // 其他职业
               const ary = this.professions.filter( (it: any) => it.key == tem.code)
               restPro.push(ary)
              }
          })
          this.primaryPro = primaryPro.flat()
          this.restPro = restPro.flat()
          // 品牌列表
          this.itemList = item || {}
          this.brandData = item.brands || []
          // 粉丝画像
          this.fans = item.fans || {}
          this.ageData = this.fans.age
          this.proData = this.fans.provinces
          this.ctyData = this.fans.cities

          // 影人相册
          this.imgList = imageTypes
      } catch (ex) {
          this.handleError(ex)
      }
  }
}

</script>
<style lang='less' scoped>
@import './less/common.less';
em {
  font-style: normal;
}
.table-label {
  display: -webkit-box;
  margin-bottom: 15px;
  .label {
    width: 100px;
  }
}
.detail-btn {
  text-align: center;
  .btn {
    margin-right: 20px;
  }
}
</style>