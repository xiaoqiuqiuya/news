<template>
  <el-card>
    <div class="top">
      <i class="el-icon-bicycle icon_trace"></i>
      <h1 class="page_name">动态</h1>
    </div>

    <div class="content">
      <el-timeline>
        <el-timeline-item
          v-for="item in traceList"
          :key="item.id"
          :timestamp="$moment(item.gmtCreate).format('YYYY-MM-DD HH:mm')"
          placement="top"
        >
          <el-card>
            <div>
              <p>
                <span class="trace_title">
                  {{ item.content }}
                </span>

                <i class="el-icon-delete del_item" @click="checkDel(item.id)"
                  >删除</i
                >
                <span class="author">{{ item.authorName }}</span>
              </p>
            </div>

            <!-- 新闻对象 -->
            <el-card v-if="item.type <= 3">
              <div>
                <p>
                  <span class="news_title" @click="getNew( item.object.id)">
                    {{ item.object.title }}
                  </span>

                  <span class="author">{{ item.object.authorName }}</span>
                </p>
              </div>

              <p style="text-align: right">
                <span v-for="tags in item.object.tagsList" :key="tags.id"
                  >{{ tags.name }} /
                </span>
              </p>
            </el-card>
            <!-- 评论对象 -->
            <el-card v-if="item.type == 4">
              <span @click="getNew(item.object.newsId)" class="comment">
                {{ item.object.content }}
              </span>
            </el-card>
            <!-- 留言对象 -->
            <el-card v-if="item.type == 5" class="board">
              {{ item.object.content }}
              <span class="floor">第{{ item.object.id }}楼</span>
            </el-card>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-card>
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
    };
  },
  created: async function () {
    // 获取登陆的用户
    const token = window.sessionStorage.getItem("token");
    if (token == null) {
      this.$message.error("登陆信息已过期，请重新登录");
    }
    this.userId = token;

    //获取动态
    this.getTrace();

    // 获取总数
    this.getTotal();
  },
  methods: {
    // 判断登录状态
    getLoginStatus() {
      if (this.userId == 0) {
        this.$message.error("登录已经失效");
        return false;
      }
      return true;
    },
    async getTotal() {
      if (this.getLoginStatus) {
        const { data: totalRes } = await this.$http.get(
          "/trace/getTraceTotal",
          {
            params: { userId: this.userId },
          }
        );
        if (!totalRes.success) {
          this.$message.error(totalRes.message);
        }
        this.total = totalRes.data.total;
      }
    },

    // 获取动态
    async getTrace() {
      if (this.getLoginStatus) {
        // 发送请求，获取动态
        const { data: res } = await this.$http.get("/trace/getTrace", {
          params: {
            userId: this.userId,
            current: this.current,
            size: this.size,
          },
        });
        if (!res.success) {
          this.$message.error(res.$message);
        }
        this.traceList = res.data.traceList;
      }
    },

    // 处理分页
    handleCurrentChange(current) {
      this.current = current;
      this.getTrace();
    },
    // 确认删除
    async doDel(traceId) {
      if (this.getLoginStatus) {
        const { data: res } = await this.$http.delete("/trace/delTrace", {
          params: { traceId: traceId },
        });
        if (!res.success) {
          this.$message.error(res.message);
        } else {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        }
        // 刷新页面
        this.getTrace();
        // 获取总数
        this.getTotal();
      }
    },
    // 删除动态
    checkDel(traceId) {
      this.$confirm("此操作将删除该条动态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认删除
          this.doDel(traceId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getNew(id) {
      this.$router.push("/newsItem?id=" + id);
    },
  },
};
</script>
<style lang="less" scoped>
.top {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  .page_name {
    display: inline;
  }
  .icon_trace {
    font-size: 3rem;
  }
}
.content {
  margin-top: 20px;
}

.trace_title {
  font-size: 1.4rem;
  font-weight: bold;
}
.del_item {
  cursor: pointer;
}

.news_title {
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}
.news_title:hover {
  cursor: pointer;
}
.author {
  font-size: 0.8rem;
  float: right;
  font-weight: bold;
  cursor: pointer;
}
.author:hover {
  color: #00965e;
}

.floor {
  float: right;
}
.comment {
  cursor: pointer;
}
.board {
  cursor: pointer;
}
</style>