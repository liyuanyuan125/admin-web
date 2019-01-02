<template>
  <div class="page">
    <Tabs :value="invalue" :defalutTag="defalutTag" :list="tabsList"></Tabs>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Tabs from '@/components/tabs/tabs.vue'
@Component({
    components: {
        Tabs
    }
})
export default class Main extends ViewBase {
    tabsList: any = [{
        name: 'user',
        title: '124'
    }]
    invalue = {
        name: 'user'
    }
    defalutTag = [
      {
        name: 'advertiser',
        title: '广告主',
      },
      {
        name: 'resource',
        title: '资源方',
      }
    ]
}
</script>

<style lang="less" scoped>
</style>
