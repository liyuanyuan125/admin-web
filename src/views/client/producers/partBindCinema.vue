<template>
  <div class="component">
    <Table :columns="columns" :data="inValue" border disabled-hover size="small"/>
    <div class="act-bar">
      <a @click="onAdd" v-if="!type">添加关联影片</a>
    </div>
    <AddCinemaModel v-if="!type" ref="addCinemaModel" @done="columndata" />
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
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
export default class ComponentMain extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Array, default: () => [] }) value!: any[]

  // 判断新增和添加
  @Prop() type: any

  /**
   * 分润单位列表
   */

  /**
   * 是否为影院
   */
  @Prop() incinematype: any

  inValue: any[] = this.value
  addShow =  false
  get columns() {
    const arr = [
      {
        title: '影片中文名称',
        align: 'center',
        key: 'name'
      },
       {
         title: '影片英文名称',
         align: 'center',
         key: 'nameEn'
      }
    ]
    const add: any = [
       {
          title: '操作',
          width: 70,
          align: 'center',
          render: (hh: any, { row: { id } }: any) => {
            /* tslint:disable */
            const h = jsxReactToVue(hh)
            return <a on-click={this.onDel.bind(this, id)}>删除</a>
            /* tslint:enable */
          }
        }
    ]
    const column = this.type == 1 ? arr : arr.concat( add )
    return column
  }

  onAdd() {
    this.addShow = true
    this.$nextTick(() => {
      (this.$refs.addCinemaModel as any).init(this.inValue)
    })
  }

  columndata(val: any) {
    this.inValue = val.map((it: any) => {
      return {
        ...it,
        nameEn: it.englishName
      }
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
