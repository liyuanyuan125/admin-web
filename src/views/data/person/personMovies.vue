<template>
  <div>
    <ListPage
      :fetch="fetch"
      :filters="filters"
      :enums="enums"
      :columns="columns"
      ref="listPage"
    >
    <template slot="master" slot-scope="{row: {master}}">
      <span>{{master ? '是' : '否'}}</span>
    </template>
    </ListPage>
  </div>
</template>

<script lang='ts'>
import {Component, Prop, Watch, Mixins} from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import UrlManager from '@/util/UrlManager'
import { clean } from '@/fn/object'
import { personMovies } from '@/api/person'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import DatePicker from './components/datePicker.vue'

@Component({
  components: {
    ListPage,
    DatePicker
  }
})
export default class Main extends ViewBase {
    @Prop({type: Number}) id!: any
    fetch = personMovies
    filters: Filter[] = [
      {
        name: 'id',
        defaultValue: this.id
      },
      {
        name: 'name',
        defaultValue: '',
        type: 'input',
        width: 140,
        placeholder: '影片名字'
      },
      {
        name: 'govId',
        defaultValue: '',
        type: 'input',
        width: 140,
        placeholder: '影片专资id'
      },
      {
        name: 'year',
        defaultValue: '',
        type: DatePicker,
        width: 140,
        placeholder: '选择年份'
      },
      {
        name: 'pageIndex',
        defaultValue: 1
      },
      {
        name: 'pageSize',
        defaultValue: 20
      }
    ]
    enums = []
    get columns() {
     return [
        { type: 'index', width: 60, align: 'center', renderHeader: (h: any, params: any) => {
            return h('span', '序号')
        }},
        { title: '影片名称', key: 'name', align: 'center'},
        { title: '影片专资id', key: 'govId', align: 'center'},
        { title: '上映年份', key: 'year', align: 'center'},
        { title: '代表作品', slot: 'master', align: 'center'},
     ] as ColumnExtra[]
    }
}

</script>
<style lang='less' scoped>
.select-form {
  padding: 5px 0 15px;
  /deep/ .ivu-input-wrapper {
    margin-right: 15px;
  }
}
</style>