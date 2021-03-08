<template>
  <!-- 新闻详情页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="22">
        <!-- 主体内容 -->
        <el-card class="news_list">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="添加今日进程" name="1">
              <div>
                <el-form ref="form" :model="timeLineForm">
                  <el-form-item
                    v-for="(web, index) in timeLineForm.webs"
                    :key="web.key"
                  >
                    <div class="tag_box" v-if="index == 0">
                      <el-tag>前端</el-tag>
                    </div>
                    <div
                      :class="index == 0 ? 'add_input_item' : 'add_input_item2'"
                    >
                      <el-input v-model="web.value" class="my-input"></el-input>
                      <el-button
                        type="primary"
                        @click.prevent="addInput(1)"
                        v-if="index == 0"
                        >添加项</el-button
                      >
                      <el-button
                        v-else
                        @click.prevent="removeInput(1, web)"
                        type="warning"
                        >删除</el-button
                      >
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-for="(service, index) in timeLineForm.services"
                    :key="service.key"
                  >
                    <div class="tag_box" v-if="index == 0">
                      <el-tag type="success">后端</el-tag>
                    </div>
                    <div
                      :class="index == 0 ? 'add_input_item' : 'add_input_item2'"
                    >
                      <el-input
                        v-model="service.value"
                        class="my-input"
                      ></el-input>
                      <el-button
                        type="primary"
                        @click.prevent="addInput(2)"
                        v-if="index == 0"
                        >添加项</el-button
                      >
                      <el-button
                        @click.prevent="removeInput(2, service)"
                        v-else
                        type="warning"
                        >删除</el-button
                      >
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-for="(mysql, index) in timeLineForm.mysqls"
                    :key="mysql.key"
                  >
                    <div class="tag_box" v-if="index == 0">
                      <el-tag type="info">数据库</el-tag>
                    </div>
                    <div
                      :class="index == 0 ? 'add_input_item' : 'add_input_item2'"
                    >
                      <el-input
                        v-model="mysql.value"
                        class="my-input"
                      ></el-input>
                      <el-button
                        type="primary"
                        @click.prevent="addInput(3)"
                        v-if="index == 0"
                        >添加项</el-button
                      >
                      <el-button
                        @click.prevent="removeInput(3, mysql)"
                        v-else
                        type="warning"
                        >删除</el-button
                      >
                    </div>
                  </el-form-item>
                  <el-form-item
                    v-for="(issue, index) in timeLineForm.issues"
                    :key="issue.key"
                  >
                    <div class="tag_box" v-if="index == 0">
                      <el-tag type="warning">待解决</el-tag>
                    </div>
                    <div
                      :class="index == 0 ? 'add_input_item' : 'add_input_item2'"
                    >
                      <el-input
                        v-model="issue.value"
                        class="my-input"
                      ></el-input>
                      <el-button
                        type="primary"
                        @click.prevent="addInput(4)"
                        v-if="index == 0"
                        >添加项</el-button
                      >
                      <el-button
                        @click.prevent="removeInput(4, issue)"
                        v-else
                        type="warning"
                        >删除</el-button
                      >
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <div class="add_input_item">
                      <el-button
                        type="primary"
                        class="my-input-btn"
                        @click="saveTimeLine"
                        >保存进度</el-button
                      >
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>

            <el-collapse-item
              :name="timeLine.date"
              v-for="timeLine in timeLineList"
              :key="timeLine.date"
            >
              <div slot="title">
                <el-badge v-if="timeLine.issuesNum!=0" :value="timeLine.issuesNum" class="item">
                  <span>{{timeLine.date}}</span>
                </el-badge>
                <el-badge v-else class="item">
                  <span>{{timeLine.date}}</span>
                </el-badge>
              </div>
              <el-card
                :body-style="{ padding: '5px' }"
                class="box-card my_card_web"
                v-if="timeLine.webs != ''"
                shadow="hover"
              >
                <p v-for="(web, index) in timeLine.webs" :key="'web' + index">
                  {{ index + 1 }}:{{ web }}
                </p>
              </el-card>

              <el-card
                :body-style="{ padding: '5px' }"
                class="box-card my_card_service"
                v-if="timeLine.services != ''"
                shadow="hover"
              >
                <p
                  v-for="(service, index) in timeLine.services"
                  :key="'service' + index"
                >
                  {{ index + 1 }}:{{ service }}
                </p>
              </el-card>
              <el-card
                :body-style="{ padding: '5px' }"
                class="box-card my_card_mysql"
                v-if="timeLine.mysqls != ''"
                shadow="hover"
              >
                <p
                  v-for="(mysql, index) in timeLine.mysqls"
                  :key="'mysql' + index"
                >
                  {{ index + 1 }}:{{ mysql }}
                </p>
              </el-card>
              <el-card
                :body-style="{ padding: '5px' }"
                class="box-card my_card_issue"
                v-if="timeLine.issues != ''"
                shadow="hover"
              >
                <p
                  v-for="(issue, index) in timeLine.issues"
                  :key="'issue' + index"
                  :class="issue.status ? 'issueOK' : ''"
                >
                  {{ index + 1 }}:{{ issue.content }}
                  <el-button
                    v-if="!issue.status"
                    size="mini"
                    class="btn"
                    @click="issueIsOK(issue.id)"
                    >已解决</el-button
                  >
                  <el-button
                    v-if="issue.status"
                    size="mini"
                    class="btn"
                    @click="showDate(issue.gmtUpdate)"
                    >{{
                      $moment(issue.gmtUpdate).format("YYYY-MM-DD")
                    }}==已解决</el-button
                  >
                </p>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  created: function () {
    // 时间格式
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    this.currentDate = year + "-" + month + "-" + day;
    this.getTimeLineList();
  },
  data() {
    return {
      activeNames: [], //默认打开的面板
      currentDate: "", // 当前日期
      timeLineForm: {
        webs: [{ value: "", key: 1 }],
        services: [{ value: "", key: 2 }],
        mysqls: [{ value: "", key: 3 }],
        issues: [{ value: "", key: 4 }],
      },
      timeLineList: [],
    };
  },
  methods: {
    // 添加输入框
    addInput(type) {
      if (type == 1) {
        this.timeLineForm.webs.push({
          value: "",
          key: Date.now(),
        });
      } else if (type == 2) {
        this.timeLineForm.services.push({
          value: "",
          key: Date.now(),
        });
      } else if (type == 3) {
        this.timeLineForm.mysqls.push({
          value: "",
          key: Date.now(),
        });
      } else if (type == 4) {
        this.timeLineForm.issues.push({
          value: "",
          key: Date.now(),
        });
      }
    },
    // 移除输入框
    removeInput(type, item) {
      var index = -1;
      if (type == 1) {
        index = this.timeLineForm.webs.indexOf(item);
        if (index !== -1) {
          this.timeLineForm.webs.splice(index, 1);
        }
      } else if (type == 2) {
        index = this.timeLineForm.services.indexOf(item);
        if (index !== -1) {
          this.timeLineForm.services.splice(index, 1);
        }
      } else if (type == 3) {
        index = this.timeLineForm.mysqls.indexOf(item);
        if (index !== -1) {
          this.timeLineForm.mysqls.splice(index, 1);
        }
      } else if (type == 4) {
        index = this.timeLineForm.issues.indexOf(item);
        if (index !== -1) {
          this.timeLineForm.issues.splice(index, 1);
        }
      }
    },
    // 保存进度
    async saveTimeLine() {
      const { data: res } = await this.$http.post(
        "/timeLine/saveTimeLine",
        this.timeLineForm
      );

      if (!res.success) {
        return this.$message.error(res.message);
      }
      this.$message.success(res.message);

      // 关闭添加面板,删除第一个元素
      this.activeNames.shift();
      this.getTimeLineList();
      // 添加元素--打开今日的时间事件面板
      this.activeNames.push(this.currentDate);
    },

    // 获取时间线
    async getTimeLineList() {
      const { data: res } = await this.$http.get("/timeLine/getTimeLine");
      if (!res.success) {
        return this.$message.error(res.message);
      }

      console.log(res);
      this.timeLineList = res.data.dayList;
      // 控制默认显示的面板
      if (this.timeLineList[0].date != this.currentDate) {
        // 今天还没有添加记录则打开添加的面板
        this.activeNames = ["1"];
      }
    },
    // 更新待解决的状态
    async issueIsOK(id) {
      const { data: res } = await this.$http.put(
        "/timeLine/updateIssueStatus/" + id
      );
      if (!res.success) {
        return this.$message.error(res.message);
      }
      // 重新获取时间事件
      this.getTimeLineList();
    },
    // 点击解决的日期，打开对应的那天
    showDate(date) {
      const name = this.$moment(date).format("YYYY-MM-DD");
      const index = this.activeNames.indexOf(name);
      if (index != -1) {
        return this.$message.error("面板已经打开");
      } else {
        this.activeNames.push(name);
      }
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
.tag_box {
  width: 3%;
  display: inline-block;
}
.my-input {
  width: 80%;
  margin-left: 2%;
  margin-right: 2%;
}
.my-input-btn {
  width: 80%;
  margin-left: 6%;
  margin-right: 2%;
}
.input_item {
  margin-left: 2%;
  width: 80%;
  display: inline-block;
}
.add_input_item {
  width: 80%;
  margin-left: 2%;
  display: inline-block;
}
.add_input_item2 {
  width: 80%;
  margin-left: 5%;
  display: inline-block;
}

.my_card_issue {
  color: #e6a23c;
  border-color: #faecd8;
  background-color: #fdf6ec;
  .btn {
    display: flex;
    float: right;
  }
}

.my_card_mysql {
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
}
.my_card_service {
  margin-top: 10px;
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}
.my_card_web {
  color: #409eff;
  background-color: #ecf5ff;
  border-color: #d9ecff;
}
.issueOK {
  text-decoration: line-through;
}
</style>