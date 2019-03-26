<template>
  <div class="site-layout" :class="menuIsFold && 'site-layout-menu-fold'">
    <header class="site-header flex-box">
      <h1 class="logo">
        <router-link to="/" class="logo-link">Aiads 广告投放</router-link>
      </h1>

      <div class="flex-1 flex-box">
        <a class="sider-toggle" @click="toggleSider">
          <Icon type="md-menu" size="24" class="menu-icon"
            :class="menuIsFold && 'rotate-icon'"></Icon>
        </a>

        <div class="flex-1"></div>

        <Menu mode="horizontal" class="user-menu flex-box" @on-select="onMenuSelect">
          <Submenu name="user">
            <template slot="title">
              <Icon type="md-person"></Icon>{{user && user.name || '用户'}}
            </template>
            <MenuItem name="logout">退出登录</MenuItem>
          </Submenu>
        </Menu>
      </div>
    </header>

    <Layout class="site-center">
      <Sider collapsible hide-trigger :width="168" class="site-sider light-scroll">
        <Menu width="auto" class="sider-menu" :active-name="siderActiveName"
          :open-names="siderOpenNames" v-if="siderMenuList.length > 0">
          <Submenu v-for="menu in siderMenuList" :key="menu.name" :name="menu.name">
            <template slot="title">
              <Icon :type="menu.icon" class="sider-menu-icon"/>
              <label class="sider-menu-label">{{menu.label}}</label>
            </template>
            <MenuItem v-for="sub in menu.children" :key="sub.name" :name="sub.name">
              <router-link :to="{name: sub.name}">{{sub.label}}</router-link>
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>

      <Content class="site-content">
        <main class="site-main">
          <router-view :name="viewName"/>
        </main>
      </Content>
    </Layout>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { getUser, getCurrentPerms, logout,
  getUserSettings, updateUserSettings } from '@/store'
import { PermPage } from '@/util/types'
import { getMenuList, SiderMenuItem } from './menuList'
import event from '@/fn/event'

let instance: any = null
let viewName: string = 'default'

event.on('route-perm', ({ has, to, from }: any) => {
  viewName = has ? 'default' : '403'
  instance && (instance.viewName = viewName)
})

@Component
export default class App extends ViewBase {
  menuIsFold = false

  user = getUser()

  viewName = 'default'

  permMenu: PermPage[] | null = null

  get siderMenuList() {
    const user = this.user
    if (user == null || this.permMenu == null) {
      return []
    }

    const permMenu = this.permMenu
    const list = getMenuList(permMenu)

    return list
  }

  get siderOpenNames() {
    const activeName = this.siderActiveName
    const item = this.siderMenuList.find(it => {
      const exists = (it.children! || [{ name: it.name }]).some(t => t.name === activeName)
      return exists
    })
    return item != null ? [ item.name ] : []
  }

  // 获取导航中全部可点击的页面 name
  get siderMenuNameMap() {
    const result = this.siderMenuList.reduce((map: any, it) => {
      const names = it.children != null
        ? it.children.map(t => t.name)
        : [ it.name ]
      names.forEach(name => map[name] = 1)
      return map
    }, {})
    return result
  }

  // 映射某些页面到 sider 菜单
  siderActiveMap: any = {
    // 'from-page-name': 'nav-name',
  }

  get siderActiveName() {
    const { name } = this.$route

    if (name == null) {
      return
    }

    // 若 name 在导航中，直接返回
    if (name in this.siderMenuNameMap) {
      return name
    }

    // 否则去掉最后的 -tail，再次判断
    const remain = name.replace(/-\w+$/, '')
    if (remain in this.siderMenuNameMap) {
      return remain
    }

    // 最后的手段：硬编码映射关系
    return this.siderActiveMap[name]
  }

  async created() {
    // 恢复用户设置
    const { siderMenuIsFold } = getUserSettings()
    this.menuIsFold = !!siderMenuIsFold

    // 初始化 viewName，设置全局 instance
    this.viewName = viewName
    instance = this

    const perms = await getCurrentPerms()
    // 若无法获取权限，则退出
    if (perms == null) {
      return logout()
    }

    this.permMenu = perms.menu
  }

  toggleSider() {
    this.menuIsFold = !this.menuIsFold
  }

  onMenuSelect(name: string) {
    if (name == 'logout') {
      logout()
      this.$router.push({ name: 'login' })
    }
  }

  @Watch('menuIsFold')
  watchMenuIsFold(value: boolean) {
    updateUserSettings({ siderMenuIsFold: value })
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';

.site-layout {
  position: relative;
}
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: lighten(@c-base, 8%);
  z-index: 88;
}
.logo {
  width: 168px;
  font-weight: 400;
  font-size: 18px;
}
.logo-link {
  display: block;
  text-align: center;
  color: #fff;
}

.sider-toggle {
  width: 42px;
  color: #fff;
  text-align: center;
}
.menu-icon {
  transition: all .3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}

.user-menu {
  height: 50px;
  line-height: 50px;
  background-color: transparent;
  &::after {
    display: none;
  }
  /deep/ .ivu-menu-submenu {
    border-bottom: 0 !important;
  }
  /deep/ .ivu-menu-submenu-title {
    color: #fff;
  }
}

.site-center {
  position: relative;
  background-color: transparent;
  padding-top: 50px;
}
.site-sider {
  position: fixed;
  left: 0;
  top: 50px;
  height: 100%;
  background-color: #fff;
  box-shadow: 8px 0 16px rgba(80, 110, 255, .06);
  z-index: 80;
  overflow-x: hidden;
  transform: translateX(0);
}
.site-content {
  position: relative;
  padding-left: 168px;
  overflow-x: auto !important;
  transition: padding-left .2s;
}
.site-main {
  padding: 10px;
}

.sider-menu {
  margin-bottom: 188px;
  &::after {
    display: none;
  }
  /deep/ .ivu-menu-submenu {
    .ivu-menu-item {
      padding: 0 !important;
      & > a {
        display: block;
        padding: 14px 24px 14px 46px;
        color: @c-text;
      }
    }
    .ivu-menu-item-selected {
      & > a {
        color: @c-base;
      }
    }
  }
}

.site-layout-menu-fold {
  .site-sider {
    transform: translateX(-148px);
    &:hover {
      transform: translateX(0);
    }
  }

  .site-content {
    padding-left: 20px;
  }
}
</style>
