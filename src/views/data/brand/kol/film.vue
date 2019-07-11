<template>
  <div>
    <div v-if="eidt != 'edit'" class="brand-select rest-input">
      <Select ref="ul" @on-change="init" v-model="channel" filterable clearable style="width: 120px">
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
      :data="movielist"
      class="brand-table"
      border
      stripe
      disabled-hover
    >
      <template slot="action" slot-scope="{row, index}">
        <span class="del-col" @click="movielist.splice(index, 1)">删除</span>
      </template>
    </Table>
  </div>
</template>

<script lang="tsx">
import { Component, Watch, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import jsxReactToVue from '@/util/jsxReactToVue'
import { filmlist } from '@/api/brand'
import { confirm, info, alert } from '@/ui/modal.ts'

@Component
export default class Films extends ViewBase {
  @Prop() value: any
  @Prop({ default: 'edit' }) editnums: any
  channel: any = ''
  channelList: any = []
  movielist: any = []

  get kolcoluems() {
    return this.editnums == 'edit' ? [
      { title: '影片名称', key: 'name', align: 'center' },
      { title: '操作', key: 'rate', slot: 'action', align: 'center' },
    ] : [
      { title: '影片名称', key: 'name', align: 'center' },
    ]
  }

  created() {
    this.init()
  }

  async init() {
    try {
      const {
        data: { items }
      } = await filmlist({
        pageIndex: 1,
        pageSize: 10000,
      })
      this.channelList = items || []
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async addProvinceList() {
    if (this.channel) {
      let channelname = ''
      this.channelList.map((item: any) => {
        if (item.id == this.channel) {
          channelname = item.name
        }
      })
      const ishas = this.movielist.some(
        (item: any) => item.name == this.channel
      )
      if (!ishas) {
        this.movielist.push({
          id: this.channel,
          name: channelname
        })
        this.$emit('input', this.movielist)
        ; (this.$refs.ul as any).dispatch('FormItem', 'on-form-change', this.movielist)
      } else {
        await info('改账号已存在', { title: '提示' })
      }
    } else {
      await info('请选择账号平台', { title: '提示' })
    }
  }

  @Watch('value', { deep: true })
  watchValue(val: any) {
    this.movielist = val
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
