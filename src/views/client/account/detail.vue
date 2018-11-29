<template>
  <div class="page">
    <!-- 菜单 -->
    <div class="work-Title"><span class="workT">工作台</span> > 客户管理 > 账号管理 > 账号详情</div>
    <!-- 注册账号 -->
    <div class="Inp-Group-res">
      <div class="Inps-res">
        <div class="res-num">
          <p>用户账号</p>
          <div class="res-num-item change-item">
            <span>admin&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【主账号】</span>
            <span>查看操作日志</span>
            <span @click="changetrue">变更主账号</span>
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
        <Table border :columns="columns7" :data="data6"></Table>
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
                  <select>
                    <option value="账号【姓名】">账号【姓名】</option>
                    <option value="账号【姓名】">账号【姓名】</option>
                    <option value="账号【姓名】">账号【姓名】</option>
                    <option value="账号【姓名】">账号【姓名】</option>
                    <option value="账号【姓名】">账号【姓名】</option>
                    <option value="账号【姓名】">账号【姓名】</option>
                    <option value="账号【姓名】">账号【姓名】</option>
                    <option value="账号【姓名】">账号【姓名】</option>
                  </select><br>
                </div>
                <p class="info-red">变更后，原主账号将变成无任何权限的子账号，可在前台系统中由新主账号删除或修改权限</p>
            <!-- </div> -->
            
             <Button type="primary">确认</Button>
             <Button @click="changefalse">取消</Button>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import View from '@/util/View'

@Component
export default class Main extends View {
        data () {
            return {
                change:false,
                columns7: [
                    {
                        title: '用户账号',
                        key: 'ID',
                    },
                    {
                        title: '姓名',
                        key: 'Number'
                    },
                    {
                        title: '手机号',
                        key: 'Name'
                    },
                    {
                        title: '创建时间',
                        key: 'Starttime'
                    },
                    {
                        title: '最后登陆时间',
                        key: 'Updatetime'
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
                                        size: 'small',
                                        color: "blue",
                                    },
                                    on: {
                                        click: () => {
                                            this.jump(params.index)
                                        }
                                    }
                                }, '查看操作日志')
                            ]);
                        }
                    }
                ],
                data6: [
                    {
                        ID: 'John Brown',
                        Number: 18,
                        Name: 'New York No. 1 Lake Park',
                        Starttime: '2016-10-03',
                        Updatetime: '2016-10-03',
                        Auditstatus:"未审核",
                        Enabledstate:"启用",

                    },
                    {
                        ID: 'Jim Green',
                        Number: 24,
                        Name: 'London No. 1 Lake Park',
                        Starttime: '2016-10-01',
                        Updatetime: '2016-10-03',
                        Auditstatus:"未审核",
                        Enabledstate:"未启用",


                    },
                    {
                        ID: 'Joe Black',
                        Number: 30,
                        Name: 'Sydney No. 1 Lake Park',
                        Starttime: '2016-10-02',
                        Updatetime: '2016-10-03',
                        Auditstatus:"未审核",
                        Enabledstate:"启用",


                    },
                    {
                        ID: 'Jon Snow',
                        Number: 26,
                        Name: 'Ottawa No. 2 Lake Park',
                        Starttime: '2016-10-04',
                        Updatetime: '2016-10-03',
                        Auditstatus:"未审核",
                        Enabledstate:"启用",


                    }
                ]
            }
        }
        // methods: {

        jump (index) {
            // this.$router.replace('account/detail/'+(index+1)
        }

        changetrue (index) {
            this.change=true
        }
        changefalse (index) {
            this.change=false
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
  .Inp-Group-res,.res-Group{
    background: #eee;
    padding:10px;
    margin:5px -10px 0 -10px;
  }
  .res-Group{
    margin-top:-5px;
  }
  .Inps-res,.res-Inps{
    width:100%;
    height:100%;
    padding-top:16px;
    background: #fff;
    font-size:13px;
  }
  .res-num{
    width:100%;
    height:60px;
    line-height:60px;
  }
  .res-num p{
    display: inline-block;
    width:6%;
    text-align:left;
    margin-left:2%;
  }
  .res-num-item{
    width:80%;
    height:100%;
    display: inline-block;
  }
  .res-num-item span{
    margin-left:4%;
  }
  .change-item span:nth-child(2),.change-item span:nth-child(3){
    color:#53A1F3;
    cursor: pointer;
  }
  .new-number{
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
  .info{
      width:33%;
    //   height:30%;
      background: #fff;
      border:1px solid #ccc;
      border-radius: 5px;
      position: absolute;
      top:20%;
      left:20%;
      font-size:14px;
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
      line-height:40px;
      font-size:14px;
  }
  .info-type div span{
      margin-left:10%;
      color:#aaa;
  }
  .info-type div select{
    margin-left:10%;
    width:200px;
    height:30px;line-height:30px;
    color:#999;
  }
  .info-type .ivu-radio-group{
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
      margin-left:22%;
   }
   .info-type .info-red{
     color:red;
     font-weight:normal;
     font-size:12px;
     line-height:13px;
     margin-left:20%;
   }
  
  </style>
