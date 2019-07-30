<template>
    <!-- 列表 -->
    <Select v-model="inner"
        placeholder="城市"
        filterable
        remote
        clearable
        :remote-method="remoteMethod"
        :loading="loading"
        @on-clear="data = []"
        class="select-wid" >
        <Option v-for="(item, index) in data" :key="index" :value="item.id" >{{item.nameCn}}</Option>        
    </Select>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList, removeItem, addItem, queryCities } from './data'

@Component
export default class SelectPartner extends ViewBase {
  // 双向绑定 v-model
  @Prop({ type: Number, default: 0 }) value!: number
  @Prop({ type: String, default: '' }) selectedCityName!: string

  loading: boolean = false

  data: any[] = []

  inner: number = this.value

  mounted() {}

  async remoteMethod(query: any) {
    try {
      if (query && query !== '') {
        this.loading = true
        const {
          data: { items }
        } = await queryCities({
          pageSize: 9999,
          pageIndex: 1,
          nameCn: query.trim(),
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
      const i = this.data.findIndex((it: any) => {
        return it.id === value
      })
      this.$emit('input', value)
      this.$emit('selectedCity', this.data[i].nameCn)
    } else {
      this.$emit('input', null)
      this.$emit('selectedCity', '')
    }
  }
}

</script>