<template>
 
      <el-card>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/user' }"
            >个人中心</el-breadcrumb-item
          >
          <el-breadcrumb-item>我的投稿</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 顶部分割线 -->
        <el-divider></el-divider>
        <div style="height: 740px">
          <el-tabs
            tab-position="left"
            @tab-click="handelPaneChange"
            v-model="selectPane"
          >
            <el-tab-pane name="4" label="已通过审核">
              <div class="refresh">
                <el-link
                  class="btn_refresh"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="refresh"
                  >刷新</el-link
                >
              </div>
              <div style="height: 660px">
                <el-divider v-if="total[3] == 0">暂时没有数据</el-divider>
                <el-card
                  v-else
                  v-for="item in checkedList"
                  :key="item.id"
                  class="news_item"
                >
                  <p>
                    <span class="news_title">{{ item.title }}</span>
                    <span class="new_option_btn">
                      <el-link type="primary" @click="modifiedNew(item.id)"
                        >修改</el-link
                      >/
                      <el-link type="danger" @click="delNew(item.id)"
                        >删除</el-link
                      >
                    </span>
                  </p>
                  <span class="news_info">
                    <span class="news_info_time"
                      >发布于：{{
                        $moment(item.gmtCreate).format("YYYY-MM-DD HH:mm")
                      }}</span
                    >
                  </span>
                  <span class="num_list">
                    <span class="iconfont">&#xe63b;</span>点赞({{
                      item.likeNum
                    }}) <i class="el-icon-view"></i>浏览{{ item.viewNum }}
                  </span>
                </el-card>
              </div>

              <!-- 分页 -->
              <el-pagination
                :page-size="size[3]"
                layout="prev, pager, next"
                :total="total[3]"
                @current-change="handlecheckedListChange"
              >
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane name="3" label="已驳回">
              <div class="refresh">
                <el-link
                  class="btn_refresh"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="refresh"
                  >刷新</el-link
                >
              </div>
              <div style="height: 660px">
                <el-divider v-if="total[2] == 0"
                  >暂时没有数据</el-divider
                >
                <el-card v-else v-for="item in rejectList" :key="item.id"  class="news_item">
                  <div class="news_item_title">
                    <span class="news_title">{{ item.title }}</span>
                    <span class="new_option_btn">
                      <el-link type="primary" @click="modifiedNew(item.id)"
                        >修改</el-link
                      >/
                      <el-link type="danger" @click="delNew(item.id)"
                        >删除</el-link
                      >
                    </span>
                    </div>
                  <el-alert
                    title="不可关闭的 alert"
                    type="error"
                    :closable="false"
                  >
                  </el-alert>
                </el-card>
              </div>
              <!-- 分页 -->
              <el-pagination
                :page-size="size[2]"
                layout="prev, pager, next"
                :total="total[2]"
                @current-change="handlerejectListChange"
              >
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane name="2" label="审核中">
              <div class="refresh">
                <el-link
                  class="btn_refresh"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="refresh"
                  >刷新</el-link
                >
              </div>
              <div style="height: 660px">
                <el-divider v-if="total[1] == 0">暂时没有数据</el-divider>
                <el-card
                  v-else
                  v-for="item in checkingList"
                  :key="item.id"
                  class="news_item"
                >
                  {{ item.title }}
                </el-card>
              </div>

              <!-- 分页 -->
              <el-pagination
                :page-size="size[1]"
                layout="prev, pager, next"
                :total="total[1]"
                @current-change="handlecheckingListChange"
              >
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane name="1" label="草稿">
              <div class="refresh">
                <el-link
                  class="btn_refresh"
                  type="primary"
                  icon="el-icon-refresh"
                  @click="refresh"
                  >刷新</el-link
                >
              </div>
              <div style="height: 660px">
                <el-divider v-if="total[0] == 0">暂时没有数据</el-divider>
                <el-card
                  v-else
                  v-for="item in draftList"
                  :key="item.id"
                  class="news_item"
                >
                  <p>
                    <span class="news_title">{{ item.title }}</span>
                    <span class="new_option_btn">
                      <el-link type="primary" @click="modifiedNew(item.id)"
                        >修改</el-link
                      >/
                      <el-link type="danger" @click="delNew(item.id)"
                        >删除</el-link
                      >
                    </span>
                  </p>
                  <span class="news_info">
                    <span class="news_info_time"
                      >创建于：{{
                        $moment(item.gmtCreate).format("YYYY-MM-DD HH:mm")
                      }}
                      最后一次修改：{{
                        $moment(item.gmtUpdate).format("YYYY-MM-DD HH:mm")
                      }}
                    </span>
                  </span>
                </el-card>
              </div>
              <!-- 分页 -->
              <el-pagination
                :page-size="size[0]"
                layout="prev, pager, next"
                :total="total[0]"
                @current-change="handledraftListChange"
              >
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>

