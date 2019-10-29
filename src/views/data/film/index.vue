<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      @selectionChange="selectionChange"
      ref="listPage"
    >
      <template slot="acts-2">
        <div class="table-btn">
          <Button type="primary" @click="handleGetFilm">抓取票神影片</Button>
          <Button type="primary" @click="handleUpShelf(1)">批量上架</Button>
          <Button type="primary" @click="handleUpShelf(2)">批量下架</Button>
        </div>
      </template>
      <template slot="releaseDate" slot-scope="{row}">
        <span>{{formatConversion(row.releaseDate)}}</span>
      </template>
      <template slot="types" slot-scope="{row: {types}}">
        <span v-if="types.length == 0 || types[0] == null">-</span>
        <span v-for="(item, index) in types" :key="index" v-if="item != null">
          {{item}}
          <i v-if="index < (types.length - 1)">/</i>
        </span>
      </template>
      <template slot="countries" slot-scope="{row}">
        <span v-for="(item, index) in (row.countries || [])" :key="index">{{item}}</span>
      </template>
      <template slot="casts" slot-scope="{row: {casts}}">
        <span v-for="(it, index) in casts" :key="it.id" v-if="index < 3">{{it.name}},</span>
      </template>
      <template slot="directors" slot-scope="{row: {directors}}">
        <span v-for="it in directors" :key="it.id">{{it.name}},</span>
      </template>
      <template slot="operate" slot-scope="{row}">
        <div class="operate-btn">
          <span v-if="row.controlStatus == 2" @click="handleUpShelf(1, row.id)">上架</span>
          <span v-if="row.controlStatus == 1" @click="handleUpShelf(2, row.id)">下架</span>
          <span @click="$router.push({name: 'data-film-edit', params: {id: row.id}})">编辑</span>
          <span @click="$router.push({name: 'data-film-detail', params: {id: row.id}})">查看</span>
          <span v-if="[1].includes(row.controlStatus)" @click="uploadCurrent(row)">刷新</span>
          <!-- <span v-if="row.controlStatus == 1">浏览前台</span> -->
        </div>
      </template>
    </ListPage>
    <getFilmDlg v-model="visFilmid" v-if="visFilmid.visible" @passData="filmonOK"></getFilmDlg>
  </div>
</template>

<script lang='ts'>
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList, updateMovie, fetchMovie } from '@/api/film-ed'
import getFilmDlg from './components/getFilmDlg.vue'
import { formatConversion } from '@/util/validateRules'

@Component({
  components: {
    ListPage,
    getFilmDlg
  }
})
export default class Main extends ViewBase {
  formatConversion = formatConversion
  fetch = queryList

  filters: Filter[] = [
    {
      name: 'ids',
      defaultValue: '',
      input: true,
      width: 140,
      placeholder: '影片id'
    },
    {
      name: 'name',
      defaultValue: '',
      input: true,
      width: 140,
      placeholder: '影片名称'
    },
    {
      name: 'types',
      defaultValue: '',
      select: true,
      width: 140,
      placeholder: '影片类型',
      enumKey: 'typeList'
    },
    {
      name: 'categoryCode',
      defaultValue: '',
      select: true,
      width: 140,
      placeholder: '分类'
    },
    {
      name: 'releaseStatus',
      defaultValue: '',
      select: true,
      width: 140,
      placeholder: '上映状态'
    },
    {
      name: 'controlStatus',
      defaultValue: '',
      select: true,
      width: 140,
      placeholder: '状态'
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

  // enums = ['typeList', 'categoryList', 'releaseStatusList', 'controlStatusList']

  // select ids
  idsList: any[] = []
  statusIds: any[] = []

  get columns() {
    return [
      { type: 'selection', width: 50 },
      { title: '影片id', key: 'id', minWidth: 85 },
      // {title: '专资id', key: 'specialId', minWidth: 85},
      { title: '影片名称', key: 'name', minWidth: 85 },
      { title: '上映时间', slot: 'releaseDate', minWidth: 85 },
      { title: '今日票房', key: 'todayBoxoffice', minWidth: 85 },
      { title: '累计票房', key: 'totalBoxoffice', minWidth: 85 },
      { title: '演员', slot: 'casts', minWidth: 85 },
      { title: '导演', slot: 'directors', minWidth: 85 },
      { title: '产地', slot: 'countries', minWidth: 85 },
      { title: '类型', slot: 'types',  minWidth: 85},
      { title: '分类', key: 'categoryCode', minWidth: 85, enum: 'categoryList' },
      { title: '上映状态', key: 'releaseStatus', minWidth: 85, enum: 'releaseStatusList' },
      { title: '状态', key: 'controlStatus', minWidth: 85, enum: 'controlStatusList' },
      { title: '操作', slot: 'operate', minWidth: 160 }
    ] as ColumnExtra[]
  }

  // 抓取票神影片
  visFilmid = {
    visible: false
  }

  selectionChange(ids: any[]) {
    this.idsList = ids.map(item => item.id)
    this.statusIds = ids.map(item => item.status)
  }

  // 上架 和 下架
  async handleUpShelf(status: number, id?: number) {
    const text = status == 1 ? '上架' : '下架'
    if (!id) {
      if (!this.idsList.length) {
        await alert(`请选择${text}数据`, {
          title: '提示'
        })
        return
      }
    }
    const ids = id ? Array.of(id) : this.idsList
    await confirm(`您选择了${ids.length}条影片进行${text}`, {
      title: `${text}操作`
    })
    try {
      const { data } = await updateMovie({
        movieIds: ids,
        controlStatus: status
      })
      ; (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 刷新
  async uploadCurrent(exts: any) {
    // 取mtime渠道的id
    const id = (exts.dataExts || []).filter((item: any) => item.channelCode == 'mtime')[0].channelDataId
    try {
      const { data } = await fetchMovie(id)
      await info('影片信息已经刷新，10分钟后查看刷新后的信息。', { title: '刷新' })
      ; (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }
  async handleGetFilm() {
    this.visFilmid.visible = true
  }
  async filmonOK(val: any) {
    this.visFilmid.visible = false
    try {
      const { data } = await fetchMovie(val.filmid)
      await info('影片信息已经刷新，10分钟后查看刷新后的信息。', { title: '刷新' })
      ; (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang='less' scoped>
.table-btn {
  .ivu-btn {
    margin-right: 15px;
  }
}
.operate-btn {
  span {
    cursor: pointer;
    color: #2d8cf0;
    margin: 2px 6px;
  }
}
</style>
