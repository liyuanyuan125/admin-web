<template>
  <div>
    <Tabs v-model="tab" type="card">
        <TabPane v-for="item in tabList" :key="item.key" :label="item.text" ></TabPane>
    </Tabs>
    <div v-if="tab == 0">
        <div class="base-mess">
            <h2 class="title">基础信息</h2>
            <Row>
            <Col :span="6"><p><label>中文名称</label><em>{{itemList.name || '-'}}</em></p></Col>
            <Col :span="6"><p><label>英文名称</label><em>{{itemList.nameEn|| '-'}}</em></p></Col>
            <Col :span="6"><p><label>国籍</label><em>{{itemList.nationality || '-'}}</em></p></Col>
            <Col :span="6"><p><label>出生地</label><em>{{itemList.countryName || '-'}} {{itemList.provinceName}} {{itemList.cityName}}</em></p></Col>
            </Row>
            <Row>
            <Col :span="6"><p><label>出生日期</label><em>{{formatConversion(itemList.birthday) || '-'}}</em></p></Col>
            <Col :span="6"><p><label>性别</label><em v-for="it in genders" v-if="it.key == itemList.gender">{{it.text}}</em></p></Col>
            <Col :span="6"><p><label>民族</label><em>{{itemList.nation || '-'}}</em></p></Col>
            </Row>
            <Row>
            <Col :span="22"><p><label>简介</label><em class="information">{{itemList.introduction}}</em></p></Col> 
            </Row>
      </div>
      <div class="base-mess">
            <h2 class="title">扩展信息</h2>
            <Row>
              <Col :span="9">
                <p><label>影人标签</label><em>{{itemList.tip}}</em></p>
                <p>
                <label>擅长类型</label>
                <em v-if="itemList.goodMovieTypes" v-for="(it, index) in itemList.goodMovieTypes" :key="index">
                  <i v-for="v in movieTypes" :key="v.key" v-if="v.key == it">{{v.value}}</i>
                </em>
                </p>
                <p>
                  <label>主要职业</label>
                  <em v-for="(item, index) in primaryPro" :key="index">{{item}} &nbsp; </em>
                </p>
                <p>
                  <label>其他职业</label>
                  <!-- <em v-for="(item, index) in restPro" :key="index">{{item}} &nbsp; </em> -->
                </p>
              </Col>
              <Col :span="12"><img :src="itemList.headImgSmall" class="head-img" /></Col>
            </Row>
            <Row>
            <Col :span="6"><p><label>系统鲸娱指数</label><em>{{itemList.biJyIndex}}</em></p></Col>
            <Col :span="6"><p><label>调整鲸娱指数</label><em >{{itemList.jyIndex}}</em></p></Col>
            <Col :span="6"><p><label style="width: 160px">调整鲸鱼指数所占权重</label><em>{{itemList.jyIndexWeight || 0}}%</em></p></Col>
            </Row>
            <Row>
            <Col :span="22">
              <div class="cout">
                <label>评论热词</label>
                <div style="width: 80%"><em v-for="(item, index) in (itemList.tags || [])" :key="index">{{item}}<i v-if="index != itemList.tags.length-1">,</i> </em></div>
                </div>
              </Col>
            </Row>
            <Row>
                <Col :span="12">
                    <div class="table-label">
                    <div class="label">合作品牌信息</div>
                    <Table :columns="brandColumns" :data="brandData" border stripe disabled-hover>
                      <template slot="tradeCode" slot-scope="{row: {tradeCode}}">
                        <span v-for="item in brandTrades" :key="item.text" v-if="item.key == tradeCode">{{item.text}}</span>
                      </template>
                    </Table>
                    </div>
                </Col> 
            </Row>
      </div>
      <div class="base-mess">
          <h2 class="title">其他电影平台相关id</h2>
            <Row>
            <Col :span="6"><p><label>猫眼影人id</label><em>{{channeId('maoyan')}}</em></p></Col>
            <Col :span="6"><p><label>时光影人id</label><em>{{channeId('mtime')}}</em></p></Col>
            <Col :span="6"><p><label>淘票票影人id</label><em>{{channeId('taopiaopiao')}}</em></p></Col>
            <Col :span="6"><p><label>豆瓣影人id</label><em>{{channeId('douban')}}</em></p></Col>
            </Row>
            <Row>
                <Col :span="6"><p><label>票神影人id</label><em>{{channeId('piaoshen')}}</em></p></Col>
            </Row>
      </div>
      <div class="base-mess">
          <h2 class="title">社交平台账号</h2>
            <Row>
            <Col :span="6"><p><label>微博</label><em>{{channeId('weibo')}}</em></p></Col>
            <Col :span="6"><p><label>抖音</label><em>{{channeId('douyin')}}</em></p></Col>
            <Col :span="6"><p><label>小红书</label><em>{{channeId('xiaohongshu')}}</em></p></Col>
            <Col :span="6"><p><label>微信</label><em>{{channeId('wechat')}}</em></p></Col>
            </Row>
            <Row>
                <Col :span="6"><p><label>快手</label><em>{{channeId('kuaishou')}}</em></p></Col>
            </Row>
      </div>
      <div class="base-mess">
          <h2 class="title">粉丝画像信息</h2>
            <Row>
              <!-- <Col :span="6"><p><label>粉丝数:</label><em>{{readableNumber(fans.count)}}人</em></p></Col> -->
              <Col :span="12">
                <div class="cout">
                  <label>粉丝占比:</label>
                 <div><em>男性：{{fans.male || '-'}}%</em><em class="gender-woman">女性：{{fans.female || '-'}}%</em></div>
                </div>
              </Col>
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
        <Select v-model="selectImg" @on-change="selectPictures" style="width: 120px" class="select-picture">
            <Option :value="item.key" :key="item.key" v-for="item in imageTypes">{{item.text}}</option>
      </Select>
      <Table :columns="imgColumns" :data="imgList" border stripe disabled-hover>
          <template slot="url" slot-scope="{row}">
              <a :href="row.url" target="_brank">{{row.url}}</a>
          </template>
          <template slot="type" slot-scope="{row}">
              <span v-for="item in imageTypes" :key="item.key" v-if="item.key == row.type">{{item.text}}</span>
          </template>
      </Table>
    </div>
    <!-- 相关影片 -->
    <div v-if="tab == 2">
        <personMovies :id ="id" v-if="tab == 2"></personMovies>
    </div>
    <!-- 操作日志 -->
    <div v-if="tab == 3">
      <div class="base-mess logs">
        <p v-for="(item, index) in oprateList" :key="index">
          <span>{{item.user}}</span>
          <span>{{item.time}}</span>
          <span>{{item.descption}}</span>
        </p>
      </div>
      
        <!-- <Table :columns="operateColumns" :data="oprateList" border stripe disabled-hover></Table> -->
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { personDetail, log, dicItems } from '@/api/person'
import personMovies from './personMovies.vue'
import {formatConversion} from '@/util/validateRules'
import { readableNumber } from '@/util/dealData'
import { cloneDeep } from 'lodash'


