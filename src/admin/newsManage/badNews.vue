<template>
  <el-card>
    <div class="top_option">
      <el-button class="btn_refresh"
                 type="primary"
                 @click="getObjection()">刷新</el-button>
    </div>

    <el-button class="btn_add"
               type="primary"
               @click="handleEdit(0,{id:0})">添加用户</el-button>

    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange"
                   layout="total, prev, pager, next, jumper"
                   :page-size="size"
                   :total="total">
    </el-pagination>
    <el-table :data="resultList"
              border
              style="width: 100%">
      <el-table-column label="序"
                       type="index">
      </el-table-column>

      <el-table-column prop="userName"
                       label="投诉人"
                       width="100">
      </el-table-column>

      <el-table-column prop="userName"
                       label="文章"
                       width="100">
      </el-table-column>

      <el-table-column prop="details"
                       label="描述信息"
                       width="200">
      </el-table-column>

      <el-table-column prop="item"
                       label="投诉类型"
                       width="100">
        <template slot-scope="scope">
          {{scope.row.item.name}}
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate"
                       label="投诉时间"
                       width="180">
        <template slot-scope="scope">
          {{$moment(scope.row.gmtCreate).format("YYYY-MM-DD HH:mm")}}
        </template>
      </el-table-column>
      <el-table-column prop="gmtModified"
                       label="处理时间"
                       width="180">
        <template slot-scope="scope">
          {{scope.row.gmtModified!=null?$moment(scope.row.gmtModified).format("YYYY-MM-DD HH:mm"):''}}
        </template>
      </el-table-column>
      <el-table-column prop="status"
                       label="投诉状态"
                       width="120">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.status==0"
                      placement="right-end"
                      trigger="click">
            <div class="status_box">
              <div>
                <el-button size="mini"
                           type="danger">回退稿件
                </el-button>
              </div>
              <div>
                <el-button size="mini"
                           type="warning">无效投诉
                </el-button>
              </div>
            </div>

            <el-button slot="reference"
                       size="mini"
                       type="info">待处理
            </el-button>
          </el-popover>
          <template v-else>
            <el-tag type="danger"
                    v-if="scope.row.status==1">回退稿件</el-tag>
            <el-tag type="warning"
                    v-if="scope.row.status==-1">无效投诉</el-tag>
          </template>

        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>
<script>
export default {
  created: async function () {
    this.getObjection()
  },
  data() {
    return {
      resultList: [],
      searchContent: '',
      current: 1, // 当前页
      size: 5, // 每页显示数
      total: 0, //总数
    }
  },
  methods: {
    //获取新闻列表
    async getObjection() {
      const { data: res } = await this.$http.get('/tabObjection/getObjection', {
        params: {
          status: 2,
          current: this.current,
          size: this.size,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.resultList = res.data.resultList
      this.total = res.data.total
    },
  },
}
</script>
<style scoped lang="less">
.el-table .fail-row {
  background: #fef0f0;
}
.el-card {
  .top_option {
    margin-bottom: 20px;
    border-left: 5px solid #67c23a;
    padding-left: 20px;
    .checkbox_box {
      margin-top: 10px;
    }
    .serarch_input {
      display: inline-block;
      width: 30%;
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
.status_tag {
  cursor: pointer;
  margin: 5px;
  display: inherit;
  text-align: center;
}
.status_box {
  div {
    margin: 5px;
  }
}
</style>