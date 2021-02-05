import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import home from "../views/home"
import index from "../components/index"
import publish from "../views/publish"

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
    path:"/home",
    component:home,
    redirect:"/index",
    children:[{
      path:"/index",
      component:index
    },{
      path:"/publish",
      component:publish
    }]
  }
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