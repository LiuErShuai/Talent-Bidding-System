/**
 * 项目管理页面 Mock 数据
 * 用于承接方（学生）项目管理视图
 */

export const mockProjectManageData = {
  // 项目基本信息
  project: {
    id: 'proj-001',
    name: 'AI智能客服系统开发',
    status: 'ongoing',
    statusText: '进行中',
    progress: 43,
    reward: 15000,
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    category: '人工智能',
    publisher: 'XX科技有限公司',
    description: '为平台构建基于NLP的智能客服系统，提高客户服务效率和满意度。',
    members: [
      {
        id: 1,
        name: '张三',
        avatar: 'https://picsum.photos/seed/user1/40/40',
        role: '项目负责人',
        skills: ['Python', 'NLP', 'TensorFlow']
      },
      {
        id: 2,
        name: '李四',
        avatar: 'https://picsum.photos/seed/user2/40/40',
        role: '前端开发',
        skills: ['Vue', 'React', 'TypeScript']
      },
      {
        id: 3,
        name: '王五',
        avatar: 'https://picsum.photos/seed/user3/40/40',
        role: '后端开发',
        skills: ['Java', 'Spring', 'MySQL']
      }
    ]
  },

  // 里程碑列表（按时间顺序）
  milestones: [
    // ========== 里程碑 1：揭榜征集（已完成） ==========
    {
      id: 'milestone-bidding',
      code: 'BIDDING',
      title: '揭榜征集',
      description: '学生查看并提交揭榜申请，企业/学校审核申请人资格，确定承接方',
      status: 'completed',
      statusText: '已完成',
      plannedDate: '2025-11-05',
      actualDate: '2025-11-04',
      delayDays: -1, // 负数表示提前完成
      deliverables: [
        {
          id: 1,
          name: '揭榜申请表',
          type: 'document',
          format: ['PDF'],
          requirement: '填写完整的揭榜申请表，包含个人信息、项目理解和技术背景'
        }
      ],
      submissions: [
        {
          id: 1,
          version: 1,
          deliverableId: 1,
          fileName: '揭榜申请-张三.pdf',
          fileSize: '1.2 MB',
          uploadTime: '2025-11-03 14:20',
          uploader: '张三',
          versionNote: '初次申请，附带个人简历和项目经验说明',
          status: 'approved',
          reviewResult: {
            reviewer: 'XX科技有限公司',
            reviewTime: '2025-11-04 10:00',
            action: 'approved',
            comment: '申请资料完整，技术背景符合要求，团队配置合理，批准揭榜。',
            rating: 5
          }
        }
      ],
      progressDetail: {
        percentage: 100,
        completedDeliverables: 1,
        totalDeliverables: 1,
        status: 'success',
        note: '已完成 1/1 项交付物'
      }
    },

    // ========== 里程碑 2：方案提交（进行中） ==========
    {
      id: 'milestone-proposal',
      code: 'PROPOSAL',
      title: '方案提交',
      description: '提交详细的技术方案和项目实施计划，包括系统架构设计、技术选型、进度安排等',
      status: 'in-progress',
      statusText: '进行中',
      plannedDate: '2025-11-20',
      actualDate: null,
      delayDays: 0,
      deliverables: [
        {
          id: 2,
          name: '技术方案文档',
          type: 'document',
          format: ['PDF', 'Word'],
          requirement: '不少于10页，需包含系统架构设计、技术选型依据、数据库设计、接口设计和风险评估'
        },
        {
          id: 3,
          name: '项目计划甘特图',
          type: 'document',
          format: ['Excel', 'Project', 'PDF'],
          requirement: '详细到周级别的任务分解，标注关键里程碑节点和负责人'
        }
      ],
      submissions: [
        // 技术方案 v2（已通过）
        {
          id: 3,
          version: 2,
          deliverableId: 2,
          fileName: '技术方案-AI智能客服系统-v2.pdf',
          fileSize: '3.1 MB',
          uploadTime: '2025-11-18 14:30',
          uploader: '张三',
          versionNote: '补充了技术选型依据、风险评估章节和数据库ER图',
          status: 'approved',
          reviewResult: {
            reviewer: 'XX科技有限公司',
            reviewTime: '2025-11-18 16:00',
            action: 'approved',
            comment: '第二版方案完善，技术路线清晰，风险评估全面，架构设计合理。同意进入下一阶段。',
            rating: 5
          }
        },
        // 技术方案 v1（被驳回）
        {
          id: 2,
          version: 1,
          deliverableId: 2,
          fileName: '技术方案-AI智能客服系统.pdf',
          fileSize: '2.3 MB',
          uploadTime: '2025-11-15 10:00',
          uploader: '张三',
          versionNote: '初版技术方案，包含系统架构设计和技术选型',
          status: 'rejected',
          reviewResult: {
            reviewer: 'XX科技有限公司',
            reviewTime: '2025-11-16 09:00',
            action: 'rejected',
            comment: '技术栈需要更详细说明，缺少风险评估部分。建议补充：1. 技术选型的详细依据和对比 2. 潜在风险点分析 3. 数据库ER图',
            rating: null
          }
        }
      ],
      progressDetail: {
        percentage: 50,
        completedDeliverables: 1,
        totalDeliverables: 2,
        status: 'warning',
        note: '已完成 1/2 项交付物，项目计划待提交'
      }
    },

    // ========== 里程碑 3：协议签订（待开始） ==========
    {
      id: 'milestone-agreement',
      code: 'AGREEMENT',
      title: '协议签订',
      description: '双方签订项目合作协议，明确权利义务、知识产权归属和付款方式',
      status: 'pending',
      statusText: '待开始',
      plannedDate: '2025-11-25',
      actualDate: null,
      delayDays: 0,
      deliverables: [
        {
          id: 4,
          name: '项目合作协议（签字版）',
          type: 'document',
          format: ['PDF'],
          requirement: '双方签字盖章的正式协议扫描件'
        }
      ],
      submissions: [],
      progressDetail: {
        percentage: 0,
        completedDeliverables: 0,
        totalDeliverables: 1,
        status: 'info',
        note: '已完成 0/1 项交付物'
      }
    },

    // ========== 里程碑 4：中期答辩（待开始） ==========
    {
      id: 'milestone-midterm',
      code: 'MIDTERM',
      title: '中期答辩',
      description: '项目中期检查，展示项目进展和阶段性成果，专家评审组进行质询',
      status: 'pending',
      statusText: '待开始',
      plannedDate: '2025-12-10',
      actualDate: null,
      delayDays: 0,
      deliverables: [
        {
          id: 5,
          name: '中期进度报告',
          type: 'document',
          format: ['PDF', 'Word'],
          requirement: '包含已完成功能、遇到的问题、解决方案和下阶段计划'
        },
        {
          id: 6,
          name: '代码仓库地址',
          type: 'link',
          format: ['URL'],
          requirement: 'GitHub/Gitee 公开仓库地址，需包含README和运行说明'
        },
        {
          id: 7,
          name: '答辩PPT',
          type: 'document',
          format: ['PPT', 'PPTX', 'PDF'],
          requirement: '10-15页，包含项目背景、技术方案、实现进展和效果展示'
        }
      ],
      submissions: [],
      progressDetail: {
        percentage: 0,
        completedDeliverables: 0,
        totalDeliverables: 3,
        status: 'info',
        note: '已完成 0/3 项交付物'
      }
    },

    // ========== 里程碑 5：成果提交（待开始） ==========
    {
      id: 'milestone-delivery',
      code: 'DELIVERY',
      title: '成果提交',
      description: '提交项目最终成果，包括完整的系统代码、部署文档和演示视频',
      status: 'pending',
      statusText: '待开始',
      plannedDate: '2025-12-25',
      actualDate: null,
      delayDays: 0,
      deliverables: [
        {
          id: 8,
          name: '完整源代码包',
          type: 'archive',
          format: ['ZIP', 'RAR'],
          requirement: '包含前后端完整代码，需有详细的README和环境配置说明'
        },
        {
          id: 9,
          name: '系统部署文档',
          type: 'document',
          format: ['PDF', 'Word', 'Markdown'],
          requirement: '详细的部署步骤、环境要求和常见问题解决方案'
        },
        {
          id: 10,
          name: '用户使用手册',
          type: 'document',
          format: ['PDF', 'Word'],
          requirement: '图文并茂的使用说明，面向最终用户'
        },
        {
          id: 11,
          name: '项目演示视频',
          type: 'video',
          format: ['MP4', 'AVI'],
          requirement: '5-10分钟，展示系统主要功能和操作流程'
        }
      ],
      submissions: [],
      progressDetail: {
        percentage: 0,
        completedDeliverables: 0,
        totalDeliverables: 4,
        status: 'info',
        note: '已完成 0/4 项交付物'
      }
    }
  ],

  // 审核历史记录（所有里程碑的审核记录）
  reviewHistory: [
    {
      id: 'review-002',
      time: '2025-11-18 16:00',
      reviewer: 'XX科技有限公司',
      reviewerRole: '企业方',
      action: '通过',
      target: '方案提交 - 技术方案文档 v2',
      comment: '第二版方案完善，技术路线清晰，风险评估全面，架构设计合理。同意进入下一阶段。',
      rating: 5
    },
    {
      id: 'review-001-reject',
      time: '2025-11-16 09:00',
      reviewer: 'XX科技有限公司',
      reviewerRole: '企业方',
      action: '驳回',
      target: '方案提交 - 技术方案文档 v1',
      comment: '技术栈需要更详细说明，缺少风险评估部分。建议补充：1. 技术选型的详细依据和对比 2. 潜在风险点分析 3. 数据库ER图',
      rating: null
    },
    {
      id: 'review-001-approve',
      time: '2025-11-04 10:00',
      reviewer: 'XX科技有限公司',
      reviewerRole: '企业方',
      action: '通过',
      target: '揭榜征集 - 揭榜申请表',
      comment: '申请资料完整，技术背景符合要求，团队配置合理，批准揭榜。',
      rating: 5
    }
  ],

  // 项目动态时间线
  timelineEvents: [
    {
      id: 'event-005',
      time: '2025-11-18 16:00',
      type: 'review',
      title: '审核通过：技术方案 v2',
      description: '企业方审核通过了"技术方案文档 v2"，评分5分',
      user: 'XX科技有限公司',
      icon: 'success'
    },
    {
      id: 'event-004',
      time: '2025-11-18 14:30',
      type: 'upload',
      title: '提交交付物：技术方案 v2',
      description: '张三提交了"技术方案文档 v2"，补充了风险评估和数据库设计',
      user: '张三',
      icon: 'info'
    },
    {
      id: 'event-003',
      time: '2025-11-16 09:00',
      type: 'review',
      title: '审核驳回：技术方案 v1',
      description: '企业方驳回了"技术方案文档 v1"，要求补充技术选型依据和风险评估',
      user: 'XX科技有限公司',
      icon: 'warning'
    },
    {
      id: 'event-002',
      time: '2025-11-15 10:00',
      type: 'upload',
      title: '提交交付物：技术方案 v1',
      description: '张三提交了"技术方案文档 v1"',
      user: '张三',
      icon: 'info'
    },
    {
      id: 'event-001',
      time: '2025-11-04 10:00',
      type: 'milestone',
      title: '完成里程碑：揭榜征集',
      description: '企业方审核通过揭榜申请，项目正式启动',
      user: 'XX科技有限公司',
      icon: 'success'
    }
  ]
}

// 工具函数：计算剩余天数
export function calculateRemainingDays(plannedDate) {
  const today = new Date()
  const planned = new Date(plannedDate)
  const diffTime = planned - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// 工具函数：格式化文件大小
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 工具函数：计算里程碑进度
export function calculateMilestoneProgress(milestone) {
  const total = milestone.deliverables.length
  const approved = milestone.submissions.filter(s => s.status === 'approved').length
  const percentage = total > 0 ? Math.round((approved / total) * 100) : 0

  return {
    percentage,
    completedDeliverables: approved,
    totalDeliverables: total,
    status: percentage === 100 ? 'success' : (percentage > 0 ? 'warning' : 'info'),
    note: `已完成 ${approved}/${total} 项交付物`
  }
}
