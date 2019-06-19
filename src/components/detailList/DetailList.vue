<template>
  <section class="detail-list">
    <div v-for="(group, i) in groupList" :key="i" class="detail-item flex-box">
      <div v-for="(it, si) in group" :key="si" :class="`flex-${it.span || 1} flex-box`">
        <label>{{it.label}}：</label>
        <em>{{it.value}}</em>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { DetailItem } from './types'

@Component
export default class DetailList extends ViewBase {
  /**
   * 值列表
   */
  @Prop({ type: Array, default: () => [] }) list!: DetailItem[]

  get groupList() {
    let totalSpan = 0
    const result = this.list.reduce((ret, it) => {
      const index = Math.floor(totalSpan / 3)
      ; (ret[index] || (ret[index] = [])).push(it)
      totalSpan += it.span || 1
      return ret
    }, [] as DetailItem[][])
    return result
  }
}
</script>

<style lang="less" scoped>
.detail-list {
  line-height: 2;
  padding: 10px 15px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  label {
    display: inline-block;
    min-width: 80px;
    text-align: right;
  }
  em {
    color: #19be6b;
    font-style: normal;
  }
}
</style>
