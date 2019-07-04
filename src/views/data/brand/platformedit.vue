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
      <template slot="keyWords" slot-scope="{ row: { keyWords } }">
        <div class="keyWords">
         <span v-if="keyWords">{{keyWords.join(';')}}</span>
        </div>
      </template>

      <template slot="platform" slot-scope="{ row: { keyWords } }">
        <div>
         <router-link :to="{ name: 'data-cinema-hall', params: { id } }">查看影厅</router-link>
        </div>
      </template>

      <template slot="shop" slot-scope="{ row }">
        <div>
         <router-link :to="{ name: 'data-cinema-hall', params: { id } }">查看影厅</router-link>
        </div>
      </template>

      <template slot="product" slot-scope="{ row }">
        <div>
         <router-link :to="{ name: 'data-cinema-hall', params: { id } }">查看影厅</router-link>
        </div>
      </template>

      <template slot="status" slot-scope="{ row }">
        <div>
         <router-link :to="{ name: 'data-cinema-hall', params: { id } }">查看影厅</router-link>
        </div>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <router-link
            :to="{ name: 'data-cinema-hall', params: { id } }"
            v-auth="'theater.cinemas:info'"
          >查看影厅</router-link>
          <a >编辑</a>
        </div>
      </template>
    </ListPage>
    <EditDialog :fields="fields" :fetch="editFetch" :submit="editSubmit" ref="editDlg"/>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { mediaslist, addmedias, editmedias, delmedias } from '@/api/brand'
import EditDialog, { Field } from '@/components/editDialog'

@Component({
  components: {
    ListPage,
    EditDialog
  }
})
export default class Main extends ViewBase {
  fetch = mediaslist

  get filters() {
    const brandId = this.$route.params.brandId
    return [
      {
        name: 'channelCode',
        defaultValue: '',
        type: 'select',
        width: 85,
        placeholder: '账号平台',
        enumKey: 'channelCodeList'
      },

      {
        name: 'channelDataId',
        defaultValue: '',
        type: 'input',
        width: 85,
        placeholder: '账号ID'
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        width: 85,
        placeholder: '账号名称'
      },

      {
        name: 'brandId',
        defaultValue: brandId,
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
      { title: '账号平台', key: 'id' },
      { title: '账号ID', key: 'name' },
      { title: '账号名称', key: 'enName' },
      { title: '账号头像', key: 'logo', editor: 'deprecated' },
      { title: '跳转URL链接', key: 'tradeCode', editor: 'enum', enumKey: 'tradeCodeCode' },
      { title: '操作', key: 'keyWords', slot: 'keyWords' }
    ] as ColumnExtra[]
  }

  get fields() {
    return [
      {
        name: 'brandId',
        defaultValue: 0
      },

      {
        name: 'channelCode',
        defaultValue: '',
        type: 'select',
        label: '账号平台',
        span: 16,
        required: true
      },

      {
        name: 'channelDataId',
        defaultValue: '',
        type: 'input',
        label: '账号ID',
        span: 8,
        required: true
      },

      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        label: '账号名称',
        span: 16,
        required: true
      },

      {
        name: 'url',
        defaultValue: '',
        type: 'select',
        label: '跳转URL链接',
        span: 8
      }
    ]
  }

  editShow(id = 0) {
    const editor = this.$refs.editDlg as EditDialog
    editor.show({ id }).done((data: any) => {
      (this.$refs.listPage as any).update()
    })
  }

  mounted() {}
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: "-";
}
</style>
