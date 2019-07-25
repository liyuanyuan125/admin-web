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
          @click="editShow()"
        >新建账号平台</Button>
      </template>

      <template slot="action" slot-scope="{ row, row: { id } }">
        <div class="row-acts">
          <a @click="editShow(id, row)">编辑</a>
          <a @click="del(id)">删除</a>
        </div>
      </template>
    </ListPage>
    <EditDialog :fields="fields" :fetch="editFetch" queryKeys="brandId,id,name,provinceId,phone,cityId,address" :submit="editSubmit" ref="editDlg"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { editshop, delshop, addshop, shoplist } from '@/api/brand'
import EditDialog, { Field } from '@/components/editDialog'
import { slice, clean } from '@/fn/object'
import AreaSelect, { areaParam } from '@/components/areaSelect'

@Component({
  components: {
    ListPage,
    EditDialog
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
    'channelCodeList',
  ]

  get columns() {
    return [
      { title: '序号', key: 'id' },
      { title: '门店名称', key: 'name' },
      { title: '门店所在省份', key: 'provinceName'},
      { title: '门店所在城市', key: 'cityName' },
      { title: '门店详细地址', key: 'address' },
      { title: '门店电话', key: 'phone' },
      { title: '操作', key: 'keyWords', slot: 'action' }
    ] as ColumnExtra[]
  }

  get fields() {
    const brandId = this.$route.params.brandId
    return [
      {
        name: 'brandId',
        defaultValue: brandId
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        label: '门店名称',
        span: 12,
        required: true
      },

      {
        ...areaParam,
        type: AreaSelect,
        label: '所在地区：',
        span: 12,
        props: {
          maxLevel: 2
        }
      },

      {
        name: 'address',
        defaultValue: '',
        type: 'input',
        label: '详细地址：',
        span: 12,
      },

      {
        name: 'phone',
        defaultValue: '',
        type: 'input',
        label: '电话：',
        span: 12
      }
    ]
  }

  editFetch = async (query: any) => {
    return {
      data: {
        item: {
          ...query
        }
      }
    }
  }

  async del(id: any) {
    try {
      await delshop(id)
      ; (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  editShow(id = 0, it: any) {
    const editor = this.$refs.editDlg as EditDialog
    const brandId = this.$route.params.brandId
    this.id = id
    let query: any = {}
    if (this.id) {
      query = {
        brandId,
        id,
        ...it
      }
    } else {
      query = {
        brandId,
      }
    }
    editor.show({ ...query }).done((data: any) => {
      (this.$refs.listPage as any).update()
    })
  }

  editSubmit(data: any) {
    const query = clean({
      ...data,
      id: this.id
    }, [0])
    return this.id ? editshop(query) : addshop(query)
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: "-";
}
</style>
