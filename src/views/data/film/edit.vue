<template>
  <div>
      <Form ref="form" :model="form" :rules="rule" :label-width="90">
        <FormItem prop="mess" label="修改剧情">
            <Input type="textarea" v-model="form.mess" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="搜索关键字">
            <Input type="text" v-model="form.keyCode" placeholder="关键字"></Input>
        </FormItem>
        <FormItem label="预估票房">
            <Input type="text" v-model="form.keyCode" placeholder="关键字"></Input>
        </FormItem>
        <FormItem label="影片分类">
            <Input type="text" v-model="form.keyCode" placeholder="关键字"></Input>
        </FormItem>
        <FormItem label="演员阵容">
            <Input type="text" v-model="form.keyCode" placeholder="关键字"></Input>
        </FormItem>
        <FormItem label="编辑评论热词">
            <Input type="text" v-model="form.keyCode" placeholder="关键字"></Input>
        </FormItem>
        <FormItem>
            <div>
                <Button type="primary" >保存</Button>
                <Button type="primary" >返回</Button>
            </div>
        </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import {Component} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {

}

</script>
<style lang='less' scoped>
</style>