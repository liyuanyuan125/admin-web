<template>
  <div class="page">
    account/index<br><br>
    <router-link :to="{ name: 'client-account-detail', params: { id: 1 } }">详情</router-link>
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
