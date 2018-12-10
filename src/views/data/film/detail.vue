<template>
  <div class="page">
    <div class="detail-box">
      <div class="file-detail-header">
      <dl>
        <dt>电影名称:</dt>
        <dd>{{detil.name}} <Button type="primary" style="float:right" @click="goback">返回</Button> </dd>
      </dl>
    </div>
    <div class="file-detail-center">
      <dl>
        <dt>英文名称</dt>
        <dd>{{detil.englishName}}</dd>
      </dl>
      <dl>
        <dt>标语</dt>
        <dd>{{detil.slogan}}</dd>
      </dl>
      <dl>
        <dt>简介</dt>
        <dd>{{detil.summary}}</dd>
      </dl>
      <dl>
        <dt>导演</dt>
        <dd>{{detil.director}}</dd>
      </dl>
      <dl>
        <dt>演员</dt>
        <dd>
          <span v-for="key in detil.performers" :key="key">{{key}}</span>
        </dd>
      </dl>
      <dl>
        <dt>片长</dt>
        <dd>{{detil.length}}</dd>
      </dl>
      <dl>
        <dt>票房</dt>
        <dd>今日({{todayBox}})/累计({{sumBox}})</dd>
      </dl>
      <dl>
        <dt>上映时间</dt>
        <dd>{{openTime}}</dd>
      </dl>
      <dl>
        <dt>评分</dt>
        <dd>{{detil.rating}}</dd>
      </dl>
      <dl>
        <dt>播放次数</dt>
        <dd>{{detil.personCount}}</dd>
      </dl>
      <dl>
        <dt>影片类型</dt>
        <dd><span v-for="key in detil.type" :key="key">{{key}}</span></dd>
      </dl>
      <dl>
        <dt>产地</dt>
        <dd>{{detil.fromPlace}}</dd>
      </dl>
      <dl>
        <dt>系统分类</dt>
        <dd><PartPoptipEdit v-model="value" @change="change" /></dd>
      </dl>
      <dl>
        <dt>MtimeID</dt>
        <dd>{{detil.mtimeId}}</dd>
      </dl>
      <dl>
        <dt>主图</dt>
        <dd><img width="150px" :src="detil.mainPicUrl" /></dd>
      </dl>
      <dl>
        <dt>剧情照片</dt>
        <dd><img v-for="key in detil.plotPicUrl" :key="key" :src="key" width="150px" style="margin-right:20px" /></dd>
      </dl>
      <dl>
        <dt>3D</dt>
        <dd>{{detil.support3DString}}</dd>
      </dl>
      <dl>
        <dt>DMAX</dt>
        <dd>{{detil.dmaxString}}</dd>
      </dl>
      <dl>
        <dt>EggHunt</dt>
        <dd>{{detil.eggHuntString}}</dd>
      </dl>
      <dl>
        <dt>Filter</dt>
        <dd>{{detil.filterString}}</dd>
      </dl>
      <dl>
        <dt>IMAX</dt>
        <dd>{{detil.imaxString}}</dd>
      </dl>
      <dl>
        <dt>IMAX3D</dt>
        <dd>{{detil.imax3DString}}</dd>
      </dl>
      <dl>
        <dt>Ticket</dt>
        <dd>{{detil.ticketString}}</dd>
      </dl>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component } from 'vue-property-decorator'
import { getIdDetal } from '@/api/film'
import PartPoptipEdit from '../cinema/partPoptipEdit.vue'
import View from '@/util/View'
import moment from 'moment'
import { toThousands } from '@/util/dealData'
import { updateStatus } from '@/api/film'
import { toMap } from '@/fn/array'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormat = 'YYYY-MM-DD/HH:mm:ss'

@Component({
  components: {
    PartPoptipEdit
  }
})
export default class Main extends View {
  id: any = null
  detil: any = {}
  value: any = {}
  categoryList = []
  created() {
    if (!sessionStorage.getItem('film-id')) {
      sessionStorage.setItem('film-id', JSON.stringify(this.$route.params))
    }
    const id: any = sessionStorage.getItem('film-id')
    this.id = this.$route.params.id ? this.$route.params : JSON.parse(id)
    this.detils()
  }

  get openTime() {
    return moment(this.detil.openTime).format(timeFormat)
  }

  get todayBox() {
    return toThousands(this.detil.todayBox)
  }

  get sumBox() {
    return toThousands(this.detil.sumBox)
  }

  async detils() {
    try {
       const res = await getIdDetal(this.id)
       this.detil = res.data
       this.value = {
          id: this.id.id,
          key: this.detil.categoryCode,
          text: this.detil.categoryName,
          list: this.detil.categoryList,
       }
      } catch (ex) {
        this.handleError(ex)
    }
  }

  get cachedMap() {
    return {
      categoryList: makeMap(this.detil.categoryList)
    }
  }

  goback() {
    this.$router.push({ name: 'data-film' })
  }

  async change({ id, key: newStatus, showLoading, hideLoading }: any) {
    if (this.detil && this.detil.categoryCode != newStatus) {
      try {
        showLoading()
        await updateStatus(id, newStatus)
        this.value.text = this.cachedMap.categoryList[newStatus]
        this.value.key = newStatus
        hideLoading()
      } catch (ex) {
        this.handleError(ex)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  margin: -10px;
  background: #ecf0f4;
}
.detail-box {
  padding: 10px 0;
}
.file-detail-header,.file-detail-center {
  background: #fff;
  margin-left: 14px;
  margin-right: 14px;
  dl {
    padding: 14px 14px;
    display: flex;
    dd {
      margin-left: 30px;
      flex: 1;
      span:not(:last-child)::after {
        content: ',';
      }
    }
    dt {
      width: 60px;
      text-align: right;
    }
  }
}
.file-detail-center {
  margin-top: 14px;
}
</style>
