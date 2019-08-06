<template>
  <Table
    :columns="columns"
    :data="list"
    :loading="loading"
    border
    stripe
    disabled-hover
    size="small"
    class="table"
    ref="table"
  />
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class TableData extends ViewBase {
  @Prop({ default: '' }) columns!: any

  @Prop({ type: Array, default: [] }) list!: any[]

  loading: boolean = false
}

</script>