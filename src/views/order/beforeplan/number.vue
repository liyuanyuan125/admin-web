<template>
  <span>{{numbers}}</span>
</template>

<script lang="ts">
import { Component , Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'

@Component
export default class ComponentMain extends ViewBase {
  @Prop({ type: Number }) addNum: any
  numbers: any = 0
  count = 0
  end3: any = 0
  newend: any = ''
  addNumber(number: any) {
    this.newend = ''
    this.count = 0
    if (number.indexOf('.') == -1) {
      for (let i = number.length - 1; i >= 0; i--) {
        if (this.count % 3 == 0 && this.count != 0) {
          this.newend = number.charAt(i) + ',' + this.newend
        } else {
          this.newend = number.charAt(i) + this.newend
        }
        this.count++
      }
      number = this.newend // 自动补小数点后两位
      return number
    } else {
      for (let i = number.indexOf('.') - 1; i >= 0; i--) {
        if (this.count % 3 == 0 && this.count != 0) {
          this.newend = number.charAt(i) + ',' + this.newend // 碰到3的倍数则加上“,”号
        } else {
          this.newend = number.charAt(i) + this.newend // 逐个字符相接起来
        }
        this.count++
      }
      number =
        this.newend + (number + '00').substr((number + '00').indexOf('.'), 3)
      return number
    }
  }
  mounted() {
    if (this.addNum < '15' ) {
      this.numbers = this.addNumber(String(this.addNum))
    } else {
      this.increment(2000)
    }
  }
  increment(d: number) {
    const initT: any = new Date() // 获取开始时间
    let timer: any

    const rQAF = () => {
      let t = new Date() as any - initT // 获取当前时间与开始时间的差值--动画执行时长
      if (t >= d) { // 判断动画执行时长是否大于预设目标
        t = d // 让动画执行时长等于预设目标
        this.addNumber(String(this.addNum))
        window.cancelAnimationFrame(timer)
      } else {
        timer = window.requestAnimationFrame(rQAF)// 调用rQAF函数一次
      }
      const nums = this.addNum / d * t
      this.numbers = this.addNumber(String(nums))
    }
    rQAF()
    // const numbers = setInterval(() => {
    //     if (Number(this.end3) < Number(this.addNum)) {
    //       this.end3 += Math.floor(Math.random() * 15)
    //       this.numbers = this.addNumber(String(this.end3))
    //     } else {
    //       return this.end3
    //     }
    //   }, 1)
    //   setTimeout(() => {
    //     clearInterval(numbers)
    //     this.numbers = this.addNumber(String(this.addNum))
    //   }, 1000)
  }
}
</script>

<style lang="less" scoped>
</style>
