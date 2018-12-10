<template>
  <div class="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class App extends View {
}
</script>

<style lang="less">
// 引入全局样式
@import 'site/main.less';
</style>

<style lang="less" scoped>
.app {
  position: relative;
  height: 100%;
}
</style>

