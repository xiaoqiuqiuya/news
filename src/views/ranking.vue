<template>
  <!-- 新闻详情页 -->
  <el-main>
    <!-- 间距20px -->
    <el-row>
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="20">
        <!-- 主体内容 -->
        <el-row>
          <el-col :span="16" :offset="4">
            <el-carousel :autoplay="false">
              <el-carousel-item v-for="(item,index) in topList" :key="index">
                <div class="top_list_title" @click="toTabNews(item.id)">{{item.title}}</div>
                <div class="top_list_description">{{item.description}}</div>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" :offset="1">
            <el-card :body-style="cardBodyStyle" shadow="hover">
              <div class="rank_sort">月度榜单</div>
              <p
                :class="'rank_title rank_title'+index"
                v-for="(item,index) in monthSet"
                :key="index"
                @click="toTabNews(item.id)"
              >{{index+1}}.{{item.title}}</p>
            </el-card>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-card :body-style="cardBodyStyle" shadow="hover">
              <div class="rank_sort">每周必看</div>
              <p
                :class="'rank_title rank_title'+index"
                v-for="(item,index) in weekSet"
                :key="index"
                @click="toTabNews(item.id)"
              >{{index+1}}.{{item.title}}</p>
            </el-card>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-card :body-style="cardBodyStyle" shadow="hover">
              <div class="rank_sort">今日热榜</div>
              <p
                :class="'rank_title rank_title'+index"
                v-for="(item,index) in daySet"
                :key="index"
                @click="toTabNews(item.id)"
              >{{index+1}}.{{item.title}}</p>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
  created: async function() {
    this.getRange();
  },
  data() {
    return {
      cardBodyStyle: {
        background: "#e5e9f2",
        height: "400px"
      },
      daySet: [],
      weekSet: [],
      monthSet: [],
      topList: []
    };
  },
  methods: {
    // 获取新闻详情
    toTabNews(id) {
      //  const routeDate = this.$router.push('/newsItem?id=' + id)
      // 打开一个新的标签页
      const routeDate = this.$router.resolve({
        path: "/newsItem",
        query: { id: id }
      });
      window.open(routeDate.href, "_blank");
    },
    // 获取新闻排行榜
    async getRange() {
      const { data: res } = await this.$http.get("/range/getRange");
      if (!res.success) {
        return this.$message.error(res.message);
      }
      this.daySet = res.data.daySet;
      this.weekSet = res.data.weekSet;
      this.monthSet = res.data.monthSet;
      // 避免重复
      this.topList.push(this.monthSet[0]);
      var flag = false;
      this.weekSet.forEach(item => {
        if (item.id != this.monthSet[0].id) {
          if (!flag) {
            this.topList.push(item);
            flag = !flag;
          }
        }
      });
      this.daySet.forEach(item => {
        if (item.id != this.monthSet[0].id) {
          if (flag) {
            this.topList.push(item);
            flag = !flag;
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  background-color: red;
  width: 80%;
  height: 100%;
  padding: 0 10%;
}
</style>
<style scoped lang="less">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.top_list_title {
  cursor: pointer;
  padding: 20px 0;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
.top_list_description {
  text-align: center;
  font-size: 1.3rem;
}
.el-card {
  margin: 10px 5px;
  .rank_sort {
    cursor: pointer;
    font-weight: bolder;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #d3dce6;
  }
}

.rank_title0 {
  color: #fe2d46;
}
.rank_title1 {
  color: #f60;
}
.rank_title2 {
  color: #faa90e;
}

.rank_title {
  margin: 5px 0;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    background-color: #fef0f0;
    color: #67c23a;
  }
}
.el-carousel {
  background-color: #e5e9f2;
}
</style>