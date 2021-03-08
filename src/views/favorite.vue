<template>
  <!-- 首页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="16">
        <!-- 主体内容 -->
       <div>
         fav
       </div>
      </el-col>
      <el-col :span="6" class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold">{{ userName }},你好</span>
          </div>
          <ul>
            <li>我的文章</li>
            <li>我的推荐</li>
            <li>我的收藏</li>
            <li>
              <a href="/history"> 浏览记录</a>
            </li>
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
 
  },
  methods: {
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


</style>