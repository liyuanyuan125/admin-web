<template>
  <div class="index-page">
    <Tabs v-model="typeCode" type="card" class="tabs">
      <TabPane
        v-for="it in typeList"
        :key="it.value"
        :name="it.value"
        :label="it.name"
      />
    </Tabs>

    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      selectable
      :selectedIds.sync="selectedIds"
      ref="listPage"
    >
      <template slot="acts">
        <!-- <Button
          type="success"
          icon="md-add-circle"
        >新建</Button> -->
      </template>

      <template slot="acts-2">
        <Button
          type="primary"
          class="button-audit"
          :disabled="!(selectedIds.length > 0)"
          @click="auditVisible = true"
        >批量审核</Button>

        <Button
          type="primary"
          class="button-crawl"
          @click="crawlVisible = true"
        >抓取平台账号</Button>
      </template>

      <template slot="action" slot-scope="{ row: { id, status } }">
        <div class="row-acts">

        </div>
      </template>
    </ListPage>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { beforeList } from '@/api/payroll'
import { alert, toast } from '@/ui/modal'
import { beforefetch, beforenum } from './before'
import { auditfetch } from './audit'
import { finishfetch } from './finnish'

import { EditDialog, Field } from '@/components/editForm'
import BatchAudit from '@/components/batchAudit'

const typeList = [
  { name: '待申请付款', value: 'before' },
  { name: '请款单审批', value: 'audit' },
  { name: '已申请付款', value: 'finish' },
]
const defaultType = typeList[0].value

@Component({
  components: {
    ListPage,
    EditDialog,
    BatchAudit
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultType }) type!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  typeCode = this.type

  typeList = typeList

  selectedIds = [] as number[]

  get fetch() {
    if (this.typeCode == 'before') {
      return beforeList
    } else if (this.typeCode == 'audit') {
      return auditfetch
    } else {
      return finishfetch
    }
  }

  get filters() {
    if (this.typeCode == 'before') {
      return beforefetch
    } else if (this.typeCode == 'audit') {
      return auditfetch
    } else {
      return finishfetch
    }
  }

  get enums() {
    if (this.typeCode == 'before') {
      return beforenum
    } else if (this.typeCode == 'audit') {
      return auditfetch
    } else {
      return finishfetch
    }
  }

  get columns() {
    return [
      { title: '序号', key: 'id', minWidth: 65 },
      { title: '名称', key: 'name', minWidth: 100 },
      { title: '分类', key: 'accountCategoryCode', minWidth: 60, editor: 'deprecated' },
      { title: '粉丝数', key: 'fansCount', minWidth: 60 },
      {
        title: '关联KOL编号',
        key: 'kolId',
        minWidth: 90,
        link: {
          name: 'data-kol-associated-detail',
          params: it => ({ id: it.kolId })
        }
      },
      { title: '关联KOL名称', key: 'kolName', minWidth: 100 },
      { title: '是否提供发票', key: 'provideInvoiceText', minWidth: 90 },
      { title: '结算价/有效期', slot: 'price', minWidth: 270 },
      { title: '审核状态', key: 'status', minWidth: 65, editor: 'enum' },
      { title: '操作', slot: 'action', minWidth: 50 }
    ] as ColumnExtra[]
  }

  auditVisible = false

  crawlVisible = false

  get auditSummary() {
    const count = this.selectedIds.length
    return `您选择了${count}条KOL平台账号，审核通过后可以在“KOL资源列表”中操作定价和上架。`
  }

  crawlFields: Field[] = [
    {
      name: 'channel',
      defaultValue: '',
      label: '平台',
      required: true,
      select: {
        enumList: typeList.map(it => ({ key: it.value, text: it.name }))
      },
      span: 21,
    },

    {
      name: 'account',
      defaultValue: '',
      label: '平台账号',
      required: true,
      input: true,
      span: 21,
    }
  ]

  refresh() {
    this.listPage.update()
  }


  @Watch('typeCode')
  watchTypeCode(id: any) {
    this.$router.push({
      name: 'finance-payroll',
      params: id == defaultType ? {} : { id }
    })
  }
}
</script>

<style lang="less" scoped>
.button-crawl {
  margin-left: 12px;
}

.price-table {
  margin: 4px 0;
  /deep/ th,
  /deep/ td {
    height: 24px;
    background-color: #fff !important;
  }
}
</style>
