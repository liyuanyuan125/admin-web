<template>
  <div class="week-date-picker">
    <DatePicker
      v-model="pickerModel"
      :open="pickerOpen"
      @on-clickoutside="pickerOpen = false"
      transfer
      ref="picker"
    >
      <Input
        :value="displayValue"
        :icon="hover && displayValue ? 'ios-close-circle' : 'ios-calendar-outline'"
        :placeholder="placeholder"
        @click.native="pickerOpen = true"
        @on-focus="pickerOpen = true"
        @mouseenter.native="hover = true"
        @mouseleave.native="hover = false"
        @on-click="onClickIcon"
      />
    </DatePicker>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Vue from 'vue'
import WeekView from './weekView.vue'
import { toRange, findChildren } from './util'

@Component
export default class WeekDatePicker extends ViewBase {
  /**
   * model，Date 数组
   */
  @Prop({ type: Array, default: () => [null, null] }) value!: Array<Date | null>

  /**
   * 星期开始，0 表示周日，1 ~ 6 表示周一 ~ 周六
   *
   * 默认周四：为电影行业优化
   */
  @Prop({ type: Number, default: 4 }) weekStart!: 0 | 1 | 2 | 3 | 4 | 5 | 6

  @Prop({ type: String, default: '请选择' }) placeholder!: string

  model: Array<Date | null> = [null, null]

  pickerModel = new Date

  weekView: WeekView | null = null

  pickerOpen = false

  hover = false

  get displayValue() {
    const [start, end] = this.value
    return toRange(start, end) || ''
  }

  mounted() {
    this.insertWeekView()
    this.watchDatePane()
  }

  public clear() {
    this.model = [null, null]
  }

  // 硬插入 weekVue 实例
  // TODO: 黑魔法，注意升级 iview 后的影响
  insertWeekView() {
    const cells = findChildren(this.$refs.picker as Vue, 'ivu-date-picker-cells')
    const cellsEl = cells!.$el
    const viewBox = document.createElement('div')
    cellsEl.after ? cellsEl.after(viewBox) : cellsEl.parentElement!.appendChild(viewBox)

    this.weekView = new WeekView({
      propsData: {
        weekStart: this.weekStart
      }
    }).$mount(viewBox)
    this.updateWeekView()
    this.weekView.$on('change', ([start, end]: Array<Date | null>) => {
      this.model = [start, end]
      this.pickerOpen = false
    })
  }

  // 利用 vue 未文档化的 api，监听内部组件状态的改变
  // TODO: 黑魔法，注意升级 iview 后的影响
  watchDatePane() {
    const panelVue = findChildren(this.$refs.picker as Vue, 'ivu-picker-panel-body-wrapper') as Vue
    // 添加一个又臭又长的类名，以便可以在 transfer 模式下样式化
    panelVue!.$el.classList.add('week-date-picker-panel-body-wrapper')

    const watchHandler = () => {
      const view = (panelVue as any).pickerTable as string
      const date = (panelVue as any).panelDate as Date
      if (view == 'date-table') {
        this.weekView!.monthDate = date
      }
    }
    panelVue.$watch('pickerTable', watchHandler)
    panelVue.$watch('panelDate', watchHandler)
    // 手动调用一次，以便初始化
    watchHandler()
  }

  updateWeekView() {
    if (this.weekView) {
      const value = this.value
      this.weekView.selected = value && value[0]
    }
  }

  onClickIcon(ev: MouseEvent) {
    if (this.hover && this.displayValue) {
      ev.stopPropagation()
      this.clear()
    }
  }

  @Watch('value', { immediate: true })
  watchValue(value: Array<Date | null>) {
    this.model = value
    this.updateWeekView()
    this.pickerModel = value && value[0] || new Date
  }

  @Watch('model')
  watchModel(value: Array<Date | null>) {
    this.$emit('input', value)
  }
}
</script>

<style lang="less">
.week-date-picker-panel-body-wrapper {
  .ivu-picker-panel-content {
    position: relative;
  }
  .ivu-date-picker-cells {
    position: relative;
    visibility: hidden;
    z-index: 900;
    background-color: #fff;
  }
  .ivu-date-picker-cells-month,
  .ivu-date-picker-cells-year {
    visibility: visible;
    z-index: 980;
  }
}
</style>

<style lang="less" scoped>
@import '~@/site/lib.less';

.week-date-picker {
  position: relative;
  display: inline-block;
  user-select: none;
  /deep/ .ivu-date-picker {
    width: 100%;
  }
}

.week-date-handle {
  display: inline-block;
  line-height: 28px;
  color: @c-base;

  &:hover {
    color: shade(@c-base, 10%);
  }

  i, label {
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }
  label {
    margin-left: 4px;
  }
}
</style>
