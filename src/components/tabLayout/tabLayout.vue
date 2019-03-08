<template>
  <Tabs v-model="currentName" type="card" :class="`tab-layout tab-layout-${list.length}`"
    @on-click="onClick" @on-tab-remove="onRemove" style='height: 1000px;'>
    <TabPane v-for="(it, i) in list" :key="i" :name="it.name" :label="it.meta.title"
      :closable="!it.meta.fixed">
      <keep-alive>
        <component :is="it.component ? it.component : it.components.default" v-if="it.name == currentName"></component>
      </keep-alive>
    </TabPane>
  </Tabs>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { RouteItem } from './types'
import deepExtend from 'deep-extend'
import { Route } from 'vue-router'
import tryParseJson from '@/fn/tryParseJson'
import { uniqBy } from 'lodash'

const flatRoutes = (routes: any[]) => {
  const result = routes.reduce((list, it) => {
    list.push(it)
    it.children && it.children.length > 0 &&
      (list = list.concat(flatRoutes(it.children)))
    return list
  }, [])
  return result
}

const findParent = (route: any, routes: any[]) => {
  const item = routes.find(it => {
    return (it.children || []).some((t: any) => t.name == route.name)
  })
  return item
}

const defaultRouteItem: RouteItem = {
  name: '',
  query: {},
  params: {},
  meta: {
    title: '[页面名]',
    fixed: false
  }
}

const fillRouteItem = (item: RouteItem) => deepExtend({}, defaultRouteItem, item)

@Component
export default class TabLayout extends ViewBase {
  currentName: string = ''

  parentName: string = ''

  list: RouteItem[] = []

  allList: RouteItem[] = []

  created() {
    const route = this.$route
    const routes = flatRoutes((this.$router as any).options.routes)

    const parent = findParent(route, routes) || {}
    const parentName = parent.name

    const allRoutes: RouteItem[] = parent.children || []

    const allList: RouteItem[] = allRoutes.map(fillRouteItem)

    // 从 sessionStorage 中读取保存的数据
    const storeJson = sessionStorage.getItem(parentName)
    const storeList: RouteItem[] = tryParseJson(storeJson, [])

    // 从 sessionStorage 中读取的数据，没有 component 信息
    storeList.forEach(it => {
      const foundItem = allList.find(t => t.name == it.name)
      it.component = foundItem && foundItem.component
    })

    const fixedList = allList.filter(it => it.meta!.fixed)
    const list = uniqBy(fixedList.concat(storeList), 'name')
    const currentName = route.name || (list[0] || {}).name || ''

    this.currentName = currentName
    this.parentName = parentName
    this.list = list
    this.allList = allList

    this.add(route)

    // 将信息保存到 sessionStorage
    // window.addEventListener('beforeunload', () => {
    //   const listJson = JSON.stringify(this.list)
    //   sessionStorage.setItem(parentName, listJson)
    // })
  }

  add(route: Route) {
    const foundItem = this.allList.find(it => it.name == route.name)
    if (foundItem != null) {
      this.currentName = foundItem.name

      let item = this.list.find(it => it.name == route.name)
      if (item == null) {
        item = fillRouteItem(foundItem)
        this.list.push(item)
      }
      item.meta!.lastUrl = route.fullPath
    }
  }

  beforeRouteUpdate(to: Route, from: Route, next: any) {
    // 跳转到外部时，保存当前 list
    this.add(to)
    next()
  }

  // saveList() {
  //   const listJson = JSON.stringify(this.list)
  //   sessionStorage.setItem(this.parentName, listJson)
  // }

  // beforeRouteLeave(to: Route, from: Route, next: any) {
  //   this.saveList()
  //   next()
  // }

  onClick(name: string) {
    const item = this.list.find(it => it.name == name)
    const lastUrl = item && item.meta!.lastUrl
    this.$router.push(lastUrl ? { path: lastUrl } : { name })
  }

  onRemove(name: string) {
    const index = this.list.findIndex(it => it.name == name)
    this.list.splice(index, 1)
    const isCurrent = this.$route.name === name
    isCurrent && this.$router.back()
  }
}
</script>

<style lang="less" scoped>
.tab-layout {
  /deep/ .ivu-tabs-bar {
    margin-bottom: 10px;
    user-select: none;
    height: 32px;
  }
}
.tab-layout-1 {
  /deep/ .ivu-tabs-bar {
    height: 0;
    overflow: hidden;
    border: 0;
    margin-bottom: 0;
    transition: height ease-in-out .3s;
  }
}
/deep/ .ivu-tabs-content .ivu-tabs-content-animated {
  min-height: 700px;
  overflow-y: scroll;
}
</style>
