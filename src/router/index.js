import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/login', component: () => import('@/views/login/Login.vue') },
  { path: '/register', component: () => import('@/views/login/Register.vue') },
  {
    path: '/',
    component: () => import('@/components/layout/Layout.vue'),
    children: [
      { path: 'dashboard', component: () => import('@/views/dashboard/Index.vue') },
      { path: 'customer/list', component: () => import('@/views/customer/list.vue') },
      { path: 'checkin/index', component: () => import('@/views/checkin/index.vue') },
      { path: 'checkout/index', component: () => import('@/views/checkout/index.vue') },
      { path: 'backdown/index', component: () => import('@/views/backdown/index.vue') },
      { path: 'outward/index', component: () => import('@/views/outward/index.vue') },
      { path: 'bed/index', component: () => import('@/views/bed/index.vue') },
      { path: 'nurse/level', component: () => import('@/views/nurse/level.vue') },
      { path: 'nurse/project', component: () => import('@/views/nurse/project.vue') },
      { path: 'nurse/record', component: () => import('@/views/nurse/record.vue') },
      { path: 'nurse/task', component: () => import('@/views/nurse/task.vue') },
      { path: 'nurse/customer-nursing', component: () => import('@/views/nurse/customerNursing.vue') },
      { path: 'nurse/service', component: () => import('@/views/nurse/service.vue') },
      { path: 'nurse/assignment', component: () => import('@/views/nurse/assignment.vue') },
      { path: 'health/index', component: () => import('@/views/health/index.vue') },
      { path: 'meal/index', component: () => import('@/views/meal/index.vue') },
      { path: 'schedule/index', component: () => import('@/views/schedule/index.vue') },
      { path: 'statistics/index', component: () => import('@/views/statistics/index.vue') },
      { path: 'role/index', component: () => import('@/views/role/index.vue') },
      { path: 'admin/index', component: () => import('@/views/admin/index.vue') },
      { path: 'user/manage', component: () => import('@/views/user/manage.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // 根路径重定向
  if (to.path === '/' || to.path === '') {
    next(token ? '/dashboard' : '/login')
    return
  }
  // 未登录拦截
  if (to.path !== '/login' && to.path !== '/register' && !token) {
    next('/login')
    return
  }
  // 角色权限拦截：系统管理页面只有超级管理员能访问
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || localStorage.getItem('admin') || '{}')
  const role = userInfo.role || ''
  const systemAdminPages = ['/role/index', '/admin/index', '/user/manage']
  if (systemAdminPages.includes(to.path) && role !== 'super_admin') {
    next('/dashboard') // 无权限，跳转首页
    return
  }
  next()
})

export default router
