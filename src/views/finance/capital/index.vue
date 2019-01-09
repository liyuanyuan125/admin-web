<template>
  <div class="page">
    <Tabs class="name" :value="$route" @input="handleClick" @on-close="handleCloseTag" :defalutTag="defalutTag" :list="tabsList"></Tabs>
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

  defalutTag = [
    {
      name: 'ggtiser',
      title: '广告主系统',
    },
    {
      name: 'resource',
      title: '资源方系统',
    }
  ]

  mounted() {
    this.routeUpdate()
  }

  routeUpdate() {
  }

  get cacheList() {
    return this.tabsList.length ? [...this.tabsList, ...this.defalutTag].map((item: any) => item.name) : []
  }

  turnToPage(name: any, query: any, params: any) {
    this.$router.push({
      name,
      query,
      params
    })
  }

  handleClick(item: any) {
    this.turnToPage(item.name, item.query, item.params)
  }

  handleCloseTag(res: any, type: string, name: string) {
    const tagNavList = [...this.tabsList, ...this.defalutTag]
    const nextName = getNextName(tagNavList, name, this.defalutTag)
    this.tabsList = res
    if (type === 'all') {
      this.defalutTag.forEach((item: any) => {
        this.turnToPage(item.name, item.query, item.params)
      })
    } else if (this.$route.name === name) {
      this.$router.push({ name: nextName })
    }
  }

  @Watch('$route', {immediate: true, deep: true})
  Watch$route(val: any, to: any) {
    const defaultName = this.defalutTag.map((it: any) => {
      return it.name
    })
    const name = this.tabsList.map((it: any) => {
      return it.name
    })
    if (!defaultName.includes(val.name) && !name.includes(val.name)) {
      this.tabsList.push({
        title: val.meta.title,
        name: val.name,
        query: val.query,
        params: val.params
      })
    }
    if (name.includes(val.name)) {
      const index = name.findIndex((item: any) => item == val.name )
      this.tabsList[index].query = val.query
      this.tabsList[index].params = val.params
    }
    const names = to ? to.name : ''
    if (val.name == 'resource' && names == 'withdrawalBill') {
      if (to.params.show != 'show') {
        const res = this.tabsList.filter((item: any) => item.name !== 'withdrawalBill' )
        this.tabsList = res
      }
    }
  }
}
</script>

<style lang="less" scoped>
.name {
  margin-left: -8px;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
