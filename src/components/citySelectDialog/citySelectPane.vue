<template>
  <div class="city-select-pane">
    <!-- <div class="city-fast-row" v-if="fastList.length > 0">
      <label class="city-row-label">快速选择：</label>
      <div class="city-fast-list">
        <Checkbox
          v-for="it in fastList"
          :key="it.key"
          v-model="it.checked"
          :indeterminate="it.indeterminate"
          class="city-fast-item"
          @on-change="fastChange(it, $event)"
        >{{it.text}}</Checkbox>
      </div>
    </div> -->

    <div class="city-filter-row" v-if="cellData">
      <label class="city-row-label">查询：</label>
      <Select v-model="city" filterable clearable class="city-filter">
        <Option
          v-for="item in cityList"
          :key="item.id"
          :value="item.id"
        >{{item.name}}</Option>
      </Select>
    </div>

    <table class="city-table" v-if="cellData">
      <tr v-for="(row, i) in cellData" :key="i">
        <component
          v-for="cell in row"
          :key="cell.uqid"
          :is="cell.type == 'region' ? 'th' : 'td'"
          :rowspan="cell.rowspan"
          :colspan="cell.colspan"
        >
          <component
            :is="cell.type == 'province' ? 'dropdown' : 'span'"
            class="cell-inner"
            trigger="custom"
            transfer
            transfer-class-name="city-select-pane-transfer"
            :visible="cell.dropdownOpen"
            @on-clickoutside="dropdownClickOutside(cell, $event)"
            v-if="cell.type != 'empty'"
          >
            <span
              class="cell-label"
              :class="{
                'cell-label-hl': cell.type == 'city'
                  && cell.data.id == hightlightCityId
              }"
            >
              <Checkbox
                v-model="cell.checked"
                :indeterminate="cell.indeterminate"
                @on-change="cellCheckChange(cell)"
                class="city-check">
                <span class="city-name">{{cell.label}}</span>
                <em
                  class="city-count"
                  :class="{
                    'city-count-show': cell.selectedCityIds.length > 0
                      && cell.type == 'province'
                  }"
                >({{cell.selectedCityIds.length}})</em>
              </Checkbox>

              <div
                class="cell-pull-handle"
                @click="cell.dropdownOpen = !cell.dropdownOpen"
                v-if="cell.type == 'province'"
              >
                <Icon
                  type="ios-arrow-down"
                  class="cell-pull-icon"
                  v-if="cell.type == 'province'"
                />
              </div>
            </span>

            <DropdownMenu
              slot="list"
              :data-cell-uqid="cell.uqid"
              v-if="cell.type == 'province'"
            >
              <div class="city-dropdown-in">
                <h4 class="city-dropdown-name">
                  <span>{{cell.label}}</span>
                  <em v-if="cell.selectedCityIds.length > 0">({{cell.selectedCityIds.length}})</em>
                </h4>
                <CheckboxGroup
                  v-model="cell.selectedCityIds"
                  @on-change="dropdownCityChange(cell)"
                >
                  <table class="city-dropdown-table">
                    <tr v-for="(cityList, ii) in cell.cityChunk" :key="ii">
                      <td
                        v-for="city in cityList"
                        :key="city.id"
                        class="city-dropdown-item"
                        :class="{
                          'city-dropdown-item-hl': city.id == hightlightCityId
                        }"
                      >
                        <Checkbox :label="city.id">{{city.name}}</Checkbox>
                      </td>
                    </tr>
                  </table>
                </CheckboxGroup>
              </div>
            </DropdownMenu>
          </component>
        </component>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getGegionProvinceCity, getSubList, RegionSubList, AreaItem, AreaItemSubList } from './area'
import { chunk, flatMap, flatten, intersection, difference, isEqual, uniq } from 'lodash'
import { random } from '@/fn/string'
import { devWarn } from '@/util/dev'
import { toMap } from '@/fn/array'
import { MapType, KeyText } from '@/util/types'
import { getRelation, SetRelation } from './set'

interface RegionChunk extends RegionSubList {
  subChunk: AreaItemSubList[][]
}

interface FastItem extends KeyText {
  cityIds: number[]
  checked: boolean
  indeterminate: boolean
}

// 过滤掉脏数据
const filterDirty = (list: RegionSubList[]) => {
  const regionList = list
    // 没有任何省份的大区，被认为是脏数据
    .filter(region => (region.subList || []).length > 0)
    .map(region => {
      region.subList = region.subList
        // 没有任何城市的省份，也被认为是脏数据
        .filter(province => (province.subList || []).length > 0)
      return region
    })
  return regionList
}

