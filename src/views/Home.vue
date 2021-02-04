<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
      </div>
      <el-menu mode="horizontal">
        <el-menu-item index="0"></el-menu-item>
        <el-menu-item index="1">首页</el-menu-item>
        <el-submenu index="2">
          <template slot="title">新闻热榜</template>
          <el-menu-item index="2-1">周榜</el-menu-item>
          <el-menu-item index="2-2">月榜</el-menu-item>
          <el-menu-item index="2-3">年度大事件</el-menu-item>
        </el-submenu>
        <el-menu-item index="3">通知</el-menu-item>
        <el-menu-item index="3">留言板</el-menu-item>
        <el-menu-item index="3">
          <el-button type="info" @click="logout">退出</el-button>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.el-container {
  width: 100%;
}
.el-header {
  border-bottom: 1px solid #e6e6e6;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 10%;
  padding-right: 10%;
  align-items: center;
  font-size: 20px;
  color: #ffffff;
  img {
    width: 48px;
    height: 48px;
  }

}
.el-main {
  background-color: #ffffff ;
  padding-top: 0 ;
}
</style>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    //   退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
