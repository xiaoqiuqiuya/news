<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
      </div>
      <el-menu mode="horizontal">
        <el-menu-item index="0"></el-menu-item>
        <el-menu-item index="1">
          <a href="/index">首页</a>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">新闻热榜</template>
          <el-menu-item index="2-1">周榜</el-menu-item>
          <el-menu-item index="2-2">月榜</el-menu-item>
          <el-menu-item index="2-3">年度大事件</el-menu-item>
        </el-submenu>
        <el-menu-item index="3">
          <a href="/messageBoard">留言板</a>
        </el-menu-item>
        <el-menu-item index="4">
          <a href="/publish">发布</a>
        </el-menu-item>
        <el-menu-item>
          <a href="/timeLine">进度条</a>
        </el-menu-item>
        <el-menu-item index="6">
          <a href="/user">个人中心</a>
        </el-menu-item>
        <el-menu-item index="7">
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
  background-color: #ffffff;
  padding-top: 0;
}
</style>

<script>
export default {
  created: function () {
    const token = window.sessionStorage.getItem("token");
    if (token != null) {
      this.userId = token;
    } else {
      this.userId = 0;
    }
  },
  data() {
    return {
      data: {
        userId: 0,
      },
    };
  },
  mounted() {
    // WebSocket
    if ("WebSocket" in window) {
      this.websocket = new WebSocket(
        "ws://localhost:8889/websocket/" + this.userId
      );
      this.initWebSocket();
    } else {
      this.$message.error("当前留言浏览器尚未支持socket，建议更换浏览器后尝试");
    }
  },
  beforeDestroy() {
    this.onbeforeunload();
  },
  methods: {
    //   退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    initWebSocket() {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage;
      // 连接成功
      this.websocket.onopen = this.setOnopenMessage;
      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage;
      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage;
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload;
    },
    setErrorMessage() {
      console.log(
        "WebSocket连接发生错误   状态码：" + this.websocket.readyState
      );
    },
    setOnopenMessage() {
      console.log("WebSocket连接成功    状态码：" + this.websocket.readyState);
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理
      console.log("服务端返回：" + event.data);
    },
    setOncloseMessage() {
      console.log("WebSocket连接关闭    状态码：" + this.websocket.readyState);
    },
    onbeforeunload() {
      this.closeWebSocket();
    },
    closeWebSocket() {
      this.websocket.close();
    },
  },
};
</script>
