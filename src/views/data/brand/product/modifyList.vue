<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
      <template slot="index" slot-scope="{ index }">
        <div>
          {{index + 1}}
        </div>
      </template>

      <template slot="keywords" slot-scope="{ row: { keyWords } }">
        <div v-if=" !keyWords "> - </div>
        <div v-else-if="keyWords && keyWords.length > 0">
          <ul>
            <li v-for="(it, index) in keyWords" :key="index">{{it}}</li>
          </ul>
        </div>
        <div v-else>
          {{ ...keyWords }}
        </div>
      </template>

      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">
          <!-- <router-link
            :to="{
              name: 'data-kol-account-edit',
              params: {
                id,
                channel,
                action: status == 1 ? 'audit' : 'edit'
              }
            }"
          >{{status == 1 ? '审核' : '编辑'}}</router-link> -->
          <a @click="del(id)">查看</a>
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
import { productsList, addmedias, editmedias, delmedias } from '@/api/brandProduct'
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

  fetch = productsList
  brandId: number|null = 0

  get filters() {

    return [
      {
        name: 'query',
        defaultValue: '',
        type: 'select',
        width: 85,
        placeholder: '产品名称',
      },

      {
        name: 'id',
        defaultValue: '',
        type: 'input',
        width: 85,
        placeholder: '产品ID'
      },

      {
        name: 'brandId',
        defaultValue: this.brandId
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
    'statusList',
  ]

  get columns() {
    return [
      { title: '序号', slot: 'index', maxWidth: 60 },
      { title: '产品ID', key: 'id'},
      { title: '产品中文名称', key: 'name' },
      { title: '产品外文名称', key: 'enName' },
      { title: '产品简述', key: 'description', minWidth: 200 },
      { title: '搜索关键字', key: 'keyWords', slot: 'keywords' },
      { title: '最后更新时间', key: 'modifyTime' },
      { title: '状态', key: 'status', editor: 'enum', enumKey: 'statusList' },
      { title: '操作', key: 'keyWords', slot: 'action' }
    ] as ColumnExtra[]
  }

  get fields() {
    return [
      {
        name: 'brandId',
        defaultValue: this.brandId
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
    // const { data: {
    //   items,
    //   channelCodeList
    // }} = await productsList(query)
    // if (items.length > 0) {
    //   return {
    //     data: {
    //       channelCodeList,
    //       item: {
    //         url: items[0].url,
    //         channelCodeCode: items[0].channelCode,
    //         name: items[0].name,
    //         channelDataId: items[0].channelDataId,
    //       }
    //     }
    //   }
    // } else {
    //   return {
    //     data: {
    //       channelCodeList,
    //       item: null
    //     }
    //   }
    // }
  }

  async del(id: any) {
    // try {
    //   await delmedias(id)
    //   ; (this.$refs.listPage as any).update()
    // } catch (ex) {
    //   this.handleError(ex)
    // }
  }

  editShow(id = 0) {
    // const editor = this.$refs.editDlg as EditDialog
    // const brandId = this.$route.params.id
    // let query: any = {}
    // if (id) {
    //   query = {
    //     brandId,
    //     id
    //   }
    // } else {
    //   query = {
    //     brandId,
    //     channelCode: 1
    //   }
    // }
    // editor.show({ ...query }).done((data: any) => {
    //   (this.$refs.listPage as any).update()
    // })
  }

  editSubmit(data: any) {
    // const query = clean({
    //   ...data,
    //   channelCode: data.channelCodeCode,
    //   channelCodeCode: '',
    //   id: this.id
    // })
    // return this.id ? editmedias(query) : addmedias(query)
  }

  created() {
    this.brandId = parseFloat(this.$route.params.brandId) || null

  }
}
</script>

<style lang="less" scoped>
.keyWords:only-child:empty::before {
  content: "-";
}
</style>
