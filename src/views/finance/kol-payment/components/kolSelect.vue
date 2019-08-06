<template>
    <!-- KOL名称列表 -->
    <Select v-model="inner"
        placeholder="KOL名称"
        filterable
        remote
        clearable
        :remote-method="remoteMethod"
        :loading="loading"
        @on-clear="data = []"
        class="select-wid" >
        <Option v-for="(item, index) in data" :key="index" :value="item.id" >{{item.name}}</Option>        
    </Select>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryKolAcounts } from '../data'

@Component
export default class KolSelect extends ViewBase {
  // 双向绑定 v-model
  @Prop({ default: '' }) value!: any

  @Prop({ type: String, default: '' }) channelCode!: string

  loading: boolean = false

  data = []

  inner: number = this.value

  mounted() {}

  async remoteMethod(query: any) {
    try {
      if (query) {
        this.loading = true
        const {
          data: { items }
        } = await queryKolAcounts({
          keyword: query.trim(),
          channelCody: this.channelCode
        })
        if ( items && items.length > 0 ) {
          this.data = items
        }
      }
      this.loading = false
    } catch (ex) {
      this.loading = false
      this.handleError(ex)
    }
  }

  @Watch('value')
  watchValue(value: number) {
    this.inner = value
  }

  @Watch('inner')
  watchInner(value: number) {
    if ( value ) {
      this.$emit('input', value)
    } else {
      this.$emit('input', null)
    }
  }
}

</script>