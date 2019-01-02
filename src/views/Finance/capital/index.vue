<template>
  <div class="page">
    <Tabs :value="invalue" :defalutTag="defalutTag" :list="tabsList"></Tabs>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Tabs from '@/components/tabs/tabs.vue'
import { getNextName } from '@/components/tabs/index'

@Component({
    components: {
        Tabs
    }
})
export default class Main extends ViewBase {
  tabsList: any = []
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
  // handleCloseTag (res: any, type: string, name: string) {
  //   const nextName = getNextName(this.tagNavList, name)
  //   this.setTagNavList(res)
  //   if (type === 'all') this.turnToPage('home')
  //   else if (this.$route.name === name) this.$router.push({ name: nextName })
  // }
}
</script>

<style lang="less" scoped>
</style>
