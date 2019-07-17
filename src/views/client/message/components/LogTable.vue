<template>
<div>
  <Table
      :columns="columns"
      :data="list"
      border
      stripe
      disabled-hover
      size="small"
      class="table"
      ref="table"
    />
</div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryItem } from '@/api/message'
import { findIndex } from 'lodash'
import moment from 'moment'
const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text || ''
  return res
}

@Component
export default class LogTable extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Number, default: -1 }) value!: number

  columns: any[] = [
    {
      title: '时间',
      key: 'createTime'
    },
    {
      title: '操作人',
      key: 'userName'
    },
    {
      title: '操作后状态',
      key: 'status'
    },
    {
      title: '备注信息',
      key: 'remark',
      width: 200
    }
  ]

  list: any[] = []

  async created() {
    if ( this.value === -1 ) { return }

    try {
      const { data } = await queryItem(this.value, false)
      const operationLogList = data.item.operationLogList || null
      const statusList = data.statusList || null
      if ( operationLogList && operationLogList.length > 0 ) {
        this.list = operationLogList.map((it: any) => {
          return {
            createTime: ( it.createTime && it.createTime !== 0 ) ?
            moment(it.createTime).format('YYYY-MM-DD hh:mm') :
            '-' ,
            userName: it.userName,
            status: getName(it.status, statusList),
            remark: it.remark
          }
        })
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  get tableColumns() {
    return {

    }
  }
}
</script>
<style lang="less" scoped>
</style>
