<template>
  <div>
      <ListPage
      :fetch="fetch"
      :filters="filters"
      :columns="columns"
      :selectedIds.sync = "selectedIds"
      ref="listPage">
      
      <template slot="acts-2">
        <div class="table-btn">
            <Button type="primary" @click="handleGetFilm" >抓取票神影人</Button>
            <Button type="primary"  @click="handleUpShelf(2)" >批量上架</Button>
            <Button type="primary"  @click="handleUpShelf(3)">批量下架</Button>
        </div>
      </template>

      <template slot="professions" slot-scope="{row: {professions}}">
        <span v-for="(item, index) in professions" :key="index" v-if="item.primary">
          <font v-for="(it, ind) in professionsList" :key="ind" v-if="it.key == item.code">{{it.text}}</font>
        </span>
      </template>

      <template slot="action" slot-scope="{row}">
        <div class="operate-btn">
          <span @click="$router.push({name: 'data-person-edit', params: {id: row.id}})" >编辑</span>
          <span v-if="row.status == 1 || row.status == 3" @click="handleUpShelf(2, row.id)">上架</span>
          <span v-if="row.status == 2" @click="handleUpShelf(3, row.id)">下架</span>
          <span @click="$router.push({name: 'data-person-detail', params: {id: row.id}})">查看</span>
          <span @click="uploadCurrent(row.id)">刷新</span>
        </div>
      </template>
    </ListPage>
    <getFilmDlg v-model="visFilmid" v-if="visFilmid.visible" @passDate="filmonOK"></getFilmDlg>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { queryList, personStatus, personTask } from '@/api/person'
import Country from './country.vue'
import getFilmDlg from './components/getFilmDlg.vue'

@Component({
    components: {
        ListPage,
        Country,
        getFilmDlg
    }
})

export default class Main extends ViewBase {
  fetch = queryList
  filters: Filter[] = [
    {
      name: 'id',
      defaultValue: '',
      input: true,
      width: 140,
      placeholder: '影人id'
    },
    {
      name: 'name',
      defaultValue: '',
      input: true,
      width: 140,
      placeholder: '中文名'
    },
    {
      name: 'nameEn',
      defaultValue: '',
      type: 'input',
      width: 140,
      placeholder: '英文名'
    },
    {
      name: 'profession',
      defaultValue: '',
      select: {
        enumKey: 'professions'
      },
      width: 140,
      placeholder: '职业状态'
    },
    {
      name: 'status',
      defaultValue: '',
      select: {
        enumKey: 'status'
      },
      width: 140,
      placeholder: '状态',
    },
    {
      name: 'gender',
      defaultValue: '',
      select: {
        enumKey: 'genders'
      },
      width: 140,
      placeholder: '性别',
    },
    {
      name: 'nationality',
      defaultValue: '',
      component: Country,
      width: 140,
      placeholder: '国籍'
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

  get columns() {
     return [
        {type: 'selection', width: 50},
        { key: 'id', title: '影人id', align: 'center'},
        { key: 'name', title: '中文名', align: 'center'},
        { key: 'nameEn', title: '英文名', align: 'center'},
        { key: 'gender', title: '性别',  align: 'center',  enum: 'genders'},
        { key: 'nationality', title: '国籍', align: 'center'},
        { slot: 'professions', title: '主要职业', align: 'center'},
        { key: 'status', title: '状态', align: 'center', enum: 'status'},
        { slot: 'action', title: '操作', align: 'center', minWidth: 140},
     ] as ColumnExtra[]
  }

  selectedIds: any[] = []

  // 抓取票神
  visFilmid = {
    visible: false
  }
  // 演员枚举
  professionsList: any[] = []

  mounted() {
    this.handleQueryList()
  }
  async handleQueryList() {
    try {
      const { data: {professions} } = await queryList({})
      this.professionsList = professions
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 上架 / 下架
  async handleUpShelf(status: number, id?: number) {
    const text = status == 2 ? '上架' : '下架'
    if (!id) {
      if (!this.selectedIds.length) {
        await alert(`请选择${text}数据`, {
          title: '提示'
        })
        return
      }
    }
    const ids = id ? Array.of(id) : this.selectedIds
    await confirm(`您选择了${ids.length}条影人进行${text }`, {
      title: `${text}操作`
    })
    try {
      const { data} = await personStatus({
        ids,
        status
      });
      (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 刷新
  async uploadCurrent(id: number) {
    // 刷新数据接口成功
    const ids = Array.of(id)
    try {
      const data = await personTask('PiaoshenPersonDetailTask', {
        ids
      });
      (this.$refs.listPage as any).update()
      await info('影人信息已经刷新，10分钟后查看刷新后的信息。', {title: '刷新'})
    } catch (ex) {
      this.handleError(ex)
    }
  }
  handleGetFilm() {
    this.visFilmid.visible = true
  }
  async filmonOK(val: any) {
    this.visFilmid.visible = false
    const ids = Array.of(val)
    try {
      const data = await personTask('PiaoshenPersonDetailTask', {
        ids
      });
      (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
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
.operate-btn {
  span {
    cursor: pointer;
    color: #2d8cf0;
    margin: 2px 6px;
  }
}
</style>