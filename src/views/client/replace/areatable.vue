<template>
  <div class="component">
    <Table :columns="columns" :data="parent" border disabled-hover size="small"/>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { arealist } from '@/api/corpReal'
import { confirm } from '@/ui/modal'
import { uniq } from 'lodash'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')

@Component
export default class ComponentMain extends ViewBase {
  @Prop() value!: number[]
  items: any = []
  parent: any = []
  async init() {
    try {
      const {
        data
      } = await arealist(this.value.join(','))
      this.items = data
      this.parentarea(uniq(this.items.map((it: any) => it.parentId)).join(','))
    } catch (ex) {
      this.handleError(ex)
    }
  }

  get columns() {
    return  [
      { title: '地区',
        align: 'center',
        key: 'areaName',
        width: 80,
      },
      {
        title: '省',
        align: 'center',
        key: 'nameCn',
        width: 80,
      },
      {
        title: '市',
        align: 'center',
        render: (hh: any, { row: { child } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <span>{child.join(' / ')}</span>
          /* tslint:enable */
        }
      }
    ]
  }

  async parentarea(val: any) {
    try {
      const {
        data
      } = await arealist(val)
      this.parent = data
      this.parent = this.parent.map((it: any) => {
        const child = this.items.filter((its: any) => its.parentId == it.id).map((item: any) => {
          return item.nameCn
        })
        return {
          ...it,
          child
        }
      })
    } catch (ex) {
      this.handleError(ex)
    }
  }

  @Watch('value', { immediate: true })
  watchValue(val: any) {
    if (val) {
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
