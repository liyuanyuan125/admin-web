<template>
  <section class="brand-pane">
    <div class="action-bar">
      <RemoteSelect
        v-model="id"
        :fetch="searchBrandByName"
        class="brand-select"
        placeholder="请输入品牌名"
      />

      <Button
        type="primary"
        class="brand-add"
        :disabled="!(id > 0)"
        @click="addBrand"
      >添加进品牌列表</Button>
    </div>

    <div class="table-wrap">
      <Table
        :columns="columns"
        :data="list"
        size="small"
        stripe
        border
      >
        <div slot="status" slot-scope="{ row: { hasBind } }">
          {{hasBind ? '已绑定' : '-'}}
        </div>

        <div slot="action" slot-scope="{ row: { id, hasBind } }">
          <a class="brand-del" @click="delBrand(id)" v-if="!hasBind">删除</a>
        </div>
      </Table>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { isEqual } from 'lodash'
import { searchBrand } from './data'
import { Brand, BrandBind } from './types'
import { alert } from '@/ui/modal'
import RemoteSelect from '@/components/remoteSelect'

@Component({
  components: {
    RemoteSelect
  }
})
export default class BrandPane extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: number[]

  /** 已绑定的列表 */
  @Prop({ type: Array, default: () => [] }) bindList!: Brand[]

  model = this.value

  id = 0

  selectList: Brand[] = []

  list: BrandBind[] = []

  get columns() {
    return [
      { type: 'index', title: '序号', width: 60, align: 'center' },
      { title: '品牌ID', key: 'id', width: 80, align: 'center' },
      { title: '品牌中文名称', key: 'name', align: 'center' },
      { title: '状态', slot: 'status', align: 'center' },
      { title: '操作', slot: 'action', align: 'center' },
    ]
  }

  async searchBrandByName(name: string) {
    const list = await searchBrand({ name })
    this.selectList = list
    return list
  }

  addBrand() {
    const exists = this.exists(this.id)
    if (exists) {
      alert('品牌已存在')
      return
    }
    const item = this.selectList.find(it => it.id == this.id)!
    this.list.push({ ...item, hasBind: false })
  }

  delBrand(id: number) {
    const index = this.list.findIndex(it => it.id == id)
    index > -1 && this.list.splice(index, 1)
  }

  exists(brandId: number) {
    return this.list.find(it => it.id == brandId) != null
  }

  @Watch('value')
  watchValue(value: number[]) {
    if (!isEqual(value, this.model)) {
      this.model = value
    }
  }

  @Watch('model')
  watchModel(value: number[]) {
    if (!isEqual(value, this.value)) {
      this.$emit('input', value)
    }
  }

  @Watch('list')
  watchList(value: BrandBind[]) {
    const ids = this.list.map(it => it.id)
    this.model = ids
  }

  @Watch('bindList', { immediate: true })
  watchBindList(bindList: Brand[]) {
    const list = bindList
    .filter(it => !this.exists(it.id))
    .map(it => ({
      ...it,
      hasBind: true
    }) as BrandBind)
    this.list = list.concat(this.list)
  }
}
</script>

<style lang="less" scoped>
.brand-pane {
  width: 659px;
}

.action-bar {
  display: flex;
}

.brand-select {
  width: 300px;
}

.brand-add {
  margin-left: 10px;
}

.table-wrap {
  margin-top: 10px;
}
</style>


