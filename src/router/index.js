import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import home from "../views/Home"
import index from "../components/index"
import publish from "../views/publish"
import newsItem from "../components/newsItem/newsItem"
import timeLine from "../views/timeLine"
import messageBoard from "../views/messageBoard"
import user from "../views/user"
import history from "../views/history"
import favorite from "../views/favorite"
import trace from "../views/trace"
import notifications from "../views/notifications"

Vue.use(VueRouter)

const routes = [{
  path: "/",
  redirect: "/login"
},
{
  path: '/login',
  component: Login
},
{
  path: "/home",
  component: home,
  redirect: "/index",
  children: [{
    path: "/index",
    component: index
  }, {
    path: "/publish",
    component: publish
  }, {
    path: "/newsItem",
    component: newsItem
  }, {
    path: "/timeLine",
    component: timeLine
  }, {
    path: "/messageBoard",
    component: messageBoard
  }, {
    path: "/user",
    component: user,
    redirect: "/user/trace",
    children: [{
      path: "trace",
      component: trace
    }, {
      path: "favorite",
      component: favorite
    }, {
      path: "history",
      component: history
    },  {
      path: "notifications",
      component: notifications
    }]
  },

  ]
},

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 拦截
// router.beforeEach((to, form, next) => {
//   if (to.path == "/login") return next();
//   // 获取token
//   const token = window.sessionStorage.getItem("token");
//   if (!token) return next("/login");
//   next();
// })

export default router
