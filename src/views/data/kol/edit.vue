<template>
  <div>
    <Form ref="form" :model="form" :rules="rule" :label-width="125">
      <div class="base-mess">
        <h2 class="title">基础和扩展信息</h2>
        <Row v-if='$route.params.id'>
          <Col :span="12">
            <FormItem label="KOL编号:">
              <span>{{$route.params.id}}</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="12">
            <FormItem label="KOL名称:" prop="name">
              <Input v-model="form.name" placeholder></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="5">
            <FormItem :show-message="form.exts.length > 0" label="KOL头像" prop="photo"> 
              <Upload v-model="form.photo" :maxCount="1" accept="image/*" />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="12">
            <FormItem label="KOL类型:" prop="accountCategoryCode">
              <RadioGroup v-model="form.accountCategoryCode">
                <Radio :key="item.key" v-for="item in accountCategoryList" :label="item.key" >
                  {{item.text}}
                </Radio>
            </RadioGroup>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="12">
            <FormItem label="KOL描述:">
              <Input
                type="textarea"
                v-model="form.description"
              ></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormItem label="合作品牌信息:">
              <Brand v-model="brandlist"></Brand>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="12">
            <FormItem label="系统评论热词:">
              <Table
                :columns="customcolunms"
                :data="customTags"
                class="brand-table"
                style="width: 362px"
                border
                stripe
                disabled-hover
              ></Table>
            </FormItem>
          </Col>

          <Col :span="12">
            <FormItem label="编辑评论热词:">
              <Input
                type="textarea"
                v-model="form.customTags"
              ></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col v-if="$route.params.id" :span="6">
            <FormItem label="系统鲸娱指数:">
              <span>{{jyIndex}}</span>
            </FormItem>
          </Col>

          <Col :span="6">
            <FormItem label="调整鲸娱指数:" prop="customJyIndex">
              <Input v-model="form.customJyIndex" placeholder=""></Input>
            </FormItem>
          </Col>

          <Col :span="6">
            <FormItem :labelWidth="180" label="调整鲸娱指数所占权重:" prop="customIndexPercent">
              <div style="display: flex">
                <Input v-model="form.customIndexPercent	" placeholder=""></Input><span>%</span>
              </div>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="关联KOL账号:" prop="exts">
          <kol :channelCodeList="channelCodeList" v-model="form.exts"></kol>
        </FormItem>
        <Row v-if="logList.length > 0">
          <Col :span="15">
            <FormItem label="操作日志:">
              <Table
                :columns="logocoulms"
                :data="logList"
                class="log-table"
                border
                stripe
                disabled-hover
              >
                <template slot="index" slot-scope="{row, index}">
                  <span>{{index + 1}}</span>
                </template>
                <template slot="createTime" slot-scope="{row}">
                  <span>{{autotime(row.createTime)}}</span>
                </template>
              </Table>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="footer-btn">
        <Button type="primary" class="btn">浏览</Button>
        <Button type="primary" @click="editSubmit">保存</Button>
      </div>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { confirm, info, alert } from '@/ui/modal.ts'
import { brandbefore, brandList } from '@/api/brand'
import AreaSelect, { areaParam } from '@/components/areaSelect'
import Upload from '@/components/Upload.vue'
import kol from '../brand/kol/kolist.vue'
import Brand from './brand.vue'
import moment from 'moment'
import { queryList, addkol, editkol, detailkol } from '@/api/associated'
import { clean } from '@/fn/object'
import { toMap } from '@/fn/array'

const timeFormat = 'YYYY/MM/DD HH:mm:ss'
const makeMap = (list: any[]) => toMap(list, 'key', 'text')
@Component({
  components: {
    AreaSelect,
    Upload,
    kol,
    Brand
  }
})
export default class Main extends ViewBase {
  kolid = ''
  kollist: any = []
  channelCodeList: any = []
  accountCategoryList: any = []
  form: any = {
    name: '',
    accountCategoryCode: '1',
    photo: [],
    customJyIndex: null,
    customIndexPercent: null,
    description: '',
    customTags: '',
    exts: []
  }

  logList: any = []

  customcolunms: any = [
    { title: '排序', key: 'index', align: 'center' },
    { title: '评论热词', key: 'hot', align: 'center' },
  ]

  tags: any = []

  logocoulms: any = [
    { title: '序号', key: 'index', slot: 'index', align: 'center' },
    { title: '操作类型', key: 'eventName', align: 'center' },
    { title: '操作时间', width: '130', key: 'createTime', slot: 'createTime', align: 'center' },
    { title: '操作人', key: 'createUserName', align: 'center' },
    { title: '字段', key: 'kyes', align: 'center' },
    { title: '原值', key: 'kyes', align: 'center' },
    { title: '新值', key: 'kyes', align: 'center' },
  ]
  get rule() {
    const exts = (rule: any, value: any, callback: any) => {
      if (value.length == 0) {
        return callback(new Error('请选择平台账号'))
      } else {
        return callback()
      }
    }
    const jinyu = (rule: any, value: any, callback: any) => {
      const jinyureg: any = /^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$/
      if (value == 0 || value == '') {
        return callback()
      }
      if (jinyureg.test((value + ''))) {
        return callback(new Error('格式不对'))
      } else {
        return callback()
      }
    }
    const jinyu1 = (rule: any, value: any, callback: any) => {
      const jinyureg: any = /^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$/
      if (value == 0 || value == '') {
        return callback()
      }
      if (value > 100) {
        return callback(new Error('数字不能大于100'))
      }
      if (jinyureg.test((value + ''))) {
        return callback(new Error('格式不对'))
      } else {
        return callback()
      }
    }
    return {
      name: [
        { required: true, message: '请输入kol名称', trigger: 'blur' }
      ],
      accountCategoryCode: [
        { required: true, message: '请选择账号类型', trigger: 'blur' }
      ],
      customJyIndex: [
        { validator: jinyu, trigger: 'change' }
      ],
      customIndexPercent: [
        { validator: jinyu1, trigger: 'change' }
      ],
      photo: [
        { type: 'array', required: true, len: 1, message: '请上传图片', trigger: 'change'}
      ],
      exts: [
        { required: true, validator: exts, trigger: 'change' }
      ]
    }
  }
  customTags: any = []
  jyIndex: any = ''
  imageList: any = []
  brandlist: any = []

