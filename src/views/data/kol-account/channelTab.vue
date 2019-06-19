<template>
  <Tabs v-model="channelCode" type="card" class="tabs">
    <TabPane v-for='item in channelList' :name="item.key" :key='item.key' :label="item.text" />
  </Tabs>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class ChannelTab extends ViewBase {
  @Prop({ type: Boolean, default: false} ) multiple!: boolean
  @Prop() value!: any

  channelCode: any = null
  queryList: any = {}
  channelList: any[] = [{
    text: '微博',
    key: 'weibo'
  }, {
    text: '微信',
    key: 'wechat'
  }, {
    text: '快手',
    key: 'kuaishou'
  }, {
    text: '抖音',
    key: 'douyin'
  }, {
    text: '小红书',
    key: 'xiaohongshu'
  }]
  mounted() {  }
  created() {  }

  @Watch('channelCode')
  watchInner(val: any) {
    this.$emit('input', val)
  }

  @Watch('value')
  watchValue(val: any) {
    this.channelCode = val
  }
}
</script>
<style lang="less" scoped>
.tabs {
  /deep/ .ivu-tabs-bar {
    margin-bottom: 10px;
  }
}
</style>