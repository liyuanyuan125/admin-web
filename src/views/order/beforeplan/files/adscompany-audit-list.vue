<template>
  <RemoteSelect v-model="model" :fetch="fetch" placeholder="广告主公司名称" ref="ui"/>
</template>

<script lang="ts">

import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import RemoteSelect from '@/components/remoteSelect'
import { queryList, planlist, company } from '@/api/orderSys'
import { clean } from '@/fn/object'

@Component({
  components: {
    RemoteSelect
  }
})
export default class CompanyList extends ViewBase {
    @Prop({ type: Number }) value!: number

    model: number = 0

    async fetch(keyword: string) {
        const query = {
            // ...this.query,
            shortName: keyword,
            pageIndex: 1,
            pageSize: 88,
        }
        const res = await company(query)
        const list = res.data.items || null
        // 若现有列表中，没有找到已选择的影院，则清空
        const foundItem = list.find((it: any) => it.id == this.model)
        if (foundItem == null) {
            this.model = 0
        }
        return list
    }

    @Watch('value', { immediate: true })
    watchValue(value: number) {

        this.model = value
    }

    @Watch('model')
    watchMode(value: number) {
        this.$emit('input', value)
    }

    @Watch('query', { deep: true })
    watchQuery() {
        // 当条件改变时，重新刷新
        const ui = this.$refs.ui as RemoteSelect
        ui.refresh()
    }
}
</script>

<style lang="less" scoped>
</style>
