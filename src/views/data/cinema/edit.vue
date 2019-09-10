<template>
  <div class="edit-page">
    <EditForm
      :fields="fields"
      :fetch="fetch"
      :submit="submit"
      :hideSubmit="isView"
      :labelWidth="88"
      @done="onDone"
      ref="editForm"
    >
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field, Validator } from '@/components/editForm'
import { queryItem, addItem, updateItem } from '@/api/cinema'
import { alert, success } from '@/ui/modal'
import { MapType } from '@/util/types'
import { devLog } from '@/util/dev'

const actionMap: MapType<any> = {
  new: addItem,
  edit: updateItem,
  view: null,
}

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) action!: 'new' | 'edit' | 'view'

  get editForm() {
    return this.$refs.editForm as EditForm
  }

  get isNew() {
    return this.action == 'new'
  }

  get isEdit() {
    return this.action == 'edit'
  }

  get isView() {
    return this.action == 'view'
  }

  get fields() {
    const isNew = this.isNew
    const isView = this.isView
    const readonly = isView

    const list: Field[] = [
      {
        name: 'id',
        defaultValue: this.id,
      },

      {
        name: 'shortName',
        defaultValue: '',
        label: '影城名称',
        span: 16,
      },
    ]

    return list
  }

  submit = actionMap[this.action]

  filterCinema: ((item: any) => any) | null = null

  async fetch() {
    const data = await queryItem({
      id: this.id
    })
    return data
  }

  async onDone() {
    await success('操作成功')
    this.$router.back()
  }
}
</script>

<style lang="less" scoped>
</style>
