<template>
  <section class="fans-pane">
    <div class="action-bar">
      <RemoteSelect
        v-model="id"
        :fetch="fetchWrap"
        class="search-select"
        placeholder="请输入名称"
        :disabled="disabled"
        v-if="remote"
      />

      <Select
        v-model="id"
        filterable
        clearable
        transfer
        class="search-select"
        placeholder="请选择"
        :disabled="disabled"
        v-else
      >
        <Option
          v-for="(it, i) in selectList"
          :key="i"
          :value="it.id"
        >{{it.name}}</Option>
      </Select>

      <InputNumber
        v-model="ratio"
        :min="0"
        :max="100"
        placeholder="粉丝数占比"
        :disabled="disabled"
        class="ratio-input"
        :formatter="value => `${value > 0 ? value : ''}`"
        :parser="value => `${parseInt(value, 10) || 0}`"
      />

      <Button
        type="primary"
        class="btn-add"
        :disabled="!(id > 0 && ratio > 0)"
        @click="addItem"
      >添加进列表</Button>
    </div>

    <InputHidden v-model="hiddenModel"/>

    <div class="table-wrap">
      <Table
        :columns="columns"
        :data="model"
        size="small"
        stripe
        border
        disabled-hover
      >
        <div slot="value" slot-scope="{ row: { value } }">
          <span>{{value}}%</span>
        </div>
        <div slot="action" slot-scope="{ row: { id } }">
          <a class="act-del" @click="delItem(id)">删除</a>
        </div>
      </Table>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { isEqual } from 'lodash'
import { toast } from '@/ui/modal'
import RemoteSelect from '@/components/remoteSelect'
import NumberInput from '@/components/numberInput'
import InputHidden from '@/components/inputHidden'

export interface IdName {
  id: number
  name: string
}

export interface FansItem extends IdName {
  value: number
}

@Component({
  components: {
    RemoteSelect,
    NumberInput,
    InputHidden
  }
})
export default class FansPane extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: FansItem[]

  @Prop({ type: Function }) fetch!: (keyword: string) => Promise<IdName[]>

  @Prop({ type: String, default: '' }) type!: string

  @Prop({ type: Boolean, default: false }) remote!: boolean

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  model = this.value

  // 用于触发 FormItem 的验证
  hiddenModel = ''

  id = 0

  ratio = 0

  selectList: IdName[] = []

  get columns() {
    return [
      { title: this.type, key: 'name', align: 'center' },
      { title: '粉丝数占比', slot: 'value', width: 120, align: 'center' },
      { title: '操作', slot: 'action', width: 120, align: 'center' },
    ]
  }

  mounted() {
    this.fetchWrap()
  }

  async fetchWrap(keyword = '') {
    const list = await this.fetch(keyword)
    this.selectList = list
    return list
  }

  exists(id: number) {
    return this.model.find(it => it.id == id) != null
  }

  addItem() {
    const exists = this.exists(this.id)
    if (exists) {
      return toast('已存在', { type: 'error' })
    }
    const item = this.selectList.find(it => it.id == this.id)!
    this.model.push({ ...item, value: this.ratio })
  }

  delItem(id: number) {
    const index = this.model.findIndex(it => it.id == id)
    index > -1 && this.model.splice(index, 1)
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: FansItem[]) {
    !isEqual(this.model, value) && (this.model = value)
    this.hiddenModel = value.map(it => it.value).join(',')
  }

  @Watch('model', { deep: true })
  watchModel(value: FansItem[]) {
    !isEqual(this.value, value) && this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.fans-pane {
  width: 388px;
}

.action-bar {
  display: flex;
}

.search-select {
  // 消除 form-item-error 带来的影响
  /deep/ .ivu-select-selection {
    border-color: #dcdee2 !important;
  }
  /deep/ .ivu-select-arrow {
    color: #808695 !important;
  }
}

.ratio-input {
  display: inline-flex;
  width: 280px;
  margin-left: 10px;

  /deep/ input {
    text-align: center;
  }

  /deep/ .ivu-input-number-handler-wrap {
    display: none;
  }

  &::after {
    content: '%';
    display: inline-block;
    min-width: 36px;
    height: 100%;
    text-align: center;
    background-color: #f8f8f9;
    border-left: 1px solid #dcdee2;
  }
}

.btn-add {
  margin-left: 10px;
}

.table-wrap {
  margin-top: 10px;
}
</style>


