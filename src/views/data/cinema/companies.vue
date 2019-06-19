<template>
   <Select v-model="shadowId" placeholder="影投名称" :multiple="multiple" clearable>
    <Option v-for="item in queryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
  </Select>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { companiesList } from '@/api/cinema'

@Component
export default class CompaniesList extends ViewBase {
  @Prop({ type: Boolean, default: false} ) multiple!: boolean
  @Prop() value!: any

  shadowId: any = null
  queryList: any = {}

  mounted() {
    this.getCompanies()
  }

  async getCompanies() {
    try {
      const {
        data: {
          items
        }
      } = await companiesList()
      this.queryList = items
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

<style lang="less" scoped>
</style>