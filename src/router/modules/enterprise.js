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
      // 注意：企业的"我的项目"和学生的"我的项目"使用不同的组件
      // 暂时复用学生的MyProject组件，后续需要创建企业专属的MyProject组件
      {
        path: 'enterprise/my-projects',
        name: 'EnterpriseMyProjects',
        component: () => import('@/views/student/MyProject/index.vue'), // TODO: 创建企业专属组件
        meta: {
          title: '我的项目',
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
      }
    ]
  }
]
