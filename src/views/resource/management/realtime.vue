<template>
  <div class="page">实时刊例价查询</div>
</template>

<script lang="tsx">
import { Component, Watch , Mixins } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'

@Component
export default class Main extends Mixins(ViewBase, UrlManager) {
}
</script>

<style lang="less" scoped>
</style>
