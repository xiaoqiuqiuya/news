<template>
  <!-- 首页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="16">
        <!-- 新闻列表 -->
        <el-card class="news_list">
          <!--新闻轮播-->
          <el-carousel
            :interval="4000"
            height="200px"
            indicator-position="outside"
          >
            <el-carousel-item v-for="item in hotNews" :key="item.uniquekey">
              <div class="news_item">
                <!-- 标题 -->
                <div class="news_top">
                  <h2>{{ item.title }}</h2>
                </div>
                <!-- 内容 -->
                <div class="news_content">
                  <p>
                    为有效提高幼儿园保育工作质量，促进保育员队伍建设，12月23日下午，城关幼儿园举行了“展技能
                    亮风采 促规范
                    ”为题的保育员技能大比拼活动，全园15名保育员参加此次比赛。
                  </p>
                </div>
                <!-- 相关信息 -->
                <div class="news_info">{{ item.date }}</div>
                <el-divider></el-divider>
              </div>
            </el-carousel-item>
          </el-carousel>
          <!-- 一条新闻 -->
          <div class="news_item" v-for="item in newsList" :key="item.id">
            <!-- 标题 -->
            <div class="news_top">
              <h1
                v-html="item.title"
                @click="getNew(item.id)"
                class="news_title"
              ></h1>
            </div>
            <!-- 内容 -->
            <div class="news_content">
              <!-- <p v-html="item.content"></p> -->
            </div>
            <!-- 相关信息 -->
            <div class="news_info">
              <!-- 作者名字 -->
              <span v-html="item.authorName" class="info_authorname"></span>
              |
              <!-- 发布时间 -->
              <span v-html="item.createTime" class="info_time"></span>
              <span>--{{ item.likeNum }}点赞 --{{ item.viewNum }}浏览</span>

              <!-- 标签 -->
              <p style="text-align: right">
                <el-button
                  size="mini"
                  v-for="tags in item.tagsList"
                  :key="tags.id"
                  >{{ tags.name }}</el-button
                >
              </p>
            </div>
            <!-- 底部分割线 -->
            <el-divider></el-divider>
          </div>
        </el-card>
      </el-col>
      <!-- 右边 -->
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>推荐阅读</span>
          </div>
          <!-- 推荐列表 -->
          <div class="hot_list">
            <el-table :data="hotNews" :show-header="false" style="width: 100%">
              <el-table-column prop="title"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  created: async function () {
    // 请求新闻列表
    const { data: res } = await this.$http.get(
      "/tabNews/getList/" + this.current + "/" + this.size
    );
    if (!res.success) {
      return this.$message.error(res.message);
    }
    console.log(res);
    this.newsList = res.data.newsList;
  },
  data() {
    return {
      hotNews: [
        {
          uniquekey: "18a61c23cec3248992b3c3f22507f564",
          title: "黑龙江呼兰持刀杀害社区志愿者嫌疑人已被刑拘",
          date: "2021-02-04 13:03",
          category: "头条",
          author_name: "央视新闻客户端",
          url: "https://mini.eastday.com/mobile/210204130301238107821.html",
          thumbnail_pic_s:
            "https://dfzximg02.dftoutiao.com/news/20210204/20210204130301_a708fad3bc5cb98e2f7013a803910d15_0_mwpm_03201609.jpeg",
        },
        {
          uniquekey: "ae0865aab7de1bc573b80aea47e44c3f",
          title: "浙江一女子车祸去世养父母要拿6成赔偿金 女婿：他们要给亲儿子用",
          date: "2021-02-04 12:57",
          category: "头条",
          author_name: "山东商报",
          url: "https://mini.eastday.com/mobile/210204125707449735774.html",
          thumbnail_pic_s:
            "https://dfzximg02.dftoutiao.com/news/20210204/20210204125707_e0a3bcfeb85d4e19c1237ae0d6eb84d2_0_mwpm_03201609.jpeg",
          thumbnail_pic_s02:
            "https://dfzximg02.dftoutiao.com/news/20210204/20210204125707_e0a3bcfeb85d4e19c1237ae0d6eb84d2_1_mwpm_03201609.jpeg",
          thumbnail_pic_s03:
            "https://dfzximg02.dftoutiao.com/news/20210204/20210204125707_e0a3bcfeb85d4e19c1237ae0d6eb84d2_2_mwpm_03201609.jpeg",
        },
        {
          uniquekey: "2e838ccdf9be393df58a447658ced5f1",
          title:
            "天府人物推荐（98）|硕士农民刘沈厅：青春无处不精彩 乡村也有大舞台",
          date: "2021-02-04 12:56",
          category: "头条",
          author_name: "川观新闻",
          url: "https://mini.eastday.com/mobile/210204125656993322472.html",
          thumbnail_pic_s:
            "https://dfzximg02.dftoutiao.com/news/20210204/20210204125656_7f52d892ab4684f259cbd1de398097c8_0_mwpm_03201609.jpeg",
          thumbnail_pic_s02:
            "https://dfzximg02.dftoutiao.com/news/20210204/20210204125656_7f52d892ab4684f259cbd1de398097c8_1_mwpm_03201609.jpeg",
          thumbnail_pic_s03:
            "https://dfzximg02.dftoutiao.com/news/20210204/20210204125656_7f52d892ab4684f259cbd1de398097c8_2_mwpm_03201609.jpeg",
        },
      ],
      current: 1, //当前页
      size: 5, //默认每页显示数
      newsList: [], //新闻列表
    };
  },
  methods: {
    getNew(id){
      this.$router.push("/newsItem?id="+id);
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
.news_item {
  padding-bottom: 20px;
  .news_content {
    text-indent: 2rem;
  }
}

.hot_list {
  padding: 0px !important;
  > li {
    list-style-type: none;
  }
}
.carouse_img {
  height: 200px;
}
.info_authorname {
  cursor: pointer;
  margin-right: 10px;
}
.info_authorname:hover {
  color: #00965e;
}
.info_time {
  margin-left: 10px;
  margin-right: 10px;
}
.news_title {
  cursor: pointer;
}
.news_title:hover {
  color: #00965e;
}
</style>