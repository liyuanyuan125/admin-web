<template>
  <div>
    留言板
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import EditDialog, { Field } from '@/components/editDialog'

@Component({
  components: {
    ListPage
  }
})
export default class Message extends ViewBase {

}
</script>

<style lang="less" scoped>
</style>
