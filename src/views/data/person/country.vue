<template>
  <Select v-model="countyId" placeholder="国籍" clearable filterable>
      <Option v-for="item in countryList" :key="item.code" :value="item.code" :label="item.name"></Option>
  </Select>
</template>

<script lang='ts'>
import {Component, Prop, Watch} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryCountry } from '@/api/person'

@Component
export default class Main extends ViewBase {
    @Prop({ type: String, default: '' }) value!: string
    countyId: any = this.value
    countryList = []

    mounted() {
        this.list()
    }
    async list() {
        try {
            const { data } = await queryCountry()
            this.countryList = data || []
        } catch (ex) {
            this.handleError(ex)
        }
    }

    @Watch('value')
    watchValue(value: any) {
        this.countyId = value
    }

    @Watch('countyId')
    watchCountyId(value: any) {
        this.$emit('input', value)
    }
}

</script>
<style lang='less' scoped>
</style>