<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回列表</Button>
      <div class="flex-1">
        <em style="margin-left:5px">影片详情</em>
      </div>
    </header>
    <div class="detail-box">
      <div class="file-detail-header">
      <dl>
        <dt>电影名称:</dt>
        <dd>{{detil.name}}</dd>
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
  nextId: any = null
  detil: any = {}
  value: any = {}
  categoryList = []
  show = false

  created() {
    if (!sessionStorage.getItem('film-id')) {
      sessionStorage.setItem('film-id', JSON.stringify(this.$route.params))
    }
    const id: any = sessionStorage.getItem('film-id')
    this.nextId = this.$route.params.id ? this.$route.params : JSON.parse(id)
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
      const res = await getIdDetal(this.nextId)
      this.detil = res.data
      this.value = {
        id: this.nextId.id,
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

  back() {
    this.$router.go(-1)
  }

  async change({ id, value, showLoading, hideLoading }: any) {
    try {
      showLoading()
      await updateStatus(id, value)
      this.value.value = value
      this.value.text = this.cachedMap.categoryList[value]
    } catch (ex) {
      this.handleError(ex)
    } finally {
      hideLoading()
    }
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

.detail-box {
  padding-top: 10px;
  border: 1px solid #dcdee2;
}
.file-detail-header,.file-detail-center {
  background: #fff;
  margin-left: 14px;
  margin-right: 14px;
  dl {
    padding: 10px 14px;
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
