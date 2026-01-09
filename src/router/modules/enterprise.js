/**
 * 企业模块路由
 * 包含企业专属功能：项目管理、成果评审、成果中心
 */

export default [
  // 使用 DefaultLayout 的企业页面
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      // 企业专属的"我的项目"页面
      {
        path: 'enterprise/my-projects',
        name: 'EnterpriseMyProjects',
        component: () => import('@/views/enterprise/MyProjects.vue'),
        meta: {
          title: '我的项目',
          transition: 'fade',
          requiresAuth: true,
          role: 'enterprise'
        }
      },
      {
        path: 'enterprise/profile',
        name: 'EnterpriseProfile',
        component: () => import('@/views/enterprise/Profile/index.vue'),
        meta: {
          title: '企业个人中心',
          transition: 'fade',
          requiresAuth: true,
          role: 'enterprise'
        }
      },
      {
        path: 'evaluation/:projectId',
        name: 'EnterpriseEvaluation',
        component: () => import('@/views/enterprise/Evaluation/index.vue'),
        meta: {
          title: '成果评审',
          transition: 'fade',
          requiresAuth: true,
          role: 'enterprise'
        }
      },
      {
        path: 'results-center',
        name: 'EnterpriseResultsCenter',
        component: () => import('@/views/enterprise/ResultsCenter/index.vue'),
        meta: {
          title: '成果中心',
          transition: 'fade',
          requiresAuth: true,
          role: 'enterprise'
        }
      },
      {
        path: 'enterprise/project/:id/manage',
        name: 'EnterpriseProjectManage',
        component: () => import('@/views/enterprise/ProjectManage.vue'),
        meta: {
          title: '项目管理',
          transition: 'fade',
          requiresAuth: true,
          role: 'enterprise'
        }
      }
    ]
  }
]
