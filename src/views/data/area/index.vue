<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.nameCn" placeholder="地区名称" class="input input-id"/>
        <Select v-if="!query.parentIds" v-model="query.areaIds" placeholder="所属区域" class="input" style="width: 200px" clearable>
          <Option v-for="it in statusList" :key="it.key"
            :value="it.id">{{it.name}}</Option>
        </Select>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
        <Button v-if="!!query.parentIds" @click="goBack" class="btn-reset">返回上一级</Button>
      </form>

      <div class="acts">
        <Button type="success" @click="edit(query.parentIds)">创建</Button>
      </div>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table"></Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" show-total :page-size="query.pageSize" show-sizer
        :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
    <DlgEdit  ref="addOrUpdate" :areaSelect="statusList" :areaObject="editOne"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" />
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { get } from '@/fn/ajax'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { clean } from '@/fn/object'
import { queryList, arealist, areaSet, dels } from '@/api/dateArea'
import PartPoptipEdit from '../cinema/partPoptipEdit.vue'
import { confirm } from '@/ui/modal'
import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')

const defQuery = {
  nameCn: '',
  areaIds: '',
  pageIndex: 1,
  pageSize: 20,
  parentIds: ''
}

@Component({
  components: {
    DlgEdit,
    PartPoptipEdit
  }
})
export default class Main extends View {
  query = { ...defQuery }
  oldQuery: any = null
  editOne: any = null
  loading = false
  addOrUpdateVisible = false
  list: any[] = []
  // 父级县区
  parentsName = ''
  total = 0
  // 父级所属区域id
  parentsAreaId = ''
  statusList: any[] = []
  saveId: any[] = []
  get columns() {
    const colum =  [
      { title: '序号', key: 'id', align: 'center' },
      { title: '地区名称', key: 'nameCn', align: 'center',
        render: (hh: any, { row: { id, nameCn, areaId, childCount} }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return childCount>0?(<div class='row-acts'>
            <div><a on-click={this.sonMessage.bind(this, id, nameCn, areaId)}>{nameCn}</a></div>
          </div>):<div><span>{nameCn}</span></div>
          /* tslint:enable */
        }
      },
      { title: '简拼', key: 'pinyinShort',  align: 'center' },
      { title: '拼音', key: 'pinyin',  align: 'center' },
      {
        title: '所属区域',
        key: 'areaName',
        width: 120,
        align: 'center',
        render: (hh: any, { row : { id , areaId, areaName } }: any) => {
          /* tslint:disable */
        const list = this.statusList.map((value) => {
          return {
            key: value.id,
            text: value.name
          }
        })
        const h = jsxReactToVue(hh)
            const value = {
                id,
                key: areaId,
                text: areaName,
                list
            }
            return <PartPoptipEdit v-model={value}
                on-change={this.editStatus.bind(this)}/>
          /* tslint:enable */
        }
      },
      {
        title: '排序',
        key: 'orderNum',
        width: 90,
        align: 'center'
      },
      {
        title: '操作',
        key: 'action',
        width: 90,
        align: 'center',
        render: (hh: any, { row }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class='row-acts'>
            <a on-click={this.edit.bind(this, row.id, row , 1)} style="margin-right:10px">编辑</a>
            <a on-click={this.delete.bind(this, row.id)}>删除</a>
          </div>
          /* tslint:enable */
        }
      }
    ]
    !!this.query.parentIds ? colum.splice(4, 1) : colum
    return colum
  }

  get cachedMap() {
    return {
      statusList: makeMap(this.statusList),
    }
  }

  sonMessage(id: any, nameCn: string, areaId: string) {
    this.saveId.push(id)
    this.parentsAreaId = areaId
    this.query.areaIds = areaId
    this.parentsName = nameCn
    this.query.parentIds = this.saveId.join(',')
    this.doSearch()
  }

  goBack() {
    this.saveId.pop()
    this.query.parentIds = this.saveId.join(',')
    !this.query.parentIds ? this.parentsAreaId = '' : ''
    this.query.areaIds = this.parentsAreaId
    !this.query.parentIds ? this.parentsName = '' : ''
    this.doSearch()
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it
      }
    })
    return list
  }

  created() {
    this.addArea()
  }
  mounted() {
    this.doSearch()
  }

  async addArea() {
    try {
      const { data } = await arealist({})
      this.statusList = data
    } catch (ex) {
      this.handleError(ex)
    }
  }
  search() {
    this.query.pageIndex = 1
  }

  reloadSearch() {
    if (this.query.pageIndex != 1) {
      this.query.pageIndex = 1
      return
    }
    this.doSearch()
  }

  reset() {
    const { pageSize } = this.query
    if (!this.query.parentIds) {
      this.query = { ...defQuery, pageSize }
    } else {
      this.query.nameCn = ''
    }
  }

  async delete(id: any) {
    try {
      await confirm('您确定删除当前地区信息吗？')
      await dels(id)
      this.$Message.success({
        content: `删除成功`,
      })
      this.reloadSearch()
    } catch (ex) {
      this.handleError(ex)
    }
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
        items: list,
        totalCount: total,
      } } = await queryList(query)
      this.list = list
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  async editStatus({ id, key: newStatus, showLoading }: any) {
    const item = this.list.find(it => it.id == id)
    if (item && item.areaIds != newStatus) {
      try {
        showLoading()
        await areaSet(id, {areaId: newStatus, areaName: this.cachedMap.statusList[newStatus]})
        item.areaId = newStatus
        item.areaName = this.cachedMap.statusList[newStatus]
      } catch (ex) {
        this.handleError(ex)
      }
    }
  }

  // 新增 / 修改
  edit(id: number, row: any, editMes: number) {
    this.addOrUpdateVisible = true
    !!id ? this.editOne = row : this.editOne = ''
    this.$nextTick(() => {
      const myThis: any = this
      myThis.$refs.addOrUpdate.init(id, this.parentsName, this.parentsAreaId, editMes, this.query.parentIds)
    })
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
.form {
  .input {
    margin-right: 8px;
  }
  .input-id {
    width: 180px;
  }
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}

.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}

.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
</style>
