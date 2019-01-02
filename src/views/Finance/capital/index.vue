<template>
  <div class="page">
    <Tabs :value="invalue" :list="tabsList"></Tabs>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Tabs from '@/components/tabs.vue'
@Component({
    components: {
        Tabs
    }
})
export default class Main extends ViewBase {
    tabsList: any = [{
        name: 'user',
        title: '124'
    }]
    invalue = {
        name: 'user'
    }
}
</script>

<style lang="less" scoped>
</style>
