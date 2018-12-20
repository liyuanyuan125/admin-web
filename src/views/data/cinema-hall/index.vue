<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回列表</Button>
      <div class="flex-1">
        <em>{{cinema.shortName}}</em>
        <i>影厅列表</i>
      </div>
      <Button type="success" icon="md-add-circle" class="btn-new"
        @click="edit(0)">新建影厅</Button>
    </header>

    <div class="info-pane">
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
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table"></Table>

    <div v-for="(it, i) in dlgEditList" :key="it.id">
      <DlgEdit v-model="dlgEditList[i]" :cinemaId="query.id"
        @done="dlgEditDone" v-if="it.showDlgEdit"/>
    </div>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch, Mixins } from 'vue-property-decorator'
import View from '@/util/View'
import UrlManager from '@/util/UrlManager'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { clean, slice } from '@/fn/object'
import { queryItem } from '@/api/cinema'
import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

@Component({
  components: {
    DlgEdit,
  }
})
export default class Main extends Mixins(View, UrlManager) {
  defQuery = {
    id: 0
  }

  query: any = {}

  oldQuery: any = {}

  loading = false
  list: any[] = []
  cinema: any = {}

  enumType: any = {
    typeList: [],
    projectorTypeList: [],
    placementList: [],
    projectorResolutionList: [],
    projectorBrandList: [],
    businessTypeList: [],
    controlStatusList: [],
  }

  get enumMap() {
    return Object.keys(this.enumType).reduce((map: any, it) => {
      const name = it.replace(/List$/, '')
      map[name || it] = makeMap(this.enumType[it])
      return map
    }, {})
  }

  // 编辑对话框列表
  dlgEditList: any[] = []

  get columns() {
    return  [
      { title: '序号', key: 'id', width: 70, align: 'center' },
      { title: '影厅名称', key: 'name', minWidth: 70, align: 'center' },
      { title: '影厅类型', key: 'typeName', width: 65, align: 'center' },
      { title: '座位数', key: 'seats', width: 55, align: 'center' },
      { title: '放映机类型', key: 'projectorTypeName', width: 75, align: 'center' },
      { title: '机位', key: 'placementName', width: 50, align: 'center' },
      { title: '放映机分辨率', key: 'projectorResolutionName', width: 85, align: 'center' },
      { title: '放映机品牌', key: 'projectorBrandName', width: 80, align: 'center' },
      { title: '放映机型号', key: 'projectorModel', width: 85, align: 'center' },
      { title: '放映机编号', key: 'projectorNumber', width: 80, align: 'center' },
      { title: '影厅业务类型', key: 'businessTypeName', width: 85, align: 'center' },
      { title: '控制状态', key: 'controlStatusName', width: 65, align: 'center' },
      {
        title: '操作',
        key: 'action',
        width: 50,
        align: 'center',
        render: (hh: any, { row: { id } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class="row-acts">
            <a on-click={this.edit.bind(this, id)}>编辑</a>
          </div>
          /* tslint:enable */
        }
      }
    ]
  }

  get tableData() {
    const enumMap = this.enumMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        typeName: enumMap.type[it.typeCode],
        projectorTypeName: enumMap.projectorType[it.projectorTypeCode],
        placementName: enumMap.placement[it.placementCode],
        projectorResolutionName: enumMap.projectorResolution[it.projectorResolutionCode],
        projectorBrandName: enumMap.projectorBrand[it.projectorBrandCode],
        businessTypeName: enumMap.businessType[it.businessTypeCode],
        controlStatusName: enumMap.controlStatus[it.controlStatus],
      }
    })
    return list
  }

  mounted() {
    this.updateQueryByParam()
  }

  async fetch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data } = await queryItem(query)

      const item = data.item || {}

      this.list = item.halls || []

      this.enumType = {
        ...this.enumType,
        ...slice(data, Object.keys(this.enumType))
      }

      this.dlgEditList = this.list.map((it: any) => ({
        id: it.id,
        showDlgEdit: false,
      }))

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
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  back() {
    this.$router.go(-1)
  }

  edit(id: string|number) {
    let item = this.dlgEditList.find(it => it.id == id)
    if (item == null && id == 0) {
      item = { id: 0, showDlgEdit: true }
      this.dlgEditList.push(item)
    }
    item && (item.showDlgEdit = true)
  }

  dlgEditDone() {
    this.fetch()
  }

  @Watch('query', { deep: true })
  watchQuery() {
    this.fetch()
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';

.header {
  margin-top: 5px;
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
.btn-back {
  margin-right: 10px;
}

.info-pane {
  margin-top: 15px;
  border: 1px solid #dcdee2;
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

.table {
  margin-top: 16px;
  /deep/ .ivu-table-cell {
    padding-left: 4px;
    padding-right: 4px;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
  /deep/ .row-acts > a {
    margin: 0 4px;
  }
}
</style>
