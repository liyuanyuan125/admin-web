<template>
  <div class="page">
    <header class="header flex-box">
      <div class="flex-1">
        <em>{{cinema.shortName}}</em>
        <i>影厅列表</i>
      </div>
      <Button type="success" icon="md-add-circle" class="btn-new"
        @click="edit(0)">新建影厅</Button>
      <Button icon="md-return-left" @click="goback">返回列表</Button>
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
          <em>{{cinema.officalName}}</em>
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
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { clean } from '@/fn/object'
import { queryItem } from '@/api/cinema'
import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const defQuery = {
  id: null,
  pageIndex: 1,
  pageSize: 20,
}

@Component({
  components: {
    DlgEdit,
  }
})
export default class Main extends View {
  query: any = { ...defQuery }

  oldQuery: any = null

  loading = false
  list: any[] = []
  cinema: any = {}

  projectorTypeList: any[] = []
  placementList: any[] = []
  projectorResolutionList: any[] = []
  projectorBrandList: any[] = []
  businessTypeList: any[] = []
  controlStatusList: any[] = []

  // 辅助数据
  helperList: any[] = []

  get columns() {
    return  [
      { title: '序号', key: 'id', width: 138, align: 'center' },
      { title: '影厅名称', key: 'name', minWidth: 70, align: 'center' },
      { title: '影厅类型', key: 'type', width: 65, align: 'center' },
      { title: '座位数', key: 'seats', width: 55, align: 'center' },
      { title: '放映机类型', key: 'projectorTypeName', width: 75, align: 'center' },
      { title: '机位', key: 'placementName', width: 50, align: 'center' },
      { title: '放映机分辨率', key: 'projectorResolutionName', width: 85, align: 'center' },
      { title: '放映机品牌', key: 'projectorBrandName', width: 80, align: 'center' },
      { title: '放映机型号', key: 'projectorModel', width: 85, align: 'center' },
      { title: '放映机编号', key: 'projectorNumber', width: 85, align: 'center' },
      { title: '影厅业务类', key: 'businessTypeName', width: 80, align: 'center' },
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

  get cachedMap() {
    return {
      projectorType: makeMap(this.projectorTypeList),
      placement: makeMap(this.placementList),
      projectorResolution: makeMap(this.projectorResolutionList),
      projectorBrand: makeMap(this.projectorBrandList),
      businessType: makeMap(this.businessTypeList),
      controlStatus: makeMap(this.controlStatusList),
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
        projectorTypeName: cachedMap.projectorType[it.projectorType],
        placementName: cachedMap.placement[it.placement],
        projectorResolutionName: cachedMap.projectorResolution[it.projectorResolution],
        projectorBrandName: cachedMap.projectorBrand[it.projectorBrand],
        businessTypeName: cachedMap.businessType[it.businessType],
        controlStatusName: cachedMap.controlStatus[it.controlStatus],
      }
    })
    return list
  }

  mounted() {
    const { id } = this.$route.params
    this.query.id = id
    this.doSearch()
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true
    const query = clean({ ...this.query })
    try {
      const { data: {
        item,
        projectorTypeList = [],
        placementList = [],
        projectorResolutionList = [],
        projectorBrandList = [],
        businessTypeList = [],
        cstatusList = [],
        statusList = [],
        gradeList = [],
      } } = await queryItem(query)

      const statusMap = makeMap(statusList)
      const gradeMap = makeMap(gradeList)
      this.cinema = {
        ...item,
        statusText: statusMap[item.status],
        gradeName: gradeMap[item.grade],
        fullAddress: [
          item.provinceName,
          item.cityName,
          item.countyName,
          item.address
        ].join(' ').trim()
      }

      this.list = item.halls || []
      this.projectorTypeList = projectorTypeList
      this.placementList = placementList
      this.projectorResolutionList = projectorResolutionList
      this.projectorBrandList = projectorBrandList
      this.businessTypeList = businessTypeList
      this.controlStatusList = cstatusList
      this.helperList = this.list.map((it: any) => ({
        id: it.id,
        showDlgEdit: false,
      }))
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  goback() {
    this.$router.go(-1)
  }

  edit(id: string|number) {
    let item = this.helperList.find(it => it.id == id)
    if (item == null && id == 0) {
      item = { id: 0, showDlgEdit: true }
      this.helperList.push(item)
    }
    item && (item.showDlgEdit = true)
  }

  dlgEditDone() {
    this.doSearch()
  }

  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.doSearch()
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
.btn-new {
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
}
</style>