const chunkData = (list: RegionSubList[], chunkSize = 4) => {
  const result = list.map(it => {
    const subChunk = chunk(it.subList, chunkSize)
    return { ...it, subChunk } as RegionChunk
  })
  return result
}

/** 单元格项 */
interface CellItem {
  /** 唯一 id */
  uqid: string

  /**
   * 类型，分别为：region 大区、province 省、city 城市（仅当平坦时）、empty 用作空填充
   */
  type: 'region' | 'province' | 'city' | 'empty'

  /** 单元格显示的文字 */
  label?: string

  /** 占据的行数 */
  rowspan?: number

  /** 占据的列数 */
  colspan: number

  /** 包含的城市 id 列表 */
  cityIds?: number[]

  /** 选中的城市 id 列表，type 为 province、city 才有 */
  selectedCityIds?: number[]

  /**
   * 原有的数据，对于大区来说，是 RegionChunk
   * 对于省份来说，是 AreaItemSubList
   * 对于平坦市来说，是 AreaItem
   */
  data?: RegionChunk | AreaItemSubList | AreaItem

  /** 选中状态 */
  checked?: boolean

  /** indeterminate 状态 */
  indeterminate?: boolean

  /** 将 cityList 分组 */
  cityChunk?: AreaItem[][]

  /** dropdown 是否展开 */
  dropdownOpen?: boolean

  /** 子级 cell，type 为 region 才有 */
  subCells?: CellItem[]

  /** 区域 cell，type 为 province、city 才有 */
  regionCell?: CellItem
}

const getCityIds = (cityList: AreaItem[] | null) => {
  const ids = flatMap(cityList, 'id') as number[]
  return ids
}

const provinceCityIds = (provinceList: AreaItemSubList[]) => {
  const cityList = flatMap(provinceList, 'subList') as AreaItem[]
  const ids = getCityIds(cityList)
  return ids
}

const cellData = (list: RegionSubList[], {
  chunkSize = 4,
  cityChunkSize = 3
} = {}) => {
  const chunkList = chunkData(list, chunkSize)
  const result = chunkList.reduce((rowList, item) => {
    const subCells: CellItem[] = []

    // 本身就是一项
    const regionCell: CellItem = {
      uqid: random('cell'),
      type: 'region',
      label: item.name,
      rowspan: item.subChunk.length,
      colspan: 1,
      cityIds: provinceCityIds(item.subList),
      selectedCityIds: [],
      data: item,
      checked: false,
      indeterminate: false,
      subCells
    }

    // 重复循环 subChunk
    const rows = item.subChunk.map(subList => {
      const row = subList.map(sub => {
        // 平坦市指的是：省份名称与城市名称，且省下有且只有本市的市，例如北京市、天津市
        const isFlat = (sub.subList || []).length == 1
          && sub.name == sub.subList[0].name
        const cityIds = getCityIds(sub.subList)

        const subCell: CellItem = {
          uqid: random('cell'),
          type: isFlat ? 'city' : 'province',
          label: sub.name,
          rowspan: 1,
          colspan: 1,
          cityIds,
          selectedCityIds: [],
          data: isFlat ? sub.subList[0] : sub,
          checked: false,
          indeterminate: false,
          cityChunk: !isFlat ? chunk(sub.subList, cityChunkSize) : [],
          dropdownOpen: false,
          regionCell
        }

        subCells.push(subCell)

        return subCell
      })

      // 填充一个空 cell
      if (row.length < chunkSize) {
        row.push({
          uqid: random('cell'),
          type: 'empty',
          colspan: chunkSize - row.length
        })
      }

      return row
    })

    // 将本身这项加到最前面
    rows[0].unshift(regionCell)

    rowList = rowList.concat(rows)

    return rowList
  }, [] as CellItem[][])

  return result
}

const gradeSorts = [
  'first-tier',
  'new-first-tier',
  'second-tier',
  'third-tier',
  'four-tier',
  'five-tier',
  'six-tier'
]

const getGradeList = (list: RegionSubList[]) => {
  const provinceList = flatMap(list, 'subList')
  const cityList = flatMap(provinceList, 'subList') as AreaItem[]

  const gradeMap = cityList.reduce((map, item) => {
    const { id, grade: key, gradeName: text } = item
    if (key && text) {
      const fast = map[key] || (map[key] = {
        key,
        text,
        cityIds: [],
        checked: false,
        indeterminate: false,
      })
      fast.cityIds.push(id)
    }
    return map
  }, {} as MapType<FastItem>)

  const result = Object.values(gradeMap)
    .sort((a, b) => gradeSorts.indexOf(a.key as string)
      - gradeSorts.indexOf(b.key as string))
  return result
}

