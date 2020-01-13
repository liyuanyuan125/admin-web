<template>
    <!-- 院线列表 -->
    <Select v-model="inner"
        placeholder="城市id"
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
import { queryCities, districts } from '@/api/nextissue'
import { isFinite, toNumber } from 'lodash'

@Component
export default class SelectPlan extends ViewBase {
  // 双向绑定 v-model
  @Prop({ default: ''}) value!: any

  loading: boolean = false

  data = []
  index = 1
  inner = this.value

  mounted() { }

  async remoteMethod(query: any) {
    try {
      if (query) {
        this.loading = true
        // if ( isFinite(toNumber(query)) && this.index == 1) {
        //   this.index ++
        //   const { data } = await districts(query)
        //   this.data = data
        //   this.loading = false
        // }
        const {
          data: { items }
        } = await queryCities({
          pageSize: 99,
          pageIndex: 1,
          nameCn: query
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