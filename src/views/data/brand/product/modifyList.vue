<template>
  <div>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage">
      <template slot="acts-2">
        <!-- <Button
          type="primary"
          class="button-audit"
        >批量审核</Button> -->
        <router-link :to="{
            name: 'data-brand-product-detail',
            params: {
              action: 'create'
            }
          }">
          <Button type="primary" class="button-audit">添加新的产品</Button>
        </router-link>
      </template>

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

      <template slot="action" slot-scope="{ row: { status, id, name, enName } }">
        <div class="row-acts">
          <router-link :to="{
              name: 'data-brand-product-detail',
              params: {
                id,
                action: 'edit'
              }
            }">编辑</router-link>
          <router-link :to="{
              name: 'data-brand-product-detail',
              params: {
                id,
                action: 'view'
              }
            }">查看</router-link>
          <a @click="enabledItemHandler(id, name, enName, 'enabled')" v-if="status === 0 || status === 2">启用</a>
          <a @click="enabledItemHandler(id, name, enName, 'disabled')" v-if="status === 1">禁用</a>
        </div>
      </template>
    </ListPage>

    <EditDialog v-model="enabledItemVisible" :title="enabledTitleName" :labelWidth="120" :width="550" :fields="enabledItemFields" :fetch="() => { return this.enabledItemData }" :submit="enabledSubmitFetch" hideSubmit hideReturn />
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
import { EditDialog, Field } from '@/components/editForm'
import AreaSelect, { areaParam } from '@/components/areaSelect'

@Component({
  components: {
    ListPage,
    EditDialog,
    AreaSelect
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  brandId: number | null = 0

  enums = ['statusList']

  enabledTitleName: string = ''
  enabledSubmitFetch: any = null
  enabledItemVisible: boolean = false
  enabledItemData: any = {
    id: '',
    name: '',
    enName: ''
  }
  enabledItemFields: Field[] = [
    {
      name: 'id',
      defaultValue: '',
      label: '产品ID',
      text: true,
      span: 21
    },

    {
      name: 'name',
      defaultValue: '',
      label: '产品中文名称',
      text: true,
      span: 21
    },

    {
      name: 'enName',
      defaultValue: '',
      label: '产品英文名称',
      text: true,
      span: 21
    }
  ]

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

  // 启用弹层
  enabledItemHandler(id: number, name: string, enName: string, status: string) {
    if (status === 'enabled') {
      // 启用
      this.enabledSubmitFetch = this.enabledItemSubmit
      this.enabledTitleName = '启用'
    } else {
      // 禁用
      this.enabledTitleName = '禁用'
      this.enabledSubmitFetch = this.disabledItemSubmit
    }
    this.enabledItemData = {
      id,
      name,
      enName
    }
    this.enabledItemVisible = true
  }

  // 启用请求
  async enabledItemSubmit({ id }: any) {
    await enabledItem(id)
    toast('操作成功')
    this.enabledItemVisible = false
    this.refresh()
  }

  // 禁用请求
  async disabledItemSubmit({ id }: any) {
    await disabledItem(id)
    toast('操作成功')
    this.enabledItemVisible = false
    this.refresh()
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
