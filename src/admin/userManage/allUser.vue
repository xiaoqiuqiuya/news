<template>
  <el-card>
    <div class="top_option">
      <div class="serarch_input">
        <el-input v-model="searchName"
                  placeholder="按名字搜索"
                  maxlength="30">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="getUser()"></el-button>
        </el-input>

      </div>
      <el-button class="btn_refresh"
                 type="primary"
                 @click="searchName='',getUser()">刷新</el-button>
      <el-button class="btn_add"
                 type="primary"
                 @click="handleEdit(0,{id:0})">添加用户</el-button>

    </div>
    <el-table :data="userList"
              border
              style="width: 100%"
              :row-class-name="tableRowClassName">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="gmtCreate"
                       label="注册日期"
                       width="150">
      </el-table-column>
      <el-table-column prop="name"
                       label="姓名"
                       width="120">
      </el-table-column>
      <el-table-column prop="email"
                       label="邮箱"
                       width="180">
      </el-table-column>
      <el-table-column prop="phone"
                       label="手机"
                       width="120">
      </el-table-column>
      <el-table-column prop="password"
                       label="密码"
                       width="120">
      </el-table-column>
      <el-table-column prop="qq"
                       label="QQ"
                       width="120">
      </el-table-column>
      <el-table-column prop="wechar"
                       label="微信"
                       width="120">
      </el-table-column>
      <el-table-column prop="sex"
                       label="性别"
                       width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.sex">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column prop="age"
                       label="年龄"
                       width="50">
      </el-table-column>
      <el-table-column prop="type"
                       label="账号类型"
                       width="105">
        <template slot-scope="scope">
          <el-button size="mini"
                     v-if="scope.row.type"
                     type="primary"
                     @click="handlechangeAttr(scope.row,'type')">管理员</el-button>
          <el-button size="mini"
                     v-else
                     type="success"
                     @click="handlechangeAttr(scope.row,'type')">普通用户</el-button>
        </template>

      </el-table-column>

      <el-table-column prop="height"
                       label="身高(cm)"
                       width="100">
      </el-table-column>
      <el-table-column prop="status"
                       label="状态"
                       width="100">
        <template slot-scope="scope">
          <el-button size="mini"
                     v-if="scope.row.status"
                     type="success"
                     @click="handlechangeAttr(scope.row,'status')">正常</el-button>
          <el-button size="mini"
                     v-else
                     type="danger"
                     @click="handlechangeAttr(scope.row,'status')">封禁中</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改信息对话框 -->
    <el-dialog :title="updateUser.id==0?'添加用户':'编辑用户信息'"
               :visible.sync="showEditInfo">
      <user-info-form id="updateUser"
                      v-bind:updateUser="updateUser"
                      v-on:updateStatus="getUpdateStatus">
        <template v-if="updateUser.id==0"
                  slot="password">
          <el-form-item label="密码"
                        prop="password">
            <el-input v-model="updateUser.password"></el-input>
          </el-form-item>
        </template>

      </user-info-form>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination layout="prev, pager, next"
                   :total="total"
                  @current-change="handelChange" >
    </el-pagination>
  </el-card>
</template>
<script>
import userInfoForm from '../../components/user/userInfoForm'

export default {
  created: function () {
    this.getUser()
  },
  data() {
    return {
      userList: [],
      current: 1,
      size: 10,
      total: 0,
      showEditInfo: false,
      searchName: '',
      updateUser: {}, //传递到组件中的用户
    }
  },
  methods: {
    // 修改成功后子组件向父组件发送信息，关闭对话框
    getUpdateStatus(flag) {
      if (flag) {
        this.showEditInfo = false
        this.getUser()
      }
    },
    //修改类型/状态
    async handlechangeAttr(row, attr) {
      var tips2 = ''
      if (attr == 'type') {
        tips2 = '的账号类型'
      }
      if (attr == 'status') {
        tips2 = '的账号状态'
      }
      var tips = '是否修改用户:' + row.name + tips2
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.post(
            '/tabUser/updateAttr/' + attr + '/' + row.id
          )
          if (!res.success) {
            return this.$message.error(res.message)
          }
          this.$message({
            type: 'success',
            message: '修改成功!',
          })
          this.getUser()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          })
        })
    },

    // 编辑/添加用户
    async handleEdit(index, row) {
      // 显示对话框
      this.showEditInfo = true
      // 赋值需要更新的用户
      this.updateUser = row
    },
    // 删除
    async handleDelete(index, row) {},
    //特殊行的样式
    tableRowClassName({ row, rowIndex }) {
      if (row.status == false) {
        return 'fail-row'
      } else {
        return ''
      }
    },
    //处理分页
    handelChange(current) {
      this.current = current
      this.getUser()
    },
    //获取用户
    async getUser() {
      const { data: res } = await this.$http.get('/tabUser/getAllUser', {
        params: {
          name: this.searchName,
          current: this.current,
          size: this.size,
          type: 0,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.userList = res.data.userList
    },
    //获取总数
    async getTotal() {
      const { data: res } = await this.$http.get('/tabUser/getTotal', {
        params: { searchName: this.searchName, type: 0 },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.total = res.data.total
    },
  },
  components: {
    userInfoForm: userInfoForm,
  },
}
</script>
<style scoped lang="less">
.el-table .fail-row {
  background: #fef0f0;
}
.el-card {
  .top_option {
    margin-bottom: 20px;
    border-left: 5px solid #67c23a;
    padding-left: 20px;
    .serarch_input {
      display: inline-block;
      width: 30%;
    }
    .btn_refresh {
      margin-left: 20px;
    }
    .btn_add {
      float: right;
    }
  }
}
</style>