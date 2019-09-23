<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      ref="listPage"
    >
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          :to="editRoute()"
          v-auth="'theater.cinemas:add'"
        >新建</Button>
      </template>

      <template slot="companies" slot-scope="{ row: { companies } }">
        <div class="companies">
          <p v-for="(item, index) in companies" :key="index">{{ item.name }}</p>
        </div>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'data-cinema-hall', params: { id } }"
            v-auth="'theater.cinemas:info'"
          >查看影厅</router-link>
          <router-link
            :to="editRoute('edit', id)"
            v-auth="'theater.cinemas:modify'"
          >编辑</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import AreaSelect, { areaParam } from '@/components/areaSelect'
import jsxReactToVue from '@/util/jsxReactToVue'
import {
  queryList,
  updateStatus,
  updateControlStatus,
  updatePricingLevelCode,
  updateBoxLevelCode,
} from '@/api/cinema'
import Companies from './companies.vue'

@Component({
  components: {
    ListPage,
    CinemaChainSelect,
    AreaSelect,
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'code',
      defaultValue: '',
      input: true,
      width: 90,
      placeholder: '专资ID',
    },

    {
      name: 'name',
      defaultValue: '',
      input: true,
      width: 90,
      placeholder: '影院名称'
    },

    {
      name: 'chainId',
      defaultValue: 0,
      component: CinemaChainSelect,
      width: 168,
      minWidth: 168
    },

    {
      name: 'companyIds',
      defaultValue: '',
      component: Companies,
      width: 120,
      placeholder: '影投'
    },

    {
      ...areaParam,
      component: AreaSelect,
      width: 160,
      placeholder: '地区名称'
    },

    {
      name: 'status',
      defaultValue: 0,
      select: true,
      width: 85,
      placeholder: '营业状态'
    },

    {
      name: 'controlStatus',
      defaultValue: 0,
      select: true,
      width: 85,
      placeholder: '控制状态'
    },

    {
      name: 'hallDataStatus',
      defaultValue: 0,
      select: true,
      width: 85,
      placeholder: '影厅数据'
    },

    {
      name: 'pricingLevelCode',
      defaultValue: '',
      select: true,
      width: 85,
      placeholder: '定价级别',
      enumKey: 'pricingLevelList'
    },

    {
      name: 'boxLevelCode',
      defaultValue: '',
      select: true,
      width: 85,
      placeholder: '票房级别',
      enumKey: 'boxLevelList'
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

  get columns() {
    return [
      {
        title: '序号',
        key: 'id',
        width: 65,
        link: ({ item }) => this.editRoute('view', item.id)
      },
      { title: '专资ID', key: 'code', width: 80 },
      { title: '影院名称', key: 'shortName', minWidth: 90 },
      { title: '影投', width: 100, slot: 'companies' },
      { title: '院线', key: 'chainName', minWidth: 90, editor: 'deprecated' },
      { title: '省份', key: 'provinceName', width: 80 },
      { title: '城市', key: 'cityName', width: 80 },
      { title: '区县', key: 'countyName', width: 80 },
      { title: '级别', key: 'gradeCode', width: 60, enum: 'gradeList' },
      {
        title: '营业状态',
        key: 'status',
        width: 70,
        enum: {
          enumKey: 'statusList',
          updateField: updateStatus,
        },
        auth: 'theater.cinemas:change-status'
      },
      {
        title: '控制状态',
        key: 'controlStatus',
        width: 75,
        enum: {
          enumKey: 'controlStatusList',
          updateField: updateControlStatus,
        },
        auth: 'theater.cinemas:change-control-status'
      },
      {
        title: '定价级别',
        key: 'pricingLevelCode',
        width: 75,
        enum: {
          enumKey: 'pricingLevelList',
          updateField: updatePricingLevelCode,
        },
        auth: 'theater.cinemas:change-pricing-level'
      },
      {
        title: '票房级别',
        key: 'boxLevelCode',
        width: 75,
        enum: {
          enumKey: 'boxLevelList',
          updateField: updateBoxLevelCode,
        },
        auth: 'theater.cinemas:change-box-level'
      },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  editRoute(action = 'new', id = 0) {
    return {
      name: 'data-cinema-edit',
      params: id > 0 ? { action, id: String(id) } : { action }
    }
  }
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: '-';
}
</style>
