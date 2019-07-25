<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
      <template slot="acts">
        <Button
          type="success"
          icon="md-add-circle"
          :to="{
            name: 'data-kol-associated-edit'
          }"
        >新建</Button>
      </template>

      <template slot="weibo" slot-scope="{ row: { id, exts } }">
        <span v-for="it in (exts || [])" :key="it.id" v-if="it.channelCode == 'weibo'">{{it.channelDataName}}</span>
      </template>

      <template slot="wechat" slot-scope="{ row: { id, exts } }">
        <span v-for="it in (exts || [])" :key="it.id" v-if="it.channelCode == 'wechat'">{{it.channelDataName}}</span>
      </template>

      <template slot="douyin" slot-scope="{ row: { id, exts } }">
        <span v-for="it in (exts || [])" :key="it.id" v-if="it.channelCode == 'douyin'">{{it.channelDataName}}</span>
      </template>

      <template slot="kuaishou" slot-scope="{ row: { id, exts } }">
        <span v-for="it in (exts || [])" :key="it.id" v-if="it.channelCode == 'kuaishou'">{{it.channelDataName}}</span>
      </template>

      <template slot="id" slot-scope="{ row: { id } }">
        <router-link :to="{ name: 'data-kol-associated-detail', params: { id} }">
           {{id}}</router-link>
      </template>

      <template slot="action" slot-scope="{ row }">
        <div class="row-acts">
          <router-link :to="{
            name: 'data-kol-associated-edit',
            params: {
              id: row.id
            }
          }">编辑</router-link>
        </div>
      </template>
    </ListPage>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { queryList } from '@/api/associated'

@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {

  filters: Filter[] = [
    {
      name: 'id',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: 'KOL编号'
    },

    {
      name: 'name',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: 'KOL名称'
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
    'accountCategoryList'
  ]

  fetch = async (val: any) => {
    const {
      data: {
        accountCategoryList,
        items,
        totalCount
      }
    } = await queryList(val)
    const name: any = {
      weibo: '',
      kuaishou: '',
      douyin: '',
      wechat: ''
    }
    const item = (items || []).map((it: any) => {
      (it.exts || []).map((its: any) => {
        name[its.channelCode] = its.channelDataName
      })
      return {
        ...it,
        ...name.channelDataName
      }
    })
    return {
      data: {
        accountCategoryList,
        items: [
          ...item
        ],
        totalCount
      },
      items: [
        ...item
      ],
      totalCount
    }
  }

  get columns() {
    return [
      { title: 'KOL编号', key: 'id', slot: 'id' },
      { title: 'KOL名称', key: 'name' },
      { title: '鲸娱指数', key: 'jyIndex' },
      { title: '微博平台账号', key: 'weibo', slot: 'weibo' },
      { title: '微信平台账号', key: 'wechat', slot: 'wechat' },
      { title: '快手', key: 'kuaishou', slot: 'kuaishou' },
      { title: '抖音平台账号', key: 'douyin', slot: 'douyin' },
      { title: '最后更新时间', key: 'modifyTime', editor: 'dateTime' },
      { title: '操作', slot: 'action' }
    ] as ColumnExtra[]
  }

  async start(row: any) {
    this.$nextTick(() => {
      (this.$refs.start as any).init(row)
    })
  }

  uplist() {
    (this.$refs.listPage as any).update()
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: "-";
}
.keyWords a {
  display: block;
  padding: 5px 0;
}
</style>
