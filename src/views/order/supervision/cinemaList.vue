<template>
  <Select 
    v-model="inValue" 
    placeholder="资源方影院" 
    filterable
    clearable 
    class="component"
    remote
    :loading="loading"
    :remote-method="remoteMethod"
    @on-clear="list = []"
    ref="ui">
    <Option v-for="it in list" :key="it.id" :value="it.id"
      :label="it.shortName" class="flex-box">
      <span>{{it.shortName}}</span>
    </Option>
  </Select>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList  } from '@/api/cinema'
import { clean } from '@/fn/object'

@Component
export default class CinemaChainSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Number, default: null }) value!: any
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '影院名称' }) placeholder!: string
  // @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: any = this.value

  list: any = []
  loading = false

  async mounted() {
    // try {
    //   const { data } =  await queryList({pageSize: 666666})
    //   const list: any[] = data.items || []
    //   this.list = list
    // } catch (ex) {
    //   this.handleError(ex)
    // }
    this.remoteMethod('')
  }

  async remoteMethod(querys: any) {
    try {
      if (querys) {
        this.loading = true
        const {
          data: { items }
        } = await queryList({
          name: querys,
        })
        this.list = items || []
      }
      this.loading = false
    } catch (ex) {
      this.handleError(ex)
      this.loading = false
    }
  }

  @Watch('value')
  watchValue(val: number) {
    this.inValue = val
    // 触发 form item 验证
    ; (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', val)
  }

  @Watch('inValue')
  watchInValue(val: number) {
    this.$emit('input', val)
    const row = this.list.filter((item: any) => item.id == val)
    this.$emit('row', row)
  }
}
</script>

<style lang="less" scoped>
.component {
  min-width: 188px;
}
.offline {
  color: #bbb;
  font-style: normal;
}
</style>
