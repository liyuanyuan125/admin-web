<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
    >
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from './data'

@Component({
  components: {
    ListPage
  }
})
export default class IndexPage extends ViewBase {
  fetch = queryList

  get filters(): Filter[] {
    return [
      {
        name: 'beginDate',
        defaultValue: 0,
        date: {
          type: 'month'
        },
        width: 128,
        placeholder: '开始月份',
      },

      {
        name: 'endDate',
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

  get columns() {
    return [
      {
        title: '月份',
        key: 'month',
        width: 80,
      },
      {
        title: '应收金额',
        key: 'amountReceivable',
        minWidth: 100,
        link: ({ item }) => ({ name: 'finance-accrual-receive', params: { id: item.id } })
      },
      {
        title: '应付金额',
        key: 'amountPayable',
        minWidth: 100,
        link: ({ item }) => ({ name: 'finance-accrual-pay', params: { id: item.id } })
      },
      {
        title: '应收-应付',
        key: 'amountReceivablePayable',
        minWidth: 100,
        link: ({ item }) => ({ name: 'finance-accrual-receive-pay', params: { id: item.id } })
      },
    ] as ColumnExtra[]
  }
}
</script>

<style lang="less" scoped>
</style>