@Component({
    components: {
        personMovies
    }
})
export default class Main extends ViewBase {
  @Prop({type: Number, default: 0}) id!: number // 375284
  formatConversion = formatConversion
  readableNumber = readableNumber

  tab = 0
  tabList = [
    {key: 1, text: '基本信息'},
    {key: 2, text: '影人相册'},
    {key: 3, text: '相关影片'},
    {key: 4, text: '操作日志'},
  ]

  itemList = []
  genders = []
  professionsList = []

  // 主要职业，其他职业, 职业类型
  primaryPro: any[] = []
  restPro: any[] = []
  movieTypes: any[] = []

  // 合作品牌
  brandColumns = [
    {title: '品牌分类', slot: 'tradeCode', align: 'center'},
    {title: '品牌名称', key: 'name', align: 'center'}
  ]
  brandData = []
  // 品牌分类
  brandTrades: any[] = []

  // 平台账号id
  exts: any[] = []

  // 评论热词
  hotColumns = [
    {title: '评论热词'}
  ]
  hotData = []

  // 粉丝
  fans: any = {}
  ageColumns = [
    {title: '年龄', key: 'k', align: 'center'},
    {title: '占比%', key: 'v', align: 'center'},
  ]
  ageData = []

  proColumns = [
    {title: '省份id', key: 'id', align: 'center'},
    {title: '占比%', key: 'rate', align: 'center'},
    {title: '省份名称', key: 'name', align: 'center'},
  ]
  proData = []

