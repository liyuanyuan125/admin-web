<template>
  <div class="page">
    <header class="header flex-box">
      <Button icon="md-return-left" @click="back" class="btn-back">返回上一页</Button>
      <div class="flex-1">
        <em></em>
      </div>
    </header>
    <div class="detail-box">
      <div class='titop'>基础信息</div>
      <div class="detail-header">
        <Row>
          <Col span="2"><div>名称</div></Col>
          <Col span="8"><span> </span></Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
// doc: https://github.com/kaorun343/vue-property-decorator
import { Component, Watch , Mixins  } from 'vue-property-decorator'
import moment from 'moment'
import ViewBase from '@/util/ViewBase'
import { queryList } from '@/api/kolAccount'
import jsxReactToVue from '@/util/jsxReactToVue'
import { toMap } from '@/fn/array'
import { slice , clean } from '@/fn/object'
import { warning , success, toast } from '@/ui/modal'
import UploadButton, { SuccessEvent } from '@/components/UploadButton.vue'




const makeMap = (list: any[]) => toMap(list, 'key', 'text')

const timeFormatDate = 'YYYY-MM-DD HH:mm:ss'
const timeFormat = 'YYYY/MM/DD'

const defQuery = {
}

const dataForm = {
  refuseReason: '',
  agree: true
}

@Component({
  components: {
    UploadButton
  }
})
export default class Main extends ViewBase {
  query = { ...defQuery }
  oldQuery: any = {}
  detail: any = {}
  att: any = {}
  attachments: any = []
  typeList: any = []





  id = 0

  applyTime = ''

//   // 审核
  dataForm: any = { ...dataForm }

  mounted() {
    if ( this.$route.params.status == '1' ) {
      // this.showStatus = true
    }
    if ( this.$route.params.status == '3' || this.$route.params.status == '4' ) {
      // this.showedit = true
    }
    // this.doSearch()
  }


  // 上传文件
  async onUploadSuccess({ files }: SuccessEvent, key: number) {
    // console.log(this, key, files)
    const typetext = key
    // const typecode = this.typeList.map((item: any) => {
    //       return item.sort
    // })
    // const index = typecode.indexOf(typetext)
    // if (index != -1) {
      try {
        // await addvideo (this.$route.params.id , {
        //                                         name: files[0].clientName,
        //                                         fileId: files[0].fileId,
        //                                         typeCode: key
        //                                       })
        toast('操作成功')
        this.doSearch()
      } catch (ex) {
        this.handleError(ex)
      }
    // } else {
    //   alert('请确认上传文件格式')
    // }
  }
  get cachedMap() {
    return {
    }
  }

  get tableData() {
    const cachedMap = this.cachedMap
    const typeList = (this.typeList || []).map((it: any) => {
      return {
        ...it,
      }
    })
    return typeList
  }

