<template>
  <div>
    <Form ref="form" :model="form" :rules="rule" :label-width="110" class="form">
      <div class="base-mess">
        <h2 class="title">基础和扩展信息</h2>

        <FormItem label="预估票房">
          <InputNumber :min="0" style="width: 200px" v-model="form.predict" /> 万元
        </FormItem>
        <FormItem label="演员阵容">
          <InputNumber :max="5" :min="0" style="width: 200px" v-model="form.celebrityRating" />
          <em> 满分为5分，保留一位小数</em>
        </FormItem>
        <FormItem label="影片分类">
          <RadioGroup v-model="form.categoryCode">
            <Radio v-for="item in categoryList" :key="item.key" :label="item.key">{{item.text}}</Radio>
          </RadioGroup>
        </FormItem>

        <Row class="jyindex-input">
          <Col :span="4">
            <FormItem label="系统鲸娱指数:">{{items.jyIndex || '-'}}</FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="调整鲸娱指数:">
              <InputNumber style="width: 120px" v-model="form.customJyIndex" />
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="调整鲸娱指数所占权重:" :label-width="160">
              <InputNumber :min="0" style="width: 120px" v-model="form.customJyIndexRate" />
            </FormItem>
          </Col>
        </Row>
        <FormItem label="搜索关键字">
          <Input type="text" v-model="form.searchKeywords" placeholder="请以‘，’号分割"></Input>
          <em>请以‘，’号分割</em>
        </FormItem>
        <FormItem label="编辑评论热词">
          <Input type="text" v-model="form.tags" placeholder="热词请以‘，’号分开"></Input>
          <em>请以‘，’号分割</em>
        </FormItem>
        <FormItem prop="mess" label="修改剧情">
          <Input
            type="textarea"
            class="info-textarea"
            :rows="5"
            v-model="form.summary"
            placeholder="请输入内容"
          ></Input>
        </FormItem>
        <FormItem label="猫眼ID">
          <Input v-model="formID.maoyan" type="number" />
        </FormItem>
        <FormItem label="淘票票ID">
          <Input v-model="formID.taopiaopiao" type="number" />
        </FormItem>
        <FormItem label="豆瓣ID">
          <Input v-model="formID.douban" type="number" />
        </FormItem>
        <FormItem label="票神ID">
          <Input v-model="formID.piaoshen" type="number" />
        </FormItem>
        <FormItem>
          
          <div class="save">
            <Button type="primary" class="btn" @click="handleSubmit">保存</Button>
            <Button type="primary" :to="{name: 'data-film'}">返回</Button>
          </div>
        </FormItem>
      </div>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { movieEdit, movieDetail } from '@/api/film-ed'

@Component
export default class Main extends ViewBase {
  @Prop({ type: Number, default: 0 }) id!: number
  form: any = {}
  formID: any = {}
  dataExts: any[] = []

  rule = {}
  items: any = {}

  categoryList = [] // 影片分类

  mounted() {
    if (this.id) {
      this.queryList()
    }
  }

  async queryList() {
    try {
      const { data } = await movieDetail(this.id)
      this.items = data || {}
      this.categoryList = data.categoryList || []
      this.dataExts = data.dataExts || []

      // 展示电影平台相关ID
      const dataExts = (data.dataExts || []).map((obj: any) => {
        this.formID[obj.channelCode] = obj.channelDataId
      })

      this.form = {
        summary: data.summary,
        categoryCode: data.categoryCode,
        predict: data.customPredict,
        customJyIndex: data.customJyIndex || null,
        customJyIndexRate: data.customJyIndexRate || null,
        celebrityRating: data.customCelebrityRating,
        searchKeywords: data.customSearchKeywords
          ? data.customSearchKeywords.join()
          : '',
        tags: data.customTags ? data.customTags.join() : ''
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleSubmit() {
    const formWords = this.form.searchKeywords.trim()
    const formTags = this.form.tags.trim()
    const searchKeywords = formWords ? formWords.split(/,|，/) : []
    const tags = formTags ? formTags.split(/,|，/) : []

    // 电影平台相关id dataExts
    // const cloneData = Object.assign(this.dataExts)
    const dataExts = [
      {
        channelCode: 'maoyan',
        channelDataId: this.formID.maoyan
      },
      {
        channelCode: 'taopiaopiao',
        channelDataId: this.formID.taopiaopiao
      },
      {
        channelCode: 'douban',
        channelDataId: this.formID.douban
      },
      {
        channelCode: 'piaoshen',
        channelDataId: this.formID.piaoshen
      },
    ]

    // for (const [key, value] of Object.entries(this.formID)) {
    //   this.dataExts.map((item: any, index) => {
    //     if (key == item.channelCode) {
    //       cloneData[index].channelDataId = value
    //     }
    //   })
    // }

    // const dataExts = maoyan.concat(cloneData)

    try {
      const { data } = await movieEdit(this.id, {
        ...this.form,
        searchKeywords,
        tags,
        dataExts
      })
      this.$router.push({ name: 'data-film' })
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang='less' scoped>
@import '../person/less/common';
/deep/ .jyindex-input {
  .ivu-input {
    width: 150px;
  }
}
.save {
  text-align: center;
  .btn {
    margin-right: 15px;
  }
}
</style>