  created() {
    this.init()
    this.brandbeforelist()
    this.detail()
  }

  autotime(time: any) {
    return time ? moment(time).format(timeFormat) : ''
  }

  async init() {
    try {
     const { data: {
       accountCategoryList,
       items
      } } = await queryList(clean({
        id: this.$route.params.id
      }))
      this.accountCategoryList = accountCategoryList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async detail() {
    try {
      if (!this.$route.params.id) {
        return
      }
      const { data: {
        accountCategoryList,
        brandCategoryList,
        item,
        logList
      } } = await detailkol(this.$route.params.id)
      this.accountCategoryList = accountCategoryList
      const msg = item && item[0]
      if (this.$route.params.id) {
        this.form.name = item.name
        this.kolid = item.kolid
        this.form.description = item.description
        this.form.accountCategoryCode = item.accountCategoryCode
        this.form.customJyIndex = item.customJyIndex
        this.form.customIndexPercent = item.customIndexPercent
        this.form.description = item.description
        this.form.customTags = (item.tags || []).join(';')
        this.customTags = (item.customTags || []).map((it: any, index: number) => {
          return {
            hot: it,
            index: index + 1
          }
        })
        this.form.exts = (item.exts || []).map((it: any) => {
          return {
            name: '',
            channelCode: it.channelCode,
            channelDataId: it.channelDataId,
            rate: it.channelDataName
          }
        })
        this.logList = logList || []
        this.jyIndex = item.jyIndex
        this.form.photo = item.photo ? [
          {
            url: item.photoUrl,
            fileId: item.photo
          }
        ] : []
        this.tags = (item.tags || []).map((it: any, index: number) => {
          return {
            index,
            name: it
          }
        })
        this.customTags = (item.customTags || []).map((it: any, index: number) => {
          return {
            hot: it,
            index: index + 1
          }
        })
        const brand = makeMap(brandCategoryList)
        this.brandlist = (item.cooperateBrands || []).map((it: any) => {
          return {
            name: brand[it.categoryCode],
            categoryCode: it.categoryCode,
            brandId: it.brandId,
            rate: it.brandName
          }
        })
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async brandbeforelist() {
    try {
      const {
        data: { channelCodeList }
      } = await brandbefore()
      this.channelCodeList = channelCodeList
    } catch (ex) {
      this.handleError(ex)
    }
  }

  // 提交
  async editSubmit() {
    try {
      const valid = await (this.$refs.form as any).validate()
      if (!valid) {
        return
      }
      const photo = this.form.photo.map((it: any) => it.fileId).join('')
      const query = clean({
        ...this.form,
        cooperateBrands: this.brandlist.map((it: any) => {
          return {
            categoryCode: it.categoryCode,
            brandId: it.brandId
          }
        }),
        customIndexPercent: Number(this.form.customIndexPercent),
        customJyIndex: Number(this.form.customJyIndex),
        photo: this.form.photo.map((it: any) => it.fileId).join(''),
        customTags: this.form.customTags ? this.form.customTags.split(';') : [],
        exts: this.form.exts.map((it: any) => {
          return {
            channelCode: it.channelCode,
            channelDataId: it.channelDataId
          }
        })
      })
      if (this.$route.params.id) {
        await editkol(this.$route.params.id, {
          ...query,
        })
      } else {
        await addkol({
          ...query
        })
      }
      this.$router.push({ name: 'data-kol-associated' })
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>
<style lang='less' scoped>
.upload-box {
  background: none;
}
.base-mess {
  font-size: 14px;
  border: solid 1px #ededed;
  padding: 10px 15px;
  margin-bottom: 15px;
  background: #fff;
  .title {
    font-size: 14px;
    padding-bottom: 20px;
  }
  .ivu-col {
    p {
      padding-bottom: 15px;
      display: flex;
      label {
        display: block;
        width: 90px;
      }
    }
  }
  .hot-word {
    display: -webkit-box;
  }
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    font-size: 14px;
  }
}
.brand-table {
  min-width: 362px;
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
.brand-select {
  /deep/ .ivu-select {
    margin-right: 10px;
  }
}
.footer-btn {
  text-align: center;
  .btn {
    margin-right: 15px;
  }
}
.log-table {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  /deep/ span:empty {
    &::before {
      content: '-';
    }
  }
}
</style>