<template>
    <DatePicker type="year" v-model="pick"  @on-change="handleChange"  format="yyyy" placeholder="请选择年份" style="width: 140px"></DatePicker>
</template>

<script lang='ts'>
import {Component, Watch, Prop} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
@Component
export default class Main extends ViewBase {
    // @Prop({ type: String, default: '' }) value!: string
    pick = ''

    handleChange(val: any) {
      this.pick = val
       this.$emit('input', val)
    }
    // @Watch('value')
    // watchValue(value: any) {
    //     this.pick = value
    // }
}

</script>
<style lang='less' scoped>
</style>