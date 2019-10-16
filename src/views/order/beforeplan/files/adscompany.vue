<template>
    <Select v-model="inValue" placeholder="公司名称" filterable clearable class="component" remote
             :remote-method="adsremoteMethod"
             @on-clear="list = []" ref="ui">
        <Option v-for="it in list" :key="it.id" :value="it.name == null ? '' : it.name" :label="it.name" class="flex-box">
            <span>{{it.name}}</span>
        </Option>
    </Select>
</template>
<script lang="ts">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { queryList, planlist, company } from '@/api/orderSys'
import { clean } from '@/fn/object'

@Component
export default class CompanyList extends ViewBase {
    /**
     * 值本身，可以使用 v-model 进行双向绑定
     */
    @Prop({ type: String, default: null }) value!: number
    @Prop({ default: '' }) typeCode!: string
    @Prop({ default: true }) type!: boolean
    /**
     * 提示文字
     */
    @Prop({ type: String, default: '公司名称' }) placeholder!: string
    @Prop({ type: Boolean, default: true }) clearable!: boolean

    inValue: any = this.value

    list: any[] = []

    loadings = false

    async mounted() {
        // try {
        //     const adscmy = await company({})
        //     this.list = adscmy.data.items
        // } catch (ex) {
        //     this.handleError(ex)
        // }
    }

      // 广告主公司搜索
    async adsremoteMethod(querys: any) {
        try {
          if (querys) {
            this.loadings = true
            const {
              data: { items }
            } = await company({
              shortName: querys,
              typeCodes: 'ads,agent,film'
            })
            this.list = items || []
          }
          this.loadings = false
        } catch (ex) {
          this.handleError(ex)
          this.loadings = false
        }
    }

    @Watch('value')
    watchValue(val: any) {
        this.inValue = val
        // 触发 form item 验证
        ;
        (this.$refs.ui as any).dispatch('FormItem', 'on-form-change', val)
    }

    @Watch('inValue')
    watchInValue(val: any) {
        this.$emit('input', val)
        const row = this.list.filter((item: any) => item.id == val)
        this.$emit('row', row)
    }
}
</script>
<style lang="less" scoped>
.component {
  min-width: 120px;
}

.offline {
  color: #bbb;
  font-style: normal;
}
</style>