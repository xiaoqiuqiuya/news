<template>
  <el-card>
    <div class="top_option">
      <div class="serarch_input">

        <el-input v-model="searchContent"
                  placeholder="按内容搜索"
                  maxlength="30">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="btnSearch()"></el-button>
        </el-input>
      </div>
      <el-button class="btn_refresh"
                 type="primary"
                 @click="searchContent='',getBoard()">刷新</el-button>
      <el-button class="btn_add"
                 type="primary"
                 @click="addBoard()">添加留言</el-button>
    </div>
    <el-table :data="boardList"
              border
              style="width: 100%">
      <el-table-column label="序"
                       type="index">
      </el-table-column>
      <el-table-column prop="id"
                       label="留言Id"
                       width="150">
      </el-table-column>
      <el-table-column prop="userName"
                       label="留言者"
                       width="150">
      </el-table-column>
      <el-table-column prop="gmtCreate"
                       label="发布时间"
                       width="150">
      </el-table-column>
      <el-table-column prop="content"
                       label="内容"
                       width="400">
        <template slot-scope="scope">
          <el-popover placement="bottom"
                      trigger="click"
                      width="800"
                      :content="scope.row.content">
            <el-link type="info"
                     slot="reference"
                     :underline="false"
                     class="span_popover">{{scope.row.content}}</el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="status"
                       label="状态"
                       width="150">
        <template slot-scope="scope">
          <el-button size="mini"
                     v-if="scope.row.status==1"
                     type="primary"
                     @click="handlechangeStatus(scope.row.id)">正常</el-button>
          <el-button size="mini"
                     v-else
                     type="danger"
                     @click="handlechangeStatus(scope.row.id)">撤回</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleDel(scope.row.id)"
                     type="danger">永久删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :page-sizes="[5, 10]"
                   :page-size="size"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
export default {
  created: function () {
    this.getBoard()
  },
  data() {
    return {
      boardList: [], //投稿列表
      current: 1, // 当前页
      size: 5, // 每页显示数
      total: 0, //总数
      searchContent: '',
      orderByDesc: true, // 是否按照时间逆序排列
      status: -1, //留言的状态
    }
  },
  methods: {
    // 删除
    async handleDelete(index, row) {},
    handleSizeChange(size) {
      this.size = size
      this.getBoard()
    },
    //处理分页
    handleCurrentChange(current) {
      this.current = current
      this.getBoard()
    },
    // 搜索
    async btnSearch() {
      if (this.searchContent != '') {
        this.current = 1
      }
      this.getBoard()
    },
    //
    async handlechangeStatus(id) {
      var tips = '是否修改该条留言的状态'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.post(
            '/board/updateStatus/' + id
          )
          if (!res.success) {
            return this.$message.error(res.message)
          }
          this.$message({
            type: 'success',
            message: res.message,
          })
          this.getBoard()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          })
        })
    },
    //删除
    async handleDel(id) {
      var tips = '是否永久删除该条留言'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('/board/delBoard/' + id)
          if (!res.success) {
            return this.$message.error(res.message)
          }
          this.$message({
            type: 'success',
            message: res.message,
          })
          this.getBoard()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          })
        })
    },

    //获取留言板列表
    async getBoard() {
      const { data: res } = await this.$http.get('/board/getBoard/', {
        params: {
          current: this.current,
          size: this.size,
          content: this.searchContent,
          status: this.status,
          orderByDesc: this.orderByDesc,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.boardList = res.data.boardList
      this.total = res.data.total
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
</style>