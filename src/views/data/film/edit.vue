<template>
  <div>
      <Form ref="form" :model="form" :rules="rule" :label-width="90" class="form">
        <FormItem prop="mess" label="修改剧情">
            <Input type="textarea" v-model="form.summary" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="搜索关键字">
            <Input type="text" v-model="form.searchKeywords" placeholder="请以‘，’号分割"></Input>
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
            <Input type="text" v-model="form.tags" placeholder="热词请以‘，’号分开"></Input>
        </FormItem>
        <FormItem>
            <div class="save">
                <Button type="primary" class="btn" @click="handleSubmit">保存</Button>
                <Button type="primary" >返回</Button>
            </div>
        </FormItem>
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
        // summary: data.summary,
        categoryCode: data.categoryCode,
        celebrityRating: data.rating
      }
    } catch (ex) {
      this.handleError(ex)
    }
  }

  async handleSubmit() {
    const hasFlag = this.form.tags.includes(',')
    const tags = hasFlag ? this.form.tags.split(',') : Array.of(this.form.tags)

    const keyWord =  this.form.searchKeywords.includes(',')
    const searchKeywords = keyWord ? this.form.searchKeywords.split(',') : Array.of(this.form.searchKeywords)
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
.save {
  text-align: center;
  .btn {
    margin-right: 15px;
  }
}
.form {
  padding: 30px 50px 0;
}
</style>