// 根据 https://github.com/vuejs/vue-class-component#adding-custom-hooks 创建
import Component from 'vue-class-component'

Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate'
])
