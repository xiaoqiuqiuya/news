<template>
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/user' }">个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的投稿</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 顶部分割线 -->
    <el-divider></el-divider>
    <div style="height: 740px">
      <el-tabs tab-position="left"
               v-model="selectPane">
        <el-tab-pane name="4"
                     label="已通过审核">
          <checked-news></checked-news>
        </el-tab-pane>
        <el-tab-pane name="3"
                     label="已驳回">
          <back-news></back-news>
        </el-tab-pane>

        <el-tab-pane name="2"
                     label="审核中">
          <checking-news></checking-news>
        </el-tab-pane>
        <el-tab-pane name="1"
                     label="草稿">
          <draft></draft>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>

</template>

<script>
import checkedNews from '../components/contribute/checkedNews.vue'
import backNews from '../components/contribute/backNews.vue'
import checkingNews from '../components/contribute/checkingNews.vue'
import draft from '../components/contribute/draft.vue'
export default {
  components: {
    checkedNews,
    backNews,
    checkingNews,
    draft,
  },

  data() {
    return {
      selectPane: '4', // 默认打开的面板
    }
  },
  

}
</script>
<style lang="less" scoped>
.news_item {
  margin-bottom: 10px;
}
.refresh {
  width: 100%;
  padding: 0 0 5px 0;
  height: 30px;
  .btn_refresh {
    float: right;
  }
}
.news_title {
  cursor: pointer;
  font-weight: bold;
  font-size: 1.3rem;
}
.news_title:hover {
  color: #00965e;
}
.news_info {
  font-size: 0.8rem;
}
.news_info_time {
  margin-left: 3px;
}
.num_list {
  float: right;
}
.new_option_btn {
  float: right;
}
.news_item_title {
  padding: 8px;
}
</style>