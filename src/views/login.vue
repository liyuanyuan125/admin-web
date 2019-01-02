<template>
  <div class="box" @keydown.enter="submit">
    <div class="card">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon> 欢迎登录
        </p>
        <div class="form-wrap">
          <Form :model="form" :rules="rules" ref="form">
            <FormItem prop="uname" :error="unameError">
              <Input v-model="form.uname" placeholder="请输入账号">
                <span slot="prepend">
                  <Icon :size="16" type="md-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="pwd" :error="pwdError">
              <Input type="password" v-model="form.pwd" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" :loading="submitLoading" @click="submit" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import { login, getUserInfo } from '@/api/auth'
import event from '@/fn/event'
import { logout, setUser, appId } from '@/store'

@Component
export default class Main extends ViewBase {
  form = {
    uname: '',
    pwd: ''
  }

  rules = {
    uname: [
      { required: true, message: '账号不能为空', trigger: 'blur' }
    ],
    pwd: [
      { required: true, message: '密码不能为空', trigger: 'blur' }
    ]
  }

  submitLoading = false
  unameError =  ''
  pwdError = ''

  async submit() {
    this.unameError = ''
    this.pwdError = ''

    const valid = await (this.$refs.form as any).validate()
    if (valid) {
      this.submitLoading = true
      try {
        const pdata = {
          username: this.form.uname,
          password: this.form.pwd,
          appId,
        }
        const { data } = await login(pdata)

        const user = { id: data.userId, name: data.name }
        setUser(user)

        this.$router.push({ name: 'home' })
      } catch (ex) {
        const { code } = ex
        ; ((this as any)[`ajax${code}`] || this.handleError).call(this, ex)
      } finally {
        this.submitLoading = false
      }
    }
  }

  ajax900100(ex: any) {
    // do something
  }

  ajax900200(ex: any) {
    // do something
  }
}
</script>

<style lang="less" scoped>
.box {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('https://file.iviewui.com/iview-admin/login_bg.jpg') no-repeat center;
  background-size: cover;
}
.card {
  position: absolute;
  right: 160px;
  top: 50%;
  transform: translateY(-60%);
  width: 300px;
}
.form-wrap {
  padding: 10px 0 0;
  /deep/ .ivu-input-group-prepend {
    min-width: 32px;
  }
}

@media (max-width: 600px) {
  /deep/ .card {
    position: relative;
    right: 0;
    width: 88%;
    margin: auto;

    .ivu-card-head p {
      font-size: 16px;
    }

    .ivu-input-group-prepend {
      min-width: 38px;
    }

    .ivu-input-group .ivu-input {
      font-size: 16px;
      height: 38px;
    }

    .ivu-btn {
      font-size: 16px;
      margin-top: 5px;
    }
  }
}
</style>
