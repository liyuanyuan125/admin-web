<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      @selectionChange="selectionChange"
      ref="listPage">
      <template slot="acts-2">
        <div class="table-btn">
            <Button @click="handleGetFilm" >抓取票神影片</Button>
            <Button @click="handleUpShelf()" >批量上架</Button>
            <Button @click="handleDownShelf()">批量下架</Button>
        </div>
      </template>
      <template slot="operate" slot-scope="{row}">
        <span @click="$router.push({name: 'data-film-edit', params: {id: row.id}})">编辑</span>
        <span @click="uploadCurrent">刷新</span>
        <span @click="handleUpShelf(row.id)">上架</span>
        <span @click="handleDownShelf(row,id)">下架</span>
        <span>浏览前台</span>
        <span @click="$router.push({name: 'data-film-detail', params: {id: row.id}})">查看</span>
      </template>
    </ListPage>
    <getFilmDlg v-model="visFilmid" v-if="visFilmid.visible" @input="filmonOK"></getFilmDlg>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList } from '@/api/film-ed'
import getFilmDlg from './components/getFilmDlg.vue'


@Component({
  components: {
    ListPage,
    getFilmDlg
  }
})
export default class Main extends ViewBase {
  fetch = queryList
  filters: Filter[] = [
    {
      name: 'ids',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '影片id'
    },
    {
      name: 'name',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '影片名称'
    },
    // {
    //   name: 'types',
    //   defaultValue: '',
    //   type: 'select',
    //   width: 140,
    //   placeholder: '影片类型',
    //   enumKey: 'type',
    // },
    {
      name: 'categoryCode',
      defaultValue: '',
      type: 'select',
      width: 140,
      placeholder: '分类',
      enumKey: 'categoryList',
    },
    {
      name: 'releaseStatus',
      defaultValue: '',
      type: 'select',
      width: 140,
      placeholder: '上映状态',
      enumKey: 'releaseStatusList',
    },
    {
      name: 'controlStatus',
      defaultValue: '',
      type: 'select',
      width: 140,
      placeholder: '状态',
      enumKey: 'controlStatusList',
    },
    {
      name: 'pageIndex',
      defaultValue: 1
    },
    {
      name: 'pageSize',
      defaultValue: 20
    }
  ]
  enums = [
    'categoryList',
    'releaseStatusList',
    'controlStatusList'
  ]

  // select ids
  idsList: any[] = []
  statusIds: any[] = []

  get columns() {
    return [
      {type: 'selection', width: 50},
      {title: '影片id', key: 'id', minWidth: 85},
      {title: '专资id', key: 'specialId', minWidth: 85},
      {title: '影片名称', key: 'englishName', minWidth: 85},
      {title: '上映时间', key: 'openTime', minWidth: 85, editor: 'dateTime'},
      {title: '今日票房', key: 'todayBox', minWidth: 85},
      {title: '累计票房', key: 'sumBox', minWidth: 85},
      {title: '演员', key: 'performers', minWidth: 85},
      {title: '导演', key: 'director', minWidth: 85},
      {title: '产地', key: 'fromPlace', minWidth: 85},
      {title: '类型', key: 'type', minWidth: 85},
      {title: '分类', key: 'categoryCode', minWidth: 85, editor: 'enum'},
      {title: '上映状态', key: 'releaseStatus', minWidth: 85, editor: 'enum'},
      {title: '状态', key: 'controlStatus', minWidth: 85, editor: 'enum'},
      {title: '操作', slot: 'operate', minWidth: 120},
    ] as ColumnExtra[]
  }

  // 抓取票神影片
  visFilmid = {
    visible: false
  }

  selectionChange(ids: any[]) {
    this.idsList = ids.map( item => item.id)
    this.statusIds = ids.map( item => item.status)
  }
  // 上架
  async handleUpShelf(id?: any[]) {
    if (!this.idsList.length) {
      await alert('请选择上架数据', {
        title: '提示'
      })
      return
    }
    const length = id ? Array.of(id).length : this.idsList.length
    await confirm(`您选择了${length}条影片进行上架`, {
      title: '上架操作'
    })
    // ids = [] 后台传入参数
    const ids = id ? Array.of(id) : this.idsList
    // 接口操作
  }
  // 下架
  async handleDownShelf(id?: any[]) {
    if (!this.idsList.length) {
      await alert('请选择下架数据', {
        title: '提示'
      })
      return
    }
    const length = id ? Array.of(id).length : this.idsList.length
     await confirm(`您选择了${length}条影片进行下架`, {
      title: '下架操作'
    })
    // ids = [] 后台传入参数
    const ids = id ? Array.of(id) : this.idsList
    // 接口操作
  }

  // 刷新
  async uploadCurrent() {
    // 刷新数据接口成功
    await info('影片信息已经刷新，10分钟后查看刷新后的信息。', {title: '刷新'})
  }
  async handleGetFilm() {
    this.visFilmid.visible = true
  }
  filmonOK(val: any) {
    this.visFilmid.visible = false;
    (this.$refs.listPage as any).update()
  }
}

</script>
<style lang='less' scoped>
.table-btn {
  padding: 10px 0;
  .ivu-btn {
    margin-right: 15px;
  }
}
</style>