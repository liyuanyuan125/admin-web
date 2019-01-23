<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <CinemaChainSelect v-model="chainId"/>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
      </form>
      <div class="acts">
        <Button type="success" :to="{ name: 'resource-management-edit' }">新建刊例价</Button>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'

@Component({
  components: {
    CinemaChainSelect
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery: any = {
    chainId: 0,
    provinceId: 0,
    cityId: 0,
    countryId: 0,
    cinemaId: 0,
    hallId: 0,
    year: 0,
    month: 1,
  }

  query: any = {}

  resetToday() {
    const today = new Date
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    this.defQuery.year = this.query.year = year
    this.defQuery.month = this.query.month = month
  }

  mounted() {
    this.updateQueryByParam()
    this.resetToday()
  }
}
</script>

<style lang="less" scoped>
.page {
  min-height: 600px;
}
.calendar {
  position: relative;
  /deep/ .ivu-select-dropdown {
    left: 10px !important;
    top: 20px !important;
  }
}
</style>
