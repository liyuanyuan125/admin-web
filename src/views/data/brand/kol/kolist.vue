<template>
  <div>
    <div v-if="editnums == 'edit'" class="brand-select rest-input">
      <Select @on-change="init" v-model="promodel" filterable clearable style="width: 120px">
        <Option
          v-for="option in channelCodeList"
          :value="option.key"
          :key="option.key"
        >{{option.text}}</Option>
      </Select>
      <Select ref='ul' v-model="channel" filterable clearable style="width: 120px">
        <Option
          v-for="option in channelList"
          :value="option.channelDataId"
          :key="option.channelDataId"
        >{{option.channelDataId}}</Option>
      </Select>
      <Button @click="addProvinceList">添加列表</Button>
    </div>
    <Table
      :columns="kolcoluems"
      :data="kollist"
      class="brand-table"
      border
      stripe
      disabled-hover
    >
      <template slot="action" slot-scope="{row, index}">
        <span class="del-col" @click="del(index)">删除</span>
      </template>
    </Table>
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { brandList, kolchannel } from '@/api/brand'
import { confirm, info, alert } from '@/ui/modal.ts'
import { toMap } from '@/fn/array'

const makeMap = (list: any[]) => toMap(list, 'key', 'text')
@Component
export default class Kol extends ViewBase {
  @Prop() value: any

  @Prop() channelCodeList: any

  @Prop({ default: 'edit' }) editnums: any

  channel: any = ''
  promodel: any = ''
  channelList: any = []
  kollist: any = []

  get kolcoluems() {
    const table: any = [
      { title: '平台', key: 'name', align: 'center' },
      { title: '平台账号ID', key: 'channelDataId', align: 'center' },
      { title: '平台账号名称', key: 'rate', align: 'center' },
    ]
    const edit = [
      { title: '操作', key: 'rate', slot: 'action', width: 120, align: 'center' }
    ]
    return this.editnums == 'edit' ? [...table, ...edit] : [ ...table ]
  }

  created() {
    this.init()
  }

  async init(val?: any) {
    if (!val) {
      return
    }
    try {
      const {
        data: { items }
      } = await kolchannel({
        channelCode: val,
        status: 2,
        pageIndex: 1,
        pageSize: 1000,
      })
      this.channelList = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  del(index: any) {
    this.kollist.splice(index, 1)
    this.$emit('input', this.kollist)
  }

  async addProvinceList() {
    if (this.promodel && this.channel) {
      let proname: string = ''
      let channelname = ''
      this.channelCodeList.map((item: any) => {
        if (item.key == this.promodel) {
          proname = item.text
        }
      })
      this.channelList.map((item: any) => {
        if (item.channelDataId == this.channel) {
          channelname = item.name
        }
      })
      const ishas = this.kollist.some(
        (item: any) => item.channelDataId == this.channel
      )
      if (!ishas) {
        this.kollist.push({
          name: proname,
          channelCode: this.promodel,
          channelDataId: this.channel,
          rate: channelname
        })
        this.$emit('input', this.kollist)
        ; (this.$refs.ul as any).dispatch('FormItem', 'on-form-change', this.kollist)
      } else {
        await info('该账号已存在', { title: '提示' })
      }
    } else {
      await info('请选择账号平台', { title: '提示' })
    }
  }

  @Watch('value', { deep: true })
  watchValue(val: any) {
    this.kollist = val.map((it: any) => {
      const channelCode = makeMap(this.channelCodeList)
      return {
        ...it,
        name: channelCode[it.channelCode]
      }
    })
  }
}
</script>

<style lang="less">
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
