<template>
  <div class="page">
    <div class="act-bar flex-box">
      <form class="form flex-1" @submit.prevent="search">
        <LazyInput v-model="query.nameCn" placeholder="地区名称" class="input input-id"/>
        <Select v-if="query.parentIds == 0" v-model="query.areaCodes" placeholder="所属区域" class="input" style="width: 200px" clearable>
          <Option v-for="it in statusList" :key="it.key"
            :value="it.code">{{it.name}}</Option>
        </Select>
        <Button type="default" @click="reset" class="btn-reset">清空</Button>
        <Button v-if="query.parentIds!=0" @click="goBack" class="btn-reset" style="margin-left: 8px">返回上一级</Button>
      </form>
      <div class="acts" v-auth="'basis.districts:add'">
        <Button type="success" icon="md-add-circle" @click="edit(query.parentIds)">新建地区信息</Button>
      </div>
    </div>

    <Table :columns="columns" :data="tableData" :loading="loading"
      border stripe disabled-hover size="small" class="table">
    </Table>

    <div class="page-wrap" v-if="total > 0">
      <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
        show-total show-sizer show-elevator :page-size-opts="[10, 20, 50, 100]"
        @on-change="page => query.pageIndex = page"
        @on-page-size-change="pageSize => query.pageSize = pageSize"/>
    </div>
    <DlgEdit ref="addOrUpdate" :areaSelect="statusList" :areaObject="editOne"  @refreshDataList="reloadSearch" v-if="addOrUpdateVisible" />
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch, Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { slice, clean } from '@/fn/object'
import { queryList, arealist, areaSet, dels } from '@/api/dateArea'
import PoptipSelect from '@/components/PoptipSelect.vue'
import { confirm, toast } from '@/ui/modal'
import DlgEdit from './dlgEdit.vue'

const makeMap = (list: any[]) => toMap(list, 'code', 'name')

@Component({
  components: {
    DlgEdit,
    PoptipSelect
  }
})
export default class Main extends Mixins(ViewBase, UrlManager) {
  defQuery = {
    nameCn: '',
    areaCodes: '',
    pageIndex: 1,
    pageSize: 20,
    parentIds: '0',
    city: ''
  }

  query: any = {}

  oldQuery: any = {}

  editOne: any = null

  loading = false
  pageIndex: any = []
  addOrUpdateVisible = false
  list: any[] = []
  cityArray: any[] = []
  // 父级县区
  total = 0
  // 父级所属区域id
  parentsareaCode = ''
  statusList: any[] = []
  saveId: any[] = []

  get columns() {
    const colum =  [
      { title: '序号', key: 'id', align: 'center' },
      { title: '地区名称', key: 'nameCn', align: 'center',
        render: (hh: any, { row: { id, nameCn, areaCode } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          return <div class='row-acts'>
            <div><a on-click={this.sonMessage.bind(this, id, nameCn, areaCode)}>{nameCn}</a></div>
          </div>
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
        render: (hh: any, { row : { id , areaCode, areaName } }: any) => {
          /* tslint:disable */
          const list = this.statusList.map((value) => {
            return {
              key: value.code,
              text: value.name
            }
          })
          const h = jsxReactToVue(hh)
          const value = {
            id,
            text: areaName,
            value: areaCode,
            list
          }
          return <PoptipSelect v-model={value}
            on-change={this.editStatus.bind(this)}/>
          /* tslint:enable */
        }
      },
      {
        title: '排序',
        key: 'sort',
        width: 90,
        align: 'center'
      },
      {
        title: '操作',
        key: 'action',
        width: 90,
        slot: 'action',
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
    ; (this.query.parentIds != '0') ? colum.splice(4, 1) : colum
    return colum
  }

  get cachedMap() {
    return {
      statusList: makeMap(this.statusList),
    }
  }

  sonMessage(id: any, nameCn: string, areaCode: string) {
    this.saveId.push(id)
    this.cityArray.push(nameCn)
    this.query.nameCn = ''
    this.query.areaCodes = areaCode
    this.query.city = nameCn
    this.query.parentIds = id
    this.pageIndex.push( this.query.pageIndex )
    this.query.pageIndex = 1
  }

  goBack() {
    this.query.pageIndex = this.pageIndex[this.pageIndex.length - 1]
    this.query.parentIds = this.saveId[this.saveId.length - 2] || 0
    this.query.city = this.cityArray[this.cityArray.length - 2]
    this.saveId.pop()
    this.pageIndex.pop()
    this.cityArray.pop()
    this.query.parentIds == '0' ? this.query.areaCodes = '' : ''
    this.query.areaCodes = this.query.areaCodes
    this.query.parentIds == '0' ? this.query.city = '' : ''
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
    this.updateQueryByParam()
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
    this.doSearch()
  }

  reset() {
    if (this.query.parentIds == '0') {
      this.resetQuery()
    } else {
      this.query.nameCn = ''
    }
  }

  async delete(id: any) {
    await confirm('您确定删除当前地区信息吗？')
    try {
      await dels(id)
      toast(`删除成功`)
      this.reloadSearch()
    } catch (ex) {
      setTimeout(() => {
        this.handleError(ex)
      }, 500)
    }
  }

  async doSearch() {
    if (this.loading) {
      return
    }
    this.oldQuery = { ...this.query }
    this.updateUrl()
    this.loading = true
    const query = clean({ ...this.query })
    const setQuery: any = {}
    if (this.query.parentIds != '0') {
      for ( const key in query ) {
        if (query.hasOwnProperty(key)) {
          if (key != 'areaCodes' && key != 'city') {
              setQuery[key] = query[key]
          }
        }
      }
    } else {
      for ( const key in query ) {
        if (query.hasOwnProperty(key)) {
          if (key != 'city') {
            setQuery[key] = query[key]
          }
        }
      }
    }
    try {
      const { data: {
        items: list,
        totalCount: total,
      } } = await queryList(setQuery)
      this.list = list
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }

  async editStatus({ id, value, showLoading, hideLoading }: any) {
    const item = this.list.find(it => it.id == id)
    try {
      showLoading()
      await areaSet(id, {areaCode: value})
      item.areaCode = value
      item.areaName = this.cachedMap.statusList[value]
    } catch (ex) {
      this.handleError(ex)
    } finally {
      hideLoading()
    }
  }

  // 新增 / 修改
  edit(id: any, row: any, editMes: number) {
    this.addOrUpdateVisible = true
    id != '0' ? this.editOne = row : this.editOne = ''
    this.$nextTick(() => {
      (this.$refs.addOrUpdate as any).init(id, this.query.city, this.query.areaCodes, editMes, this.query.parentIds)
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
.act-bar {
  margin-top: 5px;
}

.form {
  .input {
    margin-right: 8px;
  }
  .input-id {
    width: 180px;
  }
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
