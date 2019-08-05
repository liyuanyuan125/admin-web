<template>
  <section class="fans-pane">
    <div class="action-bar">

      <Select
        v-model="channelCode"
        filterable
        clearable
        transfer
        class="search-select"
        placeholder="请选择平台"
        :disabled="disabled"
        @change="kolId = ''"
      >
        <Option
          v-for="(it, i) in channelList"
          :key="i"
          :value="it.key"
        >{{it.text}}</Option>
      </Select>

      <RemoteSelect
        v-model="kolId"
        :fetch="fetchWrap"
        class="search-select"
        style="margin-left: 10px;"
        placeholder="请输入KOL名称"
        :disabled=" !channelCode || channelCode == '' "
      />

      <Button
        type="primary"
        class="btn-add"
        :disabled="!(channelCode !== '' && kolId !== '') || !channelCode || !kolId"
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
        <div slot="channelCode" slot-scope="{ row: { channelCode } }">
          <span>{{getName(channelCode, channelList)}}</span>
        </div>
        <div slot="channelDataId" slot-scope="{ row: { channelDataId } }">
          <span>{{channelDataId}}</span>
        </div>
        <div slot="channelName" slot-scope="{ row: { channelName } }">
          <span>{{channelName}}</span>
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

  @Prop({ type: Array, default: () => [] }) channelList!: any[]

  @Prop({ type: Function }) fetch!: (channelCode: string, keyword: string) => Promise<AjaxResult>

  @Prop({ type: String, default: '' }) type!: string

  @Prop({ type: Boolean, default: false }) remote!: boolean

  @Prop({ type: Boolean, default: false }) disabled!: boolean

  // 双向绑定
  model = this.value

  // 获取字典的 text
  getName = getName

  // 所选平台code
  channelCode = ''

  // 所选kol id
  kolId: string = ''

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
      { title: this.type, slot: 'channelCode', align: 'center' },
      { title: '平台账号ID', slot: 'channelDataId', width: 120, align: 'center' },
      { title: '平台账号名称', slot: 'channelName', width: 120, align: 'center' },
      !this.disabled && { title: '操作', slot: 'action', width: 120, align: 'center' },
    ]
    .filter(it => !!it)
  }

  mounted() {}

  async fetchWrap(keyword = '') {
    if ( !this.channelCode || this.channelCode == '' ) {
      toast('请选择平台', { type: 'error' })
      return
    }
    const { data } = await this.fetch(this.channelCode, keyword)
    const items = data.items || null
    const res = (items as any[] || []).map(it => ({
      id: it.channelDataId,
      name: it.name
    }))
    this.idsList = res
    return res
  }

  exists(channelCode: string, kolId: string) {
    return this.model.find(it => (it.channelCode == channelCode) && (it.channelDataId == kolId)) != null
  }

  addItem() {
    if ( !this.channelCode || this.channelCode == '' ) {
      return toast('请选择平台', { type: 'error' })
    }
    const exists = this.exists(this.channelCode, this.kolId)
    if (exists) {
      return toast('已存在', { type: 'error' })
    }
    const channelItem = this.channelList.find(it => it.key == this.channelCode)!
    const idItem = this.idsList.find(it => it.id == this.kolId)!

    // console.log(channelItem)
    // console.log(idItem)

    this.model.push({
      channelCode: channelItem.key,
      channelDataId: idItem.id,
      channelName: idItem.name
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
