/**
 * 学生模块路由
 * 包含学生专属功能：揭榜申请、我的项目、成果提交、成长中心、智能匹配
 */

export default [
  // 使用 DefaultLayout 的学生页面
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'apply/:projectId',
        name: 'StudentApply',
        component: () => import('@/views/student/Apply/index.vue'),
        meta: {
          title: '揭榜申请',
          transition: 'fade',
          requiresAuth: true,
          role: 'student'
        }
      },
      {
        path: 'my-projects',
        name: 'StudentMyProjects',
        component: () => import('@/views/student/MyProject/index.vue'),
        meta: {
          title: '我的项目',
          transition: 'fade',
          requiresAuth: true,
          role: 'student'
        }
      },
      {
        path: 'submit/:projectId',
        name: 'StudentSubmit',
        component: () => import('@/views/student/Submit/index.vue'),
        meta: {
          title: '成果提交',
          transition: 'fade',
          requiresAuth: true,
          role: 'student'
        }
      },
      {
        path: 'growth-center',
        name: 'StudentGrowthCenter',
        component: () => import('@/views/student/GrowthCenter/index.vue'),
        meta: {
          title: '成长中心',
          transition: 'fade',
          requiresAuth: true,
          role: 'student'
        }
      },
      {
        path: 'smart-match',
        name: 'StudentSmartMatch',
        component: () => import('@/views/student/SmartMatch/index.vue'),
        meta: {
          title: '智能匹配',
          transition: 'fade',
          requiresAuth: true,
          role: 'student'
        }
      }
    ]
  }
]
