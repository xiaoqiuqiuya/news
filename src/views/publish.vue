<template>
  <!-- 首页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2"
              :span="16">
        <!-- 主体内容 -->
        <div class="publish">
          <el-alert v-if="news.id != 0"
                    title="修改文章"
                    type="success"
                    :closable="false">
          </el-alert>
          <el-form label-width="0px"
                   :model="news">
            <!-- 新闻标题 -->
            <el-form-item>
              <el-input size="large"
                        v-model="news.title">
                <template slot="prepend">请输入标题</template>
              </el-input>
            </el-form-item>
            <!-- 新闻内容 -->
            <el-form-item>
              <editor-bar v-model="detail"
                          :isClear="isClear"
                          @change="change"></editor-bar>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="6"
              class="right">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <el-button type="success"
                       plain
                       @click="btnOption('save')">保存为草稿</el-button>
            <el-button type="warning"
                       plain
                       @click="btnOption('post')">发布</el-button>
          </div>
          <!-- 推荐列表 -->
          <div class="hot_list">
            <el-form :model="news">
              <!-- 描述 -->
              <el-input type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        placeholder="【选填】请简要描述该内容"
                        v-model="news.description"
                        resize="none"></el-input>
              <p>原创声明</p>
              <!-- 是否原创 -->
              <el-switch v-model="news.original"
                         active-text="原创"
                         inactive-text="非原创 "></el-switch>
              <p>原文链接</p>
              <!-- 原文连接 -->
              <el-input v-model="news.originalLink"
                        placeholder="请输入内容"
                        :disabled="news.original"></el-input>
              <p>添加分类标签【可多选】</p>

              <!-- 标签选择 -->
              <el-checkbox-group v-model="selectedTags"
                                 :min="1"
                                 :max="5"
                                 @change="getSelectedTags">
                <el-checkbox v-for="tag in tags"
                             :label="String(tag.id)"
                             :key="tag.id">{{tag.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript">
const E = window.wangEditor
const editor = new E('#text1')
editor.create()
</script>

<script>
import EditorBar from '../components/editor'

export default {
  data() {
    return {
      //
      isClear: true,
      detail: '', //详细信息
      news: {
        id: 0, //文章的id，如果0则是全新的文章
        userId: '',
        title: '',
        content: '',
        description: '',
        original: false,
        originalLink: '',
        tags: '',
      },
      selectedTags: [],
      tags: [], //所有的标签
    }
  },
  created: async function () {
    const token = window.sessionStorage.getItem('token')
    if (token == null) {
      return this.$message({
        message: '登录信息已过期,请重新登录',
        showClose: true,
        duration: 0,
        type: 'error',
      })
    }
    // 获取文章id
    const sessionNewsid = window.sessionStorage.getItem('editNewsId')
    if (sessionNewsid != 0) {
      this.news.id = sessionNewsid
      // 获取文章内容
      this.getNews()
    }
    // 获取标签
    const { data: res } = await this.$http.get('/tags/')
    if (!res.success) {
      this.$message.error(res.message)
    }
    this.tags = res.data.tags
  },
  methods: {
    getSelectedTags(val) {
      console.log(val)
      this.news.tags = String(val)
      console.log(this.news.tags)
    },
    // 获取原文
    async getNews() {
      const { data: res } = await this.$http.get('/tabNews/getTabNews', {
        params: { id: this.news.id },
      })
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.news = res.data.tabNews
      this.detail = this.news.content
      this.selectedTags = this.news.tags.split(',')

      console.log(this.news.tags.split(','))
    },
    // 文本区域改变监听
    change(val) {
      // 文本区域中的内容绑定到对象中
      this.news.content = val
    },
    // 点击保存或者发布按钮
    async btnOption(option) {
      //判断是否登录
      const token = window.sessionStorage.getItem('token')
      if (token == null) {
        return this.$message.Error('登录信息已过期,请重新登录')
      }
      this.news.userId = token
      const { data: res } = await this.$http.post(
        '/tabNews/' + option,
        JSON.stringify(this.news),
        { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }
      )
      if (!res.success) {
        return this.$message.error(res.message)
      }
      this.$message.success(res.message)
      // 跳转到文章详情页
      this.$router.push('/home')
    },
  },
  components: { EditorBar },
}
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
.publish {
  height: 100%;
  background-color: #ffffff;
  padding: 20px;
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

.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 400px;
}
.right {
  position: fixed;
  right: 10%;
  width: 20%;
}

.btn-add-tags {
  cursor: pointer;
}
.btn-tag {
  margin: 5px 0;
}
.el-alert{
    margin: 5px 0;
}
</style>