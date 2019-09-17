<template>
  <div class="signed-cinema-page">
    <h3 v-if="cinemaCount && cinemaCount > 0">签约影院数总计{{cinemaCount}}家</h3>
    <ListPage :fetch="fetch" :filters="filters" :enums="enums" :columns="columns" ref="listPage" v-if="isAlive">
    </ListPage>
  </div>
</template>

<script lang="tsx">
import { Component, Watch } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import ListPage, { Filter, ColumnExtra } from '@/components/listPage'
import jsxReactToVue from '@/util/jsxReactToVue'
import { queryCinemaCount, queryList } from '@/api/signedCinema'
import { formatConversion } from '@/util/validateRules'
import { cloneDeep } from 'lodash'
import { confirm, info } from '@/ui/modal.ts'
import moment from 'moment'
import remoteSelectCinema from './remoteSelectCinema.vue'
import remoteSelectCinemaCompany from './remoteSelectCinemaCompany.vue'

@Component({
  components: {
    ListPage
  }
})
export default class Main extends ViewBase {
  moment = moment

  isAlive = true

  loading = false

  cinemaCount = 0

  fetch = queryList

  filters: Filter[] = [

    {
      name: 'cinemaId',
      defaultValue: 0,
      type: remoteSelectCinema,
      width: 238,
      placeholder: '影院名称'
    },

    {
      name: 'cinemaCode',
      defaultValue: '',
      type: 'input',
      width: 100,
      placeholder: '专资编码',
    },

    {
      name: 'companyId',
      defaultValue: 0,
      company: true,
      width: 238,
      placeholder: '关联资源方'
    },

    {
      name: 'cinemaCompanyId',
      defaultValue: 0,
      type: remoteSelectCinemaCompany,
      width: 150,
      placeholder: '所属影管'
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
      { title: '序号', key: 'rank', width: 65 },
      { title: '影院ID', key: 'cinemaId', width: 80 },
      { title: '影院名称', key: 'cinemaName', minWidth: 120 },
      { title: '专资编码', key: 'cinemaCode', width: 80 },
      { title: '所属影管', key: 'cinemaCompanyName', minWidth: 120 },
      { title: '关联资源方', key: 'companyName', minWidth: 120 }
    ] as ColumnExtra[]
  }

  created() {
    this.queryCinemaCountHandler()
  }

  async queryCinemaCountHandler() {
    const res = await queryCinemaCount()
    if (res.data && res.data > 0) {
      this.cinemaCount = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.companies:only-child:empty::before {
  content: '-';
}

.approve-radio {
  margin: 15px 0;
}

.label-dese {
  display: block;
  width: 40px;
}

.tips-box {
  padding: 15px;
  color: red;
}

.signed-cinema-page {
  h3 {
    color: red;
    padding: 8px 5px;
  }
}
</style>
