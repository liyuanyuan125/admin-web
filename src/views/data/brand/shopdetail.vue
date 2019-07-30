<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
    </ListPage>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { editshop, delshop, addshop, shoplist } from '@/api/brand'
import { slice, clean } from '@/fn/object'
import AreaSelect, { areaParam } from '@/components/areaSelect'

@Component({
  components: {
    ListPage,
  }
})
export default class Main extends ViewBase {
  fetch = shoplist
  id = 0

  get filters() {
    const brandId = this.$route.params.brandId
    return [
      {
        name: 'query',
        defaultValue: '',
        type: 'input',
        width: 85,
        placeholder: '门店名称',
      },

      {
        ...areaParam,
        type: AreaSelect,
        props: {
          maxLevel: 2,
        },
        width: 160,
        placeholder: '所在省市',
        defaultValue: [0, 0],
        dealParam: ([provinceId, cityId]: number[]) => ({
          provinceId: provinceId || 0,
          cityId: cityId || 0,
        }),
        backfillParam: ({ provinceId, cityId }: any) => [
          provinceId || 0,
          cityId || 0,
        ]
      },

      {
        name: 'brandId',
        defaultValue: brandId
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
  }

  enums = [
  ]

  get columns() {
    return [
      { title: '序号', key: 'id' },
      { title: '门店名称', key: 'name' },
      { title: '门店所在省份', key: 'provinceName'},
      { title: '门店所在城市', key: 'cityName' },
      { title: '门店详细地址', key: 'address' },
      { title: '门店电话', key: 'phone' },
    ] as ColumnExtra[]
  }
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: "-";
}
</style>
