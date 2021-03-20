<template>
  <el-card>
    <div class="top_option">
      <div class="serarch_input">

        <el-input v-model="searchTitle"
                  placeholder="按投稿标题搜索"
                  maxlength="30">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="btnSearch()"></el-button>
        </el-input>
      </div>
      <el-button class="btn_refresh"
                 type="primary"
                 @click="searchTitle='',getContribute()">刷新</el-button>
      <div class="checkbox_box">
        <el-checkbox :indeterminate="selectedStatus"
                     v-model="selectAll"
                     @change="handelSelectedAllShowItem">全选</el-checkbox>
        <el-checkbox-group v-model="showItem"
                           @change="handelSelectedShowItem">
          <el-checkbox v-for="(item,index) in selectShowItem"
                       :label="item"
                       :key="index">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </div>

    </div>
    <el-table :data="contributeList"
              border
              style="width: 100%">
      <el-table-column label="序"
                       type="index">
      </el-table-column>
      <el-table-column prop="id"
                       label="文章id"
                       width="150">
      </el-table-column>
      <el-table-column prop="title"
                       label="标题"
                       width="150">
        <template slot-scope="scope">
          <el-popover placement="bottom"
                      trigger="click"
                      :content="scope.row.title">
            <el-link type="info"
                     slot="reference"
                     :underline="false"
                     class="span_popover">{{scope.row.title}}</el-link>
          </el-popover>
        </template>

      </el-table-column>
      <el-table-column prop="authorName"
                       label="作者"
                       width="100">
      </el-table-column>
      <el-table-column v-for="(item,index) in showItem"
                       :key="index"
                       :prop="item.prop"
                       :label="item.label"
                       width="150">
        <template slot-scope="scope">
          <!-- 内容 -->
          <el-button size="mini"
                     v-if="item.prop=='content'"
                     @click="preView(scope.row)">
            预览
          </el-button>
          <!-- 文章类型 -->
          <span v-if="item.prop=='original'">
            <el-link v-if="scope.row.original==true"
                     type="primary">原创文章</el-link>
            <el-link v-if="scope.row.original==false"
                     type="warning">转载文章</el-link>
          </span>
          <!-- 原创链接  -->
          <el-link v-if="item.prop=='originalLink'"
                   type="info"
                   slot="reference"
                   :underline="false"
                   :href="scope.row.originalLink"
                   target="_blank"
                   class="span_popover">{{scope.row.originalLink}}</el-link>
          <!-- 描述 -->
          <el-popover v-if="item.prop=='description'"
                      placement="bottom"
                      trigger="click"
                      :content="scope.row.description">
            <el-link type="info"
                     slot="reference"
                     :underline="false"
                     class="span_popover">{{scope.row.description}}</el-link>
          </el-popover>
          <!-- 点赞数 -->
          <span v-if="item.prop=='likeNum'">
            {{scope.row.likeNum}}
          </span>
          <!-- 浏览量 -->
          <span v-if="item.prop=='viewNum'">
            {{scope.row.viewNum}}
          </span>
          <!-- 评论数 -->
          <span v-if="item.prop=='commentNum'">
            {{scope.row.commentNum}}
          </span>
          <!-- 是否已经删除 -->
          <el-tag v-if="item.prop=='deleted'"
                  :type="scope.row.deleted?'danger':'success'">
            {{scope.row.deleted?'已删除':'正常'}}
          </el-tag>
          <!-- 文章状态 -->
          <el-popover v-if="item.prop=='status'"
                      placement="bottom"
                      title="修改稿件状态"
                      trigger="click">
            <template v-for="(item,index) in tagNameList">
              <el-tag :key="index"
                      v-if="index!=0&&scope.row.status!=index"
                      :type="tagTypeList[index]"
                      @click="updateStatus(scope.row,index)"
                      class="status_tag">
                {{item}}
              </el-tag>
            </template>
            <el-tag slot="reference"
                    class="status_tag"
                    :type="tagTypeList[scope.row.status]">
              {{tagNameList[scope.row.status]}}
            </el-tag>
          </el-popover>
          <!-- 创建时间 -->
          <span v-if="item.prop=='gmtCreate'">
            {{$moment(scope.row.gmtCreate).format("YYYY-MM-DD HH:ss")}}
          </span>
          <!-- 修改时间 -->
          <span v-if="item.prop=='gmtUpdate'">
            {{$moment(scope.row.gmtUpdate).format("YYYY-MM-DD HH:ss")}}
          </span>
        </template>
      </el-table-column>
      
    </el-table>
    <!-- 文章预览 -->
    <el-dialog title="文章预览"
               :visible.sync="showContribute">
      <p v-html="contributeContent"></p>
    </el-dialog>
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
    this.getContribute()
  },
  data() {
    return {
      tagNameList: ['', '草稿', '审核中', '已驳回', '审核通过'], //文章的状态列表
      tagTypeList: ['', 'info', 'warning', 'danger', 'success'],
      selectAll: false, //判断是否全部选中
      // 确定展示的列
      showItem: [],
      // 选择表格中展示的内容
      selectShowItem: [
        { prop: 'content', label: '内容' },
        { prop: 'description', label: '描述' },
        { prop: 'original', label: '是否原创' },
        { prop: 'originalLink', label: '原创链接' },
        { prop: 'likeNum', label: '点赞数' },
        { prop: 'viewNum', label: '浏览量' },
        { prop: 'commentNum', label: '评论数' },
        { prop: 'deleted', label: '是否已经删除' },
        { prop: 'status', label: '文章状态' },
        { prop: 'gmtCreate', label: '创建时间' },
        { prop: 'gmtUpdate', label: '更新时间' },
      ],
      selectedStatus: false, // 当前选中的数量状态（全选/半选）
      contributeList: [], //投稿列表
      current: 1, // 当前页
      size: 5, // 每页显示数
      total: 0, //总数
      tagId: 0, //标签id
      searchTitle: '',
      showContribute: false, // 预览文章页
      contributeContent: '', // 文章的内容
    }
  },
  methods: {
    //修改文章
    async updateStatus(row, index) {
      const newsId = row.id
      const { data: res } = await this.$http.post('/tabNews/updateStatus', {
        newsId: newsId,
        status: index,
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.$message.success("修改文章状态成功")
      row.status = index
    },
    //预览文章
    preView(row) {
      this.showContribute = true
      this.contributeContent = row.content
    },

    //选择某一项显示列
    handelSelectedShowItem(value) {
      // 获取当前已经选中的长度
      let selectCount = value.length
      // 判断当前选择的状态：如果当前选择的数量==可供选择的数量则当前状态为全选
      this.selectAll = selectCount == this.selectShowItem.length
      // 修改 全选 的状态==>半选
      this.selectedStatus =
        selectCount > 0 && selectCount < this.selectShowItem.length
    },
    // 全选 val:当前选中的状态ture全选/false全不选
    handelSelectedAllShowItem(val) {
      this.showItem = val ? this.selectShowItem : []
      this.selectedStatus = false
    },

    // 全选
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = false
    },
    // 单个选择触发
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },

    // 删除
    async handleDelete(index, row) {},
    handleSizeChange(size) {
      this.size = size
      this.getContribute()
    },
    //处理分页
    handleCurrentChange(current) {
      this.current = current
      this.getContribute()
    },
    // 搜索
    async btnSearch() {
      if (this.title != '') {
        console.log('重置当前页')
        this.current = 1
      }
      this.getContribute()
    },
    //获取新闻列表
    async getContribute() {
      const { data: res } = await this.$http.get('/tabNews/getAllNews', {
        params: {
          current: this.current,
          size: this.size,
          title: this.searchTitle,
          status: 2,
        },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.contributeList = res.data.newsList
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
</style>