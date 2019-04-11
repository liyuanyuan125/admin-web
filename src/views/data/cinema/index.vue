<template>
  <div>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums"
      :columns="columns" :listMap="listMap" ref="listPage">
      <template slot="acts">
        <Button type="success" icon="md-add-circle" @click="edit(0)"
          v-auth="'theater.cinemas:add'">新建影院</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link :to="{ name: 'data-cinema-hall', params: { id } }"
            v-auth="'theater.cinemas:info'">查看影厅</router-link>
          <a @click="edit(id)" v-auth="'theater.cinemas:modify'">编辑</a>
        </div>
      </template>
    </ListPage>

    <DlgEdit v-model="dlgEditModel" @done="dlgEditDone"/>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra, ListMapParam } from '@/components/listPage'
import CinemaChainSelect from '@/components/CinemaChainSelect.vue'
import AreaSelect from '@/components/AreaSelect.vue'
import { queryList, updateStatus, updateControlStatus,
  updatePricingLevelCode, updateBoxLevelCode } from '@/api/cinema'
import DlgEdit from './dlgEdit.vue'

@Component({
  components: {
    ListPage,
    CinemaChainSelect,
    AreaSelect,
    DlgEdit
  }
})
export default class Main extends ViewBase {
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'name',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '影院名称',
    },

    {
      name: 'chainId',
      defaultValue: 0,
      type: CinemaChainSelect,
      width: 168,
      minWidth: 168,
    },

    {
      name: 'area',
      defaultValue: [0, 0, 0],
      type: AreaSelect,
      width: 160,
      dealParams([provinceId, cityId, countyId]: number[]) {
        return {
          provinceId,
          cityId,
          countyId
        }
      }
    },

    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '营业状态',
    },

    {
      name: 'controlStatus',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '控制状态',
    },

    {
      name: 'hallDataStatus',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '影厅数据',
    },

    {
      name: 'pricingLevelCode',
      defaultValue: '',
      type: 'select',
      width: 85,
      placeholder: '定价级别',
      enumKey: 'pricingLevelList',
    },

    {
      name: 'boxLevelCode',
      defaultValue: '',
      type: 'select',
      width: 85,
      placeholder: '票房级别',
      enumKey: 'boxLevelList',
    },

    {
      name: 'pageIndex',
      defaultValue: 1
    },

    {
      name: 'pageSize',
      defaultValue: 20
    },
  ]

  enums = [
    'statusList',
    'controlStatusList',
    'hallDataStatusList',
    'pricingLevelList',
    'boxLevelList',
    'gradeList',
  ]

  get columns() {
    return  [
      { title: '序号', key: 'id', width: 70 },
      { title: '专资ID', key: 'code', width: 70 },
      { title: '影院名称', key: 'shortName', minWidth: 70 },
      { title: '院线', key: 'chainName', width: 120, editor: 'deprecated' },
      { title: '省份', key: 'provinceName', width: 80 },
      { title: '城市', key: 'cityName', width: 80 },
      { title: '区县', key: 'countyName', width: 80 },
      { title: '级别', key: 'gradeName', width: 60, editor: 'deprecated' },
      { title: '营业状态', key: 'status', width: 70, editor: 'poptipSelect',
        updateField: updateStatus, auth: 'theater.cinemas:change-status' },
      { title: '控制状态', key: 'controlStatus', width: 75, editor: 'poptipSelect',
        updateField: updateControlStatus, auth: 'theater.cinemas:change-control-status' },
      { title: '定价级别', key: 'pricingLevelCode', width: 75, editor: 'poptipSelect',
        updateField: updatePricingLevelCode, auth: 'theater.cinemas:change-pricing-level' },
      { title: '票房级别', key: 'boxLevelCode', width: 75, editor: 'poptipSelect',
        updateField: updateBoxLevelCode, auth: 'theater.cinemas:change-box-level' },
      { title: '操作', slot: 'action', width: 108 }
    ] as ColumnExtra[]
  }

  dlgEditModel = {
    show: false,
    id: -1
  }

  edit(id: number) {
    this.dlgEditModel.id = id
    this.dlgEditModel.show = true
  }

  dlgEditDone() {
    (this.$refs.listPage as any).fetchList()
  }

  listMap(item: any, { enumMap }: ListMapParam) {
    const gradeItem = enumMap.grade[item.gradeCode] || {}
    return {
      ...item,
      gradeName: gradeItem.text,
      gradeControlStatus: gradeItem.controlStatus,
    }
  }
}
</script>

<style lang="less" scoped>
</style>
