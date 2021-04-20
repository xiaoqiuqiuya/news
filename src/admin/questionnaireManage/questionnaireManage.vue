<template>
  <el-card>
    <div class="top_option">
      <el-button class="btn_refresh"
                 type="primary">刷新</el-button>
      <el-button class="btn_add"
                 type="primary">添加问卷</el-button>
    </div>
    <el-collapse model="1">
      <el-collapse-item title="添加问卷"
                        name="1">
        <el-form ref="form"
                 :model="surveyInfo"
                 label-width="80px">
          <el-form-item label="问卷标题">
            <el-input v-model="surveyInfo.title"></el-input>
          </el-form-item>
          <el-form-item label="问题描述">
            <el-input v-model="surveyInfo.description"></el-input>
          </el-form-item>
          <el-form-item label="有效期间">
            <el-date-picker v-model="dateTimePicker"
                            type="datetimerange"
                            :picker-options="dateTimePickerOption"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right"
                            @change="getDateTimePicker">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="'问题'+(Number(questionIndex)+1)"
                        v-for="(question,questionIndex) in surveyInfo.questionList"
                        :key="questionIndex">
            <el-input class="question_input"
                      v-model="question.content"></el-input>
            <span class="question_attribute">
              <el-checkbox v-model="question.requireFlag">必填</el-checkbox>
              <el-radio v-model="question.type"
                        label="1">单选</el-radio>
              <el-radio v-model="question.type"
                        label="2">多选</el-radio>
              <el-radio v-model="question.type"
                        label="3">填空</el-radio>
              <el-button type="danger"
                         size="mini"
                         @click="handelDelQuestion(questionIndex)"
                         v-if="questionIndex!=0">删除当前项</el-button>
            </span>
            <template v-if="question.type!=3">
              <el-form-item class="answer_form_item"
                            v-for="(answer,optionIndex) in question.optionList"
                            :key="optionIndex">
                <el-input class="answer_input"
                          v-model="answer.content"></el-input>
                <el-button v-if="optionIndex==0"
                           class="add_answer"
                           size="medium"
                           @click="handelAddAnswer(questionIndex)"
                           type="primary">添加项</el-button>
                <el-button v-else
                           class="rem_answer"
                           size="medium"
                           @click="handelDelAnswer(questionIndex,optionIndex)"
                           type="warning">删除项</el-button>
              </el-form-item>

            </template>

          </el-form-item>

          <el-form-item>
            <el-button class="add_question"
                       @click="handelAddQuestion"><i class="el-icon-circle-plus-outline"></i>添加问题</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="warning"
                       class="btn_handelSave">暂 存</el-button>
            <el-button type="primary"
                       class="btn_handelPublish"
                       @click="handelPublish(1)">发 布</el-button>

          </el-form-item>
        </el-form>

      </el-collapse-item>
      <el-collapse-item :title="surveyInfo.title"
                        v-for="surveyInfo in surveyInfoList"
                        :key="surveyInfo.id">
        <span>
          {{surveyInfo.description}}
        </span>
      </el-collapse-item>
    </el-collapse>
    <el-pagination :page-size="size"
                   layout="prev, pager, next"
                   :total="total"
                   @current-change="handleCurrentChange">
    </el-pagination>
  </el-card>

</template>
<script>
export default {
  created: function () {
    this.getPostedSurveyInfoList()
  },
  data() {
    return {
      radio: '1',
      requireFlag: true,
      current: 1, // 当前页
      size: 10, // 每页显示数
      total: 0, //总数
      dateTimePicker: '',
      dateTimePickerOption: {
        disabledDate(time) {
          var timeNow = Date.now()
          var before = timeNow - 24 * 60 * 60 * 1000 // 今天之前的日期
          return time.getTime() < before
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      // 已发布的问卷
      surveyInfoList: [],
      // 添加问卷
      surveyInfo: {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        topFlag: false,
        questionList: [
          {
            type: 1,
            requireFlag: true,
            optionList: [
              {
                content: '',
              },
            ],
          },
        ],
      },
    }
  },
  methods: {
    handleCurrentChange(current) {
      this.current = current
      this.getPostedSurveyInfoList()
    },
    // 获取以发布的问卷
    async getPostedSurveyInfoList() {
      const { data: res } = await this.$http.get('/surveyInfo/getSurveyList', {
        params: { current: this.current, size: this.size, userId: 0 },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.surveyInfoList = res.data.surveyList
      this.total = res.data.total
    },

    // 发布问卷
    async handelPublish(status) {
      this.surveyInfo.status = status
      const { data: res } = await this.$http.post(
        '/surveyInfo/postSurvey',
        this.surveyInfo
      )
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
    },
    //设置时间
    getDateTimePicker(dateTimePicker) {
      this.surveyInfo.startTime = dateTimePicker[0]
      this.surveyInfo.endTime = dateTimePicker[1]
      console.log(this.surveyInfo)
    },
    // 添加问题项
    handelAddQuestion() {
      var questionItem = {
        type: '1',
        requireFlag: true,
        content: '',
        optionList: [
          {
            content: '',
          },
        ],
      }
      this.surveyInfo.questionList.push(questionItem)
    },
    //删除问题项
    handelDelQuestion(questionIndex) {
      this.surveyInfo.questionList.splice(questionIndex, 1)
    },
    //添加答案
    handelAddAnswer(questionIndex) {
      const questionList = this.surveyInfo.questionList[questionIndex]
      questionList.optionList.push({ content: '' })
      questionList.optionList
    },
    //删除答案
    handelDelAnswer(questionIndex, optionIndex) {
      this.surveyInfo.questionList[questionIndex].optionList.splice(
        optionIndex,
        1
      )
    },

  },
}
</script>
<style scoped lang="less">
.el-card {
  .top_option {
    margin-bottom: 20px;
    border-left: 5px solid #67c23a;
    padding-left: 20px;
    .checkbox_box {
      margin-top: 10px;
    }

    .btn_refresh {
      margin-left: 20px;
    }
    .btn_add {
      float: right;
    }
  }
}

.span_popover {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.add_input_item {
  width: 80%;
  margin-left: 2%;
  display: inline-block;
}
.my-input {
  width: 80%;
  margin-left: 2%;
  margin-right: 2%;
}
.btn_handelSave {
  width: 10%;
}
.btn_handelPublish {
  margin-left: 1%;
  width: 34%;
}
.survey_box {
  width: 60%;
  background-color: yellow;
  .survey_box_inner_left {
    width: 30%;
    background-color: red;
    float: left;
  }
  .survey_box_inner_right {
    background-color: black;
    widows: 70%;
    float: right;
  }
}

.el-input {
  width: 50%;
}
.question_input {
  width: 45%;
}
.add_question {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  width: 45%;
}

.question_attribute {
  margin: 0 20px;
}
.answer_form_item {
  margin: 10px 0;
  .answer_input {
    width: 45%;
  }
  .rem_answer {
    margin: 0 20px;
  }
  .add_answer {
    margin: 0 20px;
  }
}
</style>