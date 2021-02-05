<template>
  <!-- 首页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="16">
        <!-- 主体内容 -->
        <el-card class="news_list">
          <el-form ref="loginFormRef" label-width="0px" :model="article" >
            <el-input  size="large" v-model="article.title">
              <template slot="prepend">请输入标题</template>
            </el-input>

            <el-form-item prop>
              <el-input type="textarea" :rows="10" v-model="article.content" ></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <!-- 右边 -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>推荐阅读</span>
          </div>
          <!-- 推荐列表 -->
          <div class="hot_list"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      article: {
        title: "",
        content: ""
      }
    };
  }
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
.news_list {
  height: 100%;
  background-color: #ffffff;
}
.news_item {
  padding-bottom: 20px;
  .news_content {
    text-indent: 2rem;
  }
}

.hot_list {
  padding: 0px !important;
  > li {
    list-style-type: none;
  }
}
.carouse_img {
  height: 200px;
}
</style>