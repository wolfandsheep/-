import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入vuex
import store from '@/store/index.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      { path: '/home', component: () => import('@/views/layout/home') },
      { path: '/cart', component: () => import('@/views/layout/cart') },
      { path: '/category', component: () => import('@/views/layout/category') },
      { path: '/user', component: () => import('@/views/layout/user') }
    ]
  },
  { path: '/layout', component: () => import('@/views/layout') },
  { path: '/login', component: () => import('@/views/login') },
  { path: '/myorder', component: () => import('@/views/myorder') },
  { path: '/pay', component: () => import('@/views/pay') },
  { path: '/search', component: () => import('@/views/search') },
  { path: '/searchlist', component: () => import('@/views/search/searchlist') },
  { path: '/prodetail/:id?', component: () => import('@/views/prodetail') }
]

const router = new VueRouter({
  routes
})

// 这些路径是不可以访问的
const paths = ['/pay', '/myorder', '/user']

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 不是权限页面的情况
  if (!paths.includes(to.path)) {
    next()
    return
  }

  // 是权限页面，需要进一步判断是否有token
  const token = store.state.user.userInfo.token
  if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router
