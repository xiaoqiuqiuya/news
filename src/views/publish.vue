<template>
  <!-- 首页 -->
  <div class="container">
    <!-- 间距20px -->
    <el-row :gutter="20">
      <!-- 偏移2格 -->
      <el-col :offset="2" :span="16">
        <!-- 主体内容 -->
        <el-card class="news_list">
          <el-form label-width="0px" :model="news">
            <!-- 新闻标题 -->
            <el-form-item>
              <el-input size="large" v-model="news.title">
                <template slot="prepend">请输入标题</template>
              </el-input>
            </el-form-item>
            <!-- 新闻内容 -->
            <el-form-item>
              <editor-bar
                v-model="detail"
                :isClear="isClear"
                @change="change"
              ></editor-bar>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <!-- 右边 -->
      <el-col :span="6" class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button type="success" plain @click="btnOption('save')"
              >保存为草稿</el-button
            >
            <el-button type="warning" plain @click="btnOption('post')"
              >发布</el-button
            >
          </div>
          <!-- 推荐列表 -->
          <div class="hot_list">
            <el-form :model="news">
              <!-- 描述 -->
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 4 }"
                placeholder="【选填】请简要描述该内容"
                v-model="news.description"
                resize="none"
              ></el-input>
              <p>原创声明</p>
              <!-- 是否原创 -->
              <el-switch
                v-model="news.original"
                active-text="原创"
                inactive-text="非原创 "
              ></el-switch>
              <p>原文链接</p>
              <!-- 原文连接 -->
              <el-input
                v-model="news.originalLink"
                placeholder="请输入内容"
                :disabled="news.original"
              ></el-input>
              <p>添加分类标签【可多选】</p>

              <!-- 已选标签 -->
              <div class="tags-list">
                <el-button
                  class="btn-tag"
                  v-for="(item, index) in selectedTags"
                  :key="item.id"
                  size="mini"
                >
                  {{ item.name }}
                  <i class="el-icon-close" @click="remove(index)"></i>
                </el-button>
              </div>

              <!-- 标签选择框 -->
              <el-popover placement="bottom" width="200" trigger="click">
                <i
                  slot="reference"
                  class="btn-add-tags el-icon-circle-plus-outline"
                ></i>
                <el-button
                  class="btn-tag"
                  v-for="item in tags"
                  :key="item.id"
                  size="mini"
                  @click="addTag(item.id, item.name)"
                  >{{ item.name }}</el-button
                >
              </el-popover>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript">
const E = window.wangEditor;
const editor = new E("#text1");
editor.create();
</script>

<script>
import EditorBar from "../components/editor";

export default {
  data() {
    return {
      //
      isClear: false,
      detail: "", //详细信息
      ids: [], //已选标签的id
      news: {
        userId: "",
        title: "",
        content: "",
        description: "",
        original: false,
        originalLink: "",
        tags: "",
      },
      tags: [], //所有的标签
      selectedTags: [], //所有已选的标签
      tagsNum: 5, //可选标签总数
      elCasercaderProps: {
        // 多选
        multiple: true,
      },
    };
  },
  created: async function () {
     const token = window.sessionStorage.getItem("token");
      if (token == null) {
        return this.$message({message:"登录信息已过期,请重新登录", showClose: true,duration:0,type:'error'});
      }
      
    // 获取标签
    const { data: res } = await this.$http.get("/tags/");
    if (!res.success) {
      this.$message.error(res.message);
    }
    this.tags = res.data.tags;
  },
  methods: {
    // 文本区域改变监听
    change(val) {
      // 文本区域中的内容绑定到对象中
      this.news.content = val;
    },
    // 点击保存为草稿
    async btnSave() {
      //判断是否登录
      const token = window.sessionStorage.getItem("token");
      if (token == null) {
        return this.$message.Error("登录信息已过期,请重新登录");
      }
      this.news.userId = token;
      this.news.tags = JSON.stringify(this.ids);
      const { data: res } = await this.$http.post("/tabNews/save", this.news);
      if (!res.success) {
        return this.$message.error(res.message);
      }
      this.$message.success(res.message);
    },

    // 点击保存或者发布按钮
    async btnOption(option) {
      //判断是否登录
      const token = window.sessionStorage.getItem("token");
      if (token == null) {
        return this.$message.Error("登录信息已过期,请重新登录");
      }
      this.news.userId = token;
      this.news.tags = JSON.stringify(this.ids);
      const { data: res } = await this.$http.post(
        "/tabNews/" + option,
        this.news
      );
      if (!res.success) {
         
        return this.$message.error(res.message);
      }
      this.$message.success(res.message);
      // 跳转到文章详情页
     this.$router.push("/home");

    },

    // 点击标签，添加tag
    addTag(id, name) {
      // 判断标签数是否超出限制
      if (this.tagsNum == 0) {
        this.$message.error("标签数量超过限制");
      } else {
        //判断标签是否重复
        this.ids = []; //重置最后提交的已选标签列表，防止刷新后携带刷新之前的数据
        for (var i = 0; i < this.selectedTags.length; i++) {
          this.ids.push(this.selectedTags[i].id);
        }
        const index = this.ids.indexOf(id);
        if (index == -1) {
          //没有重复
          //添加元素到数组中
          this.selectedTags.push({ id: id, name: name });
          this.ids.push(id);
          this.tagsNum -= 1;
        } else {
          //重复
          this.$message.error("重复添加标签");
        }
      }
    },
    //删除标签
    remove(index) {
      this.selectedTags.splice(index, 1); //去除数组中的元素
      // +1
      this.tagsNum += 1;
    },
  },
  components: { EditorBar },
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
</style>