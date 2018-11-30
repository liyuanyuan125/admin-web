<template>
  <div class="page">
    <!-- 菜单 -->
    <!-- <div class="work-Title"><span class="workT">工作台</span> > 客户管理 > 账号管理 > 账号详情</div> -->
    <!-- 注册账号 -->
    <div class="Inp-Group-res">
      <div class="Inps-res">
        <div class="res-num">
          <p>用户账号</p>
          <div class="res-num-item change-item">
            <span>admin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【主账号】</span>
            <span class="blu1">查看操作日志</span>
            <span class="blu2" @click="changetrue">变更主账号</span>
            <!-- <span>变更主账号</span> -->
          </div>
        </div>
        <div class="res-num">
          <p>所属公司</p>
          <div class="res-num-item">
            <span>北京博纳国际有限公司</span>
          </div>
        </div>
        <div class="res-num">
          <p>最后登陆时间</p>
          <div class="res-num-item">
            <span>2018/11/01 12:22:21</span>
            <!-- <span style="margin-left:8%;" class="res-date">注册时间</span>
            <span style="margin-left:2%;">2018/11/01 12:22:21</span> -->
          </div>
        </div>
        <div class="res-num">
          <p>注册时间</p>
          <div class="res-num-item">
            <span>2018/11/01 12:22:21</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 子账号 -->
    <div class="new-number">
      <div class="new-num">
        <p>子账号</p><br>
        <Table :columns="columns" :data="tableData"
        border stripe disabled-hover size="small" class="table"></Table>
        <div class="page-wrap" v-if="total > 0">
          <Page :total="total" show-total :page-size="query.pageSize" show-sizer
            :page-size-opts="[10, 20, 50, 100]" :current="query.pageIndex"
            @on-change="page => query.pageIndex = page"
            @on-page-size-change="pageSize => query.pageSize = pageSize"/>
        </div>
      </div>
    </div> 
    <!-- 注册信息 -->
    <div class="res-Group">
      <div class="res-Inps">
        <div class="res-num">
          <p>公司名称</p>
          <div class="res-num-item change-item">
            <span>北京博纳国际有限公司</span>
            <span>保存为新公司</span>
            <!-- <span>变更主账号</span> -->
          </div>
        </div>
        <div class="res-num">
          <p>所在地</p>
          <div class="res-num-item">
            <span>北京&nbsp;&nbsp; 北京市  朝阳区  亿利生态广场 17层</span>
          </div>
        </div>
        <div class="res-num">
          <p>联系人</p>
          <div class="res-num-item">
            <span>老麦</span>
            <span style="margin-left:8%;" class="res-date">联系电话</span>
            <span style="margin-left:2%;">13146015795</span>
            <span style="margin-left:8%;" class="res-date">邮箱</span>
            <span style="margin-left:2%;">850506428@qq.com</span>
          </div>
        </div>
        <div class="res-num">
          <p>资质</p>
          <div class="res-num-item">
            <span>营业执照  8839938273774823KDhd</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 变更主账号信息表 -->
    <div class="info" v-if="change">
        <div class="info-ver">变更主账号<Icon class="info-Icon" type="md-close"   @click="changefalse" size="22"/></div>
        <div class="info-type">
            <!-- <div class="info-type-t"> -->
                <div>当前主账号<span>admin</span></div>
                <div>所属公司<span>北京博纳国际有限公司</span></div>
                <div>新主账号
                  <Select class="sec"  clearable>
                    <Option>账号【姓名】</Option>
                    <Option>账号【姓名】</Option>
                    <Option>账号【姓名】</Option>
                    <Option>账号【姓名】</Option>
                    <Option>账号【姓名】</Option>
                    <Option>账号【姓名】</Option>
                    <Option>账号【姓名】</Option>
                    <Option>账号【姓名】</Option>
                  </Select><br>
                </div>
                <p class="info-red">变更后，原主账号将变成无任何权限的子账号，可在前台系统中由新主账号删除或修改权限</p>
            <!-- </div> -->
            
             <Button type="primary">确认</Button>
             <Button @click="changefalse">取消</Button>
        </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import View from '@/util/View'
