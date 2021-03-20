<template>
  <div>
    <el-form ref="form"
             :model="updateUser"
             :rules="rules"
             inline
             label-width="80px">
      <el-form-item label="账号昵称"
                    prop="name">
        <el-input v-model="updateUser.name"></el-input>
      </el-form-item>
      <el-form-item label="qq"
                    prop="qq">
        <el-input v-model="updateUser.qq"></el-input>
      </el-form-item>
      <el-form-item label="邮箱"
                    prop="email">
        <el-input v-model="updateUser.email"></el-input>
      </el-form-item>
      <el-form-item label="微信"
                    prop="wechat">
        <el-input v-model="updateUser.wechat"></el-input>
      </el-form-item>
      <slot name="password"></slot>
      <el-form-item label="手机号"
                    prop="phone">
        <el-input v-model="updateUser.phone"></el-input>
      </el-form-item>
      <el-form-item label="年龄"
                    prop="age">
        <el-input v-model.number="updateUser.age"></el-input>
      </el-form-item>
      <el-form-item label="身高"
                    prop="height">
        <el-input v-model.number="updateUser.height"></el-input>
      </el-form-item>

      <el-form-item label="性别"
                    prop="sex">
        <el-radio-group v-model="updateUser.sex">
          <el-radio :label="true">男</el-radio>
          <el-radio :label="false">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary"
                   @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'userInfoForm',
  created: function () {},
  data() {
    return {
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 4,
            max: 20,
            message: '长度在 4 到 20 个字符',
            trigger: 'blur',
          },
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur',
          },
        ],
        qq: [
          { min: 4, max: 12, message: '请输入正确的qq号码', trigger: 'blur' },
        ],
        email: [
          { min: 5, max: 20, message: '请输入正确的邮箱格式', trigger: 'blur' },
        ],
        wechat: '',
        sex: '',
        phone: [
          {
            required: true,
            message: '手机号是注册和找回密码的重要途径，不能为空',
            trigger: 'blur',
          },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
        ],
        age: [{ type: 'number', message: '年龄必须为数字值' }],
        height: [{ type: 'number', message: '身高必须为数字值,单位cm' }],
      },
    }
  },
  methods: {
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请确认表单信息是否符合规范')
          return
        }
        delete this.updateUser.gmtCreate
        delete this.updateUser.gmtModified
        var path = ''
        if (this.updateUser.id == 0) {
          path = '/tabUser/updateUser/add'
        } else {
          path = '/tabUser/updateUser/update'
        }
        const { data: res } = await this.$http.post(
          path,
          this.updateUser
        )
        if (!res.success) {
          return this.$message.error(res.message)
        }
        // 向父组件发送信息
        this.$emit('updateStatus', true)
        return this.$message.success(res.message)
      })
    },
  },
  props: {
    updateUser: {
      type: Object,
      required: true,
    },
  },
}
</script>