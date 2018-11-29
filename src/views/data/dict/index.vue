<template>
  <div class="page">
    <!-- 菜单 -->
    <div v-if="shows" class="work-Title"><span class="workT">工作台</span> > 基础数据 > 系统字典</div>
    <!-- 查询输入 -->
    <div v-if="shows" class="Inp-Group">
      <div class="Inps">
        <select class="Sec-One">
          <option value="广告主分类">广告主分类</option>
          <option value="资源方分类">资源方分类</option>
          <option value="广告主行业">广告主行业</option>
          <option value="映前广告广告位">映前广告广告位</option>
          <option value="影厅类型">影厅类型</option>
          <option value="区域划分">区域划分</option>
          <option value="城市级别">城市级别</option>
        </select>

        <input class="Inp-Two" type="text" placeholder="词条名称">
        <Button class="button" type="primary">查询</Button>
      </div>
    </div>
    <!-- 新建词条 -->
    <div v-if="shows" class="new-number">
      <div class="new-num">
        <Button class="button1" type="primary" id="btn" @click='Toshowfalse'><strong>+</strong>&nbsp;新建词条&nbsp;</Button>
        <Table border :columns="columns7" :data="data6"></Table>
        <Page class="page-f" :total="100" show-elevator />
      </div>
    </div> 
    <!-- 添加词条页面 -->
    <div  v-if="!shows">
      <div class="work-Title"><span class="workT">工作台</span> > 客户管理 > 账号管理 > 新建账号</div>
      <div class="bge">
 
        <div class="Add-Inp">
            <span>用户账号</span><Input  size="large" style="width: 300px"/><br>
        </div>
        <div class="Add-Inp">
            <span>密码</span><Input  size="large" style="width: 300px"/><br>
        </div>
        <div class="Add-Inp">
            <span>重复密码</span><Input  size="large" style="width: 300px"/><br>
        </div>
        <div class="Add-Inp">
            <span>邮箱</span><Input  size="large" style="width: 300px"/><br>
        </div>
        <div class="Add-Inp">
            <span>所属公司</span>
            <Dropdown on-click>
            <a href="javascript:void(0)">
                北京小吃
                <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem>驴打滚</DropdownItem>
                <DropdownItem>炸酱面</DropdownItem>
                <DropdownItem>豆汁儿</DropdownItem>
                <Dropdown placement="right-start">
                    <DropdownItem>
                        北京烤鸭
                        <Icon type="ios-arrow-forward"></Icon>
                    </DropdownItem>
                    <DropdownMenu slot="list">
                        <DropdownItem>挂炉烤鸭</DropdownItem>
                        <DropdownItem>焖炉烤鸭</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <DropdownItem>冰糖葫芦</DropdownItem>
            </DropdownMenu>
            </Dropdown>
        </div>
        <div class="Add-Inp">
            <span>角色</span><Radio label="超级管理员">超级管理员</Radio><br>
        </div>
        <div class="Add-Inp">
            <span>启用状态</span>
            <RadioGroup>
            <Radio label="启用"></Radio>
            <Radio label="停用"></Radio>
            </RadioGroup>
            <br>
        </div>
        <Button class="button2" type="primary" id="btn" @click='Toshowtrue'>保存</Button>    
      </div>
    </div> 
    <br><br>
    
    <!-- <router-link  :to="{ name: 'client-account-detail', params: { id: 1 } }">详情</router-link> -->
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class Main extends View {
        data () {
            return {
                shows : true,
                columns7: [
                    {
                        title: '序号',
                        key: 'Number'
                    },
                    {
                        title: '字典分类',
                        key: 'Name'
                    },
                    {
                        title: '词条名称',
                        key: 'Starttime'
                    },
                    {
                        title: '唯一识别符',
                        key: 'Updatetime'
                    },
                    {
                        title: '排序',
                        key: 'Auditstatus'
                    },
                    {
                        title: '启用状态',
                        key: 'Enabledstate',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            // this.showEnabledstate(params.index)
                                        }
                                    }
                                }, '已启用'),
                            ])
                        }
                    },
                    {
                        title: '操作',
                        key: 'Action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '编辑'),
                            ])
                        }
                    }
                ],
                data6: [
                    {
                        ID:12132132,
                        Number: 18,
                        Name: 'New York No. 1 Lake Park',
                        Starttime: '2016-10-03',
                        Updatetime: '2016-10-03',
                        Auditstatus:'未审核',
                        Enabledstate:"启用",

                    },
                    {
                        ID:12132132,
                        Number: 24,
                        Name: 'London No. 1 Lake Park',
                        Starttime: '2016-10-01',
                        Updatetime: '2016-10-03',
                        Auditstatus:'未审核',
                        Enabledstate:'未启用',


                    },
                    {
                        ID:12132132,
                        Number: 30,
                        Name: 'Sydney No. 1 Lake Park',
                        Starttime: '2016-10-02',
                        Updatetime: '2016-10-03',
                        Auditstatus:'未审核',
                        Enabledstate:"启用",


                    },
                    {
                        ID:12132132,
                        Number: 26,
                        Name: 'Ottawa No. 2 Lake Park',
                        Starttime: '2016-10-04',
                        Updatetime: '2016-10-03',
                        Auditstatus:'未审核',
                        Enabledstate:"启用",


                    }
                ]
            }
        }
        // methods: {
        show (index) {
                this.$Modal.info({
                    title: 'User Info',
                    // content: `ID：${this.data6[index].ID}<br>Number：${this.data6[index].Number}<br>Name：${this.data6[index].Name}<br>Starttime：${this.data6[index].Starttime}<br>Updatetime：${this.data6[index].Updatetime}<br>Auditstatus：${this.data6[index].Auditstatus}<br>Enabledstate：${this.data6[index].Enabledstate}`
                })
            }
            
        remove (index) {
                this.data6.splice(index, 1)
            }

            // showEnabledstate(index){
            //   console.log(this)
            // }
        Toshowfalse () {
              this.shows = false
            }
        Toshowtrue () {
              this.shows = true
            }

        // }
}
</script>

