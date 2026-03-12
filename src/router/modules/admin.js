/**
 * 管理员后台路由
 * 使用独立的 AdminBackendLayout 布局，父级路径 /admin
 */

export default [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminBackendLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin', transition: 'none' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard/index.vue'),
        meta: { title: '仪表盘', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'project-review',
        name: 'AdminProjectReview',
        component: () => import('@/views/admin/ProjectReview/index.vue'),
        meta: { title: '项目审核', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'enterprise-review',
        name: 'AdminEnterpriseReview',
        component: () => import('@/views/admin/EnterpriseReview/index.vue'),
        meta: { title: '企业资质审核', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'category-management',
        name: 'AdminCategoryManagement',
        component: () => import('@/views/admin/CategoryManagement/index.vue'),
        meta: { title: '分类管理', requiresAuth: true, role: 'admin' }
      },
      {
        path: 'statistics',
        name: 'AdminDataCenter',
        component: () => import('@/views/admin/DataCenter/index.vue'),
        meta: { title: '数据中心', requiresAuth: true, role: 'admin' }
      }
    ]
  }
]
