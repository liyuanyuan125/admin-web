<template>
  <div class="week-view">
    <ul class="week-table" v-if="monthDate != null">
      <li class="week-name-row">
        <em v-for="(name, i) in weekNames" :key="i" class="week-name-cell">{{name}}</em>
      </li>
      <li
        v-for="(group, i) in cellGroup"
        :key="i"
        class="week-row"
        :class="{ 'week-row-on': group.selected }"
        @click="selectRow(group.list[0].value)">
        <em
          v-for="it in group.list"
          :key="it.index"
          class="week-cell"
          :class="{
            'week-cell-prev': it.type == 'prevMonth',
            'week-cell-next': it.type == 'nextMonth',
            'week-cell-today': it.type == 'today'
          }">{{it.desc}}</em>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsCalendar from 'js-calendar'
import { clearHours, isInRange, thisWeek, weekNames } from './util'
import { chunk } from 'lodash'

interface Cell {
  date: Date
  desc: number
  index: number
  type: 'prevMonth' | 'monthDay' | 'today' | 'nextMonth'
  week: number
  year: number
  value?: number
}

@Component
export default class WeekView extends ViewBase {
  /**
   * 星期开始，0 表示周日，1 ~ 6 表示周一 ~ 周六
   *
   * 默认周四：为电影行业优化
   */
  @Prop({ type: Number, default: 0 }) weekStart!: 0 | 1 | 2 | 3 | 4 | 5 | 6

  // 被选中的开始日期
  selected: Date | null = null

  monthDate = new Date

  /** 根据给定的 weekStart 与 selected，计算出本周的开始、结束 Date */
  get selectedRange() {
    if (this.selected == null) {
      return [0, 0]
    }
    const [start, end] = thisWeek(this.selected, this.weekStart)
    return [clearHours(start), clearHours(end)]
  }

  get calendar() {
    const result = new jsCalendar.Generator({
      onlyDays: true,
      weekStart: this.weekStart
    })
    return result as any
  }

  // 下面部分算法，摘抄自 iview 源码
  get cells() {
    const tableYear = this.monthDate.getFullYear()
    const tableMonth = this.monthDate.getMonth()
    const today = clearHours(Date.now())

    const result = this.calendar(tableYear, tableMonth, (cell: Cell) => {
      // normalize date offset from the dates provided by jsCalendar
      if (cell.date instanceof Date) {
        cell.date.setTime(cell.date.getTime() + cell.date.getTimezoneOffset() * 60000)
      }

      const time = cell.date && clearHours(cell.date)
      return {
        ...cell,
        type: time === today ? 'today' : cell.type,
        value: time
      }
    })
    .cells

    return result as Cell[]
  }

  get cellGroup() {
    const [start, end] = this.selectedRange
    const group = chunk(this.cells, 7)
    const result = group.map(list => ({
      list,
      selected: isInRange(list[0].value!, start, end)
    }))
    return result
  }

  get weekNames() {
    return weekNames(this.weekStart)
  }

  selectRow(time: number) {
    this.selected = new Date(time)
    const [start, end] = this.selectedRange
    this.$emit('change', [new Date(start), new Date(end)])
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.week-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  z-index: 910;
  margin-top: -4px;
}

.week-table {
  line-height: 24px;
}

.week-name-row,
.week-row {
  display: flex;
  margin: 1px 0;
  padding: 2px 0;
}

.week-row {
  cursor: pointer;
}

.week-row-on,
.week-row:hover {
  background-color: lighten(@c-base, 36%);
  border-radius: 38px;
}

.week-row-on {
  .week-cell {
    &:first-child,
    &:last-child {
      border-radius: 50%;
      color: #fff;
      background-color: @c-base;
    }
  }
}

.week-name-cell,
.week-cell {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  text-align: center;
  margin: 0 2px;
  border-radius: 3px;
  font-style: normal;
}

.week-name-cell,
.week-cell-prev,
.week-cell-next {
  color: #c5c8ce;
}

.week-cell-today {
  box-shadow: inset 0 0 0 1px @c-base;

  &::after {
    content: '';
    position: absolute;
    top: 1px;
    right: 1px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: @c-base;
  }
}
</style>
