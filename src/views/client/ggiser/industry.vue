<template>
  <div>
    <Cascader
     v-model='inner'
     :data="businessParentTypeList"
     :load-data="loadData"
     :render-format="format"
     ></Cascader>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList } from '@/api/cinemaChain'
import { codeList } from '@/api/ggsiter'
import { brandSelect } from '@/api/clientBrand.ts'

const isAllZero = (list: number[] | null) => (list || []).every(it => it == 0)

@Component
export default class BrandsSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */

  @Prop() value!: any

  @Prop() businessParentTypeList!: any

  /**
   * 控制状态
   */
  @Prop({ type: Number, default: 1 }) controlStatus!: number

  /**
   * 提示文字
   */
  @Prop({ type: String, default: '品牌名称，输入文字进行筛选' }) placeholder!: string

  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inner: number = this.value

  list: any[] = []

  mounted() {
    this.init()
  }

  async init() {
    try {

    } catch (ex) {
      this.handleError(ex)
    }
  }

  loadData: any = async (item: any, callback: any) => {
    item.loading = true
    try {
      const { data } = await codeList(item.value)
      const query = [{
        key: '0',
        text: '本行业',
        isFake: true
      }].concat(data.dictionary)
      item.children = query.map((it: any) => {
        return {
          value: it.key,
          label: it.text
        }
      })
      item.loading = false
      callback()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  format(labels: any[], selectedData: any[]) {
    const list = selectedData.filter(it => it.value != '0').map(it => it.label)
    const result = list.length > 0 ? list.join(' / ') : ''
    return result
  }

  @Watch('value')
  watchValue(value: number) {
    this.inner = value
  }

  @Watch('inner')
  watchInner(value: number) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.power-select {
  min-width: 188px;
  /deep/ .ivu-select-input {
    position: relative;
    top: -1px;
  }
}

.offline {
  color: #bbb;
  font-style: normal;
}
</style>
