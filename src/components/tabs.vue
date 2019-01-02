<template>
   <div class="tags-nav">
    <div class="close-con">
      <Dropdown transfer @on-click="handleTagsOption" style="margin-top:7px;">
        <Button size="small" type="text">
          <Icon :size="18" type="ios-close-circle-outline"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <DropdownItem name="close-others">关闭其他</DropdownItem>
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
            v-for="item in list"
            ref="tagsPageOpened"
            :key="`tag-nav-${item.name}`"
            :name="item.name"
            @on-close="handleClose"
            @click.native="handleClick(item)"
            :closable="item.name !== 'home'"
            :color="item.name === value.name ? 'blue' : 'default'"
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
  @Prop({ type: Object }) value: any
  tagBodyLeft = 0

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

  // // tabs, 删除tab
  // removeTabHandle (tabName: string) {
  //   this.mainTabs = this.mainTabs.filter((item: any) => item.name !== tabName)
  //   if (this.mainTabs.length >= 1) {
  //     // 当前选中tab被删除
  //     if (tabName === this.mainTabsActiveName) {
  //       var tab = this.mainTabs[this.mainTabs.length - 1]
  //       this.$router.push({ name: tab.name, query: tab.query, params: tab.params }, () => {
  //         this.mainTabsActiveName = this.$route.name
  //       })
  //     }
  //   } else {
  //     this.menuActiveName = ''
  //     this.$router.push({ name: 'home' })
  //   }
  // }
  handleTagsOption(type: any) {
    if (type === 'close-all') {
      // 关闭所有，除了home
      const res = this.list.filter((item: any) => item.name === 'home')
      this.$emit('on-close', res, 'all')
    } else {
      // 关闭除当前页和home页的其他页
      const res = this.list.filter((item: any) => item.name === this.value.name || item.name === 'home')
      this.$emit('on-close', res, 'others')
    }
  }
}
</script>

<style lang="less" scoped>
@import './tabs.less';
</style>
