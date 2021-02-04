import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import home from "../views/home"
import index from "../components/index"

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
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router