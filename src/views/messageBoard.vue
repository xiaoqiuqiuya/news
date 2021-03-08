<template>
  <!-- 新闻详情页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="22">
        <!-- 主体内容 -->
        <el-card>
          <div>
            <h2><i class="el-icon-s-order"></i> 听我的</h2>
            <div style="text-align: center">
              <h3>人生就象一场戏，因为有缘才相聚</h3>
              <h3>相扶到老不容易，是否更该去珍惜</h3>
              <h3>为了小事发脾气，回头想来又何必</h3>
              <h3>别人生气我不气，气出病来无人替</h3>
              <h3>我若气坏谁如意，而且伤神又费力</h3>
              <h3>出门在外少管事，早去早归少惦记</h3>
              <h3>邻居亲朋不要比，儿孙琐事随他去</h3>
              <h3>娃娃降生皆欢喜，人到终年任他去</h3>
              <h3>吃苦享乐在一起，神仙羡慕好伴侣</h3>
              <h3>男女老少多注意，莫生气啊莫生气</h3>
            </div>

            <h3>留言板规则</h3>
            <p>
              总的来说，希望您发布的评论是有意义的、对他人有帮助的内容。无意义的、违反您所在国家法律法规的，引起他人普遍反感的评论是禁止发布的。
            </p>
            <p></p>
            <h3>具体的留言规则如下：</h3>
            <ul>
              <li>没有进行登录的用户也可以发表留言</li>
              <li>
                发布留言时，请遵守您所在国家和中华人民共和国的法律法规，<strong
                  >禁止发布政治相关内容；</strong
                >
              </li>
              <li>
                留言内容应该与本站内容相关，禁止一切无意义和严重注水的内容；
              </li>
              <li>
                请尊重他人，友好留言，<strong
                  >请像和他人面对面谈话时一样保持对他人的尊重；</strong
                >
              </li>
              <li>
                禁止发布<strong><s>商业广告</s>；</strong>其他广告也不行
              </li>
              <li>
                请勿使用类似“谢谢谢谢谢谢谢谢谢”、“哈哈哈哈哈哈哈哈”这样的术语。表达感谢请真诚，此种方式视为灌水。
              </li>
            </ul>
          </div>
          <!-- 输入框 -->
          <div class="input_div">
            <el-input
              placeholder="在此留下你你的脚步吧~"
              v-model="content"
              class="my-input"
              maxlength="100"
              show-word-limit
            >
              <el-button
                slot="append"
                icon="el-icon-s-promotion"
                @click="postBoard"
              ></el-button>
            </el-input>
          </div>
          <div>
            <div
              v-infinite-scroll="load"
              style="overflow: auto"
              infinite-scroll-delay="2000"
              infinite-scroll-disabled="disabled"
            >
              <div v-for="board in messageList" :key="board.id">
                <div>
                  <span class="userName">{{ board.userName }}</span>
                  <span class="gmtTime">{{
                    $moment(board.gmtCreate).format("YYYY-MM-DD")
                  }}</span>
                  <span class="floor">第{{ board.id }}楼</span>
                </div>
                <div class="content">{{ board.content }}</div>
                <el-divider></el-divider>
              </div>
              <div class="tips">
                    <p v-if="loading">加载中...</p>
              <p v-if="noMore">没有更多了</p>
              </div>
          
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  created: async function () {
    const token = window.sessionStorage.getItem("token");
    if (!token) {
      // 没有登陆
      this.userId = 0;
    } else {
      // 已经登陆
      this.userId = token;
    }
    // 获取留言
    this.getMessageBoard();
    // 获取总数
    const { data: res } = await this.$http.get("/board/getTotal");
    this.count = res.data.count;
  },
  data() {
    return {
      messageList: [],
      userId: 0,
      content: "", // 留言内容
      current: 1,
      size: 5,
      count: 0,
      currentCount: 0,
      loading: false,
    };
  },
  computed: {
    noMore() {
      return this.currentCount >= this.count;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  methods: {
    // 获取留言
    async getMessageBoard() {
      const { data: res } = await this.$http.get(
        "/board/getBoard/" + this.current + "/" + this.size
      );
      res.data.boards.forEach((element) => {
        this.messageList.push(element);
      });

      console.log(res);
    },

    //发布留言
    async postBoard() {
      const { data: res } = await this.$http.post("/board/postBoard", {
        content: this.content,
        userId: this.userId,
      });
      if (!res.success) {
        return this.$message.error(res.message);
      }
      this.$message.success(res.message);
      // 刷新留言板
      this.getMessageBoard();
    },
    // 下拉加载
    load() {
      this.loading = true;
      setTimeout(() => {
        this.currentCount = this.currentCount + this.size;
        this.loading = false;
      }, 2000);
      this.current = this.current + 1;
      this.getMessageBoard();
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
.input_div {
  text-align: center;
}
.my-input {
  width: 50%;
}
.userName {
  font-weight: bold;
}
.gmtTime {
  margin-left: 5px;
  font-size: 0.9rem;
}
.floor {
  margin-right: 10px;
  float: right;
}
.content {
  text-indent: 2rem;
  font-size: 0.9rem;
}
.tips{
  font-size: 0.9rem;
  text-align: center;
}
</style>