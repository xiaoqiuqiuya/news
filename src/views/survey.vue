<template>
  <!-- 新闻详情页 -->
  <el-main>
    <!-- 间距20px -->
    <el-row>
      <!-- 偏移2格 -->
      <el-col :offset="2"
              :span="20">
        <!-- 主体内容 -->
        <el-row>
          <el-col :span="16"
                  :offset="4">
            <el-carousel :autoplay="false">
              <el-carousel-item v-for="topSurvey in topSurveyList"
                                :key="topSurvey.id">
                <div class="top_list_title">
                  {{topSurvey.title}}
                </div>
                <div class="top_list_description">{{topSurvey.description}}</div>
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7"
                  :offset="1"
                  v-for="(survey) in surveyList"
                  :key="survey.id">
            <el-card :body-style="cardBodyStyle"
                     shadow="hover">
              <div class="card_survey_title"
                   @click="toSurveyInfo(survey.id)">
                {{survey.title}}
              </div>
              <span  class="card_survey_description">{{survey.description}}</span>
            </el-card>
          </el-col>

        </el-row>
        <div class="page">
     <el-pagination :page-size="size"
                       layout="prev, pager, next"
                       :total="total"
                       @current-change="handleCurrentChange">
        </el-pagination>
        </div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
  created: async function () {
    const token = window.sessionStorage.getItem('token')
    if (token == null) {
      return this.$message({
        message: '登录信息已过期,请重新登录',
        showClose: true,
        duration: 0,
        type: 'error',
      })
    } else {
      this.userId = token
    }
    this.getSurveyList()
    this.getTopSurveyList()
  },
  data() {
    return {
      cardBodyStyle: {
        background: '#e5e9f2',
        height: '200px',
      },
      userId: 0,
      surveyList: [],
      topSurveyList: [],
      current: 1,
      size: 6,
      total: 0,
    }
  },
  methods: {
    //处理分页
    handleCurrentChange(current) {
      this.current = current
      this.getSurveyList()
    },
    toSurveyInfo(id) {
      const routeDate = this.$router.resolve({
        path: '/newsItem',
        query: { id: id },
      })
      window.open(routeDate.href, '_blank')
    },
    // 获取置顶问卷列表
    async getTopSurveyList() {
      const { data: res } = await this.$http.get('/surveyInfo/getTopSurveyList')
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.topSurveyList = res.data.topSurveyList
    },
    // 获取问卷列表
    async getSurveyList() {
      const { data: res } = await this.$http.get('/surveyInfo/getSurveyList', {
        params: { current: this.current, size: this.size, userId: this.userId },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.surveyList = res.data.surveyList
      this.total = res.data.total
    },
  },
}
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
.toSurveyInfo {
  color: black;
}
.toSurveyInfo:visited {
  text-decoration: none;
}
.toSurveyInfo:link {
  text-decoration: none;
}
.toSurveyInfo:hover {
  text-decoration: none;
}
.toSurveyInfo:active {
  text-decoration: none;
}
.toSurveyInfo:focus {
  text-decoration: none;
}
.top_list_title {
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
  .card_survey_title {
    cursor: pointer;
    font-weight: bolder;
    padding: 0.5rem;
    border-radius: 4px;
    background-color: #d3dce6;
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  margin: 20px;
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.page{
  text-align: center;
}
.card_survey_description{
  text-indent: 2rem;
}
</style>