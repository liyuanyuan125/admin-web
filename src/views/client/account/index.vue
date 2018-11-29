<template>
  <div class="page">
    <!-- 菜单 -->
    <div v-if="shows" class="work-Title"><span class="workT">工作台</span> > 客户管理 > 账号管理</div>
    <!-- 查询输入 -->
    <div v-if="shows" class="Inp-Group">
      <div class="Inps">
        <input class="Inp-One" type="text" placeholder="账号ID">
        <input class="Inp-Two" type="text" placeholder="账号">
        <input class="Inp-Three" type="text" placeholder="公司名称">
        <div class="Inp-Four">
          <span>注册时间</span>
          <input type="date">
          <span>至</span>
          <input type="date">
        </div>
        <select class="Sec-One">
          <option value="审核状态">审核状态</option>
          <option value="待审核">待审核</option>
          <option value="审核已通过">审核已通过</option>
          <option value="审核未通过">审核未通过</option>
        </select>
        <select class="Sec-Two">
          <option value="启用状态">启用状态</option>
          <option value="已启用">已启用</option>
          <option value="未启用">未启用</option>
        </select>
        <Button class="button" type="primary">查询</Button>
      </div>
    </div>
    <!-- 新建账号 -->
    <div v-if="shows" class="new-number">
      <div class="new-num">
        <Button class="button1" type="primary" id="btn" @click='Toshowfalse'><strong>+</strong>&nbsp;新建账号&nbsp;</Button>
        <Table border :columns="columns7" :data="data6"></Table>
        <Page class="page-f" :total="100" show-elevator />
      </div>
    </div> 
    <!-- 添加账号页面 -->
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
    <!-- 弹窗审核 -->
    <div class="info" v-if="examine">
        <div class="info-ver">账户审核<Icon class="info-Icon" type="md-close"   @click="examinefalse" size="22"/></div>
        <div class="info-type">
            <div class="info-type-t">
                <div>注册账号<span>adadadadada</span></div>
                <div>账号类型<span>主账号</span></div>
            </div>
            <div class="info-type-t">审核意见
                <RadioGroup>
                    <Radio label="通过"></Radio>
                    <Radio label="拒绝"></Radio>
                </RadioGroup>
            </div>
            <div class="info-type-t info-type-inp">
                所属公司<Input class="info-inp" size="large" style="width: 230px"/><Icon type="ios-alert" color="#FF9900" size="24"/><span>保存为新公司</span>
            </div>
             <Button type="primary">确认</Button>
             <Button @click="examinefalse">取消</Button>
        </div>
    </div>
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
                shows:true,
                examine:false,
                columns7: [
                    {
                        title: '账号ID',
                        key: 'ID',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person',
                                        // content:params.index
                                    }
                                }),
                                h('strong', params.row.ID)
                            ]);
                        }
                    },
                    {
                        title: '账号',
                        key: 'Number'
                    },
                    {
                        title: '公司名称',
                        key: 'Name'
                    },
                    {
                        title: '注册时间',
                        key: 'Starttime'
                    },
                    {
                        title: '更新时间',
                        key: 'Updatetime'
                    },
                    {
                        title: '审核状态',
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
                            ]);
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
                                            this.examinetrue(params.index)
                                        }
                                    }
                                }, '重新审核'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.jump(params.index)
                                        }
                                    }
                                }, '详情')
                            ]);
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
        examinetrue (index) {
            this.examine=true
        }
        examinefalse (index) {
            this.examine=false
            }
        jump (index) {
            this.$router.replace('account/detail/'+(index+1))
        }
        Toshowfalse() {
            this.shows=false
        }
        Toshowtrue() {
            this.shows=true
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
    height:75px;
    background: #eee;
    padding:10px;
    margin:5px -10px 0 -10px;
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
  .Inp-One{
    width:7%;
    float:left;
  }
  .Inp-Two , .Inp-Three{
    float:left;
    width:12%;
    margin-left:1.3%;
  }
  .Inp-Four{
    float: left;
    max-width: 24%;
    width: 24%;
    height: 100%;
    border: 1px solid #ccc;
    padding-left: 5px;
    line-height: 37px;
    margin-left: 1.3%;
    border-radius: 5px;
  }
  .Inp-Four span{
    float:left;
  }
  .Inp-Four input{
    float:left;
    width:33%;
    background: #fff;
    border:0px;
    height:100%;
    color:#515A6E;
  }
  .Sec-One , .Sec-Two{
    height:40px;
    border-radius: 5px;
    margin-left:1.3%;
    background: #fff;
    border: 1px solid #ccc;
    color:#515A6E;
  }
  .Sec-One option , .Sec-Two option{
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
  .info{
      width:35%;
    //   height:30%;
      background: #fff;
      border:1px solid #ccc;
      border-radius: 5px;
      position: absolute;
      top:20%;
      left:20%;
      font-size:14px;
      z-index:10;
  }
  .info-ver{
      width:100%;
      height:43px;
      line-height:43px;
      padding-left:3%;
      border-bottom:1px solid #ccc;
    }
  .info-ver .info-Icon{
      float:right;
      margin-right:3%;
      font-weight: bold;
      // font-size:15px;
      margin-top:10px;
  }
  .info-type{
      padding:17px;
  }
  .info-type-t{
      width:100%;
      height:50px;
      line-height:50px;
  }
  .info-type-t div{
      display:inline-block;
      width:50%;
  }
  .info-type-t div span{
      margin-left:10%;
  }
  .info-type-t .ivu-radio-group{
      margin-left:5%;
  }
  .info-inp{
      margin-left:5%;
  }
  .info-type-inp span{
      margin-left:1%;
      color:#53A1F3;
      cursor:pointer;
      text-decoration: underline;
  }
  .info-type Button{
      margin-top:2%;
      margin-left:24%;
   }


  </style>