</template>

<script>
export default {
  data() {
    return {
      selectPane: "4", // 默认打开的面板
      userId: 0,
      checkedList: [],
      checkingList: [],
      rejectList: [],
      draftList: [],
      gotList: [0, 0, 0, 0], //用于控制是否发起网络请求
      total: [0, 0, 0, 0], //总数
      current: [1, 1, 1, 1], // 当前页
      size: [5, 5, 5, 5], // 每页显示数
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
    // 默认打开面板
    this.getResultList();
    // 发起请求获取总数、
    this.getTotal();
  },
  methods: {
    // 刷新按钮
    refresh() {
      this.getResultList();
      this.getTotal();
      this.$message.success("已刷新");
    },
    // 获取总数
    async getTotal() {
      const { data: res } = await this.$http.get("/newsChecked/getTotal", {
        params: {
          userId: this.userId,
        },
      });
      if (!res.success) {
        this.$message.error(res.message);
      }
      this.total = res.data.total;
      console.log(this.total);
    },
    // 处理分页
    handlecheckedListChange(current) {
      this.current[3] = current;
      this.getResultList();
    },
    handlecheckingListChange(current) {
      this.current[2] = current;
      this.getResultList();
    },
    handlerejectListChange(current) {
      this.current[1] = current;
      this.getResultList();
    },
    handledraftListChange(current) {
      this.current[0] = current;
      this.getResultList();
    },
    // 处理标签页切换
    handelPaneChange() {
      if (this.selectPane == 4 && this.gotList[3] == 0) {
        this.getResultList();
      }
      if (this.selectPane == 3 && this.gotList[2] == 0) {
        this.getResultList();
      }
      if (this.selectPane == 2 && this.gotList[1] == 0) {
        this.getResultList();
      }
      if (this.selectPane == 1 && this.gotList[0] == 0) {
        this.getResultList();
      }
    },
    // 获取结果
    async getResultList() {
      this.gotList[this.selectPane - 1] = this.gotList[this.selectPane - 1] + 1;
      const flag = this.getLoginStatus();
      if (flag) {
        const { data: res } = await this.$http.get("/newsChecked/getList", {
          params: {
            userId: this.userId,
            status: this.selectPane,
            current: this.current[this.selectPane - 1],
            size: this.size[this.selectPane - 1],
          },
        });
        if (!res.success) {
          return this.$message.error(res.message);
        }
        if (this.selectPane == 4) {
          this.checkedList = res.data.newsList;
        }
        if (this.selectPane == 3) {
          this.rejectList = res.data.newsList;
        }
        if (this.selectPane == 2) {
          this.checkingList = res.data.newsList;
        }
        if (this.selectPane == 1) {
          this.draftList = res.data.newsList;
        }
      }
    },
    //判断登录状态
    getLoginStatus() {
      if (this.userId == 0) {
        this.$message.error("登陆信息已过期，请重新登录");
        return false;
      }
      return true;
    },
    //修改文章
    modifiedNew(newsId) {},
    // 删除文章
    delNew(newsId) {
      this.$confirm("此操作将永久删除该投稿, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.doDel(newsId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async doDel(newsId) {
      const { data: res } = await this.$http.delete("/tabNews/delNew", {
        params: {
          userId: this.userId,
          newsId: newsId,
        },
      });
      if (!res.success) {
        return this.$message.error(res.message);
      }
      this.$message.success(res.message);
      this.getResultList();
    },
  },
};
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
.news_item_title{
  padding: 8px;
}
</style>