<template>
  <Modal
    v-model='showDlg'
    :transfer='true'
    :width='760'
    :title="'添加影片'"
    @on-cancel="cancel" >
    <Form ref="dataForm" :model="dataForm" label-position="left" :rules="ruleValidate" :label-width="100">
       <div class="act-bar flex-box">
        <form class="form flex-1" @submit.prevent="search">
          <span style='margin-right: 7.5%;'>影片名称</span><LazyInput v-model="query.name" placeholder="影片名称" class="input"/>
        </form>
      </div>
      <FormItem label="影片类型" prop="userIds">
        <Checkbox  :indeterminate="indeterminate" :value="checkAll"  @click.prevent.native="handleCheckAll">不限</Checkbox>
        <CheckboxGroup v-model="type" v-if="showDlg">
          <Checkbox :label='it.key' v-for='it in typelist' :key='it.key' :value='it.key'>{{it.text}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <Table ref="selection" :columns="columns" @on-selection-change="onselect" :data="list" v-if="showDlg"  
        border stripe disabled-hover size="small" class="table">
        <template  slot="type" slot-scope="{row}" >
          <span>{{typelists(typelist, row.type)}}</span>
          <!-- <span class="type-box" v-for='(it,index) in typelist' :key='index'>
            <em v-for='(item,index) in row.type' class="types" :key='index' v-if='it.key == item'>{{it.text}}
            </em>
          </span> -->
        </template>
        <template  slot="wish" slot-scope="{row}" >
          {{formatNumber(row.wish , 2)}}
        </template>
        </Table>
      <div class="page-wrap" v-if="total > 0">
        <Page :total="total" :current="query.pageIndex" :page-size="query.pageSize"
          show-total show-sizer show-elevator :page-size-opts="[5, 10]"
          @on-change="sizeChangeHandle"
          @on-page-size-change="currentChangeHandle"/>
      </div>
    </Form>
    <div slot="footer" class="dialog-footer">
      <span style='margin-right: 7.5%;'>已选{{ids.length}}</span>
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
import number from './number.vue'
import { formatNumber } from '@/util/validateRules'
const timeFormat = 'YYYY-MM-DD'

const dataForm = {
}

@Component({
  components: {
    number
  }
})
export default class ComponentMain extends Mixins(ViewBase, UrlManager) {
  query = {
    name: '',
    types: '',
    pageIndex: 1,
    pageSize: 10,
  }

  asd: any = false
  showDlg = false
  id = 0
  total = 0
  list: any = []
  typelist: any = []
  type: any = []
  checkAll: any = false
  indeterminate: any = true
  ids: any = []
  start: any = ''
  end: any = ''

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
    { title: '影片名称', key: 'nameCn', align: 'center',
      render: (hh: any, { row: { nameCn } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (nameCn.length >= 7) {
        return (
            <div>
              <tooltip max-width="200" transfer content={nameCn} placement="top">
                <span class="bei" v-html={nameCn} />
              </tooltip>
            </div>
          )
        } else {
          return (
              <span class="bei" v-html={nameCn} />
          )
        }
        /* tslint:enable */
      }
    },
    { title: '上映时间', key: 'releaseDate', align: 'center' ,
      render: (hh: any, { row: { releaseDate } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        const a = String(releaseDate)
        const html = a.slice(0 , 4) + '-' + a.slice(4 , 6) + '-' + a.slice(6 , 8)
        return <span class='datetime' v-html={html}></span>
        /* tslint:enable */
      }
    },
    { title: '剧情类型', slot: 'type', align: 'center'},
    { title: '导演', key: 'director', align: 'center',
      render: (hh: any, { row: { director } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (director.length >= 2) {
        return (
            <div>
              <tooltip max-width="200" transfer content={director + ' '} placement="top">
                <span class="bei" v-html={director + ' '} />
              </tooltip>
            </div>
          )
        } else {
          return (
              <span class="bei" v-html={director + ' '} />
          )
        }
        /* tslint:enable */
      }
    },
    { title: '主演', key: 'actor', align: 'center',
      render: (hh: any, { row: { actor } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (actor.length >= 2) {
        return (
            <div>
              <tooltip max-width="200" transfer content={actor + ' '} placement="top">
                <span class="bei" v-html={actor + ' '} />
              </tooltip>
            </div>
          )
        } else {
          return (
              <span class="bei" v-html={actor + ' '} />
          )
        }
        /* tslint:enable */
      }
    },
    { title: '想看人数', slot: 'wish', align: 'center'},
  ]

  ruleValidate = {
  }

  dataForm: any = { ...dataForm }

  get formatNumber() {
    return formatNumber
  }
  async init(start: any , end: any) {
    this.showDlg = true
    this.start = start
    this.end = end
    ; (this.$refs.dataForm as any).resetFields()
    return this.id
  }

  typelists(val: any, type: any) {
    const maps: any = []
    ; (val || []).forEach((item: any) => {
      if (item) {
        (type || []).forEach((it: any) => {
          if (item.key == it) {
            maps.push(item.text)
          }
        })
      }
    })
    return maps.join(' / ')
  }
  onselect(row: any , selection: any) {
    this.ids = row.map((it: any) => {
      return {
        movieId : Number(it.id),
        beginDate : Number(this.start),
        endDate: Number(this.end),
      }
    })
  }

  handleCheckAll() {
    if (this.indeterminate) {
        this.checkAll = false
    } else {
        this.checkAll = !this.checkAll
    }
    this.indeterminate = false

    if (this.checkAll) {
        // this.type = (this.typelist || []).map((it: any ) => {
        //   return it.key
        // })
        this.type = []
    } else {
        this.type = []
    }
  }


  cancel() {
    this.showDlg = false
    ; (this.$refs.dataForm as any).resetFields()
  }
  // 表单提交
  async dataFormSubmit(dataForms: any) {
    try {
      const res =  await addfilm (this.$route.params.id , {items: this.ids })
      toast('操作成功')
      this.showDlg = false
      this.$emit('done')
    } catch (ex) {
      this.handleError(ex)
      this.showDlg = false
    }
  }

  reset() {
    this.resetQuery()
  }

  mounted() {
    this.doSearch()
  }

  search() {
    this.query.pageIndex = 1
  }

  async doSearch() {
    this.query.types = this.type.join(',')
    try {
      // 获取角色详情
      const { data } = await filmList(this.query)
      this.list = data.items
      this.total = data.totalCount
      this.typelist = data.movieTypeList
    } catch (ex) {
      this.handleError(ex)
    } finally {
    }
  }

  // 每页数
  sizeChangeHandle(val: any) {
    this.query.pageIndex = val
    this.doSearch()
  }

  // 当前页
  currentChangeHandle(val: any) {
    this.query.pageSize = val
    this.doSearch()
  }


  // @Watch('query', { deep: true })
  // watchQuery() {
  //   this.doSearch()
  // }


  @Watch('type', { deep: true })
  watchType() {
    this.doSearch()
  }
  @Watch('query', { deep: true })
  watchQuery() {
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
em {
  font-style: normal;
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
.types::after {
  content: '/';
  display: inline-block;
}
.type-box:only-child .types:not(:last-of-type)::after {
  content: '';
  display: inline-block;
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
  /deep/ .bei {
    display: block;
    width: 86%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
/deep/ .ivu-tooltip {
  width: 100%;
}
// /deep/ .ivu-table-cell {
//   padding-left: 4px;
//   padding-right: 4px;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
// }
</style>