  ctyColumns = [
    {title: '城市id', key: 'id', align: 'center'},
    {title: '占比%', key: 'rate', align: 'center'},
    {title: '城市名称', key: 'name', align: 'center'},
  ]
  ctyData = []

  // 影人相册
  selectImg = ''
  imgColumns = [
    {slot: 'url', title: '图片地址', align: 'center'},
    {slot: 'type', title: '分类', align: 'center'},
  ]
  imgList: any[] = []
  imageTypes = []
  cloneImages: any[] = []

  oprateList = []

  mounted() {
    this.goodTypes()
    this.detailList()
  }

  async detailList() {
    try {
      const { data: {
        item, genders, status, professions, imageTypes, brandTrades
      }} = await personDetail(this.id)
      this.genders = genders || []
      this.professionsList = professions || []
      this.brandTrades = brandTrades || []
      const primaryPro: any = [] // 主要职业
      const restPro: any = []; // 其他职业(演员，编辑)
      (item.professions || []).map( (tem: any) => {
        if (tem.primary) { // 主要职业
          this.professionsList.filter( (it: any) => {
            if (it.key == tem.code) {
                primaryPro.push(it.text)
            }
          })
        } else { // 其他职业
          const ary = this.professionsList.filter( (it: any) => {
            if (it.key == tem.code) {
              restPro.push(it.text)
            }
          })
        }
      })
      this.primaryPro = primaryPro
      this.restPro = restPro
      // 平台账号id
      this.exts = item.exts || []
      // 品牌列表
      this.itemList = item || {}
      this.brandData = item.brands || []
      // 粉丝画像
      this.fans = item.fans || {}
      this.ageData = this.fans.ages
      this.proData = this.fans.provinces || []
      this.ctyData = this.fans.cities || []

      // 影人相册
      this.imgList = item.images || []
      this.cloneImages = item.images
      this.imageTypes = imageTypes
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 擅长类型
  async goodTypes() {
    try {
      const { data } = await dicItems('MOVIE_TYPE')
      this.movieTypes = data || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  selectPictures() {
    const types = this.selectImg
    const cloneList = cloneDeep(this.cloneImages)
    if (types) {
      this.imgList = cloneList.filter((item: any) => item.type == types)
    } else {
      this.imgList = this.cloneImages
    }
  }

  async handleLog() {
    try {
      const { data } = await log(this.id)
      this.oprateList = data
    } catch (ex) {
      this.handleError(ex)
    }
  }

  channeId(id: string) {
    let channelDataId: any = ''
    if (this.exts.length > 0) {
      const obj = this.exts.find((item: any) => item.channelCode == id )
      channelDataId =  obj ? obj.channelDataId : '-'
    }
    return channelDataId
  }

  @Watch('tab')
  handleTab(val: any) {
    if (val == 1) {
      this.selectImg = ''
      this.selectPictures()
    }
    if (val == 3) {
      this.handleLog()
    }
  }
}

</script>
<style lang='less' scoped>
@import './less/common.less';

.select-picture {
  width: 120px;
  margin-bottom: 15px;
}
.gender-woman {
  padding-left: 20px;
}
.information {
  width: 95%;
}
.head-img {
  width: 100px;
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
.logs {
  p {
    padding-bottom: 10px;
    span {
      padding-right: 10px;
    }
  }
}
</style>