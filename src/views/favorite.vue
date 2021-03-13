<template>
  <!-- 首页 -->
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/user' }">个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>我的收藏</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 顶部分割线 -->
    <el-divider></el-divider>
    <el-tabs tab-position="left">
      <el-tab-pane :label="item.name+'('+item.list.length+')'" v-for="item in favList" :key="item.id">
        <el-card
          v-for="news in item.list"
          :key="news.id"
          class="news_item"
          v-loading="favLoading"
        >
          <p>
            <span class="news_title">{{ news.title }} </span>

            <el-dropdown style="float: right" trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-delete news_remove_fav"
                  >移出
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span @click="removeFav(item.id, news.id)"
                    >移出当前收藏夹</span
                  >
                </el-dropdown-item>
                <el-dropdown-item icon="el-icon-delete">
                  <span @click="removeFav(0, news.id)"> 移出所有收藏夹 </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
          <span class="news_info">
            <span class="news_info_author">{{ news.authorName }}</span
            >|
            <span class="news_info_time">{{
              $moment(news.gmtCreate).format("YYYY-MM-DD HH:mm")
            }}</span>
            <span class="news_info_tags">
              <span v-for="tag in news.tagsList" :key="tag.id"
                >{{ tag.name }} /
              </span>
            </span>
          </span>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userId: 0,
      favList: [],
      current: 1, // 当前页
      size: 5, // 每页最大显示数
      total: 0, // 总条数
      favDir: 0, // 收藏夹的id
      favLoading: true,
    };
  },
  created: async function () {
    // 获取登陆的用户
    const token = window.sessionStorage.getItem("token");
    if (token != null) {
      this.userId = token;
    } else {
      this.userId = 0;
    }

    // 初始化收藏夹列表
    this.getFav();
  },
  methods: {
    //
    getId(id) {
      console.log(id);
    },
    //判断登录状态
    getLoginStatus() {
      if (this.userId == 0) {
        this.$message.error("登陆信息已过期，请重新登录");
        return false;
      }
      return true;
    },

    // const {data:res} = await this.$http.get("");
    // 获取用户的收藏夹
    async getFav() {
      if (this.getLoginStatus) {
        const { data: res } = await this.$http.get("/favouriteNews/getFav", {
          params: {
            favDir: this.favDir,
            userId: this.userId,
            current: this.current,
            size: this.size,
          },
        });
        if (!res.success) {
          this.$message.error(res.message);
        }
        this.favList = res.data.favList;
        console.log(this.favList);
        this.favLoading = false;
      }
    },
    // 获取总数
    async getFavTotal() {
      if (this.getLoginStatus) {
      }
    },
    //处理分页
    handelCurrentChange(current) {
      this.current = current;
      this.getFav();
    },
    // 移除收藏,移出当前收藏夹
    async removeFav(favDirId, newsId) {
      if (this.getLoginStatus) {
        const { data: res } = await this.$http.delete(
          "/favouriteNews/removeFav",
          {
            params: {
              userId: this.userId,
              newsId: newsId,
              dirId: favDirId,
            },
          }
        );

        if (!res.success) {
          this.$message.error(res.message);
        }
        this.$message.success(res.message)
        // 刷新页面数据
        this.getFav();
      }
    },
    // 确认移除收藏
    async doRemove() {
      if (this.getLoginStatus) {
      }
    },
  },
};
</script>
<style lang="less" scoped>
.news_title {
  cursor: pointer;
  font-weight: bold;
  font-size: 1.3rem;
}
.news_title:hover {
  color: #00965e;
}

.news_remove_fav {
  cursor: pointer;
}
.news_remove_fav:hover {
  color: #00965e;
}

.news_info {
  font-size: 0.8rem;
}
.news_info_author {
  cursor: pointer;
  margin-right: 3px;
}
.news_info_author:hover {
  color: #00965e;
}
.news_info_time {
  margin-left: 3px;
}
.news_info_tags {
  float: right;
}
.news_item {
  margin-bottom: 20px;
}
</style>