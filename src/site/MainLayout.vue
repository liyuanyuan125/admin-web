<template>
  <div class="site-layout">
    <header class="site-header flex-box">
      <h1 class="logo">
        <router-link to="/" class="logo-link">Aiads 广告投放</router-link>
      </h1>
      <div class="flex-1 flex-box">
        <a class="sider-toggle" @click="toggleSider" style="display:none">
          <Icon type="md-menu" size="24" class="menu-icon"
            :class="isOff && 'rotate-icon'"></Icon>
        </a>

        <div class="flex-1"></div>

        <Menu mode="horizontal" class="user-menu flex-box"
          @on-select='onMenuSelect'>
          <Submenu name="user">
            <template slot="title">
              <Icon type="md-person"></Icon>用户
            </template>
            <MenuItem name="settings">账户信息</MenuItem>
            <MenuItem name="logout">退出登录</MenuItem>
          </Submenu>
        </Menu>
      </div>
    </header>
    <Layout class="site-center">
      <Sider collapsible hide-trigger v-model="isOff" class="site-sider" ref="sider">
        <Menu width="auto" class="sider-menu" :class="isOff && 'sider-menu-off'"
          :active-name="siderActiveName" :open-names="siderOpenNames">
          <Submenu v-for="menu in siderMenuList" :key="menu.name" :name="menu.name">
            <template slot="title">
              <Icon :type="menu.icon"/>{{menu.label}}
            </template>
            <MenuItem v-for="sub in menu.subList" :key="sub.name" :name="sub.name">
              <router-link :to="{name: sub.name}">{{sub.label}}</router-link>
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>

      <Content class="site-content">
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { logout } from '@/store'

@Component
export default class App extends ViewBase {
  isOff = false

  siderMenuList = [
    {
      name: 'client',
      icon: 'md-person',
      label: '客户管理',
      subList: [
        {
          name: 'client-account',
          label: '账号管理',
        },
        {
          name: 'client-corp',
          label: '公司管理',
        },
        {
          name: 'client-verify',
          label: '资质审核',
        },
      ]
    },
    {
      name: 'data',
      icon: 'md-cloud',
      label: '基础数据',
      subList: [
        {
          name: 'data-dict',
          label: '系统字典',
        },
        {
          name: 'data-calendar',
          label: '日历设置',
        },
        {
          name: 'data-cinema-chain',
          label: '院线管理',
        },
        {
          name: 'data-cinema',
          label: '影院管理',
        },
        {
          name: 'data-film',
          label: '影片管理',
        },
        {
          name: 'data-area',
          label: '地区信息',
        },
      ]
    },
  ]

  // 映射某些页面到 sider 菜单
  siderActiveMap: any = {
    'client-account-detail': 'client-account',
    'client-corp-detail': 'client-corp',
    'client-corp-edit': 'client-corp',
    'data-cinema-hall': 'data-cinema',
    'data-dict-viewDictionary': 'data-dict',
    'data-film-detail': 'data-film',
  }

  get siderOpenNames() {
    return this.siderMenuList.map(it => it.name)
  }

  get siderActiveName() {
    const { name } = this.$route
    return this.siderActiveMap[name as string] || name
  }

  toggleSider() {
    (this.$refs.sider as any).toggleCollapse()
  }

  onMenuSelect(name: string) {
    if (name == 'settings') {
      alert('暂未实现')
      // this.$router.push({ name })
    } else if (name == 'logout') {
      // TODO: do logout
      logout()
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style lang="less" scoped>
@import './lib.less';

.site-layout {
  position: relative;
}
.site-header {
  position: relative;
  height: 50px;
  line-height: 50px;
  background-color: lighten(@c-base, 8%);
}
.logo {
  width: 200px;
  font-weight: 400;
  font-size: 18px;
}
.logo-link {
  display: block;
  text-align: center;
  color: #fff;
}

// TODO: 右侧菜单收缩功能稍微开发完成
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
}
.site-sider {
  position: relative;
  background-color: #fff;
  border-right: 1px solid #eee;
}
.site-content {
  position: relative;
  padding: 10px;
  overflow-x: auto !important;
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
        padding: 14px 24px 14px 42px;
        color: @c-text;
      }
    }
    .ivu-menu-item-selected {
      & > a {
        color: @c-base;
      }
    }
  }
  // a {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  // }
  // span {
  //   display: inline-block;
  //   width: 69px;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   white-space: nowrap;
  //   vertical-align: bottom;
  //   transition: width .2s ease .2s;
  // }
  // i {
  //   transform: translateX(0);
  //   transition: font-size .2s ease, transform .2s ease;
  //   vertical-align: middle;
  //   font-size: 16px;
  // }
}

// .sider-menu-off {
//   span {
//     width: 0;
//     transition: width .2s ease;
//   }
//   i {
//     transform: translateX(5px);
//     transition: font-size .2s ease .2s, transform .2s ease .2s;
//     vertical-align: middle;
//     font-size: 22px;
//   }
// }
</style>