<style lang="less" scoped>
 
  .work-Title{
    height:50px;
    line-height:50px;
    background: #eee;
    padding-left:20px;
    margin:-10px;
  }
  .workT{
    font-size:14px;
  }
  .Inp-Group{
    // width:100%;
    height:75px;
    // line-height:50px;
    background: #eee;
    // padding:5px 10px 5px 20px;
    padding:10px;
    // padding-top:2px;
    margin:5px -10px 0 -10px;
    // margin-left:-10px;
  }
  .Inps{
    width:100%;
    height:100%;
    padding:8px;
    // padding-top:4px;
    background: #fff;
    font-size:13px;
  }
  .Inps input{
    
    height:100%;
    border-radius: 5px;
    border:1px solid #ccc;
    padding-left:5px;
  }

  .Inp-Two{
    float:left;
    width:12%;
    margin-left:1.3%;
  }

  .Sec-One{
    float:left;
    height:40px;
    border-radius: 5px;
    background: #fff;
    border: 1px solid #ccc;
    color:#515A6E;
  }
  .Sec-One option{
    height:40px;
  }
  .button{
    width: 6%;
    margin-left: 1.3%;
    height: 40px;
    margin-top:-3px;
  }
  .new-number{
    // height:75px;
    background: #eee;
    padding:10px;
    margin:-10px -10px 0 -10px;
  }
  .new-num{
    width:100%;
    height:100%;
    padding:8px;
    background: #fff;
    font-size:13px;
  }
  .button1{
    width: 9%;
    // margin-left: 1.3%;
    height: 40px;
    // margin-top:-3px;
    margin: -3px 0 6px 0;
  }
  .button1 strong{
    font-size:14px;
  }
  .Add-Inp{
    width:100%;
    height:80px;
    line-height:80px;
    font-size:15px;
  }
  .Add-Inp span{
    display: inline-block;
    width:8%;
    text-align:right;
    margin-right:4%;
  }
  .Add-Inp input{
    display: inline-block;
  }
  .button2{
    width: 6%;
    height: 40px;
    margin-left:5%;
  }
  .page-f{
    margin-top:10px;
    font-size:15px;
  }
  .bge{
      background: #fff;
      padding:5px;
  }
  </style>
