<template>
  <div class="page">
    <div class="detail-box">
      <div class="file-detail-header">
      <dl>
        <dt style="line-height: 32px">电影名称:</dt>
        <dd style="line-height: 32px">{{detil.name}} <Button icon="md-return-left" style="float:right" @click="goback">返回列表</Button> </dd>
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
          <span class="performers" v-for="key in detil.performers" :key="key">{{key}}</span>
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
        <dd>{{detil.rating}}分</dd>
      </dl>
      <dl>
        <dt>参演人数</dt>
        <dd>{{detil.personCount}}人</dd>
      </dl>
      <dl>
        <dt>影片类型</dt>
        <dd><span class="type" v-for="key in detil.type" :key="key">{{key}}</span></dd>
      </dl>
      <dl>
        <dt>产地</dt>
        <dd>{{detil.fromPlace}}</dd>
      </dl>
      <dl>
        <dt>系统分类</dt>
        <dd><PoptipSelect v-model="value" @change="change" /></dd>
      </dl>
      <dl>
        <dt>MtimeID</dt>
        <dd>{{detil.mtimeId}}</dd>
      </dl>
      <dl>
        <dt>主图</dt>
        <dd><ImgModel v-if="show" :uploadList = "detil.mainPicUrl" :type = 1 /></dd>
      </dl>
      <dl>
        <dt>剧情照片</dt>
        <dd>
          <div>
            <div>
              <ImgModel v-if="show" :uploadList = "detil.plotPicUrl" :type = 2 />
            </div>
          </div>
        </dd>
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
import PoptipSelect from '@/components/PoptipSelect.vue'
import View from '@/util/View'
import moment from 'moment'
import { toThousands } from '@/util/dealData'
import { updateStatus } from '@/api/film'
import { toMap } from '@/fn/array'
import ImgModel from './imgModel.vue'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormat = 'YYYY/MM/DD'

@Component({
  components: {
    PoptipSelect,
    ImgModel
  }
})
export default class Main extends View {
  id: any = null
  detil: any = {}
  value: any = {}
  categoryList = []
  show = false

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
        text: this.detil.categoryName,
        value: this.detil.categoryCode,
        list: this.detil.categoryList,
      }
      this.show = true
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

  async change({ id, value, loading, reset }: any) {
    try {
      loading()
      await updateStatus(id, value)
      this.value.value = value
      this.value.text = this.cachedMap.categoryList[value]
    } catch (ex) {
      this.handleError(ex)
    } finally {
      reset()
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
      .performers {
        margin-left: 4px;
      }
      .performers:not(:last-child)::after {
        content: ',';
      }
      .type:not(:last-child)::after {
        content: '/';
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
