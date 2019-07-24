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

      <FormInputNumber
        v-model="ratio"
        :min="0"
        :max="100"
        :disabled="disabled"
        placeholder="粉丝数占比"
        append="%"
        class="ratio-input"
      />

      <Button
        type="primary"
        class="btn-add"
        :disabled="!(id > 0 && ratio > 0)"
        @click="addItem"
      >添加进列表</Button>
    </div>

    <InputHidden :value="model"/>

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
import { FormInputNumber } from '@/components/editForm'
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
    FormInputNumber,
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

  id = 0

  ratio = 0

  selectList: IdName[] = []

  get columns() {
    return [
      { title: this.type, key: 'name', align: 'center' },
      { title: '粉丝数占比', slot: 'value', width: 120, align: 'center' },
      !this.disabled && { title: '操作', slot: 'action', width: 120, align: 'center' },
    ]
    .filter(it => !!it)
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
  width: 242px;
  margin-left: 10px;
}

.btn-add {
  margin-left: 10px;
}

.table-wrap {
  margin-top: 10px;
}
</style>
