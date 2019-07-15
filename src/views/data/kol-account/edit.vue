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

  get fields(): Field[] {
    return [
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
        text: true,
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
        text: true,
        label: '账号名称',
        span: 24
      },

      {
        name: 'intro',
        defaultValue: '',
        input: {
          type: 'textarea',
          autosize: { minRows: 2, maxRows: 8 }
        },
        label: '功能介绍',
        span: 22
      },

      {
        name: 'accountCategoryCode',
        defaultValue: '',
        select: {
          enumKey: 'accountCategoryList',
        },
        label: '账号分类',
        required: true,
        span: 6,
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
        offsetRight: 6,
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
        radio: {
          enumKey: 'typeList'
        },
        label: '账号类型',
        span: 6,
      },

      // TODO: 暂时用 select 展现，需要开发 toggle 组件
      {
        name: 'auth',
        defaultValue: 0,
        radio: {
          enumKey: 'authList',
        },
        label: '是否认证',
        span: 6,
        dealParam: (auth: number) => ({
          auth: !!auth,
        }),
        backfillParam: ({ auth }: any) => auth ? 1 : 0
      },

      {
        name: 'authName',
        defaultValue: '',
        input: {
          prepend: '认证企业名称'
        },
        span: 9,
        visible: item => item.auth == 1
      },

      {
        name: 'fansCount',
        defaultValue: 0,
        label: '粉丝数',
        required: true,
        placeholder: '粉丝数',
        span: 6,
        group: '粉丝画像',
        number: true
      },

      {
        name: 'malePercent',
        defaultValue: 0,
        label: '粉丝性别',
        placeholder: '百分比',
        span: 6,
        number: {
          prepend: '男性',
          append: '%',
          max: 100,
          showZero: true,
        }
      },

      {
        name: 'femalePercent',
        defaultValue: 0,
        placeholder: '百分比',
        span: 4,
        number: {
          prepend: '女性',
          append: '%',
          max: 100,
          showZero: true,
        }
      },
    ]
  }

  fetch = queryItem
}
</script>

<style lang="less" scoped>
/deep/ .col-form-radio-auth,
/deep/ .col-number-input-male-percent {
  width: auto;
}
/deep/ .ui-number-input-male-percent,
/deep/ .ui-number-input-female-percent {
  .number-input {
    width: 128px;
  }
}
</style>
