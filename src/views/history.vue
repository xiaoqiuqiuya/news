<template>
  <el-card>
    <div class="top">
      <div class="top_left">
        <i class="el-icon-alarm-clock icon_history"></i>
        <h1>历史记录</h1>
      </div>
      <div class="top_right">
        <el-button v-if="total != 0"
                   class="btn_clear"
                   @click="checkDelAll">清空记录</el-button>
      </div>
    </div>

    <!-- 分割线 -->
    <el-divider v-if="total === 0">暂时没有记录</el-divider>
    <el-divider v-else></el-divider>
    <div class="content"
         v-loading="historyLoading">
      <el-timeline>
        <el-timeline-item v-for="item in newsList"
                          :key="item.id"
                          :timestamp="$moment(item.viewTime).format('YYYY-MM-DD HH:mm')"
                          placement="top">
          <el-card>
            <div>
              <p>
                <span class="news_title"
                      @click="getNew(item.id)">
                  {{ item.title }}
                </span>
                <i class="el-icon-delete del_item"
                   @click="checkDel(item.id)">删除</i>
                <span class="author">{{ item.authorName }}</span>
              </p>
            </div>

            <p style="text-align: right">
              <el-button size="mini"
                         v-for="tags in item.tagsList"
                         :key="tags.id">{{ tags.name }}</el-button>
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <!-- 分页 -->
      <el-pagination :page-size="size"
                     layout="prev, pager, next"
                     :total="total"
                     @current-change="handleChange">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      newsList: [],
      current: 1,
      size: 10,
      total: 0,
      userID: 0,
      historyLoading: true,
    }
  },
  created: async function () {
    // 获取用户信息
    // const token = window.sessionStorage.getItem("token");
    const token = window.sessionStorage.getItem('token')
    if (token != null) {
      this.userID = token
    } else {
      this.userID = 0
    }
    //初始化历史数据列表
    this.getHistory()
    //初始化总数
    this.getTotal()
  },
  methods: {
    // 询问确认删除历史记录
    checkDel(newsId) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 确认删除
          this.doDel(newsId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 处理分页
    async handleChange(current) {
      this.current = current

      this.getHistory()
    },
    getNew(id) {
      this.$router.push('/newsItem?id=' + id)
    },
    // 获取历史记录列表
    async getHistory() {
      // 发送get请求
      const { data: res } = await this.$http.get(
        '/viewHistory/getHistory?content=' +
          this.content +
          '&current=' +
          this.current +
          '&size=' +
          this.size +
          '&userId=' +
          this.userID
      )
      if (!res.success) {
        return this.$message.error('查询失败，请稍后再试')
      }
      this.newsList = res.data.newsList
      this.newsList.forEach((item) => {
        if (item.title.length > 20) {
          item.title = item.title.substring(0, 20) + '...'
        }
      })
      this.historyLoading = false
    },
    // 确认删除历史记录
    async doDel(newsId) {
      const { data: res } = await this.$http.post(
        '/viewHistory/del?newsId=' + newsId + '&userId=' + this.userID
      )
      if (!res) {
        this.$message.error(res.message)
      } else {
        this.$message.success(res.message)
      }
      //刷新页面
      this.getHistory()
      //刷新总数
      this.getTotal()
    },
    // 删除全部历史记录
    checkDelAll() {
      this.$confirm('此操作将删除所有记录, 请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.doDelAll()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async doDelAll() {
      // 确认删除
      const { data: res } = await this.$http.post(
        '/viewHistory/delAll?userId=' + this.userID
      )
      if (!res) {
        this.$message.error(res.message)
      } else {
        this.$message.success(res.message)
      }
      //刷新页面
      this.getHistory()
      //刷新总数
      this.getTotal()
    },
    // 获取总数
    async getTotal() {
      const { data: res } = await this.$http.get(
        'viewHistory/getTotal?userId=' + this.userID
      )
      this.total = res.data.total
      console.log(this.total)
    },
  },
}
</script>
<style lang="less" scoped>
.top {
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  .top_left {
    display: flex;
    float: left;
    text-align: center;
    .icon_history {
      font-size: 3rem;
    }
  }
  .top_right {
    display: flex;
    float: right;
    .btn_clear {
      display: inline-block;
      margin-right: 20px;
    }
  }
}

.content {
  margin-top: 20px;
}

.news_title {
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: bold;
}
.news_title:hover {
  color: #00965e;
}
.del_item {
  cursor: pointer;
}
.author {
  font-size: 1rem;
  float: right;
  font-weight: bold;
  cursor: pointer;
}
.author:hover {
  color: #00965e;
}
</style>