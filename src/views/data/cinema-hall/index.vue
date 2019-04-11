<template>
  <div>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns"
      :listMap="listMap" ref="listPage">
      <template slot="act-bar">
        <header class="header flex-box">
          <div class="header-main flex-1">
            <em>{{cinema.shortName}}</em>
            <i>影厅列表</i>
          </div>
          <Button type="success" icon="md-add-circle" class="btn-new"
            @click="edit(0)" v-auth="'theater.halls:add'">新建影厅</Button>
        </header>

        <section class="info-pane">
          <div class="info-line flex-box">
            <div class="flex-1 flex-box">
              <label>专资ID：</label>
              <em>{{cinema.code}}</em>
            </div>
            <div class="flex-1 flex-box">
              <label>院线：</label>
              <em>{{cinema.chainName}}</em>
            </div>
            <div class="flex-1 flex-box">
              <label>状态：</label>
              <em>{{cinema.statusText}}</em>
            </div>
          </div>

          <div class="info-line flex-box">
            <div class="flex-1 flex-box">
              <label>官方名称：</label>
              <em>{{cinema.officialName}}</em>
            </div>
            <div class="flex-1 flex-box">
              <label>售票系统：</label>
              <em>{{cinema.softwareName}}</em>
            </div>
            <div class="flex-1 flex-box">
              <label>影院等级：</label>
              <em>{{cinema.gradeName}}</em>
            </div>
          </div>

          <div class="info-line flex-box">
            <div class="flex-2 flex-box">
              <label>地址：</label>
              <em>{{cinema.fullAddress}}</em>
            </div>
            <div class="flex-1 flex-box">
              <label>邮编：</label>
              <em>{{cinema.zipCode}}</em>
            </div>
          </div>
        </section>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <a @click="edit(id)" v-auth="'theater.halls:modify'">编辑</a>
        </div>
      </template>
    </ListPage>

    <DlgEdit v-model="dlgEditModel" :cinemaId="parseInt(id, 10)" @done="dlgEditDone"/>
  </div>
</template>

<script lang="tsx">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra, ListMapParam } from '@/layout/listPage'
import { toMap } from '@/fn/array'
import { clean, slice } from '@/fn/object'
import { queryItem } from '@/api/cinema'
import DlgEdit from './dlgEdit.vue'
import { AjaxResult, MapType, KeyText } from '@/util/types'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const getText = (map: MapType<KeyText>, key: string) => (map[key] || { text: '' }).text

@Component({
  components: {
    ListPage,
    DlgEdit,
  }
})
export default class Main extends ViewBase {
  @Prop({ type: [Number, String], default: 0 }) id!: number | string

  filters: Filter[] = [
    {
      name: 'id',
      defaultValue: parseInt(this.id as string, 10),
    },

    {
      name: 'pageIndex',
      defaultValue: 1
    },
  ]

  enums = [
    'typeList',
    'projectorTypeList',
    'placementList',
    'projectorResolutionList',
    'projectorBrandList',
    'businessTypeList',
    'controlStatusList',
  ]

  get columns() {
    return  [
      { title: '序号', key: 'id', width: 70 },
      { title: '影厅名称', key: 'name', minWidth: 70 },
      { title: '影厅类型', key: 'typeName', width: 65 },
      { title: '座位数', key: 'seats', width: 55 },
      { title: '放映机类型', key: 'projectorTypeName', width: 75 },

      { title: '机位', key: 'placementName', width: 50 },
      { title: '放映机分辨率', key: 'projectorResolutionName', width: 85 },
      { title: '放映机品牌', key: 'projectorBrandName', width: 80 },
      { title: '放映机型号', key: 'projectorModel', width: 85 },
      { title: '放映机编号', key: 'projectorNumber', width: 80 },

      { title: '影厅业务类型', key: 'businessTypeName', width: 85 },
      { title: '控制状态', key: 'controlStatusName', width: 65 },
      { title: '操作', slot: 'action', width: 50 }
    ] as ColumnExtra[]
  }

  cinema: any = {}

  dlgEditModel = {
    show: false,
    id: -1
  }

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
        fullAddress: [
          item.provinceName,
          item.cityName,
          item.countyName,
          item.address
        ].join(' ').trim()
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

  listMap(item: any, { enumMap }: ListMapParam) {
    return {
      ...item,
      typeName: getText(enumMap.type, item.typeCode),
      projectorTypeName: getText(enumMap.projectorType, item.projectorTypeCode),
      placementName: getText(enumMap.placement, item.placementCode),
      projectorResolutionName: getText(enumMap.projectorResolution, item.projectorResolutionCode),
      projectorBrandName: getText(enumMap.projectorBrand, item.projectorBrandCode),
      businessTypeName: getText(enumMap.businessType, item.businessTypeCode),
      controlStatusName: getText(enumMap.controlStatus, item.controlStatus),
    }
  }

  edit(id: number) {
    this.dlgEditModel.id = id
    this.dlgEditModel.show = true
  }

  dlgEditDone() {
    (this.$refs.listPage as any).fetchList()
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.header {
  margin-top: -8px;
  line-height: 30px;
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}

.info-pane {
  margin-top: 12px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  padding: 10px 15px;
  line-height: 2;
  label {
    display: inline-block;
    min-width: 80px;
    text-align: right;
  }
  em {
    color: #19be6b;
    font-style: normal;
  }
}

.header-main {
  position: relative;
  top: 2px;
}
</style>
