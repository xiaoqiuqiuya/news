<template>
  <el-main>
    <el-card>
      <!-- 面包屑导航栏 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user' }">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>账号安全</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 顶部分割线 -->
      <el-divider></el-divider>
      <div style="height: 740px">
        <p>
          最近登录
          <el-link class="update_password"
                   type="primary"
                   @click="centerDialogVisible = true">修改密码</el-link>
        </p>
        <div class="description">
          <p>
            <span>说明：</span>
          </p>
          <p>
            <span>1：移动端登录，由于运营商是随机分配IP，往往存在与实际登录地不符的情况</span>
            <span>2：若使用VPN或代理联网的，登录地无法准确记录</span>
            <span>3：部分网络代理商的服务，存在IP地址不稳定的问题</span>
          </p>
        </div>
        <!-- 修改密码框 -->
        <el-dialog title="修改密码"
                   :visible.sync="centerDialogVisible"
                   width="30%"
                   center
                   :close-on-click-modal="false">
          <el-form ref="form"
                   :model="form"
                   label-width="80px"
                   :rules="rules">
            <el-form-item label="原始密码"
                          prop="oldPass">
              <el-input v-model="form.oldPass"
                        type="password"
                        :show-password="true"></el-input>
            </el-form-item>
            <el-form-item label="新密码"
                          prop="newPass">
              <el-input v-model="form.newPass"
                        type="password"
                        :show-password="true"></el-input>
            </el-form-item>
            <el-form-item label="确认密码"
                          prop="confirmPass">
              <el-input v-model="form.confirmPass"
                        type="password"
                        :show-password="true"></el-input>
            </el-form-item>
          </el-form>

          <span slot="footer"
                class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="updatePassword">确 定</el-button>
          </span>
        </el-dialog>

        <div class="table_box">
          <el-table :data="userLogin"
                    stripe
                    style="width: 100%">
            <el-table-column type="index"
                             width="50"> </el-table-column>
            <el-table-column prop="gmtCreate"
                             label="日期"
                             width="280">
            </el-table-column>
            <el-table-column prop="ipAddr"
                             label="ip地址"> </el-table-column>
          </el-table>
        </div>

        <div class="page">
          <el-pagination :page-size="size"
                         layout="prev, pager, next"
                         :total="total"
                         @current-change="handleChange">
          </el-pagination>
        </div>
        <!-- 分页 -->
      </div>
    </el-card>
  </el-main>
</template>
<script>
export default {
  created: function () {
    // 获取登陆的用户信息
    const token = window.sessionStorage.getItem('token')
    if (token != null) {
      this.userId = token
      // 发起请求
      this.getUserLogin()
      this.getTotal()
    } else {
      this.$message.error('用户登录信息已过期，请重新登录')
      this.userId = 0
    }
  },
  data() {
    var validateNewPas = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.confirmPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var confirmPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value != this.form.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userId: 0,
      form: {
        oldPass: '',
        newPass: '',
        confirmPass: '',
      },
      rules: {
        oldPass: [
          {
            required: true,
            message: '请输入原密码',
            trigger: 'blur',
          },
        ],
        newPass: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur',
          },
          { validator: validateNewPas, trigger: 'change' },
        ],
        confirmPass: [
          {
            required: true,
            message: '请确认密码',
            trigger: 'blur',
          },
          { validator: confirmPass, trigger: 'change' },
        ],
      },
      userLogin: [],
      current: 1,
      size: 10,
      total: 0,
      centerDialogVisible: false,
    }
  },
  methods: {
    //获取总数
    async getTotal() {
      const { data: res } = await this.$http.get('/userLogin/getTotal', {
        params: { userId: this.userId },
      })
      if (!res.success) {
        this.$message.error(res.message)
      }
      this.total = res.data.total
    },
    // 处理分页
    handleChange(current) {
      this.current = current
      this.getUserLogin()
    },
    // 修改密码
    async updatePassword() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请完善表单信息')
          return
        }
        this.form.userId = this.userId
        // 发送请求
        const { data: res } = await this.$http.post(
          '/tabUser/updatePassword',
          this.form
        )
        if (!res.success) {
          return this.$message.error(res.message)
        }
        this.$message.success(res.message)
        this.centerDialogVisible = false
      })
    },
    // 获取登录记录
    async getUserLogin() {
      const { data: res } = await this.$http.get('/userLogin/getUserLogin', {
        params: { userId: this.userId, current: this.current, size: this.size },
      })
      if (!res.success) {
        this.$message.error(res.message)
      }

      this.userLogin = res.data.userLogin
      //时间格式化
      this.userLogin.forEach((item) => {
        item.gmtCreate = this.$moment(item.gmtCreate).format(
          'YYYY年MM月DD日 HH:mm'
        )
      })
    },
  },
}
</script>
<style lang="less" scoped>
.table_box {
  height: 530px;
}
.page {
  text-align: center;
}
.update_password {
  float: right;
}
.description {
  height: 70px;
  p {
    float: left;
    font-size: 12px;
  }
  span {
    display: block;
  }
}
</style>