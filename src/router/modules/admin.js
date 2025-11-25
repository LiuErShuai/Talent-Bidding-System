/**
 * 管理员模块路由
 * 包含管理员专属功能：项目初审、终审、中期答辩、数据中心、协议处理
 */

export default [
  // 使用 AdminLayout 的管理员页面
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: 'pre-review',
        name: 'AdminPreReview',
        component: () => import('@/views/admin/PreReview/index.vue'),
        meta: {
          title: '项目初审',
          transition: 'fade',
          requiresAuth: true,
          role: 'admin'
        }
      },
      {
        path: 'final-review',
        name: 'AdminFinalReview',
        component: () => import('@/views/admin/FinalReview/index.vue'),
        meta: {
          title: '项目终审',
          transition: 'fade',
          requiresAuth: true,
          role: 'admin'
        }
      },
      {
        path: 'midterm-defense',
        name: 'AdminMidtermDefense',
        component: () => import('@/views/admin/MidtermDefense/index.vue'),
        meta: {
          title: '中期答辩',
          transition: 'fade',
          requiresAuth: true,
          role: 'admin'
        }
      },
      {
        path: 'statistics',
        name: 'AdminDataCenter',
        component: () => import('@/views/admin/DataCenter/index.vue'),
        meta: {
          title: '数据中心',
          transition: 'fade',
          requiresAuth: true,
          role: 'admin'
        }
      },
      {
        path: 'agreement-processing',
        name: 'AdminAgreementProcessing',
        component: () => import('@/views/admin/AgreementProcessing/index.vue'),
        meta: {
          title: '协议处理',
          transition: 'fade',
          requiresAuth: true,
          role: 'admin'
        }
      }
    ]
  }
]
