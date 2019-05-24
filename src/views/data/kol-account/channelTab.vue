<template>
  <Tabs v-model="channelCode" type="card" class="tabs">
    <TabPane v-for='item in channelList' :name="item.key" :key='item.key' :label="item.text" />
  </Tabs>
  <!-- <Tabs v-model="channelCode" type="card" class="tabs">
    <TabPane name="1" label="待审核"/>
    <TabPane name="2" label="待支付"/>
    <TabPane name="3" label="待转码"/>
    <TabPane name="4" label="已完成"/>
    <TabPane name="5" label="审核已拒绝"/>
    <TabPane name="6" label="已取消"/>
  </Tabs> -->
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { accountCategorysList } from '@/api/kolAccount'

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
  mounted() {
    // this.getCaabbs()
  }

  async getCaabbs() {
    try {
      const {
        data: {
          items
        }
      } = await accountCategorysList('')
      this.channelList = items
      // console.log(items, 'items333')
    } catch (ex) {
      this.handleError(ex)
    }
  }

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