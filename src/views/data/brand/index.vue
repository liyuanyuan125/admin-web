<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          :to="{ name: 'data-brand-brandedit' }"
        >新建</Button>
      </template>

      <template slot="keyWords" slot-scope="{ row: { keyWords } }">
        <div class="keyWords">
         <span v-if="keyWords">{{keyWords.join(';')}}</span>
        </div>
      </template>

  
      <template slot="id" slot-scope="{ row: { id } }">
        <router-link :to="{ name: 'data-brand-brandetail', params: { brandId: id } }">
           {{id}}</router-link>
      </template>

      <template slot="platform" slot-scope="{ row: { status, id } }">
        <div class="keyWords">
         <router-link v-if="status == 1" :to="{ name: 'data-brand-platformdetail', params: { brandId: id} }">
           查看媒体平台</router-link>
         <router-link v-if="status == 1 || status == 2" :to="{ name: 'data-brand-platformedit', params: { brandId: id} }">
           编辑媒体平台</router-link>
        </div>
      </template>

      <template slot="shop" slot-scope="{ row: { status, id } }">
        <div class="keyWords">
          <router-link v-if="status == 1" :to="{ name: 'data-brand-shopdetail', params: { brandId: id} }">查看门店</router-link>
          <router-link v-if="status == 1 || status == 2" :to="{ name: 'data-brand-shopedit', params: { brandId: id} }">编辑门店</router-link>
        </div>
      </template>

      <template slot="product" slot-scope="{ row: { status, id } }">
        <div class="keyWords">
          <router-link v-if="status == 1" :to="{ name: 'data-brand-product-view-list',  params: { brandId: id } }">查看产品</router-link>
          <router-link v-if="status == 1 || status == 2" :to="{ name: 'data-brand-product-modify-list',  params: { brandId: id } }">编辑产品</router-link>
        </div>
      </template>

      <template slot="status" slot-scope="{ row }">
        <div class="keyWords">
         <a @click="start(row)" v-if="row.status == 1">禁用</a>
         <a @click="start(row)" v-if="row.status == 2">启用</a>
        </div>
      </template>

      <template slot="action" slot-scope="{ row }">
        <div class="row-acts">
          <a @click="start(row)" v-if="row.status == 1">禁用</a>
          <a @click="start(row)" v-if="row.status == 2">启用</a>
          <router-link @click="start(row)" v-if="row.status == 1"
            :to="{ name: 'data-brand-brandedit', params: {id: row.id} }">
            编辑</router-link>
        </div>
      </template>
    </ListPage>
  <Start @done='uplist' ref="start"></Start>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { brandList } from '@/api/brand'
import Start from './start.vue'

@Component({
  components: {
    ListPage,
    Start
  }
})
export default class Main extends ViewBase {
  fetch = brandList

  filters: Filter[] = [
    {
      name: 'id',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '品牌ID'
    },

    {
      name: 'name',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '品牌中文名称'
    },
    {
      name: 'enName',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '品牌外文名称'
    },

    {
      name: 'tradeCode',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '品牌所属行业',
      enumKey: 'tradeCodeList'
    },

    {
      name: 'pageIndex',
      defaultValue: 1
    },

    {
      name: 'pageSize',
      defaultValue: 20
    }
  ]

  enums = [
    'tradeCodeList',
    'statusList'
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', width: 65 },
      { title: '品牌ID', key: 'id', slot: 'id', width: 80 },
      { title: '品牌中文名称', key: 'name', minWidth: 90 },
      { title: '品牌外文名称', key: 'enName', width: 100 },
      { title: '品牌logo', key: 'logo', minWidth: 90, editor: 'deprecated' },
      { title: '所属行业', key: 'tradeCode', width: 80, editor: 'enum', enumKey: 'tradeCodeCode' },
      { title: '搜索关键字', key: 'keyWords', width: 80, slot: 'keyWords' },
      { title: '社交平台', key: 'countyName', width: 110, slot: 'platform' },
      { title: '门店', key: 'gradeCode', width: 80, slot: 'shop' },
      { title: '产品', key: 'gradeCode', width: 80, slot: 'product' },
      { title: '状态', key: 'gradeCode', width: 80, slot: 'status' },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  async start(row: any) {
    this.$nextTick(() => {
      (this.$refs.start as any).init(row)
    })
  }

  uplist() {
    (this.$refs.listPage as any).update()
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: "-";
}
.keyWords a {
  display: block;
  padding: 5px 0;
}
</style>
