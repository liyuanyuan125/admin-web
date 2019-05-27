<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
      @selectionChange="selectioChangeHandler"
    >
      <template slot="acts-2">
        <Button
          type="success"
          class="ui-filter"
          icon="md-checkmark"
          @click="handleAudit">批量审核</Button>
      </template>
      <template slot="acts">
        <Button
          class="ui-filter"
          type="success"
          icon="md-add-circle"
          @click="handleCreate">抓取平台账号</Button>
      </template>
      <template slot="accountCategorys" slot-scope="{ row: { accountCategoryCode } }">
        <div>
          <p v-for="(item, index) in accountCategoryCode" :key="index">{{ item.name }}</p> 
        </div>
      </template>
      <template slot="settlementPrices" slot-scope="{ row: { settlementPrices } }">
        <ul>
          <li v-for="(item, index) in settlementPrices" :key="index">{{ item.text }} - {{item.price}}元</li> 
        </ul>
      </template>
      <template slot="action" slot-scope="{ row: { id } }">
        <div class="row-acts">    
          <router-link
            :to="{ name: 'kol-account-detail', params: { id } }"
          >审核</router-link>     
          <router-link
            :to="{ name: 'kol-account-detail', params: { id } }"
          >编辑</router-link>
        </div>
      </template>
    </ListPage>
    <Modal v-model="visibleAudit" title ='批量审核' class="audit-modal" width="500" 
      @on-ok="handleAuditSubmit">
        <p>您选择了{{auditCheck.length}}条KOL平台账号，审核通过后可以在“KOL资源列表”中操作定价和上架。</p>
        <div>
          <RadioGroup class="audit-radio" v-model="auditOpinion">
            <Radio label="1">
                <span>审核通过</span>
            </Radio>
            <Radio label="2">
                <span>审核不通过</span>
            </Radio>
          </RadioGroup>
          <p class="flex-box"  v-if="auditOpinion == 2">
            <span class="label-dese">备注：</span>
            <Input v-model="desc" type="textarea" placeholder="请输入备注"></Input>
          </p>
        </div>
    </Modal>
    <Modal v-model="visibleCreate" title ='抓取平台账号' class="create-modal" width="500" 
      @on-ok="handleCreateSubmit">
        <Form :model="createItem" :label-width="76" :rules="createRules" class="form" ref="form" >
          <Row>
            <Col span="22">
              <FormItem label="平台" prop="channelCode">
                <Select v-model="createItem.channelCode">
                  <Option v-for="it in channelList" :key="it.key"
                    :value="it.key">{{it.text}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="22">
              <FormItem label="平台账号" prop="channelDataId">
                <Input v-model="createItem.channelDataId" placeholder="请输入"/>
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

import {
  queryList,
  updateStatus,
  updateChannelCode
} from '@/api/kolAccount'
import AccountCategorys from './accountCategorys.vue'
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
  // 批量审核
  auditCheck: any[] = []
  visibleAudit = false
  auditOpinion = ''
  batchAuditShow = false
  desc = ''
  // 新建抓取
  visibleCreate = false
  createItem: any = cloneDeep(defCreateItem)
  channelList: any[] = [{
    text: '微博',
    key: 'weibo'
  }, {
    text: '微信',
    key: 'wechat'
  }, {
    text: '快手',
    key: 'kuaishou'
  }, {
    text: '抖音',
    key: 'douyin'
  }, {
    text: '小红书',
    key: 'xiaohongshu'
  }]

  get createRules() {
    const self = this
    return {
      shortName: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '不能为空', trigger: 'blur' }
      ]
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
      type: AccountCategorys,
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
      name: 'channelDataName',
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
      defaultValue: 1
    },

    {
      name: 'pageSize',
      defaultValue: 20
    }
  ]

  enums = [
    'accountCategoryList',
    'channelList',
    'controlStatusList',
    'statusList',
    'hasSettlementPriceList',
    'hallDataStatusList',
    'pricingLevelList',
    'boxLevelList',
    'gradeList',
  ]

  get columns() {
    return [
      { type: 'selection', width: 60, align: 'center'},
      { title: '平台账号', key: 'channelDataId', width: 120 },
      { title: '平台账号名称', key: 'channelDataName', minWidth: 80 },
      { title: '平台账号分类', slot: 'accountCategorys', minWidth: 80 },
      { title: '粉丝数', key: 'fansCount', width: 80, },
      { title: '关联的KOL编号', key: 'kolId', width: 100},
      { title: '关联的KOL名称', key: 'kolName', width: 100 },
      { title: '结算价', minWidth: 120 , slot: 'settlementPrices'},
      { title: '结算价有效期', key: 'createTime', width: 80 ,
        render: (hh: any, { row : { createTime } }: any) => {
          /* tslint:disable */
          const h = jsxReactToVue(hh)
          const html = createTime ? moment(createTime).format(timeFormat) : ''
          return <span v-html={html}></span>
          /* tslint:enable */
        }
      },
      {
        title: '审核状态',
        key: 'status',
        width: 70,
        editor: 'poptipSelect',
        updateField: updateStatus
      },
      { title: '操作', slot: 'action', width: 100 }
    ] as ColumnExtra[]
  }

  handleAuditSubmit() {}
  handleCreateSubmit() {}

  selectioChangeHandler(option: any) {
    // 批量处理
    // this.visibleAudit = true
    this.auditCheck = option.map((item: any) => item.id)
  }
  async handleAudit() {
    if (this.auditCheck.length == 0) {
      await info('请选择数据审核')
      return
    }
    this.visibleAudit = true
  }
  async handleCreate() {
    this.visibleCreate = true
  }
  mounted() {}
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: "-";
}
.audit-radio {
  margin: 15px 0;
}
.label-dese {
  display: block;
  width: 40px;
}
</style>
