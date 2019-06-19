<template>
    <Select v-if="placeholder != '影片名称'"  v-model="inValue" :placeholder="placeholder" filterable
      clearable class="component" ref="ui">
      <Option v-for="it in list" :key="it.id" :value="it.companyId"
        :label="it.companyName" class="flex-box">
        <span>{{it.companyName}}</span>
      </Option>
    </Select>
    <Select v-else v-model="inValue" :placeholder="placeholder" filterable
      clearable class="component" ref="ui">
      <Option v-for="it in list" :key="it.id" :value="it.movieId"
        :label="it.movieName" class="flex-box">
        <span>{{it.movieName}}</span>
      </Option>
    </Select>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList } from '@/api/clientFilm'
import { clean } from '@/fn/object'

@Component
export default class CinemaChainSelect extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  // @Prop({ type: any, default: null }) value!: any
  @Prop({ default: '' }) typeCode!: string
  @Prop({ default: true }) type!: boolean
  /**
   * 提示文字
   */
  @Prop({ type: String, default: '申请人公司名称' }) placeholder!: string
  @Prop({ type: Boolean, default: true }) clearable!: boolean

  inValue: any = null

  list: any[] = []

  async mounted() {
    try {
      const { data } =  await queryList(clean({
        pageSize: 888888,
      }))
      const list: any[] = data.items || []
      this.list = list
    } catch (ex) {
      this.handleError(ex)
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
