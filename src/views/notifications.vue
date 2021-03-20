<template>
  <!-- 首页 -->
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/user' }">个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>通知中心</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 顶部分割线 -->
    <el-divider></el-divider>
    <p>
      <span>最近收到的通知</span>
       <el-button style="float: right"
                 type="text"
                 @click="getNotifications()"> / 刷新</el-button>
      <el-button style="float: right"
                 type="text"
                 @click="updateCheckedStatus(0)">全部已读({{ uncheckCount }})</el-button>
    </p>
    <el-timeline>
      <el-timeline-item v-for="item in notices"
                        :key="item.id"
                        :timestamp="$moment(item.gmtCreate).format('YYYY-MM-DD HH:mm')"
                        placement="top">
        <el-card>
          <span style="float: right"
                type="text">
            <el-link type="primary"
                     v-if="item.checked"
                     @click="updateCheckedStatus(item.id)">标记为未读</el-link>
            <el-link type="primary"
                     v-if="!item.checked"
                     @click="updateCheckedStatus(item.id)">标记为已读</el-link>
            /
            <el-link type="danger"
                     @click="deleteNotice(item.id)">删除</el-link>
          </span>
          <p>
            <el-badge is-dot
                      :hidden="item.checked">
              <span class="sender_name">
                {{ item.senderName }}
              </span>

              <span v-if="item.type == 1"> 点赞了你的文章 </span>
              <span v-if="item.type == 2"> 收藏了你的文章 </span>
              <span v-if="item.type == 3"> 评论了你的文章 </span>
              <span v-if="item.type == 4"> 回复了你的评论 </span>
              <span v-if="item.type == 5"> 点赞了你的评论 </span>
              <span v-if="item.type == 6"> 点赞了你的回复 </span>
              <span v-if="item.type == 7"> {{item.content}} </span>

            </el-badge>
          </p>
          <el-card v-if="item.type == 1 || item.type == 2 || item.type == 7 ">
            <span class="content">
              {{ item.object.title }}
            </span>
          </el-card>
          <el-card v-if="3 <= item.type && item.type <= 6">
            <span class="content">
              {{ item.object.content }}
            </span>
            <div class="content_foot">
              <span class="gmt_create">{{
                $moment(item.object.gmtCreate).format("YYYY-DD-MM HH:mm")
              }}</span>
            </div>
          </el-card>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <!-- 分页 -->
    <el-pagination :page-size="size"
                   layout="prev, pager, next"
                   :total="total"
                   @current-change="handleChange">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userId: 0,
      notices: [], // 通知集合
      size: 5,
      current: 1,
      total: 0,
      uncheckCount: 0,
    }
  },
  created: async function () {
    // 获取登陆的用户
    const token = window.sessionStorage.getItem('token')
    if (token != null) {
      this.userId = token
    } else {
      this.userId = 0
      return this.$message.error('登录信息已过期，请重新登录')
    }
    // 获取我的通知
    this.getNotifications()
    // 获取总数
    this.getTotal()
  },
  methods: {
    // 获取我的通知
    async getNotifications() {
      const { data: res } = await this.$http.get('/tabNotice/getNotice', {
        params: {
          userId: this.userId,
          current: this.current,
          size: this.size,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.notices = res.data.notices
    },
    // 获取总数
    async getTotal() {
      const { data: res } = await this.$http.get('/tabNotice/getTotal', {
        params: {
          userId: this.userId,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      console.log(res.data)
      this.total = res.data.total
      this.uncheckCount = res.data.uncheckCount
    },
    //处理分页
    handleChange(current) {
      this.current = current
      this.getNotifications()
    },

    //修改消息的状态
    async updateCheckedStatus(noticeId) {
      const { data: res } = await this.$http.put(
        '/tabNotice/updateCheckedStatus/' + noticeId + '/' + this.userId
      )
      if (!res.success) {
        return this.$message.error(res.message)
      }
      // 更新列表
      this.getNotifications()
      this.getTotal()
    },
    // 删除通知
    async deleteNotice(noticeId) {
      const { data: res } = await this.$http.delete(
        '/tabNotice/deleteNotice/' + noticeId + '/' + this.userId
      )
      if (!res.success) {
        return this.$message.error(res.message)
      }
      // 更新列表
      this.getNotifications()
      this.getTotal()
    },
  },
}
</script>
<style lang="less" scoped>
.sender_name {
  font-weight: bold;
}
.sender_name:hover {
  color: #00965e;
}
.content {
  display: inline-block;
  cursor: pointer;
}
.content:hover {
  font-weight: bold;
  color: #00965e;
}
.content_foot {
  .gmt_create {
    font-size: 0.6rem;
  }
}
</style>