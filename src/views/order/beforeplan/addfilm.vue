<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='600'
    :title="'添加影片'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
       <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <LazyInput v-model="query.name" placeholder="影片名称" class="input"/>
        </form>
      </div>
      <Table ref="selection" :columns="columns" @on-select="onselect" :data="tableDatauser" v-if="showDlg" :loading="loading"
        border stripe disabled-hover size="small" class="table"></Table>

      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[5, 10]"
          @on-change="page => query.pageIndex = page"
          @on-page-size-change="pageSize => query.pageSize = pageSize"/>
      </div>
      <FormItem label="影片类型" prop="userIds">
        <Checkbox v-model="dataForm.admin"></Checkbox>
        <CheckboxGroup v-model="dataForm.roleIds" v-if="showDlg">
          <Checkbox :label='it.id' v-for='it in list' :key='it.id' :value='it.id'>{{it.name}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取消</Button>
      <Button type="primary" @click="dataFormSubmit('dataForm')">确定</Button>
    </div>
  </Modal>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Prop , Watch , Mixins} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { get } from '@/fn/ajax'
import { filmList , addfilm } from '@/api/beforeplan'
import { warning , success, toast } from '@/ui/modal'
import UrlManager from '@/util/UrlManager'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice, clean } from '@/fn/object'
import moment from 'moment'
const timeFormat = 'YYYY-MM-DD'
// const defQuery = {
//   id: '',
//   userName: '',
//   loginName: '',
//   pageIndex: 1,
//   pageSize: 5,
// }
const dataForm = {
  userIds: [],
  roleIds: [],
  appId: null,
  admin: null
}

@Component
export default class ComponentMain extends Mixins(ViewBase, UrlManager) {
  query = {
    name: '',
    startTime: null,
    endTime: null,
    types: '',
    pageIndex: 1,
    pageSize: 5,
  }
  loading = false
  showDlg = false
  id = 0
  total = 0
  roles: any = []
  // query = { ...defQuery }
  // query: any = {}
  oldQuery: any = {}
  list: any = []
  userlist: any = []
  data: any = {}
  checkdata: any = {}

  columns = [
    {
      type: 'selection',
      title: ' ',
      width: 60,
      key: 'id',
      align: 'center',
      render: (hh: any, { row: { id } , row}: any) => {
      //   /* tslint:disable */
      //   const h = jsxReactToVue(hh)
      //   return row.id
      //   /* tslint:enable */
      }
    },
    { title: 'ID', key: 'id', align: 'center' },
    { title: '账号', key: 'loginName', align: 'center' },
    { title: '用户姓名', key: 'userName', align: 'center' },
    { title: '邮箱', key: 'email', align: 'center' },
  ]

  ruleValidate = {
  }

  dataForm: any = { ...dataForm }

  async init(id: number) {
    this.dataForm.userIds = []
    this.dataForm.roleIds = []
    this.dataForm.admin = null
    this.showDlg = true
    this.id = id || 0
    ; (this.$refs.dataForm as any).resetFields()
    // if (this.id) {
    //   try {
    //     //  获取用户详情
    //     const { data } = await getappuserlist(this.$route.params.appId, this.id)
    //     this.dataForm.admin = data.admin
    //     this.dataForm.roleIds = data.roles
    //     this.dataForm.userIds.push(data.id)
    //     // this.query.pageIndex = 3
    //     // console.log(this.$route)
    //     //  实现默认勾选
    //     // console.log((this.$refs.selection as any).$refs.tbody.objData[2]._isChecked)
    //     // (this.$refs.selection).$refs.tbody.objData[1]._isChecked = true
    //   } catch (ex) {
    //     // this.handleError(ex)
    //   } finally {
    //   }
    // }
    return this.id
  }

  onselect(row: any , selection: any) {
    this.dataForm.userIds.push(selection.id)
  }


  cancel() {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }
  // 表单提交
  async dataFormSubmit(dataForms: any) {
    const valid = await (this.$refs.dataForm as any).validate()
    if (!valid) {
      return
    }
    const query = !this.id ? {
      ...this.dataForm,
    } : {
      id: this.id,
      ...this.dataForm,
    }
    const title = !this.id ? '添加' : '编辑'
    try {
      // const res = !this.id ? await addList (query) : await setList (query)
      toast('操作成功')
      this.showDlg = false
      this.$emit('done')
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

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

  get tableDatauser() {
    const cachedMap = this.cachedMap
    const userlist = (this.userlist || []).map((it: any) => {
      if (this.id == it.id) {
        return {
          ...it,
          _checked: true
        }
      } else {
        return {
          ...it
        }
      }
    })
    return userlist
  }

  reset() {
    this.resetQuery()
  }

  mounted() {
    // console.log(this.$refs.selection)
    this.updateQueryByParam()
    const { id } = this.$route.params
    this.dataForm.appId = Number(this.$route.params.appId)
    this.doSearch()
  }

  search() {
    this.query.pageIndex = 1
  }

  async doSearch() {
    if (this.loading) {
      return
    }
    // this.oldQuery = { ...this.query }
    this.loading = true
    // const query = clean({ ...this.query })
    try {
      // 获取角色详情
      const { data: {
        items: list,
        totalCount: total,
      } } = await filmList(this.query)
      this.list = list
      // //  获取用户详情
      // const { data: {
      //   items: userlist,
      //   totalCount: total,
      // } } = await userqueryList(query)
      // this.userlist = userlist
      this.total = total
    } catch (ex) {
      this.handleError(ex)
    } finally {
      this.loading = false
    }
  }
  @Watch('query', { deep: true })
  watchQuery() {
    if (this.query.pageIndex == this.oldQuery.pageIndex) {
      this.query.pageIndex = 1
    }
    this.doSearch()
  }
}
</script>

<style lang="less" scoped>
.form {
  .input,
  /deep/ .ivu-select {
    width: 100px;
    margin-left: 8px;
    &:first-child {
      margin-left: 0;
    }
  }

  .input-corp-id {
    width: 80px;
  }
}

.btn-search,
.btn-reset {
  margin-left: 8px;
}
.page-wrap {
  margin: 20px 0 18px;
  text-align: center;
}
.Add-Inp {
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 15px;
}
.Add-Inp span {
  display: inline-block;
  width: 7%;
  text-align: right;
  margin-right: 4%;
}
.Add-Inp input {
  display: inline-block;
}
.button2 {
  width: 6%;
  height: 40px;
  margin-left: 5%;
}
.page-f {
  margin-top: 10px;
  font-size: 15px;
}
.bge {
  background: #fff;
  padding: 5px;
}
.table {
  margin-top: 16px;
  /deep/ .status-2,
  /deep/ .aptitude-status-2 {
    color: #19be6b;
  }
  /deep/ .aptitude-status-3 {
    color: #ed4014;
  }
  /deep/ .ivu-table-cell > span:only-child:empty {
    &::before {
      content: '-';
    }
  }
}
</style>
