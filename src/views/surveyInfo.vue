<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="12"
                :offset="6">
          <div class="title">{{surveyInfo.title}}</div>
          <div class="description">{{surveyInfo.description}}</div>
          <div class="info">
            <p class="publish_time">发布于：
              <el-link :underline="false"
                       type="primary">{{$moment(surveyInfo.gmtCreate).format("YYYY-MM-DD HH:mm")}}</el-link>
            </p>
            <p v-if="surveyInfo.startTime!=null">
              <span class="start_time">开始时间：{{surveyInfo.startTime}}</span>
              <span class="end_time">结束时间{{surveyInfo.endTime}}</span>
            </p>
            <p v-if="isOutOfTime">
              <el-button type="danger"
                         class="handelSubmitBtn">问卷已过期</el-button>
            </p>
          </div>
          <el-divider></el-divider>
          <div class="question">
            <div class="question_content"
                 v-for="(question,index) in surveyInfo.questionList"
                 :key="question.id">
              <p>{{Number(index)+1}}.{{question.content}}
                <span v-if="question.type==1">【单选题】</span>
                <span v-if="question.type==2">【多选题】</span>
                <span v-if="question.type==3">【填空题】</span>
              </p>
              <template v-if="question.type==1">
                <el-radio v-model="answerInfos[index].optionId"
                          v-for="(option) in question.optionList"
                          :key="option.id"
                          :label="String(option.id)"
                          :disabled="disabled">
                  {{option.content}}
                </el-radio>
              </template>
              <el-checkbox-group v-if="question.type==2"
                                 v-model="answerInfos[index].optionId"
                                 :disabled="disabled">
                <el-checkbox v-for="option in question.optionList"
                             :key="option.id"
                             :label="String(option.id)">{{option.content}}</el-checkbox>
              </el-checkbox-group>
              <template v-if="question.type==3">
                <el-input placeholder="请输入.."
                          v-model="answerInfos[index].optionContent"
                          :disabled="editabled"></el-input>
              </template>
            </div>
          </div>
          <el-button type="warning"
                     v-if="this.surveyInfo.isSubmit"
                     class="handelSubmitBtn">已提交</el-button>
          <el-button type="primary"
                     v-else
                     @click="handelSubmit"
                     class="handelSubmitBtn">提交</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
export default {
  created: function () {
    const token = window.sessionStorage.getItem('token')
    if (token == null) {
      return this.$message({
        message: '登录信息已过期,请重新登录',
        showClose: true,
        duration: 0,
        type: 'error',
      })
    }
    this.userId = token
    const id = this.$route.query.id
    this.surveyInfoId = id
    // 获取问卷对象
    this.getsurveyInfo()
  },
  computed: {
    editabled: function () {
        return this.isOutOfTime || this.disabled
    },
  },
  data() {
    return {
      isOutOfTime: false,
      surveyInfoId: 0,
      current:new Date(),
      endTime:{},
      disabled: false, // 问卷已提交/过期不可编辑
      surveyInfo: {}, // 调查问卷
      userId: 0,
      answerInfos: [], //整理后提交的答案
    }
  },
  methods: {
    // 提交问卷
    async handelSubmit() {
      // 处理对象
      const answerInfos = JSON.parse(JSON.stringify(this.answerInfos))
      answerInfos.forEach((item) => {
        item.optionId = String(item.optionId)
      })
      const { data: res } = await this.$http.post(
        '/answerInfo/postAnswer',
        answerInfos
      )
      if (!res.success) {
        return this.$message.error(res.message)
      }
      // 当前问卷不可修改
      this.disabled = true
    },
    // 获取问卷内容
    async getsurveyInfo() {
      const { data: res } = await this.$http.get('/surveyInfo/getSurveyInfo', {
        params: {
          id: this.surveyInfoId,
          userId: this.userId,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.surveyInfo = res.data.surveyInfo
      // 判断是否已经填写,已经填写则不可修改
      if (!this.surveyInfo.isSubmit) {
        // 未填写
        const answer = JSON.parse(JSON.stringify(this.surveyInfo.questionList))
        answer.forEach((item) => {
          if (item.type == 1 || item.type == 3) {
            this.answerInfos.push({
              optionId: '',
              optionContent: '',
              questionId: item.id,
              userId: this.userId,
              surveyId: this.surveyInfoId,
            })
          }
          if (item.type == 2) {
            this.answerInfos.push({
              optionId: [],
              optionContent: '',
              questionId: item.id,
              userId: this.userId,
              surveyId: this.surveyInfoId,
            })
          }
        })
      } else {
        // 已填写
        this.surveyInfo.questionList.forEach((item) => {
          // console.log(item.answerInfo.optionContent);
          if (item.type == 1) {
            this.answerInfos.push({
              optionId: item.answerInfo.optionId,
              optionContent: '',
              questionId: item.id,
              userId: this.userId,
              surveyId: this.surveyInfoId,
            })
          }
          if (item.type == 2) {
            this.answerInfos.push({
              optionId: item.answerInfo.optionId.split(','),
              optionContent: '',
              questionId: item.id,
              userId: this.userId,
              surveyId: this.surveyInfoId,
            })
          }
          if (item.type == 3) {
            this.answerInfos.push({
              optionId: '',
              optionContent: item.answerInfo.optionContent,
              questionId: item.id,
              userId: this.userId,
              surveyId: this.surveyInfoId,
            })
          }
        })
        this.disabled = true
      }
      // 判断问卷是否已过期
      if (this.surveyInfo.endTime != null) {
        // 比较两个时间
        this.endTime = new Date(this.surveyInfo.endTime)
        console.log(this.current.getTime());
        console.log(this.endTime.getTime());
        if (this.current.getTime() > this.endTime.getTime()) {
          // 超过有效期
          this.isOutOfTime = true
        }
      }
    },
  },
}
</script>
<style scoped lang="less">
.el-container {
  padding: 0;
  margin: 0;
  background-color: #d3dce6;
  .content {
    background-color: yellow;
    padding: 20px;
  }
  .el-main {
    padding: 0;
  }
}

.el-col {
  padding: 20px;
  background: #f2f6fc;
  .title {
    font-size: 1.8rem;
    text-align: center;
    font-weight: bold;
  }
  .description {
    text-indent: 2rem;
    padding: 20px 0;
  }
  .info {
    .end_time {
      margin: 0 20px;
    }
  }
  .question {
    .question_content {
      p {
        font-weight: bold;
        font-size: 1.2rem;
      }
      ul > li {
        list-style: none;
      }
      .el-radio {
        padding: 2px 0;
        width: 100%;
        :hover {
          background-color: #d3dce6;
        }
      }

      .el-checkbox {
        padding: 2px 0;
        width: 100%;
        :hover {
          background-color: #d3dce6;
        }
      }
    }
  }
  .handelSubmitBtn {
    width: 100%;
    margin: 40px 0;
    font-size: 1rem;
  }
}
</style>
