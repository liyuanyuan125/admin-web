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
          @click="editShow()"
        >新建</Button>
      </template>
      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'data-cinema-hall', params: { id } }"
            v-auth="'theater.cinemas:info'"
          >查看影厅</router-link>
          <a >编辑</a>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { brandList } from '@/api/brand'

@Component({
  components: {
    ListPage,
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
      { title: '品牌ID', key: 'id', width: 80 },
      { title: '品牌中文名称', key: 'name', minWidth: 90 },
      { title: '品牌外文名称', key: 'enName', width: 100 },
      { title: '品牌logo', key: 'logo', minWidth: 90, editor: 'deprecated' },
      { title: '所属行业', key: 'tradeCode', width: 80, editor: 'enum', enumKey: 'tradeCodeList' },
      { title: '搜索关键字', key: 'keyWords', width: 80 },
      { title: '社交平台', key: 'countyName', width: 80 },
      { title: '门店', key: 'gradeCode', width: 60, editor: 'deprecated' },
      { title: '产品', key: 'gradeCode', width: 60, editor: 'deprecated' },
      { title: '状态', key: 'gradeCode', width: 60, editor: 'deprecated' },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: "-";
}
</style>
