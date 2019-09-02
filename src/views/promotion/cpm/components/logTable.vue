<template>
  <section class="log-table">
    <Table
      :columns="columns"
      :data="tableData"
      size="small"
      stripe
      border
      disabled-hover
    />
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import moment from 'moment'

@Component
export default class LogTable extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: any[]

  get tableData() {
    const list = (this.value || []).map(it => ({
      ...it,
      date: moment(it.createTime).format('YYYY-MM-DD HH:mm:ss')
    }))
    return list
  }

  get columns() {
    return [
      { title: '操作类型', key: 'eventName', width: 120, align: 'center' },
      { title: '操作时间', key: 'date', width: 150, align: 'center' },
      { title: '操作人', key: 'createUserName', width: 120, align: 'center' },
      { title: '描述', key: 'description' },
    ]
  }
}
</script>

<style lang="less" scoped>
.log-table {
  min-width: 688px;
}
</style>
