<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >

      <template slot="id" slot-scope="{ row }">
        <div class="row-acts">
          <router-link :to="{
            name: 'order-filmorder-filmexamine',
            params: {
              id: row.id,
              status: 0
            }
          }">{{row.id}}</router-link>
        </div>
      </template>

      <template slot="action" slot-scope="{ row }">
        <div class="row-acts">
          <router-link v-if='row.status == 1' :to="{
            name: 'order-filmorder-filmexamine',
            params: {
              id: row.id,
              status: 1
            }
          }">审核</router-link>
          <router-link v-if='row.status == 2' :to="{
            name: 'order-filmorder-filmexamine',
            params: {
              id: row.id,
              status: 'detail'
            }
          }">上传资源</router-link>
          <router-link :to="{
            name: 'order-filmorder-filmexamine',
            params: {
              id: row.id,
              status: 0
            }
          }">查看</router-link>
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
// import { planlist , company } from '@/api/orderSys'
import { queryList , film  } from '@/api/filmorder'
import Film from './data/movie.vue'
import company from './data/company.vue'

@Component({
  components: {
    ListPage,
    company,
    Film
  }
})
export default class Main extends ViewBase {

  filters: Filter[] = [
    {
      name: 'id',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '订单编号'
    },

    {
      name: 'companyId',
      defaultValue: 0,
      type: company,
      width: 125,
      placeholder: '公司名称'
    },

    {
      name: 'movieId',
      defaultValue: 0,
      type: Film,
      width: 125,
      placeholder: '影片名称'
    },

    {
      name: 'resourceType',
      defaultValue: '',
      type: 'select',
      width: 85,
      placeholder: '资源类型',
      enumKey: 'offlineResourceTypeList'
    },

    {
      name: 'dateRange',
      defaultValue: '',
      type: 'dateRange',
      width: 200,
      placeholder: '下单时间',
      dealParam(value: string) {
        const [beginDate, endDate] = value ? value.split('-') : [null, null]
        return {
          startTime: beginDate,
          endTime: endDate
        }
      }
    },

    {
      name: 'status',
      defaultValue: '',
      type: 'select',
      width: 85,
      placeholder: '单据状态',
      enumKey: 'statusList'
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
    'typeList',
    'offlineResourceTypeList',
    'statusList',
    'channelCodeList'
  ]

  fetch = async (val: any) => {
    const {
      data: {
        statusList,
        typeList,
        offlineResourceTypeList,
        channelCodeList,
        items,
        totalCount
      }
    } = await queryList(val)
    const item = (items || []).map((it: any) => {
      let coupon = ''
      let material = ''
      const offlines = (it.brandResource.offlines || []).map((ite: any) => {
        return offlineResourceTypeList.filter((its: any) => its.key == ite.channelCode)[0]
      })
      const onlines = (it.brandResource.onlines || []).map((ite: any) => {
        return channelCodeList.filter((its: any) => its.key == ite.channelCode)[0]
      })
      if (it.movieResource) {
        if (it.movieResource.coupon) {
          coupon = '  电子券资源	'
        }
        if (it.movieResource.material) {
          material = '  物料资源'
        }
      }
      return {
        ...it,
        status: it.status,
        onlines: onlines.map((its: any) => its.text).join(','),
        offlines: offlines.map((its: any) => its.text).join(','),
        names: `${coupon}${material}`
      }
    })
    return {
      statusList: statusList.filter((it: any) => it.key != 0),
      typeList,
      offlineResourceTypeList,
      channelCodeList,
      items: [
        ...item
      ],
      totalCount
    }
  }

  get columns() {
    return [
      { title: '订单编号', key: 'id', slot: 'id' },
      { title: '公司ID', key: 'companyId' },
      { title: '公司名称', key: 'companyName' },
      { title: '项目名称', key: 'projectName' },
      { title: '关联影片ID', key: 'movieId' },
      { title: '关联的影片名称', key: 'movieName' },
      { title: '下单时间', key: 'frontCreateTime', editor: 'dateTime' },
      { title: '最后更新时间', key: 'adminModifyTime', editor: 'dateTime' },
      { title: '影片资源类型', key: 'names' },
      { title: '品牌方线上资源', key: 'onlines'  },
      { title: '品牌方线下资源', key: 'offlines' },
      { title: '订单状态', key: 'status', editor: 'enum' },
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