import { get } from '@/fn/ajax'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import moment from 'moment'
import { clean } from '@/fn/object'

const makeMap = (list: any[]) => toMap(list, 'id', 'name')
const timeFormat = 'YYYY-MM-DD<br>HH:mm:ss'

const defQuery = {
  corpId: null,
  corpIds: null,
  corpName: '',
  userAccount: '',
  type: null,
  status: null,
  pageIndex: 1,
  pageSize: 20,
}

@Component
export default class Main extends View {
  change = false

  query = { ...defQuery }

  loading = false

  list = []

  total = 0

  oldQuery: any = null

  columns = [
    { title: '用户账号', key: 'corpId', align: 'center' },
    { title: '姓名', key: 'corpName', align: 'center' },
    { title: '手机号', key: 'corpIds', align: 'center' },
    {
      title: '创建时间',
      key: 'createTime',
      align: 'center',
      render: (hh: any, { row: { createTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(createTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '最后登陆时间',
      key: 'updateTime',
      align: 'center',
      render: (hh: any, { row: { updateTime } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const html = moment(updateTime).format(timeFormat)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (hh: any, { row: { id } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        return <div class='row-acts'>
          <router-link to={{ name: 'client-account-detail', params: { id } }}>查看操作日志</router-link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        /* tslint:enable */
      }
    }
  ]
  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const list = (this.list || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return list
  }
  mounted() {
    this.doSearch()
  }
  changetrue() {
    this.change = true
  }
  changefalse() {
    this.change = false
  }

  search() {
    this.query.pageIndex = 1
  }

  reset() {
    const { pageSize } = this.query
    this.query = { ...defQuery, pageSize }
  }

  async doSearch() {
    if (this.loading) {
      return
    }

    this.oldQuery = { ...this.query }

    this.loading = true

    const query = clean({ ...this.query })
    try {
      const { data: {
        items: list,
      } }: any = await get('/mock/account-detail-list', query)
      this.list = list
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.sec {
  width: 254px;
  margin-left: 9%;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Inp-Group-res,
.res-Group {
  background: #eee;
  padding: 10px;
  margin: -10px -10px 0 -10px;
}
.res-Group {
  margin-top: -5px;
}
.Inps-res,
.res-Inps {
  width: 100%;
  height: 100%;
  padding-top: 16px;
  background: #fff;
  font-size: 13px;
}
.res-num {
  width: 100%;
  height: 60px;
  line-height: 60px;
}
.res-num p {
  display: inline-block;
  width: 9%;
  text-align: left;
  margin-left: 2%;
}
.res-num-item {
  width: 80%;
  height: 100%;
  display: inline-block;
}
.res-num-item span {
  margin-left: 4%;
}
.blu1,
.blu2 {
  color: #53a1f3;
  cursor: pointer;
}
.new-number {
  background: #eee;
  padding: 10px;
  margin: -10px -10px 0 -10px;
}
.new-num {
  width: 100%;
  height: 100%;
  padding: 8px;
  background: #fff;
  font-size: 13px;
}
.info {
  width: 33%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 20%;
  font-size: 14px;
}
.info-ver {
  width: 100%;
  height: 43px;
  line-height: 43px;
  padding-left: 3%;
  border-bottom: 1px solid #ccc;
}
.info-ver .info-Icon {
  float: right;
  margin-right: 3%;
  font-weight: bold;
  margin-top: 10px;
}
.info-type {
  padding: 17px;
  line-height: 40px;
  font-size: 14px;
}
.info-type-inp span {
  margin-left: 1%;
  color: #53a1f3;
  cursor: pointer;
  text-decoration: underline;
}
.info-type div span {
  margin-left: 10%;
  color: #aaa;
}
.info-type div select {
  margin-left: 10%;
  width: 200px;
  height: 30px;
  line-height: 30px;
  color: #999;
}
.info-type .ivu-radio-group {
  margin-left: 5%;
}
.info-inp {
  margin-left: 5%;
}
.info-type button {
  margin-top: 2%;
  margin-left: 22%;
}
.info-type .info-red {
  width: 255px;
  color: red;
  font-weight: normal;
  font-size: 12px;
  line-height: 13px;
  margin-left: 24%;
}

  </style>
