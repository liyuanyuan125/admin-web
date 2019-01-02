<template>
  <div class="page">
    <Tabs :value="$route" @input="handleClick" @on-close="handleCloseTag" :defalutTag="defalutTag" :list="tabsList"></Tabs>
    <router-link :to="{name:'payRank'}">12345</router-link>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
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
    name: 'advertiser'
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
  mounted() {
    this.routeUpdate()
  }

  routeUpdate() {
  }

  turnToPage(name: any) {
    this.$router.push({
      name
    })
  }

  handleClick(item: any) {
    this.turnToPage(item.name)
  }

  handleCloseTag(res: any, type: string, name: string) {
    const tagNavList = [...this.tabsList, ...this.defalutTag]
    const nextName = getNextName(tagNavList, name, this.defalutTag)
    if (type === 'all') {
      this.defalutTag.forEach((item: any) => {
        this.turnToPage(item.name)
      })
    } else if (this.$route.name === name) {
      this.$router.push({ name: nextName })
    }
  }

}
</script>

<style lang="less" scoped>
</style>
