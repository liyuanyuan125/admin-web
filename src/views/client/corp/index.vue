<template>
  <div class="page">
    corp/index<br><br>
    <router-link :to="{ name: 'client-corp-detail', params: { id: 1 } }">详情</router-link><br><br>
    <router-link :to="{ name: 'client-corp-edit', params: { id: 1 } }">编辑</router-link>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class Main extends View {
}
</script>

<style lang="less" scoped>
</style>
