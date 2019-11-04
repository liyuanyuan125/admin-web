<template>
  <div class="index-page">
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
    >
      <template slot="acts-2">
        <a
          :href='`${ajaxBase}/bi/export-amount-receivable-months?month=${id}`'
          class="ivu-btn ivu-btn-default"
          download
        >
          <i class='ivu-icon ivu-icon-ios-cloud-download'></i>
          <span>导出</span>
        </a>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <a
            :href='`${ajaxBase}/bi/export-amount-receivables?id=${id}`'
            class="ivu-btn ivu-btn-default ivu-btn-small"
            download
          >
            <span>导出每日应收</span>
          </a>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryReceiveList } from './data'
import { downloadBook, objectListToData } from '@/util/excel'
import { alert, loading } from '@/ui/modal'
import { cloneDeep } from 'lodash'

@Component({
  components: {
    ListPage
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: Number, required: true }) id!: number

  ajaxBase = VAR.ajaxBaseUrl

  fetch = queryReceiveList

  get filters(): Filter[] {
    return [
      {
        name: 'month',
        defaultValue: this.id
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
        title: '计划ID',
        key: 'planId',
        width: 70,
      },
      {
        title: '计划名称',
        key: 'name',
        width: 160,
      },
      {
        title: '广告片',
        key: 'videoName',
        width: 130,
      },
      {
        title: '广告主公司ID',
        key: 'companyId',
        width: 100,
      },
      {
        title: '广告主公司名称',
        key: 'companyName',
        minWidth: 130,
      },
      {
        title: '曝光人次',
        key: 'exposurePerson',
        width: 80,
      },
      {
        title: '曝光场次',
        key: 'exposureSession',
        width: 80,
      },
      {
        title: '优惠前金额',
        key: 'expendFormat',
        width: 80,
      },
      {
        title: '优惠金额',
        key: 'discountedPriceFormat',
        width: 80,
      },
      {
        title: '应收金额',
        key: 'payableFormat',
        width: 80,
      },
      {
        title: '操作',
        slot: 'action',
        width: 120,
      },
    ] as ColumnExtra[]
  }

  // get exportCols() {
  //   const cols = cloneDeep(this.columns)
  //   return cols.slice(0, -1)
  // }

  // 前端导出
  // async exportAll() {
  //   const close = loading('导出中', { duration: 28 })
  //   try {
  //     const { items } = await exportReceiveList(this.id)
  //     const data = objectListToData(items, this.exportCols as any[])
  //     downloadBook(data, '应收金额月导出' + this.id)
  //   } catch (ex) {
  //     this.handleError(ex)
  //   } finally {
  //     close()
  //   }
  // }

  // async exportDay(id: string) {
  //   const close = loading('导出中', { duration: 28 })
  //   try {
  //     const { items } = await exportReceiveDayList(id)
  //     const cols = [ { key: 'date', title: '日期' } ].concat(this.exportCols as any[])
  //     const data = objectListToData(items, cols)
  //     const dt = (items as any[])[0].dt
  //     downloadBook(data, '应收金额日导出' + dt)
  //   } catch (ex) {
  //     this.handleError(ex)
  //   } finally {
  //     close()
  //   }
  // }
}
</script>

<style lang="less" scoped>
/deep/ .act-bar ~ .act-bar {
  margin-top: 0 !important;
}
</style>
