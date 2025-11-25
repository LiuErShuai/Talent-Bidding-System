/**
 * 公共模块路由
 * 包含首页、项目大厅、项目详情、信息页面等所有角色都能访问的页面
 */

export default [
  {
    path: '/',
    redirect: '/login'
  },
  // 使用 DefaultLayout 的公共页面
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          transition: 'fade',
          requiresAuth: false
        }
      },
      // 项目公共模块
      {
        path: 'projects',
        name: 'ProjectHall',
        component: () => import('@/views/project/Hall/index.vue'),
        meta: {
          title: '项目大厅',
          transition: 'fade',
          requiresAuth: false
        }
      },
      {
        path: 'projects/:id',
        name: 'ProjectDetail',
        component: () => import('@/views/project/Detail/index.vue'),
        meta: {
          title: '项目详情',
          transition: 'fade',
          requiresAuth: false
        }
      },
      {
        path: 'tracker/:projectId',
        name: 'ProjectTracker',
        component: () => import('@/views/project/Tracker/index.vue'),
        meta: {
          title: '项目进度',
          transition: 'fade',
          requiresAuth: true
        }
      },
      // 用户中心（通用）
      {
        path: 'user',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile/index.vue'),
        meta: {
          title: '个人中心',
          transition: 'fade',
          requiresAuth: true
        }
      },
      // 消息中心（通用）
      {
        path: 'messages',
        name: 'MessageCenter',
        component: () => import('@/views/message/index.vue'),
        meta: {
          title: '消息中心',
          transition: 'fade',
          requiresAuth: true
        }
      },
      // 信息页面
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/info/About/index.vue'),
        meta: {
          title: '关于我们',
          transition: 'fade',
          requiresAuth: false
        }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/info/Contact/index.vue'),
        meta: {
          title: '联系我们',
          transition: 'fade',
          requiresAuth: false
        }
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/views/info/Help/index.vue'),
        meta: {
          title: '帮助中心',
          transition: 'fade',
          requiresAuth: false
        }
      },
      {
        path: 'privacy',
        name: 'Privacy',
        component: () => import('@/views/info/Privacy/index.vue'),
        meta: {
          title: '隐私政策',
          transition: 'fade',
          requiresAuth: false
        }
      }
    ]
  }
]
