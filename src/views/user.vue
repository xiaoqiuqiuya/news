<template>
  <!-- 首页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="16">
        <!-- 主体内容 -->
        <router-view></router-view>
      </el-col>
      <el-col :span="6" class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold">{{ userName }},你好</span>
          </div>
          <ul class="my_ul">
            <li>
              <i class="el-icon-bell"></i>
              <a href="/user/notifications">我的通知</a>
            </li>
            <li>
              <i class="el-icon-reading"></i>
              我的投稿</li>
            <li>我的推荐</li>
            <li>
              <i class="el-icon-collection-tag"></i>
              <a href="/user/favorite">我的收藏</a>
            </li>
            <li>
              <a href="/user/history"> 浏览记录</a>
            </li>
          </ul>
          <!-- 分割线 -->
          <el-divider>账号设置</el-divider>

          <ul class="my_ul">
            <li><i class="el-icon-s-check"></i>修改个人信息</li>
            <li><i class="el-icon-setting"></i>账号安全</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: 0,
      traceList: [],
      current: 1, // 当前页
      size: 10, // 每页最大显示数
      total: 0, // 总条数
      userName: "",
    };
  },
  created: async function () {
    // 获取登陆的用户
    const token = window.sessionStorage.getItem("token");
    if (token == null) {
      this.$message.error("登陆信息已过期，请重新登录");
    }
    this.userId = token;
    // 获取用户的信息
    const { data: userRes } = await this.$http.get("/tabUser/getUserName", {
      params: { userId: this.userId },
    });
    if (!userRes.success) {
      this.$message.error(userRes.message);
    }
    this.userName = userRes.data.userName;

    //获取动态
    this.getTrace();

    // 获取总数
    this.getTotal();
  },
  methods: {
    async getTotal() {
      const { data: totalRes } = await this.$http.get("/trace/getTraceTotal", {
        params: { userId: this.userId },
      });
      if (!totalRes.success) {
        this.$message.error(totalRes.message);
      }
      this.total = totalRes.data.total;
    },

    // 获取动态
    async getTrace() {
      // 发送请求，获取动态
      const { data: res } = await this.$http.get("/trace/getTrace", {
        params: { userId: this.userId, current: this.current, size: this.size },
      });
      if (!res.success) {
        this.$message.error(res.$message);
      }
      this.traceList = res.data.traceList;
    },

    // 处理分页
    handleCurrentChange(current) {
      this.current = current;
    },
    // 确认删除
    async doDel(traceId) {
      const { data: res } = await this.$http.delete("/trace/delTrace", {
        params: { traceId: traceId },
      });
      if (!res.success) {
        this.$message.error(res.message);
      } else {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      }
      // 刷新页面
      this.getTrace();
      // 获取总数
      this.getTotal();
    },
    // 删除动态
    checkDel(traceId) {
      this.$confirm("此操作将删除该条动态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认删除
          this.doDel(traceId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getNew(id) {
      this.$router.push("/newsItem?id=" + id);
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 80%;
  height: 100%;
  padding: 0 10%;
}
.el-row {
  width: 100%;
  height: 100%;
  .el-col {
    height: 100%;
  }
}
.top {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  .page_name {
    display: inline;
  }
  .icon_trace {
    font-size: 3rem;
  }
}
.content {
  margin-top: 20px;
}

.trace_title {
  font-size: 1.4rem;
  font-weight: bold;
}
.del_item {
  cursor: pointer;
}

.news_title {
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}
.news_title:hover {
  cursor: pointer;
}
.author {
  font-size: 0.8rem;
  float: right;
  font-weight: bold;
  cursor: pointer;
}
.author:hover {
  color: #00965e;
}

.floor {
  float: right;
}
.comment {
  cursor: pointer;
}
.board {
  cursor: pointer;
}
.my_ul {
  list-style: none;
}
</style>