@Component
export default class CitySelectPane extends ViewBase {
  /** 城市 ids */
  @Prop({ type: Array, default: () => [] }) value!: number[]

  /** 票仓城市 Top20 城市 ids */
  @Prop({ type: Array, default: () => [] }) topCityIds!: number[]

  model: number[] = []

  list: RegionSubList[] = []

  cellData: CellItem[][] | null = null

  city: AreaItem | null = null

  hightlightCityId: number | null = null

  fastList: FastItem[] = []

  lastUncheckedFastItem: FastItem | null = null

  get cityList() {
    const provinceList = flatMap(this.list, 'subList') as AreaItemSubList[]
    const cityList = flatMap(provinceList, 'subList') as AreaItem[]
    return cityList
  }

  get allCityIds() {
    return this.cityList.map(it => it.id)
  }

  get cellList() {
    const list = flatten(this.cellData)
    return list
  }

  // 当数据结构比较复杂时，使用 get + watch，比单独的 watch 更方便
  get allSelectedCityIds() {
    const idsList = this.cellList
      .filter(it => it.selectedCityIds != null)
      .map(it => it.selectedCityIds!)
    const ids = flatten(idsList)
    return ids
  }

  async created() {
    try {
      const list = await getGegionProvinceCity()
      this.list = filterDirty(list)
      this.cellData = cellData(this.list)
      this.updateTable()

      const gradeList = getGradeList(this.list)
      this.fastList = [
        { key: 'all', text: '全国', cityIds: [], checked: false, indeterminate: false },
        // { key: 'top', text: '票仓城市Top20', cityIds: this.topCityIds, checked: false, indeterminate: false },
        // ...gradeList
      ]
      this.updateFast()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  cellCheckChange(cell: CellItem) {
    const name = `${cell.type}Change`
    const action = (this as any)[name] as (cell: CellItem) => any
    action && action.call(this, cell)
  }

  regionChange(cell: CellItem) {
    const checked = cell.checked
    cell.subCells!.forEach(it => {
      it.selectedCityIds = checked ? it.cityIds!.slice() : []
      this.updateProvinceCell(it, false)
    })
    this.updateRegionCell(cell)
  }

  provinceChange(cell: CellItem) {
    cell.selectedCityIds = cell.checked ? cell.cityIds!.slice() : []
    this.updateProvinceCell(cell)
  }

  cityChange(cell: CellItem) {
    cell.selectedCityIds = cell.checked ? cell.cityIds!.slice() : []
    this.updateRegionCell(cell.regionCell!)
  }

  updateTable() {
    const cityIds = this.value
    this.cellList.map(cell => {
      if (cell.type == 'city') {
        const { id } = cell.data as AreaItem
        cell.checked = cityIds.includes(id)
      }
      if (cell.type == 'city' || cell.type == 'province') {
        cell.selectedCityIds = intersection(cityIds, cell.cityIds!)
      }
      return cell
    })
    .filter(cell => cell.type == 'province')
    .forEach(cell => {
      this.updateProvinceCell(cell)
    })
  }

  updateRegionCell(cell: CellItem) {
    const total = cell.cityIds!.length
    const selectedIds = intersection(cell.cityIds!, this.allSelectedCityIds)
    const selectedCount = selectedIds.length
    cell.checked = selectedCount == total
    cell.indeterminate = 0 < selectedCount && selectedCount < total
  }

  updateProvinceCell(cell: CellItem, updateRegion = true) {
    const total = cell.cityIds!.length
    const selectedCount = cell.selectedCityIds!.length
    cell.checked = selectedCount == total
    cell.indeterminate = 0 < selectedCount && selectedCount < total
    updateRegion && this.updateRegionCell(cell.regionCell!)
  }

  dropdownCityChange(cell: CellItem) {
    this.updateProvinceCell(cell)
  }

  dropdownClickOutside(cell: CellItem, ev: MouseEvent) {
    const target = ev.target as Element
    if (target != null) {
      const el = target.closest('[data-cell-uqid]') as HTMLElement
      if (el != null && el.dataset.cellUqid == cell.uqid) {
        return
      }
    }
    cell.dropdownOpen = false
  }

  updateFast() {
    this.fastList.forEach((it, i) => {
      const selectedIds = this.allSelectedCityIds
      if (i == 0) {
        const allCount = this.allCityIds.length
        const selectedCount = selectedIds.length
        it.checked = selectedCount == allCount
        it.indeterminate = 0 < selectedCount && selectedCount < allCount
      } else {
        const rel = getRelation(it.cityIds, selectedIds)
        it.checked = rel == SetRelation.Equal || rel == SetRelation.AInB
        it.indeterminate = rel == SetRelation.Half
      }
    })
  }

  fastChange(item: FastItem) {
    // 记录下最后不选的项，以供 watchFastList 使用
    item.checked || (this.lastUncheckedFastItem = item)
  }

  @Watch('value')
  watchValue(value: number[]) {
    this.model = value
    this.updateTable()
    this.updateFast()
  }

  @Watch('model')
  watchModel(value: number[]) {
    if (!isEqual(value, this.value)) {
      this.$emit('input', value)
    }
  }

  @Watch('city')
  watchCity(cityId: number | null) {
    this.hightlightCityId = cityId

    if (cityId == null) {
      return
    }

    const cell = this.cellList.find(it => {
      const ids = it.type == 'province' ? it.cityIds : []
      return (ids || []).includes(cityId)
    })

    cell && (cell.dropdownOpen = true)
  }

  @Watch('allSelectedCityIds')
  watchAllSelectedCityIds(ids: number[]) {
    this.model = ids
  }

  @Watch('fastList', { deep: true })
  watchFastList(list: FastItem[]) {
    const uncheckedItem = this.lastUncheckedFastItem
    this.lastUncheckedFastItem = null

    // 若全国被取消选择，快速清空
    if (uncheckedItem != null
      && uncheckedItem.key == 'all'
      && !uncheckedItem.checked) {
      this.model = []
      return
    }

    // 若非全国被反选，设置全国选择状态
    if (uncheckedItem != null
      && uncheckedItem.key != 'all'
      && !uncheckedItem.checked) {
      this.fastList[0].checked = false
      this.fastList[0].indeterminate = this.model.length > 0
    }

    // 如果全国被选择，不要排斥其他选项
    if (list[0].checked) {
      // this.fastList.forEach((it, i) => i > 0 && (it.checked = false))
      this.model = this.allCityIds
    } else {
      // 将所有被选中的，添加到集合中
      const checkedList = list.filter(it => it.checked)
      const checkedIds = flatMap(checkedList, 'cityIds') as number[]
      const unionIds = checkedIds.concat(this.model)

      // 从集合中，减去最后被取消选择的项
      const diffIds = uncheckedItem ? difference(unionIds, uncheckedItem.cityIds) : unionIds

      const uniqIds = uniq(diffIds)
      this.model = uniqIds
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

@c-button: #3398db;
@c-button-resource: #3b98ff;

.city-select-pane {
  user-select: none;
}

.city-filter {
  width: 188px;
}

.city-table {
  margin-top: 20px;
  border-collapse: collapse;
  th, td {
    border: 1px solid #e8e8e8;
  }
}

.cell-inner,
.cell-label {
  position: relative;
  display: inline-block;
  width: 100%;
}

.cell-label {
  display: flex;
}

.city-check {
  padding: 5px 8px;
  margin: 0;
  white-space: nowrap;
}

.city-count {
  display: inline-block;
  min-width: 24px;
  visibility: hidden;
}

.city-count-show {
  visibility: visible;
}

.cell-pull-handle {
  position: relative;
  flex: 1;
  min-width: 28px;
  cursor: pointer;
  &:hover .cell-pull-icon {
    color: @c-button;
    .theme-resource & {
      color: @c-button-resource;
    }
  }
}

.cell-pull-icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.city-dropdown-in {
  padding: 1px 15px 11px;
}

.city-dropdown-name {
  border-bottom: 1px solid #e8e8e8;
  line-height: 30px;
  font-size: 14px;
}

.city-dropdown-table {
  margin-top: 8px;
  td {
    padding: 1px 0 1px 8px;
    border-radius: 4px;
  }
}

.city-dropdown-item {
  label {
    white-space: nowrap;
  }
}

.cell-label-hl,
.city-dropdown-item-hl {
  background-color: lighten(@c-button, 30%);
}

.city-fast-row,
.city-filter-row {
  display: flex;
  line-height: 32px;
  margin-top: 10px;
}

.city-row-label {
  min-width: 66px;
  text-align: right;
}

.city-fast-item {
  margin-right: 18px;
  &:last-child {
    margin-right: 0;
  }
}
.city-select-pane-transfer[data-transfer=true] {
  max-height: 666px;
  padding: 0;
  user-select: none;
}
</style>
