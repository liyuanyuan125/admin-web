<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='700'
    :title="'查看'"
    @on-cancel="cancel" >
    <!-- 微博 -->
    <Row v-if='code == "weibo"'>
      <Row class='title'>微博原发</Row>
      <Row class='rows'>
        <Col :span='3'>原发内容</Col>
        <Col :span='20'>{{itemlist.content}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>原发图片</Col>
        <Col :span='20'>
          <div class='imgs' v-for='(it,index) in itemlist.pictureFileUrls' :key='index'>
            <img :src='it.url' alt="">
          </div>
        </Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>推广链接</Col>
        <Col :span='20'>{{itemlist.url}}</Col>
      </Row>
      <Row class='title'>微博转发</Row>
      <Row class='rows'>
        <Col :span='3'>转发语</Col>
        <Col :span='20'>{{itemlist.content}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>转发链接</Col>
        <Col :span='20'>{{itemlist.url}}</Col>
      </Row>
    </Row>
    <!-- 小红书 -->
    <Row v-if='code == "xiaohongshu"'>
      <Row class='title'>小红书图文</Row>
      <Row class='rows'>
        <Col :span='3'>是否提供产品</Col>
        <Col :span='20'>{{itemlist.provideProduct == true ? 'true' : 'false'}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>产品介绍</Col>
        <Col :span='20'>{{itemlist.summary == null ? '暂无产品介绍' : itemlist.summary}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>产品图片</Col>
        <Col :span='20'>
          <div class='imgs' v-for='(it,index) in itemlist.pictureFileUrls' :key='index'>
            <img :src='it.url' alt="">
          </div>
        </Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>推广链接</Col>
        <Col :span='20'>{{itemlist.url}}</Col>
      </Row>
      <Row class='title'>小红书视频</Row>
      <Row class='rows'>
        <Col :span='3'>是否提供产品</Col>
        <Col :span='20'>{{itemlist.provideProduct == true ? '是' : '否'}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>产品介绍</Col>
        <Col :span='20'>{{itemlist.summary == null ? '暂无产品介绍' : itemlist.summary}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>推广链接</Col>
        <Col :span='20'>{{itemlist.url}}</Col>
      </Row>
    </Row>
    <!-- 微信 -->
    <Row v-if='code == "wechat"'>
      <Row class='title'>微信</Row>
      <Row class='rows'>
        <Col :span='3'>文章标题</Col>
        <Col :span='20'>{{itemlist.title}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>封面图</Col>
        <Col :span='20'>
          <div class='imgs' v-for='(it,index) in itemlist.pictureFileUrls' :key='index'>
            <img :src='it.url' alt="">
          </div>
        </Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>摘要</Col>
        <Col :span='20'>{{itemlist.summary == null ? '暂无摘要' : itemlist.summary}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>正文内容</Col>
        <Col :span='20'>{{itemlist.content}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>原文链接</Col>
        <Col :span='20'>{{itemlist.url}}</Col>
      </Row>
    </Row>
    <!-- 抖音 -->
    <Row v-if='code == "douyin"'>
      <Row class='title'>抖音</Row>
      <Row class='rows'>
        <Col :span='3'>是否提供产品</Col>
        <Col :span='20'>{{itemlist.provideProduct == true ? 'true' : 'false'}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>产品介绍</Col>
        <Col :span='20'>{{itemlist.summary == null ? '暂无产品介绍' : itemlist.summary}}</Col>
      </Row>
      <Row class='rows'>
        <Col :span='3'>推广链接</Col>
        <Col :span='20'>{{itemlist.url}}</Col>
      </Row>
    </Row>
    
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="cancel">确定</Button>
    </div>
  </Modal>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import { view } from '@/api/kollist'
import { warning , success, toast , info } from '@/ui/modal'
import moment from 'moment'
import { queryList , edit  } from '@/api/kollist'
import ViewBase from '@/util/ViewBase'


@Component
export default class ComponentMain extends ViewBase {

  showDlg = false
  id: any = 0
  code: any = ''
  itemlist: any = {}



  async init(id: number , code: any) {
    this.showDlg = true
    this.id = id
    this.code = code
    // console.log(id , code)
    const { data } = await view(id)
    this.itemlist = data.item
  }

  cancel() {
    this.showDlg = false
  }

  // 表单提交
  async dataFormSubmit() {
    try {
      this.showDlg = false
      this.$emit('done' )
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }


}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.title {
  font-size: 16px;
  color: @c-base;
  line-height: 40px;
}
.rows {
  line-height: 35px;
}
.imgs {
  width: 100px;
  height: 100px;
  display: inline-block;
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
