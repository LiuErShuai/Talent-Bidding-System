<template>
  <div class="settings-form">
    <!-- 个人信息编辑 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h2>编辑个人信息</h2>
        </div>
      </template>
      
      <el-form
        :model="profile"
        :rules="profileRules"
        ref="profileFormRef"
        label-width="120px"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input
                v-model="profile.realName"
                placeholder="请输入真实姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号">
              <el-input
                v-model="profile.studentId"
                disabled
                placeholder="学号不可修改"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="学院" prop="college">
              <el-input
                v-model="profile.college"
                placeholder="请输入学院"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-input
                v-model="profile.major"
                placeholder="请输入专业"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="年级" prop="grade">
              <el-input
                v-model="profile.grade"
                placeholder="请输入年级，如：2021级"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="profile.phone"
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="profile.email"
                type="email"
                placeholder="请输入邮箱"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个人技术简介" prop="bio">
          <el-input
            v-model="profile.bio"
            type="textarea"
            :rows="4"
            placeholder="请输入个人技术简介，包括技术栈、项目经验等..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 保存按钮 -->
    <div class="form-actions">
      <el-button @click="resetForm">重置</el-button>
      <el-button type="primary" @click="saveProfile" :loading="saving">
        保存设置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateUserInfoAPI } from '@/api/user'
import { useAuthStore } from '@/store/modules/auth'
import { useUserStore } from '@/store/modules/user'

// 状态管理
const authStore = useAuthStore()
const userStore = useUserStore()
const profileFormRef = ref()
const saving = ref(false)

// 表单数据
const profile = reactive({
  realName: '',
  studentId: '',
  college: '',
  major: '',
  grade: '',
  phone: '',
  email: '',
  bio: ''
})

// 表单验证规则
const profileRules = {
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2到20个字符', trigger: 'blur' }
  ],
  college: [
    { required: true, message: '请输入学院', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ],
  grade: [
    { required: true, message: '请输入年级', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  bio: [
    { max: 500, message: '个人简介不能超过500个字符', trigger: 'blur' }
  ]
}

// 初始化用户信息
const initProfile = () => {
  const userProfile = userStore.profile
  if (userProfile) {
    profile.realName = userProfile.realName || ''
    profile.studentId = userProfile.studentId || ''
    profile.college = userProfile.college || ''
    profile.major = userProfile.major || ''
    profile.grade = userProfile.grade || ''
    profile.phone = userProfile.phone || ''
    profile.email = userProfile.email || ''
    profile.bio = userProfile.bio || ''
  } else {
    // 如果store中没有，从authStore获取基本信息
    const userInfo = authStore.userInfo
    if (userInfo) {
      profile.realName = userInfo.realName || userInfo.username || ''
      profile.studentId = userInfo.studentId || ''
      profile.college = userInfo.college || ''
      profile.major = userInfo.major || ''
      profile.grade = userInfo.grade || ''
      profile.phone = userInfo.phone || ''
      profile.email = userInfo.email || ''
      profile.bio = userInfo.bio || ''
    }
  }
}

// 保存设置
const saveProfile = async () => {
  try {
    const valid = await profileFormRef.value.validate()
    if (!valid) return

    saving.value = true
    
    // 调用API更新用户信息
    const result = await updateUserInfoAPI({
      realName: profile.realName,
      college: profile.college,
      major: profile.major,
      grade: profile.grade,
      phone: profile.phone,
      email: profile.email,
      bio: profile.bio
    })

    if (result.code === 200) {
      // 更新store中的用户信息
      userStore.setProfile({
        ...userStore.profile,
        ...profile
      })
      
      // 更新authStore中的基本信息
      authStore.updateUserInfo({
        realName: profile.realName,
        phone: profile.phone,
        email: profile.email
      })

      ElMessage.success('设置保存成功')
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (error) {
    console.error('Save profile error:', error)
    ElMessage.error('保存失败: ' + (error.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  ElMessageBox.confirm('确定要重置所有设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    initProfile()
    ElMessage.success('已重置')
  }).catch(() => {
    // 用户取消
  })
}

// 组件挂载时初始化
onMounted(() => {
  initProfile()
})
</script>

<style scoped>
.settings-form {
  padding: 24px 0;
}

.settings-card {
  margin-bottom: 24px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
</style>

















