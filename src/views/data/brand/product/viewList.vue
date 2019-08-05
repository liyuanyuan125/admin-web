<template>
  <div>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">

      <template slot="index" slot-scope="{ index }">
        <div>
          {{index + 1}}
        </div>
      </template>

      <template slot="keywords" slot-scope="{ row: { keyWords } }">
        <div v-if=" !keyWords "> - </div>
        <div v-else-if="keyWords && keyWords.length > 0">
          <ul>
            <li v-for="(it, index) in keyWords" :key="index">{{it}}</li>
          </ul>
        </div>
        <div v-else>
          {{ ...keyWords }}
        </div>
      </template>

      <template slot="action" slot-scope="{ row: { status, id } }">
        <div class="row-acts">
          <router-link :to="{
              name: 'data-brand-product-detail',
              params: {
                id,
                action: 'view'
              }
            }">查看</router-link>
        </div>
      </template>
    </ListPage>

  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import {
  queryList,
  queryItem,
  queryKolAcounts,
  newItem,
  auditItem,
  enabledItem,
  disabledItem
} from './data'
import { alert, toast } from '@/ui/modal'
import AreaSelect, { areaParam } from '@/components/areaSelect'

@Component({
  components: {
    ListPage,
    AreaSelect
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  brandId: number | null = 0

  enums = ['statusList']

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  get filters() {
    return [
      {
        name: 'id',
        defaultValue: '',
        type: 'input',
        width: 85,
        placeholder: '产品ID'
      },

      {
        name: 'query',
        defaultValue: '',
        type: 'input',
        width: 85,
        placeholder: '产品名称'
      },

      {
        name: 'brandId',
        defaultValue: this.brandId
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
  }

  get columns() {
    return [
      { title: '序号', slot: 'index', maxWidth: 60 },
      { title: '产品ID', key: 'id' },
      { title: '产品中文名称', key: 'name' },
      { title: '产品外文名称', key: 'enName' },
      { title: '产品简述', key: 'description', minWidth: 200 },
      { title: '搜索关键字', key: 'keyWords', slot: 'keywords' },
      { title: '最后更新时间', key: 'modifyTime' },
      { title: '状态', key: 'status', editor: 'enum' },
      { title: '操作', key: 'keyWords', slot: 'action' }
    ] as ColumnExtra[]
  }

  get fields() {
    return [
      {
        name: 'brandId',
        defaultValue: this.brandId
      },

      {
        name: 'channelCodeCode',
        defaultValue: '',
        type: 'select',
        label: '账号平台',
        span: 12,
        required: true
      },

      {
        name: 'channelDataId',
        defaultValue: '',
        type: 'input',
        label: '账号ID',
        span: 12,
        required: true
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        label: '账号名称',
        span: 12
      },

      {
        name: 'url',
        defaultValue: '',
        type: 'input',
        label: 'URL链接',
        span: 12
      }
    ]
  }

  refresh() {
    this.listPage.update()
  }

  created() {
    this.brandId = parseFloat(this.$route.params.brandId) || null
  }
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: '-';
}
</style>
