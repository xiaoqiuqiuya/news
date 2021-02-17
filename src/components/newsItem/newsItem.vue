<template>
  <!-- 新闻详情页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="22">
        <!-- 主题内容 -->
        <el-card class="news_list">
          <!-- 作者信息 -->
          <span v-html="news.authorName"></span>
          <!-- 标题 -->
          <h1 v-html="news.title" class="title"></h1>
          <!-- 文章信息 -->
          <span>
            <!-- 标签 -->
            <span class="tags" v-for="item in news.tagsList" :key="item.id"
              >{{ item.name }}
              <!-- 发布时间 -->
            </span>
            发布于{{ news.createTime }}
          </span>
          <!-- 内容 -->
          <p v-html="news.content"></p>
          <!-- 分界线 -->
          <el-divider></el-divider>
          <div class="like_box">
            <el-button
              class="btn_like_news2"
              v-if="islike"
              @click="likeNews(news.id)"
            >
              已赞
              {{ news.likeNum }}
            </el-button>

            <el-button class="btn_like_news" v-else @click="likeNews(news.id)">
              <i class="el-icon-star-off"></i>
              {{ news.likeNum }}
            </el-button>
          </div>
          <!-- 评论输入框 -->
          <el-input
            placeholder="请输入内容"
            v-model="c_content"
            class="comment_input"
            maxlength="50"
            show-word-limit
          >
            <el-button
              slot="append"
              icon="el-icon-position"
              @click="postComment"
            ></el-button>
          </el-input>
          <!-- 评论信息 -->
          <div
            class="comment_box"
            v-for="(item, index) in commentList"
            :key="item.id"
          >
            <div>
              <span class="c-name">{{ item.userName }}</span>
            </div>
            <div>
              <span class="c-content">{{ item.content }}</span>
            </div>
            <!-- 相关信息 -->
            <div>
              <span class="c-info">
                {{ item.createTime }}
                <i
                  :class="
                    item.status
                      ? 'el-icon-circle-check  isLikeComment'
                      : 'el-icon-circle-check'
                  "
                  v-text="item.likeNum"
                  @click="likeComment(item.id, index)"
                ></i>
                <span class="btn-reply" @click="showOrHidden(index)"
                  >{{ item.replyNum }}回复</span
                ></span
              >
            </div>
            <!-- 回复 -->
            <div
              v-for="reply in item.replies"
              :key="reply.id"
              class="reply_list"
            >
              <div>
                <span class="r-name">{{ reply.userName }}</span>
                <span class="r-content">{{ reply.content }}</span>
              </div>
              <div class="r-info">
                <span class="r-info-time">{{ reply.createTime }}</span>
                <span class="r-info-like" @click="likeReply(reply.id, index)"
                  >{{ reply.likeNum }} <span v-if="reply.status">已赞</span>
                  <span v-else>赞</span>
                </span>
              </div>
            </div>

            <!-- 回复框 -->
            <div
              :id="'comment_box_' + index"
              style="display: none"
              class="reply_box"
            >
              <el-input
                placeholder="请输入内容"
                v-model="replyContent"
                class="reply_input"
                maxlength="50"
                show-word-limit
              >
                <el-button
                  slot="append"
                  icon="el-icon-position"
                  @click="postReply(item.id)"
                ></el-button>
              </el-input>
            </div>

            <!-- 分界线 -->
            <el-divider></el-divider>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  created: async function () {
    //获取用户的id
    const userId = window.sessionStorage.getItem("token");
    this.userId = userId;

    // 获取地址栏中文章id
    const id = this.$route.query.id;
    // 更新文章id
    this.newsId = id;
    // 请求新闻详细内容
    const { data: res } = await this.$http.get("/tabNews/selectOne?id=" + id);
    if (!res.success) return this.$message.error(res.message);
    this.news = res.data.tabNews;

    // 获取评论信息
    this.getComment(id);

    // 获取文章的点赞状态
    const { data: likeStatus } = await this.$http.get(
      "/tabNewsThumbs/getStatus?newsId=" + this.newsId + "&userId=" + userId
    );
    this.islike = likeStatus.data.status;
    // 增加浏览量
    const { data: viewres } = await this.$http.post("/viewHistory/view", {
      userId: this.userId,
      newsId: this.newsId,
    });
    if (!viewres.success) return this.$message.error(viewres.message);
  },
  data() {
    return {
      news: {}, //新闻对象
      c_content: "", //评论输入框的内容
      newsId: "", //文章id
      commentList: [], //获取评论列表
      islike: false, // 文章的点赞状态
      userId: 0,
      activeCommentInput: 0, //激活的评论输入框
      replyContent: "", //回复的内容
    };
  },
  methods: {
    // 获取最新评论
    async getComment(id) {
      //获取评论列表
      const { data: cres } = await this.$http.get(
        "/tabComment/getComment?id=" + id
      );
      if (!cres.success) return this.$message.error(cres.message);
      this.commentList = cres.data.commentList;
      console.log(cres);
    },
    // 发布评论
    async postComment() {
      const token = window.sessionStorage.getItem("token");
      if (!token) return this.$message.error("登陆信息已过期，请重新登录");
      // 构造评论对象
      const tabComment = {
        newsId: this.newsId,
        userId: token,
        content: this.c_content,
      };
      const { data: res } = await this.$http.post(
        "/tabComment/postComment",
        tabComment
      );
      if (!res.success) return this.$message.error(res.message);
      // 获取最新评论信息
      this.getComment(this.newsId);
    },
    // 点赞评论
    async likeComment(commnetId, index) {
      const token = window.sessionStorage.getItem("token");
      if (!token) this.$message.error("登录信息已过期，请重新登录");
      const { data: res } = await this.$http.post(
        "/tabComment/likeComment?commentId=" + commnetId + "&userId=" + token
      );
      if (!res.success) return this.$message.error(res.message);
      // 更新点赞状态
      this.commentList[index].status = !this.commentList[index].status;
      // 修改点赞数量
      if (this.commentList[index].status) {
        this.commentList[index].likeNum += 1;
      } else {
        this.commentList[index].likeNum -= 1;
      }
    },
    // 点赞文章
    async likeNews(newsId) {
      if (this.userId == 0)
        return this.$message.error("登录信息已过期，请重新登陆");
      const { data: res } = await this.$http.post(
        "/tabNewsThumbs/likeNews?newsId=" + newsId + "&userId=" + this.userId
      );
      if (!res.success) return this.$message.error(res.message);
      this.islike = !this.islike;
      if (this.islike) {
        this.news.likeNum = this.news.likeNum + 1;
      } else {
        this.news.likeNum = this.news.likeNum - 1;
      }
    },
    // 显示或者隐藏回复输入框
    showOrHidden(index) {
      // 关闭上次打开的输入框
      const last = document.getElementById(
        "comment_box_" + this.activeCommentInput
      );
      last.setAttribute("style", "display:none");
      this.activeCommentInput = index;
      // 显示本次回复的输入框
      const ele = document.getElementById("comment_box_" + index);
      ele.setAttribute("style", "display:block");
    },
    // 发表回复
    async postReply(commentId) {
      // 判断登录状态
      const token = window.sessionStorage.getItem("token");
      if (!token) return this.$message.error("登陆信息已过期，请重新登录");
      // 发布网络请求
      const { data: res } = await this.$http.post("/tabReply/postReply", {
        userId: this.userId,
        commentId: commentId,
        content: this.replyContent,
      });
      if (!res.success) return this.$message.error(res.message);
      // 刷新评论区
      this.getComment(this.newsId);
    },
    // 点赞回复
    async likeReply(replyId, index) {
      if (this.userId == 0) {
        return this.$message.error("登录信息已过期，请重新登陆");
      }
      const { data: res } = await this.$http.post("/tabReplyThumbs/likeReply?userId="+this.userId+"&replyId="+replyId);
      if (!res.success) {
        return this.$message.error(res.message);
      }
      // 刷新评论区
     this.getComment(this.newsId);
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
.title {
  text-align: center;
}
.tags {
  color: #00965e;
  background-color: #e5f4ef;

  margin: 0 5px;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0 0.375rem;
  line-height: 1.5rem;
  border-radius: 0.1875rem;
}
.tags:hover {
  background: #cceadf;
  color: #00965e;
}
.comment_input {
  width: 80%;
  margin: 0 10%;
}
.comment_box {
  width: 80%;
  margin: 20px 10%;
  .c-name {
    font-weight: bold;
  }
  .c-content {
    text-indent: 2em;
    display: inline-block;
    margin: 5px 2px;
  }
  .c-info {
    display: inline-block;
    font-size: 12px;
    .el-icon-circle-check {
      cursor: pointer;
      margin: 0 0 0 5px;
    }
    .el-icon-circle-check:hover {
      color: #01aaed;
    }
    .isLikeComment {
      color: #01aaed;
    }
    .btn-reply {
      margin-left: 0.5em;
      cursor: pointer;
      padding: 5px 5px;
      border-radius: 3px;
    }
    .btn-reply:hover {
      color: #01aaed;
      background: #dddddd;
    }
  }
}
.like_box {
  width: 100%;
  text-align: center;
  margin: 20px 0;
  font-size: 50px;
  .btn_like_news {
    font-size: 30px;
  }
  .btn_like_news:hover {
    color: #ffffff;
    background: #00965e;
  }
  .btn_like_news2 {
    font-size: 30px;
    color: #ffffff;
    background: #ff5722;
  }
}
.reply_box {
  padding: 1%;
  padding-left: 2em;
}
.reply_list {
  padding-left: 2em;
  .r-name {
    font-weight: bold;
  }
  .r-content {
    padding-left: 0.5em;
  }
  .r-info {
    font-size: 12px;
    .r-info-like {
      margin: 0 10px;

      cursor: pointer;
    }
    .r-info-like:hover {
      color: #01aaed;
    }
  }
}
</style>