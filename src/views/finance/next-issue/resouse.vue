<template>
    <!-- 院线列表 -->
    <Select v-model="inner"
        placeholder="资源方公司"
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
import { xadvert } from '@/api/nextissue'
@Component
export default class SelectPlan extends ViewBase {
  // 双向绑定 v-model
  @Prop({default: ''}) value!: any

  loading: boolean = false
  index = 1
  data = []

  inner: any = this.value

  mounted() { }

  async remoteMethod(query: any) {
    try {
      if (query) {
        this.loading = true
        const {
          data: { items }
        } = await xadvert({
          pageSize: 99,
          pageIndex: 1,
          shortName: query,
          typeCode: 'resource'
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