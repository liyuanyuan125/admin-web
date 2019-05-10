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
          <a @click="editShow(id)" v-auth="'theater.cinemas:modify'">编辑</a>
        </div>
      </template>
    </ListPage>

    <EditDialog :fields="fields" :fetch="editFetch" :submit="editSubmit" ref="editDlg"/>
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
  queryItem,
  addItem,
  updateItem
} from '@/api/cinema'
import Companies from './companies.vue'
import EditDialog, { Field } from '@/components/editDialog'

@Component({
  components: {
    ListPage,
    CinemaChainSelect,
    AreaSelect,
    EditDialog
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
      placeholder: '影院名称'
    },

    {
      name: 'chainId',
      defaultValue: 0,
      type: CinemaChainSelect,
      width: 168,
      minWidth: 168
    },

    {
      name: 'companyIds',
      defaultValue: '',
      type: Companies,
      width: 120,
      placeholder: '影投'
    },

    {
      ...areaParam,
      type: AreaSelect,
      width: 160,
      placeholder: '地区名称'
    },

    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '营业状态'
    },

    {
      name: 'controlStatus',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '控制状态'
    },

    {
      name: 'hallDataStatus',
      defaultValue: 0,
      type: 'select',
      width: 85,
      placeholder: '影厅数据'
    },

    {
      name: 'pricingLevelCode',
      defaultValue: '',
      type: 'select',
      width: 85,
      placeholder: '定价级别',
      enumKey: 'pricingLevelList'
    },

    {
      name: 'boxLevelCode',
      defaultValue: '',
      type: 'select',
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

  enums = [
    'statusList',
    'controlStatusList',
    'hallDataStatusList',
    'pricingLevelList',
    'boxLevelList',
    'gradeList',
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', width: 65 },
      { title: '专资ID', key: 'code', width: 80 },
      { title: '影院名称', key: 'shortName', minWidth: 90 },
      { title: '影投', width: 100, slot: 'companies' },
      { title: '院线', key: 'chainName', minWidth: 90, editor: 'deprecated' },
      { title: '省份', key: 'provinceName', width: 80 },
      { title: '城市', key: 'cityName', width: 80 },
      { title: '区县', key: 'countyName', width: 80 },
      { title: '级别', key: 'gradeCode', width: 60, editor: 'deprecated' },
      {
        title: '营业状态',
        key: 'status',
        width: 70,
        editor: 'poptipSelect',
        updateField: updateStatus,
        auth: 'theater.cinemas:change-status'
      },
      {
        title: '控制状态',
        key: 'controlStatus',
        width: 75,
        editor: 'poptipSelect',
        updateField: updateControlStatus,
        auth: 'theater.cinemas:change-control-status'
      },
      {
        title: '定价级别',
        key: 'pricingLevelCode',
        width: 75,
        editor: 'poptipSelect',
        updateField: updatePricingLevelCode,
        auth: 'theater.cinemas:change-pricing-level'
      },
      {
        title: '票房级别',
        key: 'boxLevelCode',
        width: 75,
        editor: 'poptipSelect',
        updateField: updateBoxLevelCode,
        auth: 'theater.cinemas:change-box-level'
      },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  fields: Field[] = [
    {
      name: 'id',
      defaultValue: 0
    },

    {
      name: 'shortName',
      defaultValue: '',
      type: 'input',
      label: '影城名称',
      span: 16,
      required: true
    },

    {
      name: 'code',
      defaultValue: '',
      type: 'input',
      label: '专资ID',
      span: 8,
      required: true
    },

    {
      name: 'officialName',
      defaultValue: '',
      type: 'input',
      label: '官方名称',
      span: 16,
      required: true
    },

    {
      name: 'gradeCode',
      defaultValue: '',
      type: 'select',
      label: '影院等级',
      span: 8
    },

    {
      name: 'chainId',
      defaultValue: 0,
      type: CinemaChainSelect,
      label: '院线',
      span: 16,
      required: true,
      backfillParam({ chainId, chainControlStatus }: any, { defaultValue }) {
        // 只有 chainControlStatus 为 1 是，chainId 的值，才是正确的
        return chainControlStatus == 1 ? chainId : defaultValue
      }
    },

    {
      name: 'softwareCode',
      defaultValue: '',
      type: 'select',
      label: '售票系统',
      span: 8
    },

    {
      ...areaParam,
      type: AreaSelect,
      label: '公司地址',
      span: 10,
      width: 305,
      required: true,
      props: {
        noSelf: true
      }
    },

    {
      name: 'address',
      defaultValue: '',
      type: 'input',
      span: 14,
      placeholder: '详细地址',
      width: 405
    },

    {
      name: 'companyIds',
      label: '影投',
      defaultValue: '',
      type: Companies,
      span: 16,
      placeholder: '影投',
      props: {
        multiple: true,
      },
      backfillParam({ companies }: any, { defaultValue }) {
        const value =  (companies || []).map((item: any) => item.id)
        return value
      }
    },

    {
      name: 'zipCode',
      defaultValue: '',
      type: 'input',
      label: '邮编',
      span: 8
    },

    {
      name: 'status',
      defaultValue: 0,
      type: 'select',
      label: '营业状态',
      span: 8,
      defaultEnumIndex: 0,
      auth: 'theater.cinemas:change-status'
    },

    {
      name: 'controlStatus',
      defaultValue: 0,
      type: 'select',
      label: '控制状态',
      span: 8,
      defaultEnumIndex: 0,
      auth: 'theater.cinemas:change-control-status'
    },

    {
      name: 'pricingLevelCode',
      defaultValue: '',
      type: 'select',
      label: '定价级别',
      span: 8,
      auth: 'theater.cinemas:change-pricing-level'
    },

    {
      name: 'boxLevelCode',
      defaultValue: '',
      type: 'select',
      label: '票房级别',
      span: 8,
      auth: 'theater.cinemas:change-box-level'
    }
  ]

  editFetch = queryItem

  editShow(id = 0) {
    const editor = this.$refs.editDlg as EditDialog
    editor.show({ id }).done((data: any) => {
      (this.$refs.listPage as any).update()
    })
  }

  editSubmit(data: any) {
    return data.id ? updateItem(data) : addItem(data)
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: "-";
}
</style>
