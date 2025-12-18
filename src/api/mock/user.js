/**
 * 用户相关API模拟数据
 * 开发环境使用，生产环境自动禁用
 */

/**
 * 模拟获取用户信息
 */
export const mockGetUserInfo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          id: 'test_student_001',
          username: '测试学生',
          studentId: '2021001001',
          realName: '张三',
          college: '计算机与信息安全学院',
          major: '软件工程',
          grade: '2021级',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          avatar: 'https://picsum.photos/seed/student/120/120.jpg',
          registerTime: '2024-01-01T00:00:00.000Z',
          lastLoginTime: new Date().toISOString(),
          bio: '热爱编程，专注于前端开发，熟悉Vue.js、React等框架。有丰富的项目经验，擅长解决复杂的技术问题。',
          skills: ['Vue.js', 'JavaScript', 'TypeScript', 'Python', 'Node.js', 'Element Plus'],
          projectExperiences: [
            {
              projectId: 'proj_001',
              projectName: '电商平台开发',
              role: '队长',
              status: '已完成',
              startTime: '2024-06-01',
              endTime: '2024-08-31',
              description: '这个部分记得改'
            },
            {
              projectId: 'proj_002',
              projectName: '智能客服系统',
              role: '成员',
              status: '进行中',
              startTime: '2024-09-01',
              endTime: null,
              description: '参与智能客服系统的开发，主要负责前端界面设计和用户交互优化。'
            }
          ],
          awards: [
            {
              name: '全国大学生程序设计竞赛',
              level: '省级',
              time: '2024-05-15'
            }
          ]
        },
        message: 'success'
      })
    }, 500) // 模拟网络延迟
  })
}

/**
 * 模拟更新用户信息
 */
export const mockUpdateUserInfo = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {},
        message: '更新成功'
      })
    }, 500)
  })
}

/**
 * 模拟上传头像
 */
export const mockUploadAvatar = (file) => {
  return new Promise((resolve, reject) => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      reject(new Error('只能上传图片文件'))
      return
    }

    // 验证文件大小（2MB）
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('图片大小不能超过2MB'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            avatarUrl: e.target.result
          },
          message: '上传成功'
        })
      }, 1000) // 模拟上传延迟
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 模拟获取项目经历
 */
export const mockGetUserProjects = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          projects: [
            {
              projectId: 'proj_001',
              projectName: '电商平台开发',
              role: '队长',
              status: '已完成',
              startTime: '2024-06-01',
              endTime: '2024-08-31',
              description: '这部分记得改',
              technologies: ['Vue.js', 'Element Plus', 'Axios']
            },
            {
              projectId: 'proj_002',
              projectName: '智能客服系统',
              role: '成员',
              status: '进行中',
              startTime: '2024-09-01',
              endTime: null,
              description: '参与智能客服系统的开发，主要负责前端界面设计和用户交互优化。',
              technologies: ['React', 'TypeScript', 'Ant Design']
            },
            {
              projectId: 'proj_003',
              projectName: '校园管理系统',
              role: '成员',
              status: '已完成',
              startTime: '2024-03-01',
              endTime: '2024-05-31',
              description: '参与校园管理系统的开发，负责学生信息管理模块的前端实现。',
              technologies: ['Vue.js', 'Vuex', 'Element UI']
            }
          ]
        },
        message: 'success'
      })
    }, 500)
  })
}

