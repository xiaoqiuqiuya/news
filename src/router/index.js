import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import home from '../views/Home'
import index from '../components/index'
import publish from '../views/publish'
import newsItem from '../components/newsItem/newsItem'
import timeLine from '../views/timeLine'
import messageBoard from '../views/messageBoard'
import user from '../views/user'
import history from '../views/history'
import favorite from '../views/favorite'
import trace from '../views/trace'
import notifications from '../views/notifications'
import contribute from '../views/contribute'
import information from '../views/information'
import safe from '../views/safe'
import survey from '../views/survey'
import surveyInfo from '../views/surveyInfo'
import ranking from '../views/ranking'

// 管理系统
import adminLogin from '../admin/adminLogin'
import AIndex from '../admin/AIndex'
import boardManage from '../admin/boardManage/boardManage'
import commentManage from '../admin/commentManage/commentManage'
import allNews from '../admin/newsManage/allNews'
import checkingNews from '../admin/newsManage/checkingNews'
import noticeManage from '../admin/noticeManage/noticeManage'
import questionnaireManage from '../admin/questionnaireManage/questionnaireManage'
import adminUser from '../admin/userManage/adminUser'
import allUser from '../admin/userManage/allUser'

Vue.use(VueRouter)
const routes = [
	{
		path: '/',
		redirect: '/index',
	},
	{
		path: '/login',
		component: Login,
	},
	{
		path: '/home',
		component: home,
		redirect: '/index',
		children: [
			{
				path: '/index',
				component: index,
			},
			{
				path: '/publish',
				component: publish,
			},
			{
				path: '/newsItem',
				component: newsItem,
			},
			{
				path: '/timeLine',
				component: timeLine,
			},
			{
				path: '/messageBoard',
				component: messageBoard,
			},
			{
				path: '/user',
				component: user,
				redirect: '/user/trace',
				children: [
					{
						path: 'trace',
						component: trace,
					},
					{
						path: 'favorite',
						component: favorite,
					},
					{
						path: 'history',
						component: history,
					},
					{
						path: 'notifications',
						component: notifications,
					},
					{
						path: 'contribute',
						component: contribute,
					},
					{
						path: 'information',
						component: information,
					},
					{
						path: 'safe',
						component: safe,
					},
				],
			},

			{
				path: '/survey',
				component: survey,
			},
			{
				path: '/surveyInfo',
				component: surveyInfo,
			},
			{
				path: '/ranking',
				component: ranking,
			},
		],
	},
	// 后台管理系统页面
	{
		path: '/adminLogin',
		component: adminLogin,
	},
	{
		path: '/AIndex',
		component: AIndex,
		children: [
			{
				path: 'boardManage',
				component: boardManage,
			},
			{
				path: 'commentManage',
				component: commentManage,
			},
			{
				path: 'allNews',
				component: allNews,
			},
			{
				path: 'checkingNews',
				component: checkingNews,
			},
			{
				path: 'noticeManage',
				component: noticeManage,
			},
			{
				path: 'questionnaireManage',
				component: questionnaireManage,
			},
			{
				path: 'adminUser',
				component: adminUser,
			},
			{
				path: 'allUser',
				component: allUser,
			},
		],
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
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
