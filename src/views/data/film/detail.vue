<template>
  <div>
     <Tabs v-model="tab" type="card">
        <TabPane v-for="item in tabList" :key="item.key" :label="item.text" ></TabPane>
    </Tabs>
    <!-- 基础数据 -->
    <div v-if="tab == 0">
      <div class="base-mess">
        <h2 class="title">基础信息</h2>
        <Row class="row-flex">
          <Col :span="6"><p><label>中文名称</label><em>{{items.name}}</em></p></Col>
          <Col :span="6"><p><label>英文名称</label><em>{{items.englishName}}</em></p></Col>
          <Col :span="6"><p><label>产地</label><em>{{habitatCounties}}</em></p></Col>
          <Col :span="6"><p><label>上映时间</label><em>{{formatConversion(items.releaseDate)}}</em></p></Col>
        </Row>
        <Row>
          <Col :span="6">
          <div class="flex-box film-types">
            <label >类型</label>
            <em class="item-type">{{types}}</em>
          </div>
          </Col>
        </Row>
        <Row >
          <Col :span="22" class="flex-box"><label>剧情介绍</label><em class="information" >{{items.summary}}</em></Col>
        </Row>
      </div>
      <div class="base-mess">
        <h2 class="title">扩展信息</h2>
        <Row>
          <Col :span="6">
          <p><label>搜索关键字</label> <em>{{searchKeyWord}}</em> </p>
          </Col>
          <Col :span="6"><p><label>预估票房</label><em>{{items.customPredict || '-'}}</em></p></Col>
          <Col :span="6"><p><label>影片分类</label><em>{{items.categoryName}}</em></p></Col>
          <Col :span="6"><p><label>演员阵容</label><em>{{items.customCelebrityRating}}</em></p></Col>
        </Row>
        <Row>
           <Col :span="22">
           <div class="flex-box film-types">
             <label>演员</label>
             <em class="item-type">{{castsList}}</em>
            </div>
           </Col>
        </Row>
        <Row>
          <Col :span="22">
            <p>
              <label>影片评论热词</label>
              <em>{{customTag}}</em>
            </p>
          </Col>
        </Row>
        <Row>
          <Col :span="6"><p><label>系统鲸娱指数</label><em>{{items.jyIndex || '-'}}</em></p></Col>
          <Col :span="6"><p><label>调整鲸娱指数</label><em>{{items.customJyIndex}}</em></p></Col>
          <Col :span="6"><p><label>指数所占权重</label><em>{{items.customJyIndexRate}}</em></p></Col>
        </Row>
      </div>
    </div>
    <!-- 演员表 -->
    <div v-if="tab == 1">
      <Table :columns="actorColumns" :data="actorList" border stripe disabled-hover>
        <template slot="role" slot-scope="{row}">
          <span v-for="(item, index) in (row.occupations || [])" :key="index" >
            {{item.role}}
            <i v-if="index != (row.occupations || []).length -1">,</i></span>
        </template>
        <template slot="actor" slot-scope="{row}">
          <span v-for="(item, index) in (row.occupations || [])" :key="index" >
             <em v-for="ro in occupationType" :key="ro.key" v-if="ro.key == item.occupationCode">{{ro.value}}</em>
            <i v-if="index != (row.occupations || []).length -1">,</i></span>
        </template>
      </Table>
    </div>
    <!-- 相关视频 -->
    <div v-if="tab == 2">
      <div class="base-mess logs">
        <p v-for="(item, index) in (items.trailers || [])" :key="index">
           <a :href="item" target="_brank">{{item}}</a>
        </p>
      </div>
    </div>
    <!-- 相关图片 -->
    <div v-if="tab == 3">
       <div class="base-mess logs">
         <ul class="imgs-list">
           <li v-for="(item, index) in (items.plotPics || [])" :key="index">
             <a :href="item" target="_brank"><img :src="item" width="150" /></a>
           </li>
         </ul>
      </div>
    </div>
    <!-- 电影公司 -->
    <div v-if="tab == 4">
      <Table :columns="companyFilmColumns" :data="companyFilmList" border stripe disabled-hover></Table>
    </div>
    <!-- 操作日志 -->
    <div v-if="tab == 5">
      <div class="base-mess logs">
        <p v-for="(item, index) in (items.logList || [])" :key="index">
          <span>{{item.user}}</span>
          <span>{{item.time}}</span>
          <span>{{item.descption}}</span>
        </p>
        <div class="text-align" v-if="(items.logList || []).length == 0"> 暂无日志</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { movieDetail } from '@/api/film-ed'
