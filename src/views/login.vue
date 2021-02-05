<template>
  <div class="login-box">
    <div class="login">
      <!-- 头部区域 -->
      <div class="top">
        <!-- logo和名称 -->
        <div class="icon">
          <img src="../assets/logo.png" alt />
          <span>校园新闻</span>
        </div>
      </div>
      <!-- 内容主体 -->
      <div class="login-form">
        <el-tabs>
          <el-tab-pane label="登录">
            <el-form
              ref="loginFormRef"
              label-width="0px"
              :model="form"
              :rules="loginFormRules"
              class="demo-form-inline"
            >
              <!-- 手机号 -->
              <el-form-item prop="phone">
                <el-input prefix-icon="el-icon-user" v-model="form.phone"></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item prop="password">
                <el-input prefix-icon="el-icon-lock" v-model="form.password" type="password"></el-input>
              </el-form-item>
              <!-- 按钮区域 -->
              <el-form-item class="login-btns">
                <el-button type="info" @click="resetForm">重置</el-button>
                <el-button type="primary" @click="login">登录</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="快速注册">
            <el-form
              ref="registFromRef"
              label-width="0px"
              :model="registFrom"
              :rules="registFromRules"
            >
              <!-- 手机号 -->
              <el-form-item prop="phone">
                <el-input
                  prefix-icon="el-icon-user"
                  placeholder="请输入您的手机号"
                  v-model="registFrom.phone"
                ></el-input>
              </el-form-item>
              <!-- 密码 -->
              <el-form-item prop="password">
                <el-input
                  prefix-icon="el-icon-lock"
                  placeholder="请输入您的密码"
                  v-model="registFrom.password"
                  type="password"
                ></el-input>
              </el-form-item>
              <!-- 确认密码 -->
              <el-form-item prop="confirm">
                <el-input
                  prefix-icon="el-icon-lock"
                  placeholder="请再次输入您的密码"
                  v-model="registFrom.confirm"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="regist" @click="regist">注册</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义表单校验
    var validatePhone = (rule, value, callback) => {
      if (!value) return callback(new Error("请输您的手机号"));
      if (isNaN(value)) return callback(new Error("请输入正确的手机格式"));
      if (value.length != 11)
        return callback(new Error("正确的手机长度应该为11位"));
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (!value) return callback(new Error("请输您的密码"));
      if (value.length < 6 || value.length >= 14)
        return callback(new Error("密码的长度应该在6到14位之间"));
      callback();
    };

    var validateConfirm = (rule, value, callback) => {
      if (!value) return callback(new Error("请输再次确认您的密码"));
      if (value != this.registFrom.password)
        return callback(new Error("两次输入的密码不一致"));
      callback();
    };

    return {
      // 登录表单
      form: {
        phone: "13431709114",
        password: "3479082..."
      },
      // 注册表单
      registFrom: {
        phone: "",
        password: "",
        confirm: ""
      },

      // 登录表单校验规则
      loginFormRules: {
        phone: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在3到15个字符之间", trigger: "blur" }
        ]
      },
      // 注册表单校验规则
      registFromRules: {
        phone: [
          {
            validator: validatePhone,
            trigger: "change"
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "change"
          }
        ],
        confirm: [
          {
            validator: validateConfirm,
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    // 重置表单数据
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    //  登录
    login() {
      // 判断表单数据是否符合校验规则
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        // 发送请求
        const { data: res } = await this.$http.post(
          "/tabUser/login",
          this.form
        );
        // 登录失败
        if (!res.success) return this.$message.error(res.message);
        // 登录成功
        this.$message.success(res.message);
        // 记录token
        window.sessionStorage.setItem("token",res.data.user.id);
        // 路由跳转
        this.$router.push("/home");
      });
    },

    // 注册
    regist() {
      // 判断注册表单的数据是否符合规则
      this.$refs.registFromRef.validate(async valid => {
        // 不符合规则
        if (!valid) return;
        // 发送请求
        const { data: res } = await this.$http.post(
          "/tabUser/regist",
          this.registFrom
        );
        // 请求失败
        if (!res.success) return this.$message.error(res.message);
        // 注册成功，弹框提示
        this.$message.success(res.message);
        // 自动登录
        this.form.phone = this.registFrom.phone;
        this.form.password = this.registFrom.password;
        this.login();
      });
    }
  }
};
</script>
<style lang="less" scope>
.login-box {
  height: 100%;
  background: #ffffff;
}
.login {
  box-shadow: 0 0 15px 1px #d2e1ee;
  border-radius: 16px;
  width: 396px;
  height: 540px;
  position: relative;
  left: 75%;
  top: 50%;
  transform: translate(-25%, -50%);
  .top {
    height: 100px;
    .icon {
      display: flex;
      align-items: center;
      position: relative;
      left: 75%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      img {
        width: 48px;
        height: 48px;
        margin-right: 10px;
      }
    }
  }

  .login-form {
    margin: 5% 10%;
    height: 60%;
    padding: 5% 11%;

    .login-btns {
      display: flex;
      justify-content: flex-end;
    }
  }
  .regist {
    width: 100%;
  }
}
</style>