<template>
   <div class="tags-nav">
    <div class="close-con">
      <Dropdown transfer @on-click="handleTagsOption" style="margin-top:7px;">
        <Button size="small" type="text">
          <Icon :size="18" type="ios-close-circle-outline"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">关闭所有</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="btn-con left-btn">
      <Button icon="ios-arrow-back" type="text" @click="handleScroll(240)"></Button>
    </div>
    <div class="btn-con right-btn">
      <Button icon="ios-arrow-forward" type="text" @click="handleScroll(-240)"></Button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <transition-group name="taglist-moving-animation">
          <Tag
            type="dot"
            v-for="(item, index) in sumTag"
            ref="tagsPageOpened"
            :key="`tag-nav-${item.name}`"
            :name="item.name"
            @on-close="handleClose"
            @click.native="handleClick(item)"
            :closable="!!defalutTag[index] ? item.name !== defalutTag[index].name : true"
            :color="item.name === value.name ? 'primary' : 'default'"
          >{{ item.title }}</Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class Tabs extends ViewBase {
  /**
   * 值本身，可以使用 v-model 进行双向绑定
   */
  @Prop({ type: Object, default: () => {} }) mainTabs: any
  @Prop({ type: Array, default: () => [] }) list: any
  @Prop({ type: String }) mainTabsActiveName: any
  @Prop({ type: Array, default: () => [] }) defalutTag: any
  @Prop({ type: Object }) value: any
  tagBodyLeft = 0

  get sumTag() {
    const sumTag = [...this.defalutTag, ...this.list]
    return sumTag
  }

  handlescroll(e: any) {
    const type = e.type
    let delta = 0
    if (type === 'DOMMouseScroll' || type === 'mousewheel') {
      delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
    }
    this.handleScroll(delta)
  }

  handleScroll(offset: any) {
    if (offset > 0) {
      this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
    } else {
      if ((this.$refs.scrollOuter as any).offsetWidth < (this.$refs.scrollBody as any).offsetWidth) {
        if (this.tagBodyLeft < -((this.$refs.scrollBody as any).offsetWidth -
        (this.$refs.scrollOuter as any).offsetWidth)) {
          this.tagBodyLeft = this.tagBodyLeft
        } else {
          this.tagBodyLeft = Math.max(this.tagBodyLeft + offset,
          (this.$refs.scrollOuter as any).offsetWidth - (this.$refs.scrollBody as any).offsetWidth)
        }
      } else {
        this.tagBodyLeft = 0
      }
    }
  }

  // tabs, 选中tab
  selectedTabHandle(tab: any) {
    tab = this.mainTabs.filter((item: any) => item.name === tab.name)
    if (tab.length >= 1) {
      this.$router.push({ name: tab[0].name, query: tab[0].query, params: tab[0].params })
    }
  }

  handleClick(item: any) {
    this.$emit('input', item)
  }

  handleClose(e: any, name: string) {
    const defaultName = this.defalutTag.map((it: any) => {
      return it.name
    })
    const res = this.sumTag.filter((item: any) => item.name !== name && !defaultName.includes(item.name))
    this.$emit('on-close', res, undefined, name)
  }

  handleTagsOption(type: any) {
    const defaultName = this.defalutTag.map((it: any) => {
      return it.name
    })
    if (type === 'close-all') {
      // 关闭所有，除了默认
      const res: any = []
      this.$emit('on-close', res, 'all')
    } else {
      const res = this.sumTag.filter((item: any) => item.name === this.value.name || !defaultName.includes(item.name))
      this.$emit('on-close', res, 'others')
    }
  }
}
</script>

<style lang="less" scoped>
@import './tabs.less';
</style>
