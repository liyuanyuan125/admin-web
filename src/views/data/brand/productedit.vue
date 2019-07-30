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

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <a @click="editShow(id)">编辑</a>
          <a @click="del(id)">删除</a>
        </div>
      </template>
    </ListPage>
    <EditDialog :fields="fields" :fetch="editFetch" queryKeys="brandId,id,channelCode" :submit="editSubmit" ref="editDlg"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { mediaslist, addmedias, editmedias, delmedias } from '@/api/brand'
import EditDialog, { Field } from '@/components/editDialog'
import { slice, clean } from '@/fn/object'
import AreaSelect, { areaParam } from '@/components/areaSelect'

@Component({
  components: {
    ListPage,
    EditDialog,
    AreaSelect
  }
})
export default class Main extends ViewBase {
  fetch = mediaslist
  id = 0

  get filters() {
    const brandId = this.$route.params.brandId
    return [
      {
        name: 'channelCode',
        defaultValue: '',
        type: 'select',
        width: 85,
        placeholder: '门店名称',
        enumKey: 'channelCodeList'
      },

      {
        name: 'channelDataId',
        defaultValue: '',
        type: 'input',
        width: 85,
        placeholder: '联系人电话'
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        width: 85,
        placeholder: '公司名称'
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
      { title: '账号平台', key: 'channelCode' , editor: 'enum', enumKey: 'channelCodeCode'},
      { title: '账号ID', key: 'id'},
      { title: '账号名称', key: 'name' },
      { title: '账号头像', key: 'logo', editor: 'deprecated' },
      { title: '跳转URL链接', key: 'url', editor: 'enum', enumKey: 'tradeCodeCode' },
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
        name: 'channelCodeCode',
        defaultValue: '',
        type: 'select',
        label: '账号平台',
        span: 12,
        required: true
      },

      {
        name: 'channelDataId',
        defaultValue: '',
        type: 'input',
        label: '账号ID',
        span: 12,
        required: true
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        label: '账号名称',
        span: 12,
      },

      {
        name: 'url',
        defaultValue: '',
        type: 'input',
        label: 'URL链接',
        span: 12
      }
    ]
  }

  editFetch = async ( query: any) => {
    const { data: {
      items,
      channelCodeList
    }} = await mediaslist(query)
    if (items.length > 0) {
      return {
        data: {
          channelCodeList,
          item: {
            url: items[0].url,
            channelCodeCode: items[0].channelCode,
            name: items[0].name,
            channelDataId: items[0].channelDataId,
          }
        }
      }
    } else {
      return {
        data: {
          channelCodeList,
          item: null
        }
      }
    }
  }

  async del(id: any) {
    try {
      await delmedias(id)
      ; (this.$refs.listPage as any).update()
    } catch (ex) {
      this.handleError(ex)
    }
  }

  editShow(id = 0) {
    const editor = this.$refs.editDlg as EditDialog
    const brandId = this.$route.params.brandId
    this.id = id
    let query: any = {}
    if (this.id) {
      query = {
        brandId,
        id
      }
    } else {
      query = {
        brandId,
        channelCode: 1
      }
    }
    editor.show({ ...query }).done((data: any) => {
      (this.$refs.listPage as any).update()
    })
  }

  editSubmit(data: any) {
    const query = clean({
      ...data,
      channelCode: data.channelCodeCode,
      channelCodeCode: '',
      id: this.id
    })
    return this.id ? editmedias(query) : addmedias(query)
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: "-";
}
</style>
