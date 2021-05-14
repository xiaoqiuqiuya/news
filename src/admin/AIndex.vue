<template>
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <!-- 图标 -->
      <img class="avatar" src="../assets/logo.png" alt />
      <!-- 退出登录按钮 -->
      <el-button type="info" class="log-out" @click="logOut()">退出</el-button>
    </el-header>
    <el-main>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="300px">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            background-color="#545c64"
            :collapse="isCollapse"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse-transition="false"
          >
            <template v-for="item in menuList">
              <el-menu-item v-if="!item.isParent" :key="item.id" :index="item.ind">
                <i class="el-icon-document"></i>
                <span slot="title">{{item.title}}</span>
              </el-menu-item>
              <el-submenu v-else :index="item.ind" :key="item.id">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="child in item.children"
                    :key="child.id"
                    :index="child.ind"
                  >{{child.title}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <el-card body-style="height:100%">
            <!-- 动态标签页 -->
            <div class="card_body">
              <el-tabs v-model="editableTabsValue" type="border-card" @tab-remove="removeTab">
                <el-tab-pane name="首页" label="首页">
                  <welcome></welcome>
                </el-tab-pane>
                <el-tab-pane
                  v-for="(item,index) in editableTabs"
                  :key="index"
                  :label="item.title"
                  :name="item.name"
                >
                  <component :is="item.content"></component>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script >
import boardManage from "../admin/boardManage/boardManage";
import commentManage from "../admin/commentManage/commentManage";
import allNews from "../admin/newsManage/allNews";
import checkingNews from "../admin/newsManage/checkingNews";
import noticeManage from "../admin/noticeManage/noticeManage";
import questionnaireManage from "../admin/questionnaireManage/questionnaireManage";
import adminUser from "../admin/userManage/adminUser";
import allUser from "../admin/userManage/allUser";
import objectionNews from "../admin/newsManage/objectionNews";
import welcome from "../admin/welcome";

export default {
  components: {
    boardManage,
    objectionNews,
    commentManage,
    allNews,
    checkingNews,
    noticeManage,
    questionnaireManage,
    adminUser,
    allUser,
    welcome
  },
  created: async function() {
    const adminToken = window.sessionStorage.getItem("adminToken");
    if (adminToken == null) {
      // 跳回到登录页
      return this.$router.push("/adminLogin");
    }
    const { data: res } = await this.$http.get("/adminMenu/getMenuList");
    if (!res.success) {
      return this.$message.error(res.message);
    }
    this.menuList = res.data.menuList;
  },
  data() {
    return {
      isCollapse: false,
      menuList: [], //菜单列表
      editableTabsValue: "首页", //当前激活的标签页
      editableTabs: [],
      editableTabsString: [],
      editableTabCount: 1 //打开的标签页的数量
    };
  },
  methods: {
    // 退出登录
    logOut(){
            // window.sessionStorage.setItem('adminToken', res.data.user.id)
            window.sessionStorage.clear();
            this.$router.push("/adminLogin")
    },
    //点击侧边栏菜单
    handleSelect(index, indexPath) {
      //判断是否已经打开了
      const title = String(indexPath).substring(
        String(indexPath).indexOf(",") + 1
      );
      console.log(title);
      const name = String(Number(this.editableTabCount) + 1);
      let flag = true;
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].content == title) {
          this.editableTabsValue = this.editableTabs[i].name; //激活标签页
          flag = false;
        }
      }
      if (flag) {
        this.editableTabCount = String(Number(this.editableTabCount) + 1);
        this.editableTabs.push({
          title: title,
          name: name,
          content: title
        });
        this.editableTabsValue = name;
      }
    },
    // 移除标签
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName == targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name == targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    }
  }
};
</script>
<style scoped lang="less">
.el-container {
  .el-header {
    background-color: #434a50;
    .avatar {
      width: 48px;
      height: 48px;
      position: relative;
      top: 50%;
      transform: translate(0, -50%);
    }
    .log-out {
      position: relative;
      top: 50%;
      transform: translate(0, -50%);
      float: right;
    }
  }
  width: 100%;
  height: 100%;
  .el-main {
    width: 100%;
    // height: 100%;
    padding: 0;
    .el-container {
      //   height: 100%;
      .el-aside {
        height: 100%;
        .el-menu {
          border: none;
          height: 100%;
        }
      }
      .el-main {
        // height: 100%;
        .el-card {
          //   height: 100%;
          div {
            // height: 100%;
            .el-tabs {
              .el-pane {
                height: 100%;
              }
              height: 90%;
            }
          }
        }
      }
    }
  }
}
</style>