<template>
  <section class="fans-pane">
    <div class="action-bar">

      <RemoteSelect
        v-model="id"
        :fetch="fetchWrap"
        class="search-select"
        style="margin-left: 10px;"
        placeholder="请输入影片名称"
      />

      <Button
        type="primary"
        class="btn-add"
        :disabled="!id"
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
        <!-- <div slot="channelCode" slot-scope="{ row: { channelCode } }">
          <span>{{getName(channelCode, channelList)}}</span>
        </div>
        <div slot="channelDataId" slot-scope="{ row: { channelDataId } }">
          <span>{{channelDataId}}</span>
        </div>
        <div slot="channelName" slot-scope="{ row: { channelName } }">
          <span>{{channelName}}</span>
        </div> -->
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
import { findIndex } from 'lodash'
import { AjaxResult } from '@/util/types'

const getName = (key: string, list: any[]) => {
  const i: number = findIndex(list, (it: any) => {
    return key === it.key
  })
  const res: string = list[i].text || '-'
  return res
}

export interface IdName {
  id: number|string
  name: string
}

@Component({
  components: {
    RemoteSelect,
    FormInputNumber,
    InputHidden
  }
})
export default class KolsPane extends ViewBase {
  @Prop({ type: Array, default: () => [] }) value!: any[]

  @Prop({ type: Function }) fetch!: (keyword: string) => Promise<AjaxResult>

  @Prop({ type: String, default: '' }) type!: string

  @Prop({ type: Boolean, default: false }) remote!: boolean

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  // 双向绑定
  model: any[] = this.value

  // 所选 id
  id: number = 0

  // 枚举
  idsList: any[] = [
    // {
    //   id: 1,
    //   name: '账号名称1'
    // },
    // {
    //   id: 2,
    //   name: '账号名称2'
    // },
    // {
    //   id: 3,
    //   name: '账号名称3'
    // },
    // {
    //   id: 4,
    //   name: '账号名称4'
    // },
  ]

  get columns() {
    return [
      { title: '影片ID', align: 'center', key: 'id' },
      { title: '影片名称', key: 'name', minWidth: 150, align: 'center' },
      !this.disabled && { title: '操作', slot: 'action', align: 'center' },
    ]
    .filter(it => !!it)
  }

  mounted() {}

  async fetchWrap(keyword = '') {
    if ( keyword == '' ) {
      toast('请输入影片名称', { type: 'error' })
      return
    }
    const { data } = await this.fetch(keyword)
    const items = data.items || null
    const res = (items as any[] || []).map(it => ({
      id: it.id,
      name: it.name
    }))
    this.idsList = res
    return res
  }

  exists(id: number) {
    return this.model.find(it => (it.id == id)) != null
  }

  addItem() {
    if ( !this.id || this.id === 0 ) {
      return toast('请选择影片', { type: 'error' })
    }
    const exists = this.exists(this.id)
    if (exists) {
      return toast('已存在', { type: 'error' })
    }
    const idItem = this.idsList.find(it => it.id == this.id)!

    // console.log(idItem)

    this.model.push({
      id: idItem.id,
      name: idItem.name
    })
  }

  delItem(id: number) {
    const index = this.model.findIndex(it => it.id == id)
    index > -1 && this.model.splice(index, 1)
  }

  @Watch('value', { deep: true, immediate: true })
  watchValue(value: any[]) {
    !isEqual(this.model, value) && (this.model = value)
  }

  @Watch('model', { deep: true })
  watchModel(value: any[]) {
    !isEqual(this.value, value) && this.$emit('input', value)
  }
}
</script>

<style lang="less" scoped>
.fans-pane {
  width: 450px;
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
  width: 318px;
  margin-left: 10px;
}

.btn-add {
  margin-left: 10px;
}

.table-wrap {
  margin-top: 10px;
}
</style>
