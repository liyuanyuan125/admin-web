<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
      <template slot="act-bar">
        <header class="header flex-box">
          <div class="header-main flex-1">
            <em>{{cinema.shortName}}</em>
            <i>影厅列表</i>
          </div>
          <Button
            type="success"
            icon="md-add-circle"
            class="btn-new"
            @click="editShow()"
            v-auth="'theater.halls:add'"
          >新建影厅</Button>
        </header>

        <DetailList :list="detailList" class="detail-list"/>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <a @click="editShow(id)" v-auth="'theater.halls:modify'">编辑</a>
        </div>
      </template>
    </ListPage>

    <EditDialog
      :fields="fields"
      :fetch="editFetch"
      :submit="editSubmit"
      :width="700"
      :label-width="98"
      ref="editDlg"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { toMap } from '@/fn/array'
import { clean, slice } from '@/fn/object'
// TODO: 两个接口应该能合成一个？
import { queryItem } from '@/api/cinema'
import { queryItem as hallQueryItem, addItem, updateItem } from '@/api/cinemaHall'
import { AjaxResult, MapType, KeyText } from '@/util/types'

import { InputNumber } from 'iview'
import EditDialog, { Field } from '@/components/editDialog'
import DetailList, { DetailItem } from '@/components/detailList'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const getText = (map: MapType<KeyText>, key: string) => (map[key] || { text: '' }).text

@Component({
  components: {
    ListPage,
    DetailList,
    EditDialog
  }
})
export default class Main extends ViewBase {
  @Prop({ type: [Number, String], default: 0 }) id!: number | string

  filters: Filter[] = [
    {
      name: 'id',
      defaultValue: parseInt(this.id as string, 10)
    },

    {
      name: 'pageIndex',
      defaultValue: 1
    }
  ]

  enums = [
    'typeList',
    'projectorTypeList',
    'placementList',
    'projectorResolutionList',
    'projectorBrandList',
    'businessTypeList',
    'controlStatusList'
  ]

  get columns() {
    return [
      { title: '序号', key: 'id', width: 70 },
      { title: '影厅名称', key: 'name', minWidth: 70 },
      { title: '影厅类型', key: 'typeCode', width: 65, editor: 'enum' },
      { title: '座位数', key: 'seats', width: 55 },
      { title: '放映机类型', key: 'projectorTypeCode', width: 75, editor: 'enum' },

      { title: '机位', key: 'placementCode', width: 50, editor: 'enum' },
      { title: '放映机分辨率', key: 'projectorResolutionCode', width: 85, editor: 'enum' },
      { title: '放映机品牌', key: 'projectorBrandCode', width: 80, editor: 'enum' },
      { title: '放映机型号', key: 'projectorModel', width: 85 },
      { title: '放映机编号', key: 'projectorNumber', width: 80 },

      { title: '影厅业务类型', key: 'businessTypeCode', width: 85, editor: 'enum' },
      { title: '控制状态', key: 'controlStatus', width: 65, editor: 'enum' },
      { title: '操作', slot: 'action', width: 50 }
    ] as ColumnExtra[]
  }

  cinema: any = {}

  get detailList() {
    const cinema = this.cinema || {}
    const result: DetailItem[] = [
      { label: '专资ID', value: cinema.code },
      { label: '院线', value: cinema.chainName },
      { label: '状态', value: cinema.statusText },

      { label: '官方名称', value: cinema.officialName },
      { label: '售票系统', value: cinema.softwareName },
      { label: '影院等级', value: cinema.gradeName },

      { label: '地址', value: cinema.fullAddress, span: 2 },
      { label: '邮编', value: cinema.zipCode },
    ]
    return result
  }

  fields: Field[] = [
    {
      name: 'id',
      defaultValue: 0
    },

    {
      name: 'name',
      defaultValue: '',
      type: 'input',
      label: '影厅名称',
      span: 16,
      required: true
    },

    {
      name: 'typeCode',
      defaultValue: '',
      type: 'select',
      label: '影厅类型',
      span: 8,
      required: true
    },

    {
      name: 'seats',
      defaultValue: 0,
      type: InputNumber,
      label: '座位数',
      span: 8,
      rules: [
        {
          required: true,
          message: '不能为空',
          trigger: 'blur',
          type: 'integer',
          min: 1
        }
      ],
      props: {
        min: 0,
        max: 1000
      }
    },

    {
      name: 'businessTypeCode',
      defaultValue: '',
      type: 'select',
      label: '影厅业务类型',
      span: 8
    },

    {
      name: 'projectorTypeCode',
      defaultValue: '',
      type: 'select',
      label: '放映机类型',
      span: 8
    },

    {
      name: 'placementCode',
      defaultValue: '',
      type: 'select',
      label: '机位',
      span: 8
    },

    {
      name: 'projectorResolutionCode',
      defaultValue: '',
      type: 'select',
      label: '放映机分辨率',
      span: 8
    },

    {
      name: 'projectorBrandCode',
      defaultValue: '',
      type: 'select',
      label: '放映机品牌',
      span: 8
    },

    {
      name: 'projectorModel',
      defaultValue: '',
      type: 'input',
      label: '放映机型号',
      span: 8
    },

    {
      name: 'projectorNumber',
      defaultValue: '',
      type: 'input',
      label: '放映机编号',
      span: 8
    },

    {
      name: 'controlStatus',
      defaultValue: 0,
      type: 'select',
      label: '控制状态',
      span: 8,
      defaultEnumIndex: 0,
      auth: 'theater.halls:change-control-status'
    },
  ]

  editFetch = hallQueryItem

  fetch(query: any) {
    return queryItem(query).then(({ code, data, msg }) => {
      const item = data.item || {}
      const halls = item.halls || []

      const statusMap = makeMap(data.statusList)
      const gradeMap = makeMap(data.gradeList)
      this.cinema = {
        ...item,
        statusText: statusMap[item.status],
        gradeName: gradeMap[item.gradeCode],
        fullAddress: [item.provinceName, item.cityName, item.countyName, item.address]
          .join(' ')
          .trim()
      }

      return {
        code,
        data: {
          ...data,
          items: halls,
          totalCount: halls.length
        },
        msg
      } as AjaxResult
    })
  }

  editShow(id = 0) {
    const editor = this.$refs.editDlg as EditDialog
    editor.show({ id }).done((data: any) => {
      (this.$refs.listPage as any).update()
    })
  }

  editSubmit(data: any) {
    const cinemaId = this.id as number
    return data.id ? updateItem(cinemaId, data) : addItem(cinemaId, data)
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.header {
  margin-top: -8px;
  line-height: 30px;
  em,
  i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}

.header-main {
  position: relative;
  top: 2px;
}

.detail-list {
  margin-top: 12px;
}
</style>