import {dicItems} from '@/api/person'
import {formatConversion} from '@/util/validateRules'
import { map } from 'lodash'




@Component
export default class Main extends ViewBase {
  @Prop({type: Number, default: 0}) id!: number

  items: any = {}
  formatConversion = formatConversion

  tab = 0
  tabList = [
    {key: 1, text: '基本信息'},
    {key: 2, text: '演员表'},
    {key: 3, text: '相关视频'},
    {key: 4, text: '相关图片'},
    {key: 5, text: '电影公司'},
    {key: 6, text: '操作日志'},
  ]

  // 演员表
  actorColumns = [
    { type: 'index', title: '排序',  align: 'center'},
    { key: 'name', title: '中文名', align: 'center'},
    { slot: 'role', title: '饰演角色', align: 'center'},
    { slot: 'actor', title: '类型', align: 'center'},
  ]
  actorList = []
  // 演员类型
  occupationType: any[] = []

  // 电影公司
  companyFilmColumns = [
    { type: 'index', title: '序号', align: 'center'},
    { key: 'channelCode', title: '公司类型', align: 'center'},
    { key: 'name', title: '公司中文名', align: 'center'},
  ]
  companyFilmList = []

  // 演员阵容
  get castsList() {
    const casts = this.items.casts || []
    const names = map(casts, 'name').join() || '-'
    return names
  }
  // 影片类型
  get types() {
    const names = (this.items.types || []).join() || '-'
    return names
  }
  // 产地
  get habitatCounties() {
    const countries = (this.items.countries || []).join('/') || '-'
    return countries
  }
  // 影片评论热词
  get customTag() {
    const tags = (this.items.customTags || []).join() || '-'
    return tags
  }
  // 搜索关键字
  get searchKeyWord() {
    const keyWords = (this.items.customSearchKeywords || []).join() || '-'
    return keyWords
  }


  mounted() {
    this.handleOccupation()
    this.queryList()
  }
  async queryList() {
    try {
      const { data } = await movieDetail(this.id)
      this.items = data || {}
      // 演员表
      this.actorList = data.celebrities || []
      // 电影公司
      this.companyFilmList = data.companies || []
    } catch (ex) {
      this.handleError(ex)
    }
  }
  // 演员职业
  async handleOccupation() {
    try {
      const { data } = await dicItems('MOVIE_OCCUPATION_TYPE')
      this.occupationType = data
    } catch (ex) {
      this.handleError(ex)
    }
  }
}

</script>
<style lang='less' scoped>
.text-align {
  text-align: center;
}
.flex-box {
  display: flex;
}
.imgs-list {
  display: flex;
  flex-wrap: wrap;
  li {
    list-style: none;
    padding: 10px;
  }
}
.film-types {
  padding-bottom: 15px;
  label {
    display: inline-block;
    width: 100px;
  }
  .item-type {
    width: 90%;
  }
}
.information {
  width: 85%;
  padding-left: 25px;
  text-align: justify;
}
em {
  font-style: normal;
}
.base-mess {
  font-size: 14px;
  border: solid 1px #ededed;
  padding: 15px;
  margin-bottom: 15px;
  background: #fff;
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
.logs {
  p {
    padding-bottom: 10px;
    span {
      padding-right: 10px;
    }
  }
}
</style>