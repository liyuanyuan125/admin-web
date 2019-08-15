<template>
  <div>
     <Table 
      v-bind="$attrs"
      v-on="$listeners"
     :columns="columns" :data="dataList" border stripe disabled-hover size="small" ></Table>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Table extends ViewBase {
  @Prop({ type: Array, default: () => [] }) data!: any[]

  columns = [
    { title: '导入时间', key: 'uploadTime', align: 'center'},
    { title: '导入数量', key: 'totalCount', align: 'center'},
    { title: '已占用数量', key: 'usedCount', align: 'center'},
    { title: '剩余可用数量', key: 'remainingCount', align: 'center'},
  ]

  get dataList() {
    return this.data
  }
}

</script>
<style lang='less' scoped>
</style>