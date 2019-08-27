<template>
  <div>
    <Cascader
     ref='ui'
     :disabled='disabled'
     v-model='inner'
     :data="businessParentTypeList"
     :load-data="loadData"
     :render-format="format"
     ></Cascader>
     <!-- <span v-show='disabled' >{{ui}}11111111</span> -->
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

  @Prop({ default: false }) disabled!: any

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
  ui: any = null

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
  watchValue(value: any) {
    this.inner = value
  }

  @Watch('inner')
  watchInner(value: any) {
    const val = value.filter((it: any) => it != '0')
    this.$emit('input', value)
    ; (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', value)
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

/deep/ .ivu-input[disabled], fieldset[disabled] .ivu-input {
  border: 1px solid #fff;
  background-color: #fff;
  color: #717975;
}
/deep/ .ivu-cascader-disabled i {
  display: none;
}
</style>
