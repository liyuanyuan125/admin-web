<template>
  <div>
    <div v-if="editnums == 'edit'" class="brand-select rest-input">
      <Select @on-change="init" v-model="promodel" filterable clearable style="width: 120px">
        <Option
          v-for="option in tradeCodeList"
          :value="option.key"
          :key="option.key"
        >{{option.text}}</Option>
      </Select>
      <Select v-model="channel" filterable clearable style="width: 120px">
        <Option
          v-for="option in channelList"
          :value="option.id"
          :key="option.id"
        >{{option.name}}</Option>
      </Select>
      <Button @click="addProvinceList">添加列表</Button>
    </div>
    <Table
      :columns="kolcoluems"
      :data="kollist"
      class="brand-table"
      style="width: 362px"
      border
      stripe
      disabled-hover
    >
      <template slot="action" slot-scope="{row, index}">
        <span class="del-col" @click="kollist.splice(index, 1)">删除</span>
      </template>
    </Table>
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { confirm, info, alert } from '@/ui/modal.ts'
import { brandbefore, brandList, kolchannel } from '@/api/brand'

@Component
export default class Main extends ViewBase {
  @Prop() value: any
  @Prop() channelCodeList: any
  @Prop({ default: 'edit' }) editnums: any
  channel: any = ''
  promodel: any = ''
  channelList: any = []
  kollist: any = []
  tradeCodeList: any = []

  get kolcoluems() {
    const tables = [
      { title: '品牌分类', key: 'name', align: 'center' },
      { title: '品牌名称', key: 'rate', align: 'center' },
    ]
    const action = [{ title: '操作', key: 'rate', slot: 'action', align: 'center' }]
    return this.editnums == 'edit' ? [...tables, ...action] : [...tables]
  }

  customcolunms: any = [
    { title: '排序', key: 'index', align: 'center' },
    { title: '评论热词', key: 'hot', align: 'center' },
  ]

  created() {
    this.init()
    this.brandbeforelist()
  }

  async brandbeforelist() {
    try {
      const {
        data: { tradeCodeList }
      } = await brandList({})
      this.tradeCodeList = tradeCodeList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async init(val?: any) {
    if (!val) {
      return
    }
    try {
      const {
        data: { items }
      } = await brandList({
        tradeCode: val,
        pageIndex: 1,
        pageSize: 1000,
      })
      this.channelList = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async addProvinceList() {
    if (this.promodel != '' && this.channel != '') {
      let proname: string = ''
      let channelname = ''
      this.tradeCodeList.map((item: any) => {
        if (item.key == this.promodel) {
          proname = item.text
        }
      })
      this.channelList.map((item: any) => {
        if (item.id == this.channel) {
          channelname = item.name
        }
      })
      const ishas = this.kollist.some(
        (item: any) => item.categoryCode == this.promodel
      )
      const ishascode = this.kollist.some(
        (item: any) => item.brandId == this.channel
      )
      if (!ishas && !ishascode) {
        this.kollist.push({
          name: proname,
          categoryCode: this.promodel,
          brandId: this.channel,
          rate: channelname
        })
        this.$emit('input', this.kollist.map((it: any) => {
          return {
            categoryCode: it.categoryCode,
            brandId: it.brandId
          }
        }))
      } else {
        await info('改品牌已存在', { title: '提示' })
      }
    } else {
      await info('请选择品牌', { title: '提示' })
    }
  }

  @Watch('value', { deep: true })
  watchValue(val: any) {
    this.kollist = val
  }
}
</script>

<style lang="less" scoped>
.brand-table {
  min-width: 360px;
  max-width: 482px;
  margin-top: 15px;
  /deep/ .ivu-table {
    background: none;
    &::before {
      background-color: none;
    }
  }
  .del-col {
    cursor: pointer;
    color: #2d8cf0;
  }
}
</style>
