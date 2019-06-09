<template>
  <div>
      <form class="select-form" @submit.prevent="search">
          <LazyInput v-model="query.govld" style="width: 200px;" placeholder="请输入专资id" />
          <LazyInput v-model="query.name" style="width: 200px" placeholder="请输入专资id" />
          <DatePicker type="year" @on-change="handleChange"  format="yyyy"  placeholder="上映年份" style="width: 200px"></DatePicker>
      </form>
      <Table :columns="filmColumns" :data="filmList" border stripe disabled-hover></Table>
      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
            show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
            @on-change="page => query.pageIndex = page"
            @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Prop, Watch, Mixins} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { clean } from '@/fn/object'
import { personMovies } from '@/api/person'

@Component
export default class Main extends Mixins(ViewBase, UrlManager) {
    @Prop({type: String}) id!: any
    total = 0
    defQuery = {
        govld: '',
        name: '',
        year: '',
        pageIndex: 1,
        pageSize: 20,
    }

    oldQuery: any = {}
    query: any = {}

    filmColumns = [
        { type: 'index', width: 60, align: 'center', renderHeader: (h: any, params: any) => {
            return h('span', '序号')
        }},
        { title: '影片名称', key: 'name', align: 'center'},
        { title: '影片专资id', key: 'govld', align: 'center'},
        { title: '上映年份', key: 'year', align: 'center'},
        { title: '代表作品', key: '', align: 'center'},
    ]
    filmList = []

    mounted() {
        this.list()
    }
    async list() {
        this.oldQuery = { ...this.query }
        this.updateUrl()
        const query = clean({ ...this.query })
        try {
            const { data: {items, totalCount}} = await personMovies(this.id, query)
            this.filmList = items || []
            this.total = totalCount
        } catch (ex) {
            this.handleError(ex)
        }
    }
    handleChange(val: any) {
        this.query.pageIndex = 1
        this.query.year = val
        this.list()
    }
    @Watch('query', { deep: true })
    watchQuery() {
        if (this.query.pageIndex == this.oldQuery.pageIndex) {
          this.query.pageIndex = 1
        }
        this.list()
    }
}

</script>
<style lang='less' scoped>
.select-form {
  padding: 5px 0 15px;
  /deep/ .ivu-input-wrapper {
    margin-right: 15px;
  }
}
</style>