  columns = [
    { title: '序号', key: 'sort', width: 80 , align: 'center' },
    { title: '格式', key: 'text', width: 130 , align: 'center' },
    { title: '附件', key: 'name',  align: 'center',
      render: (hh: any, { row: { desc , text } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (desc!=undefined) {
          if (desc.fileId == '' || desc.fileId == null) {
            return <span class='datetime' v-html={desc.fileUrl}></span>
          } else {
            return <span class='datetime' style='color:#4b9cf2' v-html={desc.name}></span>
          }
        } else {
          <span class='datetime' v-html={'-'}></span>
        }
        
        /* tslint:enable */
      }
    },
    {
      title: '上传时间',
      key: 'uploadTime',
      width: 150 ,
      align: 'center',
      render: (hh: any, { row: { desc } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (desc!=undefined ) {
          const html = moment(desc.uploadTime).format(timeFormatDate)
          return desc.uploadTime == null ? <span class='datetime' v-html={'-'}></span> : <span class='datetime' v-html={html}></span>
        } else {
          <span class='datetime' v-html={'-'}></span>
        }
        /* tslint:enable */
      }
    },
    { title: '上传人', key: 'uploadName', align: 'center', width: 150,
      render: (hh: any, { row: { desc } }: any) => {
        /* tslint:disable */
        const h = jsxReactToVue(hh)
        if (desc!=undefined ) {
          const html = '【' + desc.uploadEmail + '】' + desc.uploadName
          if (desc.uploadEmail == null) {
            return <span class='datetime' v-html={desc.uploadName}></span>
          } else {
            return <span class='datetime' v-html={html}></span>
          }
        } else {
          <span class='datetime' v-html={'-'}></span>
        }
        
        /* tslint:enable */
      }
    },
    // <uploadButton style='margin-bottom:17px;' multiple @success="onUploadSuccess">上传</uploadButton>
    {
      title: '操作',
      slot: 'spaction',
      width: 170,
      align: 'center',
    }
  ]

  async doSearch() {
     (this.$Spin as any).show()
     this.oldQuery = { ...this.query }


    const query = clean({ ...this.query })
    try {
      const res = await queryList(this.$route.params.id)
      this.detail = res.data.item
      this.applyTime = moment(this.detail.applyTime).format(timeFormatDate)
       // 附件
      this.typeList = res.data.typeList.map((it: any) => {
        const key = it.key
        const typecode = this.detail.attachments.map((item: any) => {
          return item.typeCode
        })
        const index = typecode.indexOf(key)
        if (index != -1) {
          return {
            ...it,
            desc: this.detail.attachments[index]
          }
        } else {
          return {
            ...it
          }
        }
      })


      // this.logList = res.data.logList.map((item: any) => {
      //   return {
      //     ...item,
      //     createTime: item.createTime == null ? '暂无时间' : moment(item.createTime).format(timeFormatDate)
      //   }
      // })
      setTimeout(() => {
        (this.$Spin as any).hide()
      }, 1000)
    } catch (ex) {
      (this.$Spin as any).hide()
      this.handleError(ex)
    } finally {
    }
  }


  // 返回
  back() {
    this.$router.go(-1)
  }
}
</script>

<style lang="less" scoped>
@import '../../../site/lib.less';
.addbut {
  margin-top: 10px;
}
.header {
  margin-top: 5px;
  margin-bottom: 10px;
  line-height: 30px;
  em, i {
    font-style: normal;
    margin-right: 6px;
  }
  em {
    font-size: 16px;
    color: @c-base;
  }
}
.detail-number {
  /deep/ .btn-add {
    margin-left: 8px;
    line-height: 50px;
  }
}

.btn-back {
  margin-right: 10px;
  border-color: #dcdee2 !important;
}
.detail-check {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding: 10px;
  padding-left: 14px;
}
.detail-header, .detail-content, .detail-footer, .detail-number {
  margin-bottom: 10px;
  border: 1px solid #dcdee2;
  padding-left: 14px;
  /deep/ .ivu-col-span-2 {
    div {
      line-height: 50px;
      width: 88px;
    }
  }
  .red {
    color: red;
  }
  span {
    display: inline-block;
    line-height: 50px;
    color: #717975;
  }
  span:only-child:empty {
    &::before {
      content: '暂无';
    }
  }
  /deep/ .cinema-button {
    margin-bottom: 20px;
  }
}
.check-select-group {
  display: inline-flex;
  width: 90%;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  padding-left: 8px;
  overflow: hidden;
  /deep/ .ivu-select {
    .ivu-select-placeholder,
    .ivu-select-selected-value {
      position: relative;
      top: 1px;
    }
    .ivu-select-selection {
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }
}
.upload {
  padding-bottom: 40px;
  /deep/ .uplaod-slot {
    margin-bottom: 10px;
    color: #19be6b;
  }
}
.detail-edit {
  text-align: center;
  padding-bottom: 20px;
  .btn-set {
    width: 100px;
    margin: 0 10px;
  }
}
.typeBox {
  position: relative;
  padding-left: 10px;
  height: 40px;
  line-height: 40px;
  background: #ecf0f4;
  color: #717975;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    width: 50px;
    text-align: center;
    color: #717975;
    line-height: 20px;
    background: #dcdee2;
  }
  .red {
    color: red;
  }
}
.upload-wrap {
  background-color: #ecf0f4;
  padding-bottom: 6px;
  margin-top: 6px;
}
.upload-info {
  line-height: 18px;
  padding: 10px 0 0 8px;
  margin-bottom: 6px;
}
.show-img {
  width: 120px;
  height: 80px;
  margin: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
.titop {
  line-height: 35px;
  color: rgb(61, 156, 235);
  font-size: 16px;
  margin-bottom: 10px;
}
.logs-item {
  height: 35px;
}
/deep/ .ivu-btn:hover {
  color: #000;
  background-color: #fff;
  border-color: #fff;
}
/deep/ .ivu-btn {
  border-color: #fff;
}
/deep/ .ivu-btn:focus {
  box-shadow: 0;
}
</style>
