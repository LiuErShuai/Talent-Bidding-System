/**
 * 公共模块路由
 * 包含首页、项目大厅、项目详情、信息页面等所有角色都能访问的页面
 */

export default [
  {
    path: '/',
    redirect: '/home'
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
          requiresAuth: false,
          hideFooter: true,  // 隐藏 DefaultLayout 的 AppFooter
          isPublicHome: true  // 标记为外网首页，用于导航栏切换
        }
      },
      // 校内首页（内网）
      {
        path: 'campus-home',
        name: 'CampusHome',
        component: () => import('@/views/home/CampusHome.vue'),
        meta: {
          title: '校内首页',
          transition: 'fade',
          requiresAuth: true  // 必须登录
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
        path: 'projects/:id/manage',
        name: 'ProjectManage',
        component: () => import('@/views/project/Manage/index.vue'),
        meta: {
          title: '项目管理',
          transition: 'fade',
          requiresAuth: true,
          hideHeader: true, // 隐藏默认导航栏，使用自定义导航栏
          hideFooter: true  // 隐藏页脚
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
          requiresAuth: true,
          role: 'student'
        }
      },
      // 消息中心（通用）
      {
        path: 'messages',
        name: 'MessageCenter',
        component: () => import('@/views/message/MessageCenter/index.vue'),
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
          requiresAuth: false,
          isPublicPage: true  // 标记为外网页面
        }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/info/Contact/index.vue'),
        meta: {
          title: '联系我们',
          transition: 'fade',
          requiresAuth: false,
          isPublicPage: true  // 标记为外网页面
        }
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/views/info/Help/index.vue'),
        meta: {
          title: '帮助中心',
          transition: 'fade',
          requiresAuth: false,
          isPublicPage: true  // 标记为外网页面
        }
      },
      {
        path: 'privacy',
        name: 'Privacy',
        component: () => import('@/views/info/Privacy/index.vue'),
        meta: {
          title: '隐私政策',
          transition: 'fade',
          requiresAuth: false,
          isPublicPage: true  // 标记为外网页面
        }
      },
      // 合作企业页面
      {
        path: 'partners',
        name: 'Partners',
        component: () => import('@/views/info/Partners/index.vue'),
        meta: {
          title: '合作企业',
          transition: 'fade',
          requiresAuth: false,
          isPublicPage: true  // 标记为外网页面
        }
      }
    ]
  }
]
