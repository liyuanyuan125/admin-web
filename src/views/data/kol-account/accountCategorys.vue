<template>
   <Select v-model="shadowId" placeholder="账号分类名称" :multiple="multiple" clearable>
    <Option v-for="item in queryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
  </Select>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { accountCategorysList } from '@/api/kolAccount'

@Component
export default class AccountCategorysList extends ViewBase {
  @Prop({ type: Boolean, default: false} ) multiple!: boolean
  @Prop() value!: any

  shadowId: any = null
  queryList: any = {}

  mounted() {
    this.getCaabbs()
  }

  async getCaabbs() {
    try {
      const {
        data: {
          items
        }
      } = await accountCategorysList('')
      this.queryList = items
      // console.log(items, 'items333')
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('shadowId')
  watchInner(val: any) {
    if ( this.multiple ) {
      this.$emit('input', val)
    } else {
      this.$emit('input', val)
    }
  }

  @Watch('value')
  watchValue(val: any) {
    if (this.multiple) {
      this.shadowId = val
    }
  }
}
</script>
