<template>

  <div class="my-login-box">
    <el-row>
      <el-col :xs="{span:16,offset:4}"
              :sm="{span:12,offset:6}"
              :md="{span:8,offset:8}"
              :lg="{span:6,offset:9}"
              :xl="{span:4,offset:10}">
        <div class="form_box">
          <p class="form_box_title">欢迎进入后台管理系统</p>
          <el-form ref="loginFormRef"
                   label-width="0px"
                   :model="form"
                   :rules="loginFormRules">
            <!-- 手机号 -->
            <el-form-item prop="phone">
              <el-input prefix-icon="el-icon-user"
                        v-model="form.phone"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input prefix-icon="el-icon-lock"
                        v-model="form.password"
                        type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="login-btns">
              <el-button type="info"
                         @click="resetForm">重置</el-button>
              <el-button type="primary"
                         @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义表单校验
    var validatePhone = (rule, value, callback) => {
      if (!value) return callback(new Error('请输您的手机号'))
      if (isNaN(value)) return callback(new Error('请输入正确的手机格式'))
      if (value.length != 11)
        return callback(new Error('正确的手机长度应该为11位'))
      callback()
    }
    var validatePass = (rule, value, callback) => {
      if (!value) return callback(new Error('请输您的密码'))
      if (value.length < 6 || value.length >= 14)
        return callback(new Error('密码的长度应该在6到14位之间'))
      callback()
    }

    return {
      // 登录表单
      form: {
        phone: '13431709114',
        password: '3479082...',
        name: 'admin',
      },
      // 登录表单校验规则
      loginFormRules: {
        phone: [
          {
            validate: validatePhone,
            trigger: 'blur',
          },
        ],
        password: [
          {
            validate: validatePass,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 重置表单数据
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    //  登录
    login() {
      // 打开提示
      const message = this.$message({
        showClose: false,
        message: '正在登陆中...请稍等',
        duration: 0,
      })

      // 判断表单数据是否符合校验规则
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 发送请求
        const { data: res } = await this.$http.post('/tabUser/login', this.form)
        // 关闭提示
        message.close()
        // 登录失败
        if (!res.success) return this.$message.error(res.message)
        // 登录成功
        this.$message.success(res.message)
        // 记录token
        window.sessionStorage.setItem('adminToken', res.data.user.id)
        // 路由跳转
        this.$router.push('/Aindex')
      })
    },
  },
}
</script>
<style lang="less" scope>
.my-login-box {
  height: 100%;
  background-image: url('../assets/bg_logo.png');
  background-size: cover;
  .el-row {
    .el-col {
      .form_box {
        margin-top: 20%;
        .form_box_title {
          text-align: center;
          background: #fff;
          border-radius: 5px;
          padding: 5px 0;
        }
        .el-form {
          .el-form-item {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>