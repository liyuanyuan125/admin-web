<template>
  <div class="index-page">
    <Tabs v-model="typeCode" type="card" @on-click="upload" class="tabs">
      <TabPane
        v-for="it in typeList"
        :key="it.value"
        :name="it.value"
        :label="it.name"
      >
        <Before v-show="it.value == 'before'"></Before>
        <Audit ref="audit" v-show="it.value == 'audit'"></Audit>
        <Finsh ref="finsh" v-show="it.value == 'finish'"></Finsh>
      </TabPane>
    </Tabs>

    <Pay ref='pay' />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import { beforeList, auditList } from '@/api/payroll'
import { alert, toast } from '@/ui/modal'
import { beforefetch, beforenum, beforcoulm } from './before'
import { auditfetch, auditcoulm, auditenum } from './audit'
import Pay from './paymodel.vue'
import { EditDialog, Field } from '@/components/editForm'
import BatchAudit from '@/components/batchAudit'
import Before from './bofore.vue'
import Audit from './audit.vue'
import Finsh from './finnish.vue'

const typeList = [
  { name: '待申请付款', value: 'before' },
  { name: '请款单审批', value: 'audit' },
  { name: '已申请付款', value: 'finish' },
]
const defaultType = typeList[0].value

@Component({
  components: {
    ListPage,
    BatchAudit,
    Pay,
    Before,
    Audit,
    Finsh
  }
})
export default class IndexPage extends ViewBase {
  @Prop({ type: String, default: defaultType }) type!: string

  get listPage() {
    return this.$refs.listPage as ListPage
  }

  // get fetch() {
  //   if (this.typeCode == 'before') {
  //     return beforeList
  //   } else if (this.typeCode == 'audit') {
  //     return auditList
  //   } else {
  //     return finishfetch
  //   }
  // }

  // get filters() {
  //   if (this.typeCode == 'before') {
  //     return beforefetch
  //   } else if (this.typeCode == 'audit') {
  //     return auditfetch
  //   } else {
  //     return finishfetch
  //   }
  // }

  // get enums() {
  //   if (this.typeCode == 'before') {
  //     return beforenum
  //   } else if (this.typeCode == 'audit') {
  //     return auditenum
  //   } else {
  //     return finishfetch
  //   }
  // }

  // get columns() {
  //   if (this.typeCode == 'before') {
  //     return beforcoulm
  //   } else if (this.typeCode == 'audit') {
  //     return auditcoulm
  //   } else {
  //     return finishfetch
  //   }
  // }

  typeCode = this.type

  typeList = typeList

  selectedIds = [] as number[]

  auditVisible = false

  crawlVisible = false


  refresh() {
    this.listPage.update()
  }

  upload(type: string) {
    if (type == 'audit') {
      this.$nextTick(() => {
        (this.$refs.audit[2] as any).refresh()
      })
    }
    if (type == 'finish') {
      this.$nextTick(() => {
        (this.$refs.finsh[2] as any).refresh()
      })
    }
  }

  @Watch('typeCode')
  watchTypeCode(type: string) {
    this.$router.push({
      name: 'finance-payroll',
      params: type == defaultType ? {} : { type },
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
