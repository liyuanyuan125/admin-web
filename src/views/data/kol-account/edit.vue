<template>
  <div class="edit-page">
    <EditForm
      :fields="fields"
      :fetch="fetch"
      queryKeys="id,channel"
    >
    </EditForm>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import EditForm, { Field } from '@/components/editForm'
import { queryItem } from './data'

type Action = 'edit' | 'audit'

@Component({
  components: {
    EditForm
  }
})
export default class EditPage extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number

  @Prop({ type: String, default: '' }) channel!: string

  @Prop({ type: String, default: '' }) action!: Action

  fields: Field[] = [
    {
      name: 'id',
      defaultValue: this.id,
    },

    {
      name: 'channel',
      defaultValue: this.channel,
    },

    {
      name: 'channelDataId',
      defaultValue: '',
      type: 'text',
      label: '账号',
      span: 8,
      group: '基本信息',
    },

    {
      name: 'photo',
      defaultValue: '',
      label: '头像',
      span: 8,
      image: true
    },

    {
      name: 'name',
      defaultValue: '',
      type: 'text',
      label: '账号名称',
      span: 24
    },

    {
      name: 'customIntroduction',
      defaultValue: '',
      type: 'input',
      label: '功能介绍',
      span: 22
    },

    {
      name: 'accountCategoryCode',
      defaultValue: '',
      type: 'select',
      label: '账号分类',
      required: true,
      span: 6,
      enumKey: 'accountCategoryList',
    },

    {
      name: 'area',
      defaultValue: [0, 0],
      label: '所在地区',
      span: 8,
      area: {
        maxLevel: 2,
        noSelf: true,
      },
      dealParam: ([provinceId, cityId]: number[]) => ({
        provinceId: provinceId || 0,
        cityId: cityId || 0,
      }),
      backfillParam: ({ provinceId, cityId }: any) => [
        provinceId || 0,
        cityId || 0,
      ]
    },

    {
      name: 'type',
      defaultValue: 0,
      type: 'select',
      label: '账号类型',
      span: 8,
      enumKey: 'typeList',
    },

    // TODO: 暂时用 select 展现，需要开发 toggle 组件
    {
      name: 'auth',
      defaultValue: 0,
      type: 'select',
      label: '是否认证',
      span: 6,
      enumKey: 'authList',
      dealParam: (auth: number) => ({
        auth: !!auth,
      }),
      backfillParam: ({ auth }: any) => auth ? 1 : 0
    },

    {
      name: 'authName',
      defaultValue: '',
      type: 'input',
      placeholder: '认证企业名称/认证',
      span: 8,
      visible: item => item.auth == 1
    },

    {
      name: 'fansCount',
      defaultValue: 0,
      label: '粉丝数',
      required: true,
      placeholder: '粉丝数',
      span: 8,
      group: '粉丝画像',
      number: true
    },
  ]

  fetch = queryItem
}
</script>

<style lang="less" scoped>
</style>
