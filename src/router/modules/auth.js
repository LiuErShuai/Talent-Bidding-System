/**
 * 认证模块路由
 * 包含登录、注册等认证相关页面
 */

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login/index.vue'),
    meta: {
      title: '登录',
      transition: 'slide-right',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register/index.vue'),
    meta: {
      title: '注册',
      transition: 'slide-left',
      requiresAuth: false
    }
  }
]
