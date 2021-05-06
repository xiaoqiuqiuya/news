<template>
  <!-- 首页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2"
              :span="16">
        <!-- 新闻列表 -->
        <div class="news_list">
          <div class="news_item"
               v-for="item in newsList"
               :key="item.id">
            <!-- 标题 -->
            <div class="news_top">
              <h1 v-html="item.title"
                  @click="getNew(item.id)"
                  class="news_title"></h1>
            </div>
            <!-- 内容 -->
            <div class="news_content">
              <!-- <p v-html="item.content"></p> -->
            </div>
            <!-- 相关信息 -->
            <div class="news_info">
              <!-- 作者名字 -->
              <span v-html="item.authorName"
                    class="info_authorname"></span>
              |
              <!-- 发布时间 -->
              <span class="info_time">{{ $moment(item.gmtCreate).format("YYYY-MM-DD") }}
              </span>
              <span>--{{ item.likeNum }}点赞 --{{ item.viewNum }}浏览</span>

              <!-- 标签 -->
              <p style="text-align: right">
                <el-button :type="tags.id == selectTag ? 'success' : ''"
                           size="mini"
                           v-for="tags in item.tagsList"
                           :key="tags.id"
                           @click="reloadCurrent(),tags.id == selectTag ? getNewsList(0):getNewsList(tags.id) ">{{ tags.name }}</el-button>
              </p>
            </div>
            <!-- 底部分割线 -->
            <el-divider></el-divider>
          </div>
          <!-- 分页 -->
          <el-pagination :page-size="size"
                         layout="prev, pager, next"
                         :total="total"
                         @current-change="handleChange">
          </el-pagination>
          <el-button v-if="selectTag!=0"
                     type="info"
                     size="mini"
                     @click="getNewsList(0)">清除标签选中</el-button>

        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>推荐阅读</span>
          </div>
          <!-- 推荐列表 -->
          <p v-for="item in recommendList"
             :key="item.id"
             class="recomentList-item"
             v-loading="loading"
             @click="getNew(item.id)">
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
    this.getNewsList(0)
    this.getRecommend()
  },
  data() {
    return {
      recommendList: [],
      current: 1, //当前页
      size: 5, //默认每页显示数
      newsList: [], //新闻列表
      total: 0, // 总数
      selectTag: 0, // 选择的标签
      loading: true,
    }
  },
  methods: {
    // 获取新闻详情
    getNew(id) {
      //  const routeDate = this.$router.push('/newsItem?id=' + id)
      // 打开一个新的标签页
      const routeDate = this.$router.resolve({
        path: '/newsItem',
        query: { id: id },
      })
      window.open(routeDate.href, '_blank')
    },
    //处理分页
    async handleChange(current) {
      this.current = current
      this.getNewsList(this.selectTag)
    },
    //点击标签，当前页为第一页
    reloadCurrent() {
      this.current = 1
    },
    // 请求新闻列表
    async getNewsList(tagID) {
      this.selectTag = tagID
      const { data: res } = await this.$http.get('/tabNews/getList', {
        params: {
          current: this.current,
          size: this.size,
          tagId: this.selectTag,
          title: '',
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.newsList = res.data.newsList
      this.newsList.forEach((item) => {
        if (item.title.length > 40) {
          item.title = item.title.substring(0, 40) + '...'
        }
      })
      this.total = res.data.total
    },
    // 请求推荐列表
    async getRecommend() {
      const { data: res } = await this.$http.get('/tabNews/reco')
      this.recommendList = res.data.recommendList
      this.loading = false
    },
  },
}
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
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ebeef5;
  .news_item {
    // padding-bottom: 20px;
    .news_top {
      .news_title {
        cursor: pointer;
      }
      .news_title:hover {
        color: #00965e;
      }
    }
    .news_content {
      text-indent: 2rem;
    }
    .news_info {
      p {
        margin-top: 10px;
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
    }
  }
}
.el-pagination {
  display: inline-block;
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