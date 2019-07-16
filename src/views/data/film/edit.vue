<template>
  <div>
      <Form ref="form" :model="form" :rules="rule" :label-width="110" class="form">
        <div class="base-mess">
        <h2 class="title">基础和扩展信息</h2>
        <FormItem label="搜索关键字">
            <Input type="text" v-model="form.searchKeywords" placeholder="请以‘;’号分割"></Input>
        </FormItem>
        <FormItem label="预估票房">
            <Input type="text" v-model="form.predict" placeholder="预估票房"></Input>
        </FormItem>
        <FormItem label="影片分类">
            <RadioGroup v-model="form.categoryCode">
                <Radio label="commonly">一般影片</Radio>
                <Radio label="super">超级大片</Radio>
                <Radio label="popular">热门大片</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="演员阵容">
            <Input type="text" v-model="form.celebrityRating" placeholder="满分为5分，保留一位小数"></Input>
        </FormItem>
        <FormItem label="编辑评论热词">
            <Input type="text" v-model="form.tags" placeholder="热词请以‘;’号分开"></Input>
        </FormItem>
         <Row>
            <Col :span="4">
                <FormItem label="系统鲸娱指数:">{{form.biJyIndex}}</FormItem>
            </Col>
            <Col :span="10">
                <FormItem label="调整鲸娱指数:"><Input v-model="form.jyIndex" placeholder=""></Input></FormItem>
            </Col>
            <Col :span="10">
                <FormItem label="调整鲸鱼指数所占权重:" :label-width="160" >
                    <Input v-model="form.jyIndexWeight" placeholder="数字不可超过1"></Input></FormItem>
            </Col>
        </Row>
        <FormItem prop="mess" label="修改剧情">
            <Input type="textarea" class="info-textarea" :rows="5" v-model="form.summary" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem>
            <div class="save">
                <Button type="primary" class="btn" @click="handleSubmit">保存</Button>
                <Button type="primary" >返回</Button>
            </div>
        </FormItem>
      </div>
    </Form>
  </div>
</template>

<script lang='ts'>
import {Component, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { movieEdit, movieDetail } from '@/api/film-ed'

@Component
export default class Main extends ViewBase {
  @Prop({type: Number, default: 0}) id!: number
  form: any = {}
  rule = {}
  items: any = {}
  mounted() {
    if (this.id) {
      this.queryList()
    }
  }
  async queryList() {
    try {
      const { data } = await movieDetail(this.id)
      this.items = data || {}
      this.form = {
        summary: data.summary,
        categoryCode: data.categoryCode,
        celebrityRating: data.rating
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleSubmit() {
    const formTag = this.form.tags
    const hasFlag = formTag.includes(';')
    const tags = hasFlag ? formTag.split(';') : formTag ? Array.of(formTag) : []

    const searchKeyWord = this.form.searchKeywords
    const keyWord =  searchKeyWord.includes(';')
    const searchKeywords = keyWord ? searchKeyWord.split(';') : searchKeyWord ? Array.of(searchKeyWord) : []
    try {
        const { data } = await movieEdit(this.id, {
            ...this.form,
            tags,
            searchKeywords
        })
        this.$router.push({name: 'data-film'})
    } catch (ex) {
        this.handleError(ex)
    }
  }
}

</script>
<style lang='less' scoped>
@import '../person/less/common';
.save {
  text-align: center;
  .btn {
    margin-right: 15px;
  }
}
</style>