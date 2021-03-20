<template>
  <div>
    <div class="refresh">
      <el-link class="btn_refresh"
               type="primary"
               icon="el-icon-refresh"
               @click="refresh">刷新</el-link>
    </div>
    <div style="height: 660px">
      <el-divider v-if="total== 0">暂时没有数据</el-divider>
      <el-card v-else
               v-for="item in checkedList"
               :key="item.id"
               class="news_item">
        <p>
          <span class="news_title">{{ item.title }}</span>
          <span class="new_option_btn">
            <el-link type="primary"
                     @click="modifiedNew(item.id)">修改</el-link>/
            <el-link type="danger"
                     @click="delNew(item.id)">删除</el-link>
          </span>
        </p>
        <span class="news_info">
          <span class="news_info_time">发布于：{{
                        $moment(item.gmtCreate).format("YYYY-MM-DD HH:mm")
                      }}</span>
        </span>
        <span class="num_list">
          <span class="iconfont">&#xe63b;</span>点赞({{
                      item.likeNum
                    }}) <i class="el-icon-view"></i>浏览{{ item.viewNum }}
        </span>
      </el-card>
    </div>

    <!-- 分页 -->
    <el-pagination :page-size="size"
                   layout="prev, pager, next"
                   :total="total"
                   @current-change="handlecheckedListChange">
    </el-pagination>
  </div>

</template>
<script>
export default {
  data() {
    return {
      checkedList: [],
      userId: 0,
      total:0,
      current: 1, // 当前页
      size: 5, // 每页显示数
    }
  },
  created: async function () {
    // 获取登陆的用户
    const token = window.sessionStorage.getItem('token')
    if (token != null) {
      this.userId = token
    } else {
      this.userId = 0
    }
    // 默认打开面板
    this.getResultList()
    // 发起请求获取总数、
    this.getTotal()
  },
  methods: {
    // 刷新按钮
    refresh() {
      this.getResultList()
      this.getTotal()
      this.$message.success('已刷新')
    },
    // 获取总数
    async getTotal() {
      const { data: res } = await this.$http.get('/newsChecked/getTotal', {
        params: {
          userId: this.userId,
        },
      })
      if (!res.success) {
        this.$message.error(res.message)
      }
      this.total = res.data.total[3]
    },
    // 处理分页
    handlecheckedListChange(current) {
      this.current = current
      this.getResultList()
    },

    // 获取结果
    async getResultList() {
   
        const { data: res } = await this.$http.get('/newsChecked/getList', {
          params: {
            userId: this.userId,
            status: 4,
            current: this.current,
            size: this.size,
          },
        })
        if (!res.success) {
          return this.$message.error(res.message)
        }
        this.checkedList = res.data.newsList
        console.log(res);
      },

    //判断登录状态
    getLoginStatus() {
      if (this.userId == 0) {
        this.$message.error('登陆信息已过期，请重新登录')
        return false
      }
      return true
    },
    //修改文章
    modifiedNew(newsId) {},
    // 删除文章
    delNew(newsId) {
      this.$confirm('此操作将永久删除该投稿, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.doDel(newsId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async doDel(newsId) {
      const { data: res } = await this.$http.delete('/tabNews/delNew', {
        params: {
          userId: this.userId,
          newsId: newsId,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
      this.getResultList()
    },
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