<template>
  <el-main>
    <el-card>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user' }"
          >个人中心</el-breadcrumb-item
        >
        <el-breadcrumb-item>我的信息</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 顶部分割线 -->
      <el-divider></el-divider>
      <div style="height: 740px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="账号昵称" style="width: 40%" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="qq" style="width: 40%" prop="qq">
            <el-input v-model="form.qq"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" style="width: 40%" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="微信" style="width: 40%" prop="wechat">
            <el-input v-model="form.wechat"></el-input>
          </el-form-item>
          <el-form-item label="手机号" style="width: 40%" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="年龄" style="width: 40%" prop="age">
            <el-input v-model.number="form.age"></el-input>
          </el-form-item>
          <el-form-item label="身高" style="width: 40%" prop="height">
            <el-input v-model.number="form.height"></el-input>
          </el-form-item>

          <el-form-item label="性别" style="width: 100%" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="true">男</el-radio>
              <el-radio :label="false">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item style="width: 100%">
            <el-button type="primary" @click="getUser">重置</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </el-main>
</template>
<script>
export default {
  created: function () {
    // 获取登陆的用户信息
    const token = window.sessionStorage.getItem("token");
    if (token != null) {
      this.userId = token;
      // 发起请求
      this.getUser();
    } else {
      this.$message.error("用户登录信息已过期，请重新登录");
      this.userId = 0;
    }
  },
  data() {
    return {
      userId: 0,
      form: {
        id: "",
        name: "",
        qq: "",
        email: "",
        wechat: "",
        sex: "",
        phone: "",
        age: "",
        height: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        qq: [
          { min: 4, max: 12, message: "请输入正确的qq号码", trigger: "blur" },
        ],
        email: [
          { min: 5, max: 20, message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
        wechat: "",
        sex: "",
        phone: [
          {
            required: true,
            message: "手机号是注册和找回密码的重要途径，不能为空",
            trigger: "blur",
          },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" },
        ],
        age: [{ type: "number", message: "年龄必须为数字值" }],
        height: [{ type: "number", message: "身高必须为数字值,单位cm" }],
      },
    };
  },
  methods: {
    // 获取用户的信息
    async getUser() {
      const { data: res } = await this.$http.get("/tabUser/getUser", {
        params: { userId: this.userId },
      });
      if (!res.success) {
        return this.$message.error(res.message);
      }
      this.form = res.data.user;
    },

    // 提交表单
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请确认表单信息是否符合规范");
          return;
        }
        const { data: res } = await this.$http.post(
          "/tabUser/updateUser",
          this.form
        );
        if (!res.success) {
          return this.$message.error(res.message);
        }
        return this.$message.success(res.message);
      });
    },
  },
};
</script>
<style lang="less" scoped>
</style>