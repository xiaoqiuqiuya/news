<template>
  <div>
    <div class="top_option">
      <el-button class="btn_refresh"
                 type="primary"
                 @click="status=2,getResultList()">刷新</el-button>
      <el-radio-group v-model="status"
                      @change="getResultList()">
        <el-radio :label="0">待处理</el-radio>
        <el-radio :label="1">回退稿件</el-radio>
        <el-radio :label="-1">无效投诉</el-radio>
      </el-radio-group>
    </div>

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
        <template slot-scope="scope">
          <el-button type="info"
                     size="mini"
                     @click="showContribute(scope.row.tabNews)">预览</el-button>
          <el-dialog :title="preTabNews.title"
                     :visible.sync="preContribute"
                     width="70%">
            <el-button type="success"
                       v-if="preTabNews.original">原创文章</el-button>
            <template v-else>
              <el-tag type="info">原文链接

              </el-tag>
              <el-link :href="preTabNews.originalLink"
                       target="_blank"
                       :underline="false">{{preTabNews.originalLink}}</el-link>
            </template>

            <p>
              <el-tag v-for="item in preTabNews.tagsList"
                      :key="item.id"
                      class="tags-list"
                      type="success">{{item.name}}</el-tag>
            </p>
            <p v-html="preTabNews.content"></p>
            <span slot="footer"
                  class="dialog-footer">
              <el-button type="primary"
                         @click="preContribute = false">关 闭</el-button>
            </span>
          </el-dialog>
        </template>

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
          <!-- 处理状态 -->
          <el-popover v-if="scope.row.status==0"
                      placement="right-end"
                      trigger="click">
            <div class="status_box">
              <div>
                <el-button type="danger"
                           @click="handleStatusChange(scope.row,1)">回退稿件
                </el-button>
              </div>
              <div>
                <el-button type="warning"
                           @click="handleStatusChange(scope.row,-1)">无效投诉
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
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange"
                   layout="total, prev, pager, next, jumper"
                   :page-size="size"
                   :total="total">
    </el-pagination>

    </div>
</template>
<script>
export default {
  created: function () {
    this.getResultList()
    this.getTotal()
  },
  data() {
    return {
      resultList: [],
      current: 1, // 当前页
      size: 5, // 每页显示数
      total: 0, //总数
      status: 2,
      preContribute: false,
      preTabNews: {},
    }
  },
  methods: {
    //   回退稿件
    async handleStatusChange(row, status) {
      const id = row.id
      row.status = status
      const { data: res } = await this.$http.post(
        '/tabObjection/updateStatus',
        {
          id: id,
          status: status,
        }
      )
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.getResultList()
    },
    // 文章预览
    showContribute(tabNews) {
      this.preContribute = true
      this.preTabNews = tabNews
    },
    handleCurrentChange(current) {
      this.current = current
      this.getResultList()
    },
    async getResultList() {
      const { data: res } = await this.$http.get('/tabObjection/getObjection', {
        params: {
          status: this.status,
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
    getTotal() {},
  },
}
</script>
<style scoped lang="less">
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
    margin: 0 20px;
  }
  .btn_add {
    float: right;
  }
}

.status_box {
  div {
    margin: 5px;
  }
}
.tags-list {
  margin: 0 5px;
}
</style>