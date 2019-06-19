<template>
  <div>
    <ListPage :fetch="fetch"
              :filters="filters"
              :enums="enums"
              :columns="columns"
              ref="listPage"
              @selectionChange="selectionChangeHandler"
              v-if="isAlive">
      <template slot="acts-2">
        <Button type="success"
                class="ui-filter"
                icon="md-checkmark"
                @click="handleApprove">批量审核</Button>
      </template>
      <template slot="acts">
        <Button class="ui-filter"
                type="success"
                icon="md-add-circle"
                @click="handleCreate">抓取平台账号</Button>
      </template>
      <template slot="settlementPrices"
                slot-scope="{ row: { settlementPrices } }">
        <ul>
          <li v-for="(item, index) in settlementPrices"
              :key="index">{{ item.categoryName }} - {{item.settlementPrice}}元
            <span>有效期: {{ getDate(item.effectiveDate) }}</span></li>
        </ul>
      </template>
      <template slot="customFans"
                slot-scope="{ row: { customFans } }">
        <span>{{customFans.totalCount}}</span>
      </template>
      <template slot="selection"
                slot-scope="{ row: {status} }">
        <span>{{ status }}</span>
      </template>
      <template slot="action"
                slot-scope="{ row: { id, status } }">
        <div class="row-acts">
          <router-link v-if="status=='0'||status=='1'" :to="{ name: 'kol-account-approve', params: { id } }">审核</router-link>
          <router-link :to="{ name: 'kol-account-edit', params: { channelCode, id } }">编辑</router-link>
        </div>
      </template>
    </ListPage>
    <Modal v-model="approve.visible"
           title='审核'
           class="audit-modal"
           width="500"
           @on-ok="handleApproveSubmit">
      <p>您选择了 <span>{{approve.selectedList.length}}</span>条KOL平台账号，审核通过后可以在“KOL资源列表”中操作定价和上架。</p>
      <div>
        <RadioGroup class="approve-radio"
                    v-model="approve.agree">
          <Radio label="1">
            <span>审核通过</span>
          </Radio>
          <Radio label="0">
            <span>审核不通过</span>
          </Radio>
        </RadioGroup>
        <p class="flex-box"
           v-if="approve.agree == 0">
          <span class="label-dese">备注：</span>
          <Input v-model="approve.remark"
                 type="textarea"
                 placeholder="请输入备注"></Input>
        </p>
      </div>
    </Modal>
    <Modal v-model="createItem.visible"
           title='抓取平台账号'
           class="create-modal"
           width="500"
           @on-ok="handleCreateSubmit">
      <Form :model="createItem"
            :label-width="76"
            :rules="createRules"
            class="form"
            ref="form">
        <Row>
          <Col span="22">
          <FormItem label="平台"
                    prop="channelCode">
            <Select v-model="createItem.channelCode">
              <Option v-for="it in channelList"
                      :key="it.key"
                      :value="it.key">{{it.text}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
          <FormItem label="平台账号"
                    prop="channelDataId">
            <Input v-model="createItem.channelDataId"
                   placeholder="请输入" />
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'

import { queryList, approve, create } from '@/api/kolAccount'
import ChannelTab from './channelTab.vue'

import { cloneDeep } from 'lodash'
import { confirm, info } from '@/ui/modal.ts'
import moment from 'moment'
const timeFormat = 'YYYY-MM-DD'

const defCreateItem: any = {
  channelCode: '',
  channelDataId: ''
}

@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {
  isAlive = true
  loading = false
  channelList: any[] = [
    {
      text: '微博',
      key: 'weibo'
    },
    {
      text: '微信',
      key: 'wechat'
    },
    {
      text: '快手',
      key: 'kuaishou'
    },
    {
      text: '抖音',
      key: 'douyin'
    },
    {
      text: '小红书',
      key: 'xiaohongshu'
    }
  ]
  // 审核
  approve = {
    selectedList: [],
    visible: false,
    agree: '1',
    remark: '',
    batchAuditShow: false
  }
  // 新建
  createItem: any = {
    visible: false,
    ...cloneDeep(defCreateItem)
  }
  get channelCode() {
    const { channelCode } = this.$route.query.channelCode ? this.$route.query
    : {channelCode : this.filters[0].defaultValue }
    return channelCode
  }
  get createRules() {
    const self = this
    return {
      shortName: [{ required: true, message: '不能为空', trigger: 'blur' }],
      code: [{ required: true, message: '不能为空', trigger: 'blur' }]
    }
  }

  fetch = queryList
  filters: Filter[] = [
    {
      name: 'channelCode',
      defaultValue: 'weibo',
      type: ChannelTab,
      minWidth: 800,
      placeholder: '选择平台'
    },
    {
      name: 'accountCategoryCode',
      defaultValue: '',
      type: 'select',
      width: 120,
      placeholder: '平台账号分类'
    },
    {
      name: 'channelDataId',
      defaultValue: '',
      type: 'input',
      width: 85,
      placeholder: '平台账号'
    },
    {
      name: 'name',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '平台账号名称'
    },
    {
      name: 'hasSettlementPrice',
      defaultValue: 0,
      type: 'select',
      width: 120,
      placeholder: '是否有结算价'
    },
    {
      name: 'minFansCount',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '粉丝数区间下限'
    },
    {
      name: 'maxFansCount',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '粉丝数区间上限'
    },
    {
      name: 'pageIndex',
      defaultValue: 12
    },
    {
      name: 'pageSize',
      defaultValue: 77
    }
  ]

  enums = [
    'publishCategoryList',
    'accountCategoryList',
    'channelList',
    'controlStatusList',
    'statusList',
    'hasSettlementPriceList',
    'hallDataStatusList',
    'pricingLevelList',
    'boxLevelList',
    'gradeList'
  ]

  get columns() {
    return [
      { type: 'selection', width: 60, align: 'center' },
      { title: '平台账号', key: 'channelDataId', width: 120 },
      { title: '平台账号名称', key: 'name', minWidth: 80 },
      {
        title: '平台账号分类',
        key: 'accountCategoryCode',
        minWidth: 80,
        editor: 'enum'
      },
      { title: '粉丝数', slot: 'customFans', width: 80 },
      { title: '关联的KOL编号', key: 'kolId', width: 100 },
      { title: '关联的KOL名称', key: 'kolName', width: 100 },
      { title: '结算价', minWidth: 120, slot: 'settlementPrices' },
      {
        title: '审核状态',
        key: 'status',
        width: 70,
        editor: 'enum'
      },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  async handleApproveSubmit() {
    if (this.loading) {
      return
    }
    this.loading = true
    this.$Loading.start()
    const agree = !!Number(this.approve.agree)
    // const { channelCode } = this.$route.query.channelCode ? this.$route.query
    // : {channelCode : this.filters[0].defaultValue }
    const query = {
      channelCode: this.channelCode,
      agree,
      ids: this.approve.selectedList,
      remark: this.approve.remark
    }
    try {
      const { code, data } = await approve(query)
      if ( code === 0 ) {
        this.isAlive = false
        this.$nextTick(() => ( this.isAlive = true ))
      }
    } catch (ex) {
      this.$Loading.error()
      this.handleError(ex)
    } finally {
      this.loading = false
      this.$Loading.finish()
    }
  }
  selectionChangeHandler(option: any) {
    this.approve.selectedList = option.map((item: any) => item.id)
  }
  getDate(time: number) {
    return moment(time).format(timeFormat)
  }
  async handleApprove() {
    if (this.approve.selectedList.length == 0) {
      await info('请选择记录')
      return
    }
    this.approve.visible = true
  }
  handleCreate() {
    this.createItem.visible = true
  }
  async handleCreateSubmit() {
    if (this.loading) {
      return
    }
    this.loading = true
    this.$Loading.start()
    const { channelCode, channelDataId } = this.createItem
    const query = {
      channelCode,
      channelDataId
    }
    try {
      const { data } = await create(query)
      if ( data ) {
        this.$Message.success({
          content: `创建成功`
        })
      }
    } catch (ex) {
      this.$Loading.error()
      this.handleError(ex)
    } finally {
      this.loading = false
      this.$Loading.finish()
    }
    // create
  }
  mounted() {}
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: '-';
}
.approve-radio {
  margin: 15px 0;
}
.label-dese {
  display: block;
  width: 40px;
}
</style>
