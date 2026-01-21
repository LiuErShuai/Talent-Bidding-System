/**
 * 项目管理页面 Mock 数据
 * 用于承接方（学生）项目管理视图
 */

export const mockProjectManageData = {
  // 项目基本信息
  project: {
    id: 'proj-001',
    name: 'AI智能客服系统开发',
    status: 'in-progress', // 统一使用 in-progress 表示进行中
    statusText: '进行中',
    progress: 43,
    reward: 15000,
    startDate: '2025-11-01',
    endDate: '2025-12-31',
    category: '人工智能',
    publisher: '桂林电子科技大学科技有限公司',
    description: '为平台构建基于NLP的智能客服系统，提高客户服务效率和满意度。',
    brief: '为平台构建基于NLP的智能客服系统，提高客户服务效率和满意度。',
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
    ],
    // 揭榜征集统计信息
    biddingStats: {
      totalApplications: 4,
      approvedApplications: 2,
      pendingApplications: 1,
      selectedTeam: '创新科技团队'
    }
  },

  // 揭榜团队申请列表
  biddingApplications: [
    {
      id: 'app-001',
      teamName: '创新科技团队',
      leader: '张三',
      memberCount: 5,
      contact: '13800138000',
      applyTime: '2025-11-01 10:30',
      description: '我们是一支经验丰富的AI开发团队，曾参与多个智能客服项目的开发，对NLP技术有深入研究。团队成员来自计算机科学专业，具备扎实的技术功底。',
      status: 'selected',
      detailFiles: [
        { id: 'f1', name: '团队介绍.pdf', size: '2.3 MB', uploadTime: '2025-11-02 09:00' },
        { id: 'f2', name: '身份认证.pdf', size: '1.5 MB', uploadTime: '2025-11-02 09:05' },
        { id: 'f3', name: '技术方案.pdf', size: '4.2 MB', uploadTime: '2025-11-02 09:10' }
      ],
      reviewHistory: [
        {
          id: 'r1',
          time: '2025-11-02 14:00',
          action: 'approved',
          actionText: '审核通过',
          comment: '团队资质符合要求，技术方案完善'
        },
        {
          id: 'r2',
          time: '2025-11-03 10:00',
          action: 'selected',
          actionText: '选为中标团队',
          comment: '技术方案完善，团队经验丰富，综合评分最高'
        }
      ]
    },
    {
      id: 'app-002',
      teamName: '智能开发小组',
      leader: '李四',
      memberCount: 4,
      contact: '13900139000',
      applyTime: '2025-11-01 11:20',
      description: '我们团队专注于人工智能领域，有丰富的机器学习和深度学习项目经验。',
      status: 'approved',
      detailFiles: [
        { id: 'f4', name: '团队介绍.pdf', size: '1.8 MB', uploadTime: '2025-11-02 14:00' },
        { id: 'f5', name: '技术方案.pdf', size: '3.5 MB', uploadTime: '2025-11-02 14:10' }
      ],
      reviewHistory: [
        {
          id: 'r3',
          time: '2025-11-02 15:30',
          action: 'approved',
          actionText: '审核通过',
          comment: '团队经验丰富，符合项目要求'
        }
      ]
    },
    {
      id: 'app-003',
      teamName: '未来科技工作室',
      leader: '王五',
      memberCount: 3,
      contact: '13700137000',
      applyTime: '2025-11-01 14:50',
      description: '我们是一支年轻但充满活力的团队，虽然经验不多，但学习能力强，愿意接受挑战。',
      status: 'submitted',
      detailFiles: [
        { id: 'f6', name: '团队介绍.pdf', size: '1.2 MB', uploadTime: '2025-11-02 10:00' },
        { id: 'f7', name: '技术方案.pdf', size: '2.8 MB', uploadTime: '2025-11-02 10:05' }
      ],
      reviewHistory: []
    },
    {
      id: 'app-004',
      teamName: '测试团队',
      leader: '赵六',
      memberCount: 2,
      contact: '13600136000',
      applyTime: '2025-11-01 16:00',
      description: '测试申请',
      status: 'rejected',
      detailFiles: [
        { id: 'f8', name: '团队介绍.pdf', size: '800 KB', uploadTime: '2025-11-02 11:00' }
      ],
      reviewHistory: [
        {
          id: 'r4',
          time: '2025-11-02 16:30',
          action: 'rejected',
          actionText: '拒绝申请',
          comment: '团队人数不足，经验不符合要求'
        }
      ]
    }
  ],

  // 里程碑列表（按时间顺序）
  milestones: [
    // ========== 里程碑 1：方案提交（进行中） ==========
    {
      id: 'milestone-proposal',
      code: 'PROPOSAL',
      title: '方案提交',
      description: '提交详细的技术方案和项目实施计划，包括系统架构设计、技术选型、进度安排等',
      status: 'in-progress',
      statusText: '进行中',
      startDate: '2025-11-10',
      endDate: '2025-11-20',
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
      taskFiles: [
        {
          id: 'task-file-3',
          name: '技术方案编写指南.pdf',
          type: 'PDF',
          size: '1.8 MB',
          uploadTime: '2025-11-06 10:00',
          uploader: 'XX科技有限公司',
          description: '技术方案文档的编写规范和要求，包含章节结构、内容要点和评分标准'
        },
        {
          id: 'task-file-4',
          name: 'AI客服系统参考架构图.png',
          type: 'PNG',
          size: '523 KB',
          uploadTime: '2025-11-06 10:10',
          uploader: 'XX科技有限公司',
          description: '企业内部现有系统的架构图，可作为设计参考'
        },
        {
          id: 'task-file-5',
          name: '接口规范文档.pdf',
          type: 'PDF',
          size: '1.2 MB',
          uploadTime: '2025-11-06 10:15',
          uploader: 'XX科技有限公司',
          description: '企业方要求的接口设计规范，包含RESTful API规范、数据格式和认证方式'
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
          description: '根据上次审核意见进行了全面修改，补充了详细的技术选型依据、完整风险评估章节和数据库ER图设计。',
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
          description: '这是项目的初版技术方案文档，包含了系统架构设计和技术选型方案，希望得到您的指导和建议。',
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
      feedbacks: [
        {
          id: 1,
          time: '2025-11-16 09:30',
          content: '技术方案文档整体质量不错，架构设计思路清晰。但仍有一些需要完善的地方：\n\n1. 技术选型部分需要补充更详细的对比分析，建议列出至少3种备选方案的优劣势对比，包括性能、成本、学习曲线等维度。\n\n2. 数据库设计需要增加ER图和索引设计说明，特别是对于高频查询的表需要详细说明索引策略。\n\n3. 风险评估部分需要更具体，建议补充应对措施和备用方案。例如：如果NLP模型训练效果不理想，是否有备选的预训练模型？\n\n4. 接口设计需要增加错误码规范和异常处理流程，确保系统的健壮性。\n\n5. 建议补充系统的可扩展性设计，考虑未来用户量增长的情况。\n\n请在下一版本中完善以上内容，期待看到更完整的技术方案。'
        },
        {
          id: 2,
          time: '2025-11-18 16:00',
          content: '经审核，技术方案文档已按要求完善，各项内容详尽准确，符合项目要求。技术路线清晰，风险评估全面，架构设计合理。同意进入下一阶段。'
        }
      ],
      progressDetail: {
        percentage: 50,
        completedDeliverables: 1,
        totalDeliverables: 2,
        status: 'warning',
        note: '已完成 1/2 项交付物'
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
      startDate: '2025-11-21',
      endDate: '2025-11-25',
      plannedDate: '2025-11-25',
      actualDate: null,
      delayDays: 0,
      deliverables: [
        {
          id: 4,
          name: '项目合作协议（签字版）',
          type: 'document',
          format: ['PDF'],
          requirement: '双方签字盖章的正式协议扫描件，需包含项目范围、交付标准、付款方式、知识产权归属等条款'
        }
      ],
      taskFiles: [
        {
          id: 'task-file-6',
          name: '项目合作协议模板.pdf',
          type: 'PDF',
          size: '856 KB',
          uploadTime: '2025-11-20 09:00',
          uploader: 'XX科技有限公司',
          description: '标准项目合作协议模板，包含必要条款和签署说明，请按模板填写相关信息后打印签字盖章'
        },
        {
          id: 'task-file-7',
          name: '协议签署指南.pdf',
          type: 'PDF',
          size: '623 KB',
          uploadTime: '2025-11-20 09:05',
          uploader: 'XX科技有限公司',
          description: '协议签署流程说明，包含填写要求、签字盖章位置、扫描上传规范等'
        },
        {
          id: 'task-file-8',
          name: '知识产权归属说明.pdf',
          type: 'PDF',
          size: '445 KB',
          uploadTime: '2025-11-20 09:10',
          uploader: 'XX科技有限公司',
          description: '项目成果知识产权归属的详细说明，明确双方权益和使用范围'
        }
      ],
      feedbacks: [],
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
      startDate: '2025-12-01',
      endDate: '2025-12-10',
      plannedDate: '2025-12-10',
      actualDate: null,
      delayDays: 0,
      deliverables: [
        {
          id: 5,
          name: '中期进度报告',
          type: 'document',
          format: ['PDF', 'Word'],
          requirement: '包含已完成功能、遇到的问题、解决方案和下阶段计划，不少于8页'
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
      taskFiles: [
        {
          id: 'task-file-9',
          name: '中期答辩评审标准.pdf',
          type: 'PDF',
          size: '1.1 MB',
          uploadTime: '2025-12-01 10:00',
          uploader: 'XX科技有限公司',
          description: '中期答辩的评审标准和评分细则，包含技术实现、进度管理、团队协作等维度'
        },
        {
          id: 'task-file-10',
          name: '中期报告模板.docx',
          type: 'Word',
          size: '234 KB',
          uploadTime: '2025-12-01 10:05',
          uploader: 'XX科技有限公司',
          description: '中期进度报告的标准模板，包含必填章节和内容要求'
        },
        {
          id: 'task-file-11',
          name: '答辩PPT参考模板.pptx',
          type: 'PPT',
          size: '3.2 MB',
          uploadTime: '2025-12-01 10:10',
          uploader: 'XX科技有限公司',
          description: '答辩PPT的参考模板，包含推荐的页面结构和设计风格'
        },
        {
          id: 'task-file-12',
          name: '答辩注意事项.pdf',
          type: 'PDF',
          size: '567 KB',
          uploadTime: '2025-12-01 10:15',
          uploader: 'XX科技有限公司',
          description: '答辩流程说明、时间安排、常见问题和注意事项'
        }
      ],
      feedbacks: [],
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
      startDate: '2025-12-15',
      endDate: '2025-12-25',
      plannedDate: '2025-12-25',
      actualDate: null,
      delayDays: 0,
      deliverables: [
        {
          id: 8,
          name: '完整源代码包',
          type: 'archive',
          format: ['ZIP', 'RAR'],
          requirement: '包含前后端完整代码，需有详细的README和环境配置说明，代码需有适当注释'
        },
        {
          id: 9,
          name: '系统部署文档',
          type: 'document',
          format: ['PDF', 'Word', 'Markdown'],
          requirement: '详细的部署步骤、环境要求和常见问题解决方案，不少于5页'
        },
        {
          id: 10,
          name: '用户使用手册',
          type: 'document',
          format: ['PDF', 'Word'],
          requirement: '图文并茂的使用说明，面向最终用户，不少于10页'
        },
        {
          id: 11,
          name: '项目演示视频',
          type: 'video',
          format: ['MP4', 'AVI'],
          requirement: '5-10分钟，展示系统主要功能和操作流程，需配字幕或语音讲解'
        }
      ],
      taskFiles: [
        {
          id: 'task-file-13',
          name: '成果验收标准.pdf',
          type: 'PDF',
          size: '1.5 MB',
          uploadTime: '2025-12-15 09:00',
          uploader: 'XX科技有限公司',
          description: '项目成果的验收标准和评分细则，包含功能完整性、代码质量、文档规范等维度'
        },
        {
          id: 'task-file-14',
          name: '代码规范要求.pdf',
          type: 'PDF',
          size: '892 KB',
          uploadTime: '2025-12-15 09:05',
          uploader: 'XX科技有限公司',
          description: '代码编写规范、注释要求、目录结构规范等，确保代码可维护性'
        },
        {
          id: 'task-file-15',
          name: '部署文档模板.docx',
          type: 'Word',
          size: '156 KB',
          uploadTime: '2025-12-15 09:10',
          uploader: 'XX科技有限公司',
          description: '系统部署文档的标准模板，包含必填章节和格式要求'
        },
        {
          id: 'task-file-16',
          name: '用户手册模板.docx',
          type: 'Word',
          size: '234 KB',
          uploadTime: '2025-12-15 09:15',
          uploader: 'XX科技有限公司',
          description: '用户使用手册的标准模板，包含推荐的章节结构和示例'
        },
        {
          id: 'task-file-17',
          name: '演示视频制作指南.pdf',
          type: 'PDF',
          size: '678 KB',
          uploadTime: '2025-12-15 09:20',
          uploader: 'XX科技有限公司',
          description: '演示视频的制作要求、推荐工具、录制技巧和注意事项'
        }
      ],
      feedbacks: [],
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
