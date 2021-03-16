<template>
  <!-- 首页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="16">
        <!-- 新闻列表 -->
        <el-card class="news_list">
          <!--新闻轮播-->
          <el-carousel
            :interval="4000"
            height="200px"
            indicator-position="outside"
          >
            <el-carousel-item
              v-for="item in topList"
              :key="item.id"
              @click="getNew(item.id)"
            >
              <div class="news_item">
                <!-- 标题 -->
                <div class="news_top">
                  <h2>{{ item.title }}</h2>
                </div>
                <!-- 内容 -->
                <div class="news_content" v-html="item.content"></div>
                <!-- 相关信息 -->
                <div class="news_info">{{ item.date }}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
          <!-- 一条新闻 -->
          <div class="news_item" v-for="item in newsList" :key="item.id">
            <!-- 标题 -->
            <div class="news_top">
              <h1
                v-html="item.title"
                @click="getNew(item.id)"
                class="news_title"
              ></h1>
            </div>
            <!-- 内容 -->
            <div class="news_content">
              <!-- <p v-html="item.content"></p> -->
            </div>
            <!-- 相关信息 -->
            <div class="news_info">
              <!-- 作者名字 -->
              <span v-html="item.authorName" class="info_authorname"></span>
              |
              <!-- 发布时间 -->
              <span class="info_time"
                >{{ $moment(item.gmtCreate).format("YYYY-MM-DD") }}
              </span>
              <span>--{{ item.likeNum }}点赞 --{{ item.viewNum }}浏览</span>

              <!-- 标签 -->
              <p style="text-align: right">
                <el-button
                  :type="tags.id == selectTag ? 'success' : ''"
                  size="mini"
                  v-for="tags in item.tagsList"
                  :key="tags.id"
                  @click="getNewsList(tags.id)"
                  >{{ tags.name }}</el-button
                >
              </p>
            </div>
            <!-- 底部分割线 -->
            <el-divider></el-divider>
          </div>
          <!-- 分页 -->
          <el-pagination
            :page-size="size"
            layout="prev, pager, next"
            :total="total"
            @current-change="handleChange"
          >
          </el-pagination>
        </el-card>
      </el-col>
      <!-- 右边 -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>推荐阅读</span>
          </div>
          <!-- 推荐列表 -->
          <p
            v-for="item in recommendList"
            :key="item.id"
            class="recomentList-item"
            v-loading="loading"
            @click="getNew(item.id)"
          >
            {{ item.title }}
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  created: async function () {
    // 获取总数
    this.getNewsList(0);
    this.getRecommend();
    this.getTopList();
  },
  data() {
    return {
      recommendList: [],
      current: 1, //当前页
      size: 5, //默认每页显示数
      newsList: [], //新闻列表
      total: 0, // 总数
      selectTag: 0, // 选择的标签
      topList: [], // 置顶推荐
      loading: true,
    };
  },
  methods: {
    // 获取新闻详情
    getNew(id) {
      this.$router.push("/newsItem?id=" + id);
    },
    //处理分页
    async handleChange(current) {
      this.current = current;
      this.getNewsList(this.selectTag);
    },
    // 请求新闻列表
    async getNewsList(tagID) {
      if(  this.selectTag == tagID){
        this.selectTag=0;
      }else{
        this.selectTag = tagID;
      }
      const { data: res } = await this.$http.get(
        "/tabNews/getList/" +
          this.current +
          "/" +
          this.size +
          "/" +
          this.selectTag
      );
      if (!res.success) {
        return this.$message.error(res.message);
      }
      this.newsList = res.data.newsList;
      this.newsList.forEach((item) => {
        if (item.title.length > 40) {
          item.title = item.title.substring(0, 40) + "...";
        }
      });
      this.total = res.data.total;
    },
    // 请求推荐列表
    async getRecommend() {
      const { data: res } = await this.$http.get("/tabNews/reco");
      this.recommendList = res.data.recommendList;
      this.loading = false;
    },
    // 获取置顶推荐
    async getTopList() {
      const { data: res } = await this.$http.get("/tabTop/topList");
      this.topList = res.data.topList;
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

.info_authorname {
  cursor: pointer;
  margin-right: 10px;
}
.info_authorname:hover {
  color: #00965e;
}
.info_time {
  margin-left: 10px;
  margin-right: 10px;
}
.news_title {
  cursor: pointer;
}
.news_title:hover {
  color: #00965e;
}
.recomentList-item {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 2px;
  cursor: pointer;
}
.recomentList-item:hover {
  color: #00965e;
  font-weight: bold;
}
.selectTag {
  background-color: red;
}
</style>