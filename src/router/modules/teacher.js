/**
 * 教师模块路由
 * 包含教师专属功能：成果评审（教师视角）
 */

export default [
  {
    path: '/teacher/evaluation/:projectId',
    name: 'TeacherEvaluation',
    component: () => import('@/views/enterprise/Evaluation/index.vue'), // 暂时复用企业的评审组件
    meta: {
      title: '成果评审',
      transition: 'fade',
      requiresAuth: true,
      role: 'teacher'
    }
  }
]
