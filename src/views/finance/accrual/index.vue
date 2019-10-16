<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      ref="listPage"
    >
      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <router-link :to="editRoute('audit', id)" v-if="status == 1">商务审核</router-link>
          <router-link :to="editRoute('new', id)" v-if="status == 3">开票</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { navList, querySaleList } from './data'
import { alert, toast } from '@/ui/modal'
import { EditDialog, Field } from '@/components/editForm'
import { startDayTimestamp, endDayTimestamp } from '@/util/dealData'

@Component({
  components: {
    ListPage,
    EditDialog
  }
})
export default class IndexPage extends ViewBase {
  get listPage() {
    return this.$refs.listPage as ListPage
  }

  fetch = querySaleList

  get filters(): Filter[] {
    return [
      {
        name: 'start',
        defaultValue: 0,
        date: {
          type: 'month'
        },
        width: 128,
        placeholder: '开始月份',
      },

      {
        name: 'end',
        defaultValue: 0,
        date: {
          type: 'month'
        },
        width: 128,
        placeholder: '结束月份',
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

  navList = navList

  get columns() {
    return [
      {
        title: '月份',
        key: 'month',
        width: 65,
      },
      {
        title: '应收金额',
        key: 'totalTaxFee',
        minWidth: 100,
        link: ({ item }) => ({ name: '', params: {} })
      },
    ] as ColumnExtra[]
  }
}
</script>

<style lang="less" scoped>
</style>
