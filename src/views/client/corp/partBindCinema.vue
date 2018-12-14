<template>
  <div class="component">
    <Table :columns="columns" :data="inValue" border disabled-hover size="small"/>
    <div class="act-bar">
      <a @click="onAdd">添加关联影院</a>
    </div>
    <AddCinemaModel ref="addCinemaModel" v-if = "addShow" />
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { confirm } from '@/ui/modal'
import AddCinemaModel from './addCinemaModel.vue'
const makeMap = (list: any[]) => toMap(list, 'id', 'name')

@Component ({
  components: {
    AddCinemaModel
  }
})
export default class ComponentMain extends View {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: any[]

  /**
   * 分润单位列表
   */
  @Prop({ type: Array, required: true }) unitList!: any[]

  /**
   * 分润方式列表
   */
  @Prop({ type: Array, required: true }) typeList!: any[]

  inValue: any[] = this.value
  addShow =  false
  get cachedMap() {
    return {
      unit: makeMap(this.unitList),
      type: makeMap(this.typeList),
    }
  }

  columns = [
    { title: '影院名称',
      align: 'center',
      key: 'name',
       render: (hh: any, { row: { name } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <a>{name}</a>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      width: 58,
      align: 'center',
      render: (hh: any, { row: { id } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <a on-click={this.onDel.bind(this, id)}>删除</a>
        /* tslint:enable */
      }
    },
  ]

  onAdd() {
    this.addShow = true
    this.$nextTick(() => {
      (this.$refs.addCinemaModel as any).init()
    })
  }

  onSet(id: number) {
  }

  async onDel(id: number) {
    await confirm('确定要删除该项吗？')
    const index = this.inValue.findIndex(it => it.id == id)
    this.inValue.splice(index, 1)
  }

  @Watch('value')
  watchValue(val: any[]) {
    this.inValue = val
  }

  @Watch('inValue', { deep: true })
  watchInValue(val: any[]) {
    this.$emit('input', val)
  }
}
</script>

<style lang="less" scoped>
.component {
  padding: 9px 8px 2px 8px;
  background-color: #eee;
  border-radius: 4px;
}
</style>
