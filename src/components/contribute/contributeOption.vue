<template>
  <span class="new_option_btn">
    <el-link type="primary"
             @click="modifiedNew()">修改</el-link>/
    <el-link type="danger"
             @click="delNew()">删除</el-link>
  </span>
</template>
<script>
export default {
  created: async function () {
    // 获取用户信息
    // const token = window.sessionStorage.getItem("token");
    const token = window.sessionStorage.getItem('token')
    if (token != null) {
      this.userId = token
    } else {
      this.userId = 0
    }
  },
  data() {
    return {
      userId: 0,
    }
  },
  methods: {
    modifiedNew() {
      // 添加id到session中
      window.sessionStorage.setItem('editNewsId', this.newsId)
      this.$router.push('/publish')
    },
    // 删除文章
    delNew() {
      this.$confirm('此操作将永久删除该投稿, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.doDel()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    async doDel() {
      const { data: res } = await this.$http.delete('/tabNews/delNew', {
        params: {
          userId: this.userId,
          newsId: this.newsId,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
      this.$emit("refresh")
    },
  },
  props: {
    newsId: {
      type: Number,
      require: true,
    },
  },
}
</script>
<style scoped>
.new_option_btn {
  float: right;
}
</style>