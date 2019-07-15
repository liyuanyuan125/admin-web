<template>
  <div>
    <Form ref="form" :model="form" :rules="rule" :label-width="125">
      <div class="base-mess">
        <h2 class="title">基础和扩展信息</h2>
        <Row v-if='kolid'>
          <Col :span="12">
            <FormItem label="KOL编号:">
              <span>{{kolid}}</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="12">
            <FormItem label="KOL名称:" prop="name">
              <span>{{form.name}}</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="5">
            <FormItem :show-message="form.exts.length > 0" label="KOL头像" prop="photo"> 
              <Upload readonly v-model="form.photo" :maxCount="1" accept="image/*" />
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="12">
            <FormItem label="KOL类型:" prop="accountCategoryCode">
              {{form.accountCategoryCode}}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col :span="12">
            <FormItem label="KOL描述:">
              <span>{{form.description}}</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormItem label="合作品牌信息:">
              <Brand :editnums="detail" v-model="brandlist"></Brand>
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
              <span>{{form.customTags}}</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col v-if="$route.params.id" :span="6">
            <FormItem label="系统鲸鱼指数:">
              <span>{{jyIndex}}</span>
            </FormItem>
          </Col>

          <Col :span="6">
            <FormItem label="调整鲸娱指数:" prop="customJyIndex">
              <span>{{form.customJyIndex}}</span>
            </FormItem>
          </Col>

          <Col :span="6">
            <FormItem :labelWidth="180" label="调整鲸鱼指数所占权重:" prop="customIndexPercent">
              <span>{{form.customIndexPercent}}</span>
            </FormItem>
          </Col>
        </Row>

        <FormItem label="推荐的KOL列表:" prop="exts">
          <kol :editnums="detail" :channelCodeList="channelCodeList" v-model="form.exts"></kol>
        </FormItem>
      </div>
      <div class="footer-btn">
        <Button type="primary" class="btn">浏览</Button>
        <Button type="primary" @click="editSubmit">返回</Button>
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
import { queryList, addkol, editkol, detailkol } from '@/api/associated'
import { clean } from '@/fn/object'
import { toMap } from '@/fn/array'

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
    customJyIndex: 1,
    customIndexPercent: 1,
    description: '',
    customTags: '',
    exts: [],
    tag: ''
  }
  customTags: any = []
  tags: any = []

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
  jyIndex: any = ''
  imageList: any = []
  brandlist: any = []

  customcolunms: any = [
    { title: '排序', key: 'index', align: 'center' },
    { title: '评论热词', key: 'hot', align: 'center' },
  ]

  created() {
    this.init()
    this.brandbeforelist()
    this.detail()
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
        item
      } } = await detailkol(this.$route.params.id)
      this.accountCategoryList = accountCategoryList
      const msg = item && item[0]
      if (this.$route.params.id) {
        this.form.name = item.name
        this.kolid = item.kolid
        this.form.description = item.description
        const accountCategoryCode = makeMap(this.accountCategoryList)
        this.form.accountCategoryCode = accountCategoryCode[item.accountCategoryCode]
        this.form.customJyIndex = item.customJyIndex
        this.form.customIndexPercent = item.customIndexPercent
        this.form.description = item.description
        this.customTags = (item.customTags || []).map((it: any, index: number) => {
          return {
            hot: it,
            index: index + 1
          }
        })
        this.form.tag = (item.tags || []).join(';')
        this.form.exts = (item.exts || []).map((it: any) => {
          return {
            name: '',
            channelCode: it.channelCode,
            channelDataId: it.channelDataId,
            rate: it.channelDataName
          }
        })
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
  width: 362px;
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
/deep/ .ivu-form-item-content span:empty {
  &::before {
    content: '暂无';
  }
}
.footer-btn {
  text-align: center;
  .btn {
    margin-right: 15px;
  }
}
</style>