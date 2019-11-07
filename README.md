# admin-web

admin 的纯前端工程

## 工程初始化
```
yarn
```

### 开发
```
yarn dev
```

### 编译
```
yarn build
```

### 测试
```
yarn test
```

### 验证并修复语法错误
```
yarn lint
```

### 执行单元测试
```
yarn test:unit
```

### 更多自定义配置
参见 [Vue Cli 配置](https://cli.vuejs.org/zh/config/)

### 项目目录结构

主要的文件与目录如下：

```
├── Dockerfile            docker 配置文件
├── README.md             本文件
├── babel.config.js       babel 配置
├── node_modules          第三方库、模块
├── package.json          模块配置
├── postcss.config.js     post css 配置
├── prettier.config.js    prettier 配置，用于格式化代码
├── public                网站根目录
│   └── index.html        网站 home 页模板
├── src                   源码目录
│   ├── api               放置接口请求，不建议使用，建议将之放各自目录下
│   ├── app.vue           入口 vue 文件
│   ├── assets            全局资源目录
│   ├── components        全局组件目录
│   ├── fn                业务逻辑无关的工具
│   ├── main.ts           入口
│   ├── routes.ts         所有的 routes
│   ├── shims-tsx.d.ts    typescript 类型定义
│   ├── shims-vue.d.ts    typescript 类型定义
│   ├── site              全局样式
│   ├── store.ts          全局数据，暂不使用 Vuex
│   ├── ui                全局 UI 工具，目前只有 modal，未来可能会重构掉
│   ├── util              业务逻辑有关的工具
│   └── views             页面们
├── stylelint.config.js   stylelint 配置
├── tsconfig.json         typescript 配置
├── tslint.json           typescript lint 配置
├── vue.config.js         vue cli 配置
└── yarn.lock             yarn lock，推荐使用 yarn 代替 npm
